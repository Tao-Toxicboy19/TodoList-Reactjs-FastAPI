# TodoList-Reactjs-FastAPI
python -m venv env
.\env\Scripts\activate

pip install fastapi pymongo uvicorn python-dotenv

# run server
uvicorn main:app --reload

# exit (myenv)
deactivate