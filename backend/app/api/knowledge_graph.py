from fastapi import APIRouter
from app.services.knowledge_graph_service import knowledge_graph_service

router = APIRouter(prefix="/knowledge-graph", tags=["Unified Environmental Knowledge Graph"])

@router.get("/graph")
async def get_entire_knowledge_graph():
    return knowledge_graph_service.get_full_graph()

@router.get("/query")
async def query_knowledge_graph(query_id: str = "schools_near_emissions"):
    return knowledge_graph_service.execute_natural_query(query_id)
