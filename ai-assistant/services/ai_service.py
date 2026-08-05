import google.genai
from config import GEMINI_API_KEY

client = google.genai.Client(api_key=GEMINI_API_KEY)

MODEL_NAME = "gemini-1.5-flash"


def _build_prompt(context, query, role):
    parts = []
    if context:
        parts.append(context)
    parts.append(
        f"You are an AI {role} for an e-commerce store called Urban Basket. "
        f"Answer the user's question based on the available data. "
        f"Be helpful, concise, and accurate. If you don't have the information, say so clearly.\n\n"
        f"User query: {query}"
    )
    return "\n\n".join(parts)


def get_product_info_response(query, product_data=None):
    context = ""
    if product_data:
        context = f"Here is the product data available: {product_data}"

    prompt = _build_prompt(context, query, "product assistant")

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
    )
    return response.text


def get_pricing_response(query, product_data=None):
    context = ""
    if product_data:
        context = f"Here is the pricing data available: {product_data}"

    prompt = _build_prompt(context, query, "pricing assistant")

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
    )
    return response.text