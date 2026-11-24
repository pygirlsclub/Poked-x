// Guarda os favoritos e as pastas no próprio navegador (localStorage).
// Pense numa gaveta: mesmo fechando o site, o que você guardou continua lá.

const CHAVE_PASTAS = "poked-x-pastas";

function carregarPastas() {
  const textoSalvo = localStorage.getItem(CHAVE_PASTAS);
  if (textoSalvo) return JSON.parse(textoSalvo);
  // primeira vez que abre o site: cria a pasta padrão
  return { "Favoritos": [] };
}

function salvarPastas(pastas) {
  localStorage.setItem(CHAVE_PASTAS, JSON.stringify(pastas));
}

function adicionarNaPasta(nomeDaPasta, idDoPokemon) {
  const pastas = carregarPastas();
  if (!pastas[nomeDaPasta]) pastas[nomeDaPasta] = [];
  if (!pastas[nomeDaPasta].includes(idDoPokemon)) {
    pastas[nomeDaPasta].push(idDoPokemon);
  }
  salvarPastas(pastas);
}

function removerDaPasta(nomeDaPasta, idDoPokemon) {
  const pastas = carregarPastas();
  pastas[nomeDaPasta] = pastas[nomeDaPasta].filter(id => id !== idDoPokemon);
  salvarPastas(pastas);
}

// TODO: criarPasta(nome), apagarPasta(nome)
