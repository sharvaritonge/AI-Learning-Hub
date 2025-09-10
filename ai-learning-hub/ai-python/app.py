from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
from difflib import SequenceMatcher
import re

app = Flask(__name__)
CORS(app)

# --- Pipelines ---
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
qg = pipeline("text2text-generation", model="iarfmoose/t5-base-question-generator")

# --- Health check ---
@app.route("/health")
def health():
    return "AI service running"

# --- Helper: remove similar questions ---
def filter_similar_questions(questions, threshold=0.85):
    unique_qs = []
    for q in questions:
        if not any(SequenceMatcher(None, q, uq).ratio() > threshold for uq in unique_qs):
            unique_qs.append(q)
    return unique_qs

# --- Helper: clean question text ---
def clean_question(q):
    q = q.strip()
    if not q.endswith("?"):
        q += "?"
    return q

# --- Process text for summary and questions ---
def process_text(text):
    if not text:
        return None, None

    # Short summary of key points
    summary_out = summarizer(text, max_length=100, min_length=30, do_sample=False)
    summary = summary_out[0]["summary_text"]

    # Generate questions from the whole paragraph
    sentences = re.split(r'(?<=[.!?]) +', text)
    questions = []
    for sent in sentences:
        if len(sent.strip()) < 20:
            continue
        q_out = qg(sent, max_length=64, num_return_sequences=1, do_sample=True)
        question = clean_question(q_out[0]["generated_text"])
        questions.append(question)

    # Remove duplicates and limit to 4
    questions = filter_similar_questions(questions)[:4]

    return summary, questions

# --- Text endpoint ---
@app.route("/api/text", methods=["POST"])
def api_text():
    data = request.json or {}
    text = data.get("text", "")
    if not text:
        return jsonify({"error": "No text provided"}), 400
    summary, questions = process_text(text)
    return jsonify({"summary": summary, "questions": questions})

# --- Flashcards endpoint ---
@app.route("/api/flashcards", methods=["POST"])
def api_flashcards():
    data = request.json or {}
    text = data.get("text", "")
    if not text:
        return jsonify({"error": "No text provided"}), 400

    # Generate short summary for key points
    summary_out = summarizer(text, max_length=100, min_length=30, do_sample=False)
    summary = summary_out[0]["summary_text"]
    sentences = re.split(r'(?<=[.!?]) +', summary)
    key_points = [s.strip() for s in sentences if len(s.strip()) > 20]

    flashcards = []

    for sent in key_points:
        words = sent.split()
        if len(words) < 4:
            continue
        mid = len(words) // 2
        question_text = ' '.join(words[:mid]) + " ... ?"
        answer_text = sent

        # Ensure unique questions
        if not any(fc['question'] == question_text for fc in flashcards):
            flashcards.append({"question": question_text, "answer": answer_text})

        if len(flashcards) >= 4:
            break

    return jsonify({"flashcards": flashcards})

if __name__ == "__main__":
    app.run(port=5001, debug=True)
