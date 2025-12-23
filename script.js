async function simulate() {
  const partner = document.getElementById("partner").value;
  const budget = document.getElementById("budget").value;
  const result = document.getElementById("result");

  result.innerText = "⏳ Generating explanation...";
  result.style.color = "#fff";

  try {
    const response = await fetch("YOUR_FUNCTION_URL_HERE", { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partner, budget })
    });

    const data = await response.json();
    const explanation = data.explanation;

    result.innerText = explanation;

    if (explanation.includes("Success") || explanation.includes("✅")) {
      result.style.color = "lightgreen";
    } else if (explanation.includes("Partial Failure") || explanation.includes("⚠")) {
      result.style.color = "orange";
    } else if (explanation.includes("Fail") || explanation.includes("❌")) {
      result.style.color = "red";
    } else {
      result.style.color = "#fff";
    }

  } catch (error) {
    console.error(error);
    result.innerText = "⚠ Could not generate explanation. Try again.";
    result.style.color = "red";
  }
}

window.simulate = simulate;

// Innovation idea form handler
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('innovation-form');
    const textarea = document.getElementById('innovation-idea');
    const resultDiv = document.getElementById('idea-result');

    if (form) {
          form.addEventListener('submit', (e) => {
                  e.preventDefault();

                  const idea = textarea.value.trim();
                  if (!idea) {
                            alert('Please enter your innovation idea.');
                            return;
                          }

                  // Display the received idea on the page
                  resultDiv.textContent = `Idea received: ${idea}`;
                  resultDiv.style.color = 'lightgreen';
                  textarea.value = '';
                });
        }
  }

                          // Gemini API Configuration
                          const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE'; // Replace with your actual API key
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Function to call Gemini API
async function callGeminiAPI(prompt) {
    try {
          const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                            contents: [{ parts: [{ text: prompt }] }]
                                    })
                        });

          if (!response.ok) {
                  throw new Error(`API error: ${response.status}`);
                }

          const data = await response.json();
          const responseText = data.candidates[0].content.parts[0].text;
          return responseText;
        } catch (error) {
          console.error('Gemini API Error:', error);
          return 'Error: Could not generate response from Gemini.';
        }
  }

// Update innovation form handler to use Gemini
const originalHandler = document.querySelector('#innovation-form')?.addEventListener;
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('innovation-form');
    const textarea = document.getElementById('innovation-idea');
    const resultDiv = document.getElementById('idea-result');

    if (form) {
          form.addEventListener('submit', async (e) => {
                  e.preventDefault();

                  const idea = textarea.value.trim();
                  if (!idea) {
                            alert('Please enter your innovation idea.');
                            return;
                          }

                  // Show loading state
                  resultDiv.textContent = '⏳ Analyzing your innovation idea with Gemini...';
                  resultDiv.style.color = '#fff';

                  // Create prompt for Gemini
                  const prompt = `Analyze and evaluate this innovation idea: "${idea}". Provide a detailed assessment including: (1) Feasibility, (2) Market potential, (3) Key challenges, (4) Implementation roadmap, and (5) Success factors. Keep the response concise but comprehensive.`;

                  // Call Gemini API
                  const geminiResponse = await callGeminiAPI(prompt);

                  // Display Gemini response
                  resultDiv.innerHTML = `<strong>Gemini Analysis:</strong><br/><br/>${geminiResponse.replace(/\n/g, '<br/>')}`;
                  resultDiv.style.color = 'lightblue';
                  textarea.value = '';
                });
        }
  });


