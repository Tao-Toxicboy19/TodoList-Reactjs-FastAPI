from fastapi import FastAPI ,HTTPException
from pymongo import MongoClient
from pydantic import BaseModel
from bson.objectid import ObjectId

app = FastAPI()

client = MongoClient("mongodb://thewarat19:LSSCCdxCjtW3Myf4@ac-m5iasjm-shard-00-00.gnbfgkb.mongodb.net:27017,ac-m5iasjm-shard-00-01.gnbfgkb.mongodb.net:27017,ac-m5iasjm-shard-00-02.gnbfgkb.mongodb.net:27017/todolist_reactjs_fastapi?ssl=true&replicaSet=atlas-tu358i-shard-0&authSource=admin&retryWrites=true&w=majority")
db = client["todolist_reactjs_fastapi"]
collection = db["todo"]

class TodoList(BaseModel):
    title: str
    desc: str


@app.get("/")
async def root():
    return {"message":"Hello World"}

# Create
@app.post("/create/")
async def createTodoList(todo:TodoList):
    result = collection.insert_one(todo.dict())
    return {
        "id": str(result.inserted_id),
        "title": todo.title,
        "desc": todo.desc
    }

# Read
@app.get("/todo/{id}")
async def readTodoList(id:str):
    todo = collection.find_one({"_id":ObjectId(id)})
    if todo: 
        return {"id":str(todo["_id"]),"title":todo["title"],"desc":todo["desc"]}
    else:
        raise HTTPException(status_code=404,detail="Todo not found")
    
# Update
@app.put("/todo/{id}")
async def updateTodoList(id:str,todo:TodoList):
    result = collection.update_one(
        {"_id":ObjectId(id)},{"$set":todo.dict(exclude_unset=True)}
    )
    if result.modified_count ==1:
        return{"id":id,"title":todo.title,"desc":todo.desc}
    else:
        raise HTTPException(status_code=404,detail="Todo not found")
    
# Delete
@app.delete("/todo/{id}")
async def deleteTodoList(id:str):
    result = collection.delete_one({"_id":ObjectId(id)})
    if result.deleted_count == 1:
        return{"status" : "OK"}
    else:
        raise HTTPException(status_code=404,detail="Todo not found")