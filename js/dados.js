// Busca os pokémons na PokeAPI (uma API é como um garçom: você faz o pedido
// e ela traz os dados da cozinha, que é o servidor deles).

const ENDERECO_API = "https://pokeapi.co/api/v2";

async function buscarPokemon(idOuNome) {
  const resposta = await fetch(`${ENDERECO_API}/pokemon/${idOuNome}`);
  if (!resposta.ok) throw new Error(`Pokémon ${idOuNome} não encontrado`);
  const dados = await resposta.json();
  return {
    id: dados.id,
    nome: dados.name,
    imagem: dados.sprites.front_default,
    tipos: dados.types.map(item => item.type.name),
  };
}

async function buscarListaDePokemons(quantidade) {
  const pedidos = [];
  for (let numero = 1; numero <= quantidade; numero++) {
    pedidos.push(buscarPokemon(numero));
  }
  // Promise.all espera todos os pedidos chegarem, mantendo a ordem
  return Promise.all(pedidos);
}

// A descrição vem de outro "balcão" da API (pokemon-species).
// Obs.: a PokeAPI não tem as descrições em português, por isso vêm em inglês.
async function buscarDescricao(idDoPokemon) {
  const resposta = await fetch(`${ENDERECO_API}/pokemon-species/${idDoPokemon}`);
  if (!resposta.ok) throw new Error("Descrição não encontrada");
  const dados = await resposta.json();
  const textoEmIngles = dados.flavor_text_entries.find(
    entrada => entrada.language.name === "en"
  );
  if (!textoEmIngles) return "Sem descrição disponível.";
  // a API traz quebras de linha estranhas no meio do texto; trocamos por espaço
  return textoEmIngles.flavor_text.replace(/[\n\f]/g, " ");
}
