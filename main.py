from pymongo import MongoClient

copy_from_client = MongoClient("")

copy_to_client = MongoClient("")

db_name = ""

from_db = copy_from_client[db_name]
to_db = copy_to_client[db_name]

for name in from_db.list_collection_names():
    to_db[name].insert_many(from_db[name].find({}))

