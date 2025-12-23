async function simulate() {
  const partner = document.getElementById('partner').value;
  const budget = document.getElementById('budget').value;
  const result = document.getElementById('result');
  
  result.innerText = '⏳ Generating explanation...';
  result.style.color = '#fff';

  // Construct the prompt string that analyze.js expects
  const simulationPrompt = `Simulate an open innovation project with a ${partner} partner and a ${budget} budget. 
  Explain if it is a Success, Partial Failure, or Failure, and provide a brief reason.`;

  try {
    const response = await fetch('/api/analyze', { // Use the relative Vercel path
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: simulationPrompt }) // Match the "prompt" key in analyze.js
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }

    const explanation = data.response; // analyze.js returns { response: "..." }
    result.innerText = explanation;

    // Logic for color coding remains the same
    if (explanation.includes('Success') || explanation.includes('✅')) {
      result.style.color = 'lightgreen';
    } else if (explanation.includes('Failure') || explanation.includes('❌')) {
      result.style.color = 'red';
    } else {
      result.style.color = 'orange';
    }
  } catch (error) {
    console.error(error);
    result.innerText = '❌ Error: ' + error.message;
    result.style.color = 'red';
  }
}
window.simulate = simulate;

// Innovation Idea Form Handler - Calls Vercel API
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

      try {
        // Create prompt for Gemini
        const prompt = `Analyze and evaluate this innovation idea: "${idea}". Provide a detailed assessment including: (1) Feasibility, (2) Market potential, (3) Key challenges, (4) Implementation roadmap, and (5) Success factors. Keep the response concise but comprehensive.`;

        // Call Vercel API function (using /api/analyze endpoint)
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt })
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const geminiResponse = data.response;

        // Display Gemini response
        resultDiv.innerHTML = `<strong>Gemini Analysis:</strong><br/><br/>${geminiResponse.replace(/\n/g, '<br/>')}`;
        resultDiv.style.color = 'lightblue';
        textarea.value = '';
      } catch (error) {
        console.error('Error:', error);
        resultDiv.textContent = '❌ Error analyzing idea. Please try again.';
        resultDiv.style.color = 'red';
      }
    });
  }
});

