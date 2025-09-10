// ai-frontend/app.js

// Process text endpoint
async function processText(text) {
  try {
    const res = await fetch("http://127.0.0.1:5001/api/text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
    return await res.json();
  } catch (err) {
    return { error: err.message };
  }
}

// Process flashcards endpoint
async function processFlashcards(text) {
  try {
    const res = await fetch("http://127.0.0.1:5001/api/flashcards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
    return await res.json();
  } catch (err) {
    return { error: err.message };
  }
}

// Process PDF endpoint
async function processPDF(file) {
  const formData = new FormData();
  formData.append("pdf", file);

  try {
    const res = await fetch("http://127.0.0.1:5001/api/pdf", {
      method: "POST",
      body: formData
    });
    return await res.json();
  } catch (err) {
    return { error: err.message };
  }
}

// Remove duplicate questions
function uniqueQuestions(questions) {
  return [...new Set(questions.map(q => q.trim()))];
}

// Show summary
function showSummary(summary) {
  const summaryBox = document.getElementById("summaryBox");
  summaryBox.style.display = "block";
  summaryBox.innerHTML = `<div class="section-title">Summary</div>${summary || "No summary generated"}`;
}

// Show questions
function showQuestions(questions) {
  const questionsBox = document.getElementById("questionsBox");
  questionsBox.style.display = "block";

  const uniqueQs = uniqueQuestions(questions);

  if (Array.isArray(uniqueQs) && uniqueQs.length > 0) {
    questionsBox.innerHTML = `<div class="section-title">Questions</div>
      <ul class="question-list">${uniqueQs.map(q => `<li>${q}</li>`).join("")}</ul>`;
  } else {
    questionsBox.innerHTML = `<div class="section-title">Questions</div><p>No questions generated</p>`;
  }
}

// Show flashcards
function showFlashcards(flashcards) {
  const flashcardsBox = document.getElementById("flashcardsBox");
  flashcardsBox.style.display = "block";
  if (Array.isArray(flashcards) && flashcards.length > 0) {
    flashcardsBox.innerHTML = `<div class="section-title">Flashcards</div>` +
      flashcards.map(fc => `<div class="flashcard"><b>Q:</b> ${fc.question}<br><b>A:</b> ${fc.answer}</div>`).join("");
  } else {
    flashcardsBox.innerHTML = `<div class="section-title">Flashcards</div><p>No flashcards generated</p>`;
  }
}

// Event listeners
document.getElementById("process").addEventListener("click", async () => {
  const text = document.getElementById("text").value.trim();
  if (!text) return alert("Please enter text first!");

  const data = await processText(text);
  if (data.error) return alert("Error: " + data.error);

  showSummary(data.summary);
  showQuestions(data.questions);

  const fcData = await processFlashcards(text);
  if (!fcData.error) showFlashcards(fcData.flashcards);
});

document.getElementById("processFlashcards").addEventListener("click", async () => {
  const text = document.getElementById("text").value.trim();
  if (!text) return alert("Please enter text first!");

  const fcData = await processFlashcards(text);
  if (fcData.error) return alert("Error: " + fcData.error);

  showFlashcards(fcData.flashcards);
});

document.getElementById("processPDF").addEventListener("click", async () => {
  const fileInput = document.getElementById("pdfFile");
  if (!fileInput.files.length) return alert("Please upload a PDF!");

  const data = await processPDF(fileInput.files[0]);
  if (data.error) return alert("Error: " + data.error);

  showSummary(data.summary);
  showQuestions(data.questions);
});
