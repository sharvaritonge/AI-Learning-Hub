# ai-python/test_flask.py
import requests

# --- Text endpoint test ---
try:
    resp = requests.post(
        "http://127.0.0.1:5001/api/text",
        json={"text": "This is a test text."}
    )
    print("Text endpoint response:", resp.json())
except Exception as e:
    print("Text endpoint failed:", e)

# --- PDF endpoint test ---
pdf_path = "sample.pdf"  # update path if needed
try:
    with open(pdf_path, "rb") as f:
        files = {"pdf": f}
        pdf_resp = requests.post("http://127.0.0.1:5001/api/pdf", files=files)
        print("PDF endpoint response:", pdf_resp.json())
except FileNotFoundError:
    print(f"PDF file not found at {pdf_path}")
except Exception as e:
    print("PDF endpoint failed:", e)

# --- Flashcards endpoint test ---
try:
    fc_resp = requests.post(
        "http://127.0.0.1:5001/api/flashcards",
        json={"text": "This is a test text to generate flashcards."}
    )
    print("Flashcards endpoint response:", fc_resp.json())
except Exception as e:
    print("Flashcards endpoint failed:", e)
