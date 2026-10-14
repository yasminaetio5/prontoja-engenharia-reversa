
const categorias = [
  ["Todos", "🍽️"],
  ["Hambúrguer", "🍔"],
  ["Pizza", "🍕"],
  ["Japonesa", "🍣"],
  ["Brasileira", "🍛"],
  ["Sobremesas", "🍰"],
  ["Bebidas", "🥤"],
  ["Lanches", "🥪"]
];

const produtos = [
  {id:1,nome:"Combo Burger",cat:"Hambúrguer",emoji:"🍔",preco:29.90,antigo:39.90,desc:"Hambúrguer, batata e molho especial."},
  {id:2,nome:"Pizza Calabresa",cat:"Pizza",emoji:"🍕",preco:39.90,antigo:49.90,desc:"Queijo, calabresa e massa artesanal."},
  {id:3,nome:"Combo Sushi",cat:"Japonesa",emoji:"🍣",preco:34.90,antigo:44.90,desc:"Seleção especial de sushi."},
  {id:4,nome:"Brigadeiro Gourmet",cat:"Sobremesas",emoji:"🍫",preco:8.90,antigo:12.90,desc:"Chocolate cremoso."},
  {id:5,nome:"Prato Feito",cat:"Brasileira",emoji:"🍛",preco:24.90,antigo:29.90,desc:"Arroz, feijão, carne e salada."},
  {id:6,nome:"Batata Crocante",cat:"Lanches",emoji:"🍟",preco:14.90,antigo:19.90,desc:"Porção com tempero especial."},
  {id:7,nome:"Milk-shake",cat:"Bebidas",emoji:"🥤",preco:13.90,antigo:17.90,desc:"Milk-shake cremoso."},
  {id:8,nome:"Sanduíche Natural",cat:"Lanches",emoji:"🥪",preco:16.90,antigo:21.90,desc:"Frango, salada e pão macio."}
];

const restaurantes = [
  {nome:"Burger House",emoji:"🍔",cat:"Hambúrguer",nota:"4.8",tempo:"20–35 min"},
  {nome:"Cantina da Pizza",emoji:"🍕",cat:"Pizza",nota:"4.7",tempo:"30–45 min"},
  {nome:"Sushi do Bairro",emoji:"🍣",cat:"Japonesa",nota:"4.9",tempo:"25–40 min"},
  {nome:"Tempero Brasileiro",emoji:"🍛",cat:"Brasileira",nota:"4.6",tempo:"20–35 min"},
  {nome:"Doce Encanto",emoji:"🍰",cat:"Sobremesas",nota:"4.8",tempo:"15–30 min"},
  {nome:"Lanche Express",emoji:"🥪",cat:"Lanches",nota:"4.5",tempo:"15–25 min"}
];

let categoriaAtual = "Todos";
let termo = "";
let carrinho = {};

const dinheiro = n => n.toLocaleString("pt-BR", {
  style:"currency", currency:"BRL"
});

function renderizarCategorias() {
  document.getElementById("categorias").innerHTML = categorias.map(c => `
    <button class="categoria ${categoriaAtual === c[0] ? "ativa" : ""}"
      onclick="selecionarCategoria('${c[0]}')">
      <span class="emoji">${c[1]}</span>
      <span>${c[0]}</span>
    </button>
  `).join("");
}

function renderizarProdutos() {
  const filtrados = produtos.filter(p =>
    (categoriaAtual === "Todos" || p.cat === categoriaAtual) &&
    (p.nome + p.cat + p.desc).toLowerCase().includes(termo)
  );

  document.getElementById("listaProdutos").innerHTML = filtrados.length
    ? filtrados.map(p => `
      <article class="produto">
        <div class="produto-imagem">
          <span class="desconto">OFERTA</span>
          ${p.emoji}
        </div>
        <div class="produto-info">
          <h3>${p.nome}</h3>
          <p class="descricao">${p.desc}</p>
          <p class="antigo">${dinheiro(p.antigo)}</p>
          <div class="linha">
            <span class="preco">${dinheiro(p.preco)}</span>
            <button class="btn" onclick="adicionar(${p.id})">+</button>
          </div>
        </div>
      </article>
    `).join("")
    : '<p class="vazio">Nenhum produto encontrado.</p>';
}

function renderizarRestaurantes() {
  const lista = restaurantes.filter(r =>
    (categoriaAtual === "Todos" || r.cat === categoriaAtual) &&
    (r.nome + r.cat).toLowerCase().includes(termo)
  );

  document.getElementById("listaRestaurantes").innerHTML = lista.length
    ? lista.map(r => `
      <article class="restaurante">
        <span class="emoji">${r.emoji}</span>
        <h3>${r.nome}</h3>
        <p>⭐ ${r.nota} · ${r.tempo}</p>
        <button class="btn" onclick="selecionarCategoria('${r.cat}')">
          Ver cardápio
        </button>
      </article>
    `).join("")
    : '<p class="vazio">Nenhum restaurante encontrado.</p>';
}

function selecionarCategoria(cat) {
  categoriaAtual = cat;
  renderizarTudo();
}

function mostrarTodos() {
  categoriaAtual = "Todos";
  termo = "";
  document.getElementById("busca").value = "";
  renderizarTudo();
  document.getElementById("produtos").scrollIntoView({behavior:"smooth"});
}

document.getElementById("busca").addEventListener("input", e => {
  termo = e.target.value.trim().toLowerCase();
  renderizarProdutos();
  renderizarRestaurantes();
});

function adicionar(id) {
  carrinho[id] = (carrinho[id] || 0) + 1;
  renderizarCarrinho();
  abrirCarrinho();
}

function alterar(id, delta) {
  carrinho[id] = (carrinho[id] || 0) + delta;
  if (carrinho[id] <= 0) delete carrinho[id];
  renderizarCarrinho();
}

function subtotal() {
  return produtos.reduce((s,p) => s + p.preco * (carrinho[p.id] || 0), 0);
}

function taxaEntrega() {
  return subtotal() === 0 || subtotal() >= 60 ? 0 : 5.99;
}

function renderizarCarrinho() {
  const quantidade = Object.values(carrinho).reduce((a,b) => a+b, 0);
  const sub = subtotal();
  const taxa = taxaEntrega();

  document.getElementById("quantidade").textContent = quantidade;
  document.getElementById("subtotal").textContent = dinheiro(sub);
  document.getElementById("entrega").textContent =
    taxa === 0 && sub > 0 ? "Grátis" : dinheiro(taxa);
  document.getElementById("total").textContent = dinheiro(sub + taxa);

  const itens = produtos.filter(p => carrinho[p.id]);

  document.getElementById("itensCarrinho").innerHTML = itens.length
    ? itens.map(p => `
      <div class="item-carrinho">
        <div class="linha">
          <strong>${p.emoji} ${p.nome}</strong>
          <strong>${dinheiro(p.preco * carrinho[p.id])}</strong>
        </div>
        <button onclick="alterar(${p.id},-1)">−</button>
        ${carrinho[p.id]}
        <button onclick="alterar(${p.id},1)">+</button>
      </div>
    `).join("")
    : '<p class="vazio">Seu carrinho está vazio 🛒</p>';
}

function abrirCarrinho() {
  document.getElementById("carrinho").classList.add("aberto");
  document.getElementById("fundo").classList.add("aberto");
}

function fecharCarrinho() {
  document.getElementById("carrinho").classList.remove("aberto");
  document.getElementById("fundo").classList.remove("aberto");
}

function finalizar() {
  if (subtotal() === 0) {
    alert("Adicione produtos ao carrinho primeiro.");
    return;
  }

  fecharCarrinho();
  document.getElementById("checkout").classList.add("aberto");
}

function fecharCheckout() {
  document.getElementById("checkout").classList.remove("aberto");
}

document.getElementById("formPedido").addEventListener("submit", e => {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const endereco = document.getElementById("endereco").value.trim();
  const pagamento = document.getElementById("pagamento").value;

  if (!nome || !endereco || subtotal() === 0) return;

  const total = subtotal() + taxaEntrega();
  const numero = Math.floor(100000 + Math.random() * 900000);

  alert(
    `PEDIDO SIMULADO #${numero}\n\n` +
    `Cliente: ${nome}\nEndereço: ${endereco}\n` +
    `Pagamento: ${pagamento}\nTotal fictício: ${dinheiro(total)}\n\n` +
    `Nenhum pagamento foi realizado.`
  );

  carrinho = {};
  renderizarCarrinho();
  fecharCheckout();
  e.target.reset();
});

function renderizarTudo() {
  renderizarCategorias();
  renderizarProdutos();
  renderizarRestaurantes();
}

renderizarTudo();
renderizarCarrinho();