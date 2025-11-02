async function atualizarLista() {
  const res = await fetch("/lista");
  const lista = await res.json();
  const tabela = document.getElementById("tabela");
  tabela.innerHTML = "";

  lista.forEach((c) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="border p-2">${c.nome}</td>
      <td class="border p-2">${c.familia}</td>
      <td class="border p-2 text-center ${c.presente ? "text-green-600 font-bold" : "text-gray-400"}">
        ${c.presente ? "✅ Sim" : "❌ Não"}
      </td>`;
    tabela.appendChild(tr);
  });
}

setInterval(atualizarLista, 3000);
atualizarLista();
