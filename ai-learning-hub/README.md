# AI Learning Hub - VS Code Ready Project
This project is a simple scaffold for the "AI Learning Hub" (SkillSnap + Visual Assistant).
It includes a Python AI microservice (HuggingFace), a Node backend (Mongo + SQLite),
and a simple frontend (HTML/CSS/JS).

## How to run (short)
1. Start MongoDB locally (or update mongo URI in backend-node/mongo.js).
2. Start Python AI microservice:
   - cd ai-python
   - python -m venv venv
   - source venv/bin/activate   (Windows: venv\Scripts\activate)
   - pip install -r requirements.txt
   - python app.py
3. Start Node backend:
   - cd backend-node
   - npm install
   - node server.js
4. Open http://localhost:5000 in browser.
