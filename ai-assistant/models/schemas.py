from pydantic import BaseModel
from typing import Optional, List, Dict, Any


class ChatRequest(BaseModel):
    message: str
    user_id: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    context_used: Optional[dict] = None


class ProductInfoRequest(BaseModel):
    product_id: Optional[str] = None
    category: Optional[str] = None
    query: str


class PricingRequest(BaseModel):
    product_ids: Optional[List[str]] = None
    category: Optional[str] = None
    budget: Optional[float] = None
    query: str


class RAGChatRequest(BaseModel):
    message: str
    n_results: Optional[int] = 3


class RAGChatResponse(BaseModel):
    response: str
    context_used: Optional[List[Dict[str, Any]]] = None


class IngestRequest(BaseModel):
    sources: Optional[List[str]] = None


class IngestResponse(BaseModel):
    total_documents: int
    total_chunks: int
    updated_ids: List[str]


class SearchRequest(BaseModel):
    query: str
    n_results: Optional[int] = 5
    filter_type: Optional[str] = None
    threshold: Optional[float] = 0.3


class SearchResponse(BaseModel):
    results: List[Dict[str, Any]]
    query: str