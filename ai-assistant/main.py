from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from contextlib import asynccontextmanager
import chromadb
from models.schemas import (
    ChatRequest, ChatResponse, ProductInfoRequest, PricingRequest,
    RAGChatRequest, RAGChatResponse, IngestRequest, IngestResponse,
    SearchRequest, SearchResponse
)
from services.ai_service import get_product_info_response, get_pricing_response
from services.rag_service import (
    ingest_documents,
    semantic_search,
    similarity_search,
    get_rag_context,
    get_collection_stats,
)
from services.product_service import (
    get_all_products,
    get_products_by_category,
    get_product_by_id,
    search_products,
    get_products_by_price_range,
)
from config import AI_PORT

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        from services.rag_service import ingest_documents, get_collection_stats
        stats = get_collection_stats()
        if stats.get("total_chunks", 0) == 0:
            print("Knowledge base is empty, running automatic ingestion...")
            result = ingest_documents()
            print(f"Ingestion complete: {result['total_documents']} docs, {result['total_chunks']} chunks")
        else:
            print(f"Knowledge base ready: {stats['total_chunks']} chunks already indexed")
    except Exception as e:
        print(f"Startup ingestion skipped: {e}")
    yield


app = FastAPI(title="Urban Basket AI Assistant", version="2.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "AI Assistant is running", "features": ["RAG", "Semantic Search", "Similarity Search"]}


@app.post("/ai/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    try:
        context = get_rag_context(request.message, n_results=3)
        products = get_all_products()
        if context:
            prompt = f"Here is relevant information from the knowledge base:\n{context}\n\n" \
                     f"Also here is the current product database:\n{products}\n\n" \
                     f"User query: {request.message}"
            response = get_product_info_response(prompt, products)
            return ChatResponse(response=response, context_used={"rag_used": True, "chunks": 3})
        else:
            response = get_product_info_response(request.message, products)
            return ChatResponse(response=response, context_used={"rag_used": False})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/ai/product-info", response_model=ChatResponse)
def product_info(request: ProductInfoRequest):
    try:
        if request.product_id:
            product = get_product_by_id(request.product_id)
            if not product:
                raise HTTPException(status_code=404, detail="Product not found")
            products = [product]
        elif request.category:
            products = get_products_by_category(request.category)
        else:
            products = search_products(request.query)

        if not products:
            return ChatResponse(response="No products found matching your query.")

        response = get_product_info_response(request.query, products)
        return ChatResponse(response=response, context_used={"count": len(products)})
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/ai/pricing", response_model=ChatResponse)
def pricing(request: PricingRequest):
    try:
        if request.product_ids:
            from bson import ObjectId
            products = []
            for pid in request.product_ids:
                p = get_product_by_id(pid)
                if p:
                    products.append(p)
        elif request.category:
            products = get_products_by_category(request.category)
        else:
            products = get_all_products()

        if request.budget is not None:
            products = [p for p in products if p.get("price", 0) <= request.budget]

        if not products:
            return ChatResponse(response="No products found matching your criteria.")

        response = get_pricing_response(request.query, products)
        return ChatResponse(response=response, context_used={"count": len(products)})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/ai/rag/chat", response_model=RAGChatResponse)
def rag_chat(request: RAGChatRequest):
    try:
        context = get_rag_context(request.message, n_results=request.n_results)
        if not context:
            response = "I don't have enough information in my knowledge base to answer that question."
            return RAGChatResponse(response=response, context_used=[])

        from services.ai_service import _build_prompt
        from config import GEMINI_API_KEY
        import google.genai
        client = google.genai.Client(api_key=GEMINI_API_KEY)
        prompt = _build_prompt(context, request.message, "internal knowledge assistant")

        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=prompt,
        )
        return RAGChatResponse(response=response.text, context_used=[])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/ai/rag/search", response_model=SearchResponse)
def rag_search(request: SearchRequest):
    try:
        results = semantic_search(
            request.query,
            n_results=request.n_results,
            filter_type=request.filter_type
        )
        return SearchResponse(results=results, query=request.query)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/ai/rag/similar", response_model=SearchResponse)
def rag_similar(request: SearchRequest):
    try:
        results = similarity_search(
            request.query,
            n_results=request.n_results,
            threshold=request.threshold
        )
        return SearchResponse(results=results, query=request.query)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/ai/rag/ingest", response_model=IngestResponse)
def rag_ingest(request: Optional[IngestRequest] = None):
    try:
        result = ingest_documents()
        return IngestResponse(
            total_documents=result["total_documents"],
            total_chunks=result["total_chunks"],
            updated_ids=result["updated_ids"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/ai/rag/stats")
def rag_stats():
    try:
        stats = get_collection_stats()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/ai/rag/reset")
def rag_reset():
    try:
        from config import CHROMA_COLLECTION_NAME
        client = chromadb.HttpClient(host=CHROMA_HOST, port=CHROMA_PORT)
        client.delete_collection(CHROMA_COLLECTION_NAME)
        return {"status": "collection deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=AI_PORT)