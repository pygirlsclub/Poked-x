// Guarda as pastas e os pokémons salvos no próprio navegador (localStorage).
// Pense numa gaveta: mesmo fechando o site, o que você guardou continua lá.
//
// Formato guardado (um objeto: nome da pasta -> lista de ids de pokémon):
// { "Favoritos": [25, 6], "Cor de rosa": [35, 39] }

const CHAVE_PASTAS = "poked-x-pastas";
const NOME_DA_PASTA_PADRAO = "Favoritos";

function carregarPastas() {
  // try/catch porque o localStorage pode estar bloqueado ou com texto quebrado;
  // sem isso o site inteiro pararia de funcionar por causa de uma gaveta emperrada.
  try {
    const textoSalvo = localStorage.getItem(CHAVE_PASTAS);
    if (textoSalvo) {
      const pastas = JSON.parse(textoSalvo);
      if (pastas && typeof pastas === "object") return pastas;
    }
  } catch (erro) {
    console.warn("Não consegui ler as pastas salvas:", erro);
  }
  // primeira vez que abre o site: cria a pasta padrão
  return { [NOME_DA_PASTA_PADRAO]: [] };
}

function salvarPastas(pastas) {
  try {
    localStorage.setItem(CHAVE_PASTAS, JSON.stringify(pastas));
  } catch (erro) {
    console.warn("Não consegui salvar as pastas:", erro);
  }
}

function pokemonEstaNaPasta(nomeDaPasta, idDoPokemon) {
  const pastas = carregarPastas();
  return (pastas[nomeDaPasta] || []).includes(idDoPokemon);
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
  if (!pastas[nomeDaPasta]) return;
  pastas[nomeDaPasta] = pastas[nomeDaPasta].filter(id => id !== idDoPokemon);
  salvarPastas(pastas);
}

// Devolve "ok" ou um texto explicando por que não deu certo
function criarPasta(nomeDigitado) {
  const nomeDaPasta = nomeDigitado.trim();
  if (nomeDaPasta === "") return "Escreva um nome para a pasta.";

  const pastas = carregarPastas();
  if (Object.prototype.hasOwnProperty.call(pastas, nomeDaPasta)) {
    return "Já existe uma pasta com esse nome.";
  }
  pastas[nomeDaPasta] = [];
  salvarPastas(pastas);
  return "ok";
}

function apagarPasta(nomeDaPasta) {
  // A pasta padrão fica: assim sempre existe um lugar para favoritar
  if (nomeDaPasta === NOME_DA_PASTA_PADRAO) return;
  const pastas = carregarPastas();
  delete pastas[nomeDaPasta];
  salvarPastas(pastas);
}
