from fastapi import FastAPI ,HTTPException
from pymongo import MongoClient
from pydantic import BaseModel
from bson.objectid import ObjectId
from datetime import date,datetime
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
    
app = FastAPI()

# # การกำหนดการอนุญาตให้เกิด CORS ที่เซิร์ฟเวอร์ API
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"], # ให้เปิดให้ใช้งานจากทุก Origin หรือคุณอาจระบุ Origin ที่เฉพาะเจาะจง
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
# ตั้งค่า CORS เพื่ออนุญาตให้ frontend ที่อยู่ที่อื่นสามารถเรียกใช้งาน API ของคุณได้
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ใส่ URL ของ frontend ที่อยู่ที่อื่นในลิสต์นี้หากต้องการระบุเฉพาะ URL ที่อนุญาต
    allow_methods=["*"],  # ระบุเมธอดที่อนุญาต (GET, POST, PUT, DELETE, เป็นต้น)
    allow_headers=["*"],  # อนุญาตให้ส่ง header ใน request
)

load_dotenv()

mongo_url = os.environ.get('MONGO_URL')

if mongo_url is None:
    raise ValueError("MongoDB URL is not set in the environment variables.")

client = MongoClient(mongo_url)

db = client["todolist_reactjs_fastapi"]
collection = db["todo"]

class TodoList(BaseModel):
    title: str
    desc: str

@app.get("/")
async def root():
    return {"message":"Hello Guyss"}

# Create
@app.post("/create/")
async def create_todo_list(todo: TodoList):
    # เพิ่มเวลาปัจจุบันใน JSON response
    current_time = datetime.now()
    todo_data = todo.dict()
    todo_data["due_date"] = current_time

    result = collection.insert_one(todo_data)
    return {
        "title": todo.title,
        "desc": todo.desc,
        "due_date": current_time,
        "id": str(result.inserted_id),
    }

# All-todos
@app.get("/all-todos/")
async def read_all_todo_lists():
    all_todos = []
    for todo in collection.find():
        all_todos.append({
            "id": str(todo["_id"]),
            "title": todo["title"],
            "desc": todo["desc"]
        })
    return all_todos

# Read

@app.get("/todo/{id}")
async def read_todo_list(id: str):
    todo = collection.find_one({"_id": ObjectId(id)})
    if todo: 
        todo_data = {
            "id": str(todo["_id"]),
            "title": todo["title"],
            "desc": todo["desc"],
            "due_date": todo.get("due_date"),
        }
        return todo_data
    else:
        raise HTTPException(status_code=404, detail="Todo not found")
    
# Update
@app.put("/todo/{id}")
async def update_todo_list(id: str, todo: TodoList):
    existing_todo = collection.find_one({"_id": ObjectId(id)})
    
    if "due_date" in todo.dict():
        due_date = todo.due_date
    else:
        due_date = existing_todo.get("due_date")

    result = collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": todo.dict(exclude_unset=True)}
    )

    if result.matched_count == 1:
        return {
            "id": id,
            "title": todo.title,
            "desc": todo.desc,
            "due_date": due_date,
        }
    else:
        raise HTTPException(status_code=404, detail="Todo not found")
    
# Delete
@app.delete("/delete/{id}")
async def deleteTodoList(id:str):
    result = collection.delete_one({"_id":ObjectId(id)})
    if result.deleted_count == 1:
        return{"status" : "OK"}
    else:
        raise HTTPException(status_code=404,detail="Todo not found")