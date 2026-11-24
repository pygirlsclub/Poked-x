// Aqui a gente liga tudo: botões, telas e dados.

let todosOsPokemons = [];

function criarCardDoPokemon(pokemon) {
  const itemDaLista = document.createElement("li");
  itemDaLista.className = "card-pokemon";
  itemDaLista.innerHTML = `
    <img src="${pokemon.imagem}" alt="${pokemon.nome}">
    <h3>${pokemon.nome}</h3>
    <button type="button">Favoritar</button>
  `;
  itemDaLista.querySelector("button").addEventListener("click", () => {
    adicionarNaPasta("Favoritos", pokemon.id);
    // TODO: dar um aviso visual de que foi salvo
  });
  return itemDaLista;
}

function mostrarPokemonsNaLista(listaDePokemons) {
  const elementoLista = document.getElementById("lista-pokemons");
  elementoLista.innerHTML = "";
  listaDePokemons.forEach(pokemon => {
    elementoLista.appendChild(criarCardDoPokemon(pokemon));
  });
}

async function iniciar() {
  document.getElementById("botao-comecar").addEventListener("click", () => mostrarTela("tela-lista"));
  document.getElementById("botao-ir-pastas").addEventListener("click", () => mostrarTela("tela-pastas"));
  document.getElementById("botao-voltar-lista").addEventListener("click", () => mostrarTela("tela-lista"));

  todosOsPokemons = await buscarListaDePokemons(20);
  mostrarPokemonsNaLista(todosOsPokemons);

  // imagem da tela 1: o primeiro pokémon da lista
  document.getElementById("imagem-pokemon-apresentacao").src = todosOsPokemons[0].imagem;

  // TODO: pesquisa por nome e filtro por tipo (telas 2 e 3)
  // TODO: botões "Limpar filtros"
  // TODO: desenhar as pastas na tela 3, com botão de remover e detalhes
}

iniciar();
