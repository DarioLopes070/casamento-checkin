document.getElementById("btn").addEventListener("click", async () => {
  const nomeFamilia = document.getElementById("input").value.trim();
  const resDiv = document.getElementById("res");
  resDiv.textContent = "Verificando...";
  
  const resp = await fetch("/checkin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nomeFamilia })
  });

  const text = await resp.text();
  resDiv.textContent = text;
  resDiv.className = resp.ok
    ? "text-green-600 mt-4"
    : "text-red-600 mt-4";
});
