// Busca os pokémons na PokeAPI (uma API é como um garçom: você faz o pedido
// e ela traz os dados da cozinha, que é o servidor deles).

const ENDERECO_API = "https://pokeapi.co/api/v2";

async function buscarPokemon(idOuNome) {
  const resposta = await fetch(`${ENDERECO_API}/pokemon/${idOuNome}`);
  const dados = await resposta.json();
  return {
    id: dados.id,
    nome: dados.name,
    imagem: dados.sprites.front_default,
    tipos: dados.types.map(item => item.type.name),
  };
}

async function buscarListaDePokemons(quantidade = 20) {
  const pedidos = [];
  for (let numero = 1; numero <= quantidade; numero++) {
    pedidos.push(buscarPokemon(numero));
  }
  return Promise.all(pedidos);
}

// TODO: buscar a descrição detalhada (endpoint /pokemon-species/)
