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
