const listaItens = [
  "Arroz", "Feijão", "Macarrão", "Farinha de Mandioca", "Farinha de Trigo",
  "Fubá", "Café", "Óleo de Soja", "Leite", "Açúcar", "Sal",
  "Ovos", "Biscoito", "Detergente Líquido", "Sabão em Barra", "Desinfetante",
  "Água Sanitária", "Esponja", "Sabão em Pó", "Papel Higiênico", "Papel Toalha",
  "Saco de Lixo", "Carne Moída", "Coxão Mole", "Bisteca Suína", "Lombo Suíno",
  "Peito de Frango", "Coxa e Sobrecoxa", "Queijo", "Presunto", "Iogurte", "Nata"
];

const listaItensUnicos = [...new Set(listaItens)];
const tabela = document.getElementById("corpo-tabela");

function carregarDados() {
  const dadosSalvos = JSON.parse(localStorage.getItem("itensCompra"));
  const totalSalvo = localStorage.getItem("totalGeral");

  if (dadosSalvos && dadosSalvos.length > 0) {
    dadosSalvos.forEach(item => adicionarItem(item.nome, item.qtd, item.valor));
  }

  if (totalSalvo !== null) {
    document.getElementById("total-geral").textContent = `Total Geral: R$ ${parseFloat(totalSalvo).toFixed(2)}`;
  }

  calcularTotal();
}

function adicionarItem(nome = "", qtd = 0, valor = 0) {
  const linha = document.createElement("tr");

  linha.innerHTML = `
    <td><input type="number" class="qtd" min="0" max="999" step="1" value="${qtd > 0 ? qtd : ''}" oninput="salvarDados()" /></td>
    <td><input type="text" value="${nome}" oninput="salvarDados()" /></td>
    <td><input type="number" class="valor" min="0" step="0.01" value="${valor > 0 ? valor : ''}" oninput="salvarDados()" /></td>
    <td class="soma">R$ ${(qtd * valor).toFixed(2)}</td>
    <td><button onclick="removerItem(this)">Remover</button></td>
  `;

  tabela.appendChild(linha);
}

function calcularTotal() {
  let total = 0;
  const linhas = tabela.querySelectorAll("tr");
  linhas.forEach(linha => {
    const qtd = parseFloat(linha.children[0].children[0].value) || 0;
    const val = parseFloat(linha.children[2].children[0].value) || 0;
    const soma = qtd * val;
    linha.children[3].textContent = `R$ ${soma.toFixed(2)}`;
    total += soma;
  });
  document.getElementById("total-geral").textContent = `Total Geral: R$ ${total.toFixed(2)}`;
  localStorage.setItem("totalGeral", total.toFixed(2));
}

function salvarDados() {
  const itens = [];
  const linhas = tabela.querySelectorAll("tr");
  let total = 0;

  linhas.forEach(linha => {
    const nome = linha.children[1].children[0].value.trim();
    const qtd = parseFloat(linha.children[0].children[0].value) || 0;
    const val = parseFloat(linha.children[2].children[0].value) || 0;
    const soma = qtd * val;
    total += soma;

    if (nome) {
      itens.push({ nome, qtd, valor: val });
    }
  });

  localStorage.setItem("itensCompra", JSON.stringify(itens));
  localStorage.setItem("totalGeral", total.toFixed(2));
  calcularTotal();
}

function removerItem(botao) {
  const linha = botao.parentNode.parentNode; 
  linha.remove(); 
  salvarDados(); 
}

function novaLista() {
  // Limpa a interface
  tabela.innerHTML = "";
  document.getElementById("total-geral").textContent = `Total Geral: R$ 0.00`;

  // Limpa o localStorage para nova lista
  localStorage.removeItem("itensCompra");
  localStorage.removeItem("totalGeral");

  // Deixa uma linha vazia para o usuário começar nova lista
  adicionarItem();
}

// Função para limpar os valores
function limparValores() {
  const linhas = tabela.querySelectorAll("tr");

  linhas.forEach(linha => {
    // Limpa os inputs de quantidade e valor
    linha.children[0].children[0].value = "";
    linha.children[2].children[0].value = "";
    // Zera o campo da soma
    linha.children[3].textContent = "R$ 0.00";
  });

  // Zera total geral
  document.getElementById("total-geral").textContent = "Total Geral: R$ 0.00";

  // Remove os valores salvos
  const itens = Array.from(linhas).map(linha => ({
    nome: linha.children[1].children[0].value,
    qtd: 0,
    valor: 0
  }));

  localStorage.setItem("itensCompra", JSON.stringify(itens));
  localStorage.setItem("totalGeral", "0.00");
}

// Função para restaurar a lista original
function restaurarListaOriginal() {
  // Limpa a interface (tabela)
  tabela.innerHTML = "";

  // Preenche a tabela com os itens originais (da listaItens)
  listaItensUnicos.forEach(nome => adicionarItem(nome));

  // Zera o total geral
  document.getElementById("total-geral").textContent = "Total Geral: R$ 0.00";

  // Remove os dados salvos no localStorage
  localStorage.removeItem("itensCompra");
  localStorage.removeItem("totalGeral");

  // Salva a lista original novamente (sem alterações)
  const itensOriginais = listaItensUnicos.map(nome => ({
    nome: nome,
    qtd: 0,
    valor: 0
  }));

  localStorage.setItem("itensCompra", JSON.stringify(itensOriginais));
  localStorage.setItem("totalGeral", "0.00");
}

window.onload = () => {
  carregarDados();
};
