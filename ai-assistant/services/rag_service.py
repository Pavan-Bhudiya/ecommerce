import os
import glob
import hashlib
from typing import List, Dict, Optional, Tuple
import chromadb
from chromadb.config import Settings as ChromaSettings
from sentence_transformers import SentenceTransformer
from config import CHROMA_HOST, CHROMA_PORT, CHROMA_COLLECTION_NAME
from services.product_service import get_all_products

CHROMA_URL = f"http://{CHROMA_HOST}:{CHROMA_PORT}"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS_PATHS = [
    os.path.join(PROJECT_ROOT, "..", "README.md"),
    os.path.join(PROJECT_ROOT, "..", "frontend", "README.md"),
]

_embedding_model = None
_client = None
_collection = None


def _get_embedding_model():
    global _embedding_model
    if _embedding_model is None:
        _embedding_model = SentenceTransformer(EMBEDDING_MODEL)
    return _embedding_model


def _get_chroma_client():
    global _client
    if _client is None:
        _client = chromadb.HttpClient(host=CHROMA_HOST, port=CHROMA_PORT)
    return _client


def _get_collection():
    global _collection
    if _collection is None:
        client = _get_chroma_client()
        _collection = client.get_or_create_collection(
            name=CHROMA_COLLECTION_NAME,
            metadata={"hnsw:space": "cosine"}
        )
    return _collection


def _chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size - overlap):
        chunk = " ".join(words[i:i + chunk_size])
        if chunk.strip():
            chunks.append(chunk.strip())
    return chunks


def _read_file(filepath: str) -> Optional[str]:
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            return f.read()
    except Exception:
        return None


def _read_project_docs() -> List[Dict]:
    documents = []
    for path in DOCS_PATHS:
        if os.path.exists(path):
            content = _read_file(path)
            if content:
                documents.append({
                    "source": os.path.basename(path),
                    "content": content,
                    "type": "documentation"
                })
    return documents


def _read_code_files() -> List[Dict]:
    documents = []
    extensions = ["*.py", "*.js", "*.jsx", "*.ts", "*.tsx", "*.json", "*.md"]
    search_paths = [
        os.path.join(PROJECT_ROOT, "..", "backend"),
        os.path.join(PROJECT_ROOT, "..", "frontend", "src"),
        os.path.join(PROJECT_ROOT, "..", "ai-assistant"),
    ]
    for search_path in search_paths:
        for ext in extensions:
            for filepath in glob.glob(os.path.join(search_path, "**", ext), recursive=True):
                if "node_modules" in filepath or "__pycache__" in filepath or ".git" in filepath:
                    continue
                content = _read_file(filepath)
                if content and len(content.strip()) > 20:
                    documents.append({
                        "source": os.path.relpath(filepath, os.path.join(PROJECT_ROOT, "..")),
                        "content": content,
                        "type": "code"
                    })
    return documents


def _read_product_data() -> List[Dict]:
    documents = []
    try:
        products = get_all_products()
        for product in products:
            text_parts = []
            text_parts.append(f"Product: {product.get('title', 'N/A')}")
            text_parts.append(f"Description: {product.get('description', 'N/A')}")
            text_parts.append(f"Category: {product.get('category', 'N/A')}")
            text_parts.append(f"Price: {product.get('price', 'N/A')}")
            if product.get("brand"):
                text_parts.append(f"Brand: {product['brand']}")
            if product.get("stock") is not None:
                text_parts.append(f"Stock: {product['stock']}")
            if product.get("rating") is not None:
                text_parts.append(f"Rating: {product['rating']}")
            text = "\n".join(text_parts)
            documents.append({
                "source": f"product:{product.get('_id', product.get('title', 'unknown'))}",
                "content": text,
                "type": "product"
            })
    except Exception as e:
        print(f"Error reading product data: {e}")
    return documents


def _get_content_hash(content: str) -> str:
    return hashlib.md5(content.encode("utf-8")).hexdigest()


def ingest_documents() -> Dict:
    collection = _get_collection()
    model = _get_embedding_model()

    all_documents = []
    all_documents.extend(_read_project_docs())
    all_documents.extend(_read_code_files())
    all_documents.extend(_read_product_data())

    total_chunks = 0
    updated_ids = []

    for doc in all_documents:
        chunks = _chunk_text(doc["content"])
        for idx, chunk in enumerate(chunks):
            chunk_id = f"{doc['source']}:{idx}:{_get_content_hash(chunk)}"
            try:
                embedding = model.encode(chunk).tolist()
                collection.upsert(
                    ids=[chunk_id],
                    embeddings=[embedding],
                    documents=[chunk],
                    metadatas=[{
                        "source": doc["source"],
                        "type": doc["type"],
                        "chunk_index": idx
                    }]
                )
                total_chunks += 1
                updated_ids.append(chunk_id)
            except Exception as e:
                print(f"Error upserting chunk {chunk_id}: {e}")

    return {
        "total_documents": len(all_documents),
        "total_chunks": total_chunks,
        "updated_ids": updated_ids[:10]
    }


def semantic_search(query: str, n_results: int = 5, filter_type: Optional[str] = None) -> List[Dict]:
    collection = _get_collection()
    model = _get_embedding_model()

    query_embedding = model.encode(query).tolist()

    where_filter = {}
    if filter_type:
        where_filter["type"] = filter_type

    try:
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results,
            where=where_filter if where_filter else None,
            include=["documents", "metadatas", "distances"]
        )
    except Exception as e:
        print(f"Error in semantic search: {e}")
        return []

    formatted_results = []
    if results and results.get("documents"):
        for i in range(len(results["documents"][0])):
            formatted_results.append({
                "content": results["documents"][0][i],
                "metadata": results["metadatas"][0][i],
                "score": 1 - results["distances"][0][i],
                "source": results["metadatas"][0][i].get("source", "unknown")
            })
    return formatted_results


def similarity_search(query: str, n_results: int = 5, threshold: float = 0.3) -> List[Dict]:
    results = semantic_search(query, n_results=n_results * 2)
    filtered = [r for r in results if r["score"] >= threshold]
    return filtered[:n_results]


def get_rag_context(query: str, n_results: int = 3) -> str:
    results = similarity_search(query, n_results=n_results)
    if not results:
        return ""
    context_parts = []
    for r in results:
        context_parts.append(f"[Source: {r['source']}]\n{r['content']}")
    return "\n\n".join(context_parts)


def get_collection_stats() -> Dict:
    try:
        collection = _get_collection()
        count = collection.count()
        return {"total_chunks": count, "status": "connected"}
    except Exception as e:
        return {"total_chunks": 0, "status": f"error: {str(e)}"}


def delete_by_source(source: str) -> int:
    collection = _get_collection()
    try:
        results = collection.get(where={"source": source})
        if results and results.get("ids"):
            collection.delete(ids=results["ids"])
            return len(results["ids"])
    except Exception as e:
        print(f"Error deleting source {source}: {e}")
    return 0
