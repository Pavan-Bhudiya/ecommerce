from pymongo import MongoClient
from config import MONGO_URI, DB_NAME


client = MongoClient(MONGO_URI)
db = client[DB_NAME]
products_collection = db["products"]


def get_all_products():
    products = list(products_collection.find({}, {"_id": 0}))
    for p in products:
        if "_id" in p:
            p["_id"] = str(p["_id"])
    return products


def get_products_by_category(category):
    products = list(products_collection.find({"category": category}, {"_id": 0}))
    for p in products:
        if "_id" in p:
            p["_id"] = str(p["_id"])
    return products


def get_product_by_id(product_id):
    from bson import ObjectId
    product = products_collection.find_one({"_id": ObjectId(product_id)}, {"_id": 0})
    if product:
        product["_id"] = str(product["_id"])
    return product


def search_products(keyword):
    products = list(products_collection.find(
        {"$or": [
            {"title": {"$regex": keyword, "$options": "i"}},
            {"description": {"$regex": keyword, "$options": "i"}},
            {"category": {"$regex": keyword, "$options": "i"}},
        ]},
        {"_id": 0}
    ))
    for p in products:
        if "_id" in p:
            p["_id"] = str(p["_id"])
    return products


def get_products_by_price_range(min_price=None, max_price=None):
    query = {}
    if min_price is not None:
        query["price"] = {"$gte": min_price}
    if max_price is not None:
        query["price"] = {**query.get("price", {}), "$lte": max_price}
    products = list(products_collection.find(query, {"_id": 0}))
    for p in products:
        if "_id" in p:
            p["_id"] = str(p["_id"])
    return products