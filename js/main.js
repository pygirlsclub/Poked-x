// Aqui a gente liga tudo: botões, telas, dados e o localStorage.

const QUANTIDADE_DE_POKEMONS = 50; // aumente para 151 para ter a primeira geração toda

let todosOsPokemons = [];
const pokemonsPorId = {}; // "caderninho" para não pedir o mesmo pokémon duas vezes
let numeroDoUltimoDesenho = 0; // evita desenhar as pastas duas vezes se você digitar rápido

// ---------- Utilidades ----------

async function pegarPokemonPorId(idDoPokemon) {
  if (!pokemonsPorId[idDoPokemon]) {
    pokemonsPorId[idDoPokemon] = await buscarPokemon(idDoPokemon);
  }
  return pokemonsPorId[idDoPokemon];
}

function criarElemento(tag, texto, classe) {
  const elemento = document.createElement(tag);
  if (texto) elemento.textContent = texto; // textContent evita que um texto digitado vire código
  if (classe) elemento.className = classe;
  return elemento;
}

function criarImagemDoPokemon(pokemon) {
  const imagem = document.createElement("img");
  imagem.src = pokemon.imagem;
  imagem.alt = pokemon.nome;
  return imagem;
}

// ---------- TELA 2: lista ----------

function preencherSeletorDePastas(seletor) {
  seletor.innerHTML = "";
  Object.keys(carregarPastas()).forEach(nomeDaPasta => {
    const opcao = document.createElement("option");
    opcao.value = nomeDaPasta;
    opcao.textContent = nomeDaPasta;
    seletor.appendChild(opcao);
  });
}

function criarCardDaLista(pokemon) {
  const card = criarElemento("li", "", "card-pokemon");
  const seletorDePasta = document.createElement("select");
  seletorDePasta.setAttribute("aria-label", `Pasta para salvar ${pokemon.nome}`);
  preencherSeletorDePastas(seletorDePasta);
  const botaoSalvar = document.createElement("button");
  botaoSalvar.type = "button";

  // O texto do botão depende de a pasta escolhida já ter esse pokémon ou não
  function atualizarBotao() {
    const jaEstaSalvo = pokemonEstaNaPasta(seletorDePasta.value, pokemon.id);
    botaoSalvar.textContent = jaEstaSalvo ? "Remover da pasta" : "Salvar na pasta";
    botaoSalvar.classList.toggle("botao-secundario", jaEstaSalvo);
  }

  botaoSalvar.addEventListener("click", () => {
    if (pokemonEstaNaPasta(seletorDePasta.value, pokemon.id)) {
      removerDaPasta(seletorDePasta.value, pokemon.id);
    } else {
      adicionarNaPasta(seletorDePasta.value, pokemon.id);
    }
    atualizarBotao();
  });
  seletorDePasta.addEventListener("change", atualizarBotao);

  card.append(
    criarImagemDoPokemon(pokemon),
    criarElemento("h3", pokemon.nome),
    seletorDePasta,
    botaoSalvar
  );
  atualizarBotao();
  return card;
}

function mostrarPokemonsNaLista(listaDePokemons) {
  const elementoLista = document.getElementById("lista-pokemons");
  elementoLista.innerHTML = "";
  document.getElementById("mensagem-lista").textContent =
    listaDePokemons.length === 0 ? "Nenhum pokémon encontrado com esses filtros." : "";
  listaDePokemons.forEach(pokemon => {
    elementoLista.appendChild(criarCardDaLista(pokemon));
  });
}

function preencherFiltroDeTipos() {
  const seletorDeTipo = document.getElementById("filtro-tipo-lista");
  const tiposSemRepetir = [...new Set(todosOsPokemons.flatMap(pokemon => pokemon.tipos))].sort();
  tiposSemRepetir.forEach(tipo => {
    const opcao = document.createElement("option");
    opcao.value = tipo;
    opcao.textContent = tipo;
    seletorDeTipo.appendChild(opcao);
  });
}

// Não faz pedido novo à internet: só filtra a lista que já está na memória
function aplicarFiltrosDaLista() {
  const textoDigitado = document.getElementById("pesquisa-lista").value.trim().toLowerCase();
  const tipoEscolhido = document.getElementById("filtro-tipo-lista").value;

  const pokemonsFiltrados = todosOsPokemons.filter(pokemon => {
    const nomeCombina = pokemon.nome.includes(textoDigitado);
    const tipoCombina = tipoEscolhido === "" || pokemon.tipos.includes(tipoEscolhido);
    return nomeCombina && tipoCombina;
  });
  mostrarPokemonsNaLista(pokemonsFiltrados);
}

function limparFiltrosDaLista() {
  document.getElementById("pesquisa-lista").value = "";
  document.getElementById("filtro-tipo-lista").value = "";
  aplicarFiltrosDaLista();
}

// ---------- TELA 3: pastas ----------

function atualizarFiltroDePasta(pastas) {
  const seletor = document.getElementById("filtro-pasta");
  const escolhaAnterior = seletor.value;
  seletor.innerHTML = '<option value="">Todas as pastas</option>';
  Object.keys(pastas).forEach(nomeDaPasta => {
    const opcao = document.createElement("option");
    opcao.value = nomeDaPasta;
    opcao.textContent = nomeDaPasta;
    seletor.appendChild(opcao);
  });
  // se a pasta escolhida foi apagada, volta para "Todas as pastas"
  seletor.value = Object.prototype.hasOwnProperty.call(pastas, escolhaAnterior) ? escolhaAnterior : "";
}

function criarCardDaPasta(pokemon, nomeDaPasta) {
  const card = criarElemento("li", "", "card-pokemon");

  const botaoDetalhes = criarElemento("button", "Detalhes", "botao-secundario");
  botaoDetalhes.type = "button";
  botaoDetalhes.addEventListener("click", () => abrirDetalhes(pokemon));

  const botaoRemover = criarElemento("button", "Remover");
  botaoRemover.type = "button";
  botaoRemover.addEventListener("click", () => {
    removerDaPasta(nomeDaPasta, pokemon.id);
    desenharPastas(); // redesenha, senão ele sairia da gaveta mas continuaria na tela
  });

  card.append(criarImagemDoPokemon(pokemon), criarElemento("h3", pokemon.nome), botaoDetalhes, botaoRemover);
  return card;
}

async function desenharPastas() {
  numeroDoUltimoDesenho += 1;
  const numeroDesteDesenho = numeroDoUltimoDesenho;

  const pastas = carregarPastas();
  atualizarFiltroDePasta(pastas);
  const textoDigitado = document.getElementById("pesquisa-pastas").value.trim().toLowerCase();
  const pastaEscolhida = document.getElementById("filtro-pasta").value;

  const nomesDasPastas = Object.keys(pastas).filter(
    nome => pastaEscolhida === "" || nome === pastaEscolhida
  );

  const fragmento = document.createDocumentFragment();
  try {
    for (const nomeDaPasta of nomesDasPastas) {
      const secaoDaPasta = criarElemento("section", "", "pasta");

      const cabecalho = criarElemento("div", "", "pasta-cabecalho");
      cabecalho.appendChild(criarElemento("h3", nomeDaPasta));
      if (nomeDaPasta !== NOME_DA_PASTA_PADRAO) {
        const botaoApagar = criarElemento("button", "Apagar pasta", "botao-secundario");
        botaoApagar.type = "button";
        botaoApagar.addEventListener("click", () => {
          if (confirm(`Apagar a pasta "${nomeDaPasta}"?`)) {
            apagarPasta(nomeDaPasta);
            desenharPastas();
          }
        });
        cabecalho.appendChild(botaoApagar);
      }
      secaoDaPasta.appendChild(cabecalho);

      // O localStorage guarda só os números (ids); aqui buscamos nome e imagem de cada um
      const pokemonsDaPasta = await Promise.all(pastas[nomeDaPasta].map(pegarPokemonPorId));
      const pokemonsVisiveis = pokemonsDaPasta.filter(pokemon => pokemon.nome.includes(textoDigitado));

      if (pokemonsVisiveis.length === 0) {
        const textoVazio = textoDigitado
          ? "Nenhum pokémon com esse nome nesta pasta."
          : "Pasta vazia. Salve pokémons pela lista!";
        secaoDaPasta.appendChild(criarElemento("p", textoVazio, "mensagem"));
      } else {
        const grade = criarElemento("ul", "", "grade-cards");
        pokemonsVisiveis.forEach(pokemon => grade.appendChild(criarCardDaPasta(pokemon, nomeDaPasta)));
        secaoDaPasta.appendChild(grade);
      }
      fragmento.appendChild(secaoDaPasta);
    }
  } catch (erro) {
    console.error(erro);
    document.getElementById("mensagem-pastas").textContent =
      "Não consegui carregar os pokémons das pastas. Verifique a internet.";
    return;
  }

  // Se outro desenho começou enquanto esperávamos a internet, este já está velho: descarta
  if (numeroDesteDesenho !== numeroDoUltimoDesenho) return;
  document.getElementById("area-pastas").replaceChildren(fragmento);
}

function limparFiltrosDasPastas() {
  document.getElementById("pesquisa-pastas").value = "";
  document.getElementById("filtro-pasta").value = "";
  desenharPastas();
}

function criarPastaNova() {
  const campoDoNome = document.getElementById("nome-nova-pasta");
  const mensagem = document.getElementById("mensagem-pastas");
  const resultado = criarPasta(campoDoNome.value);
  if (resultado === "ok") {
    campoDoNome.value = "";
    mensagem.textContent = "";
    desenharPastas();
  } else {
    mensagem.textContent = resultado;
  }
}

// ---------- Detalhes ----------

async function abrirDetalhes(pokemon) {
  const painel = document.getElementById("detalhes-pokemon");
  painel.hidden = false;
  painel.replaceChildren(
    criarImagemDoPokemon(pokemon),
    criarElemento("h3", pokemon.nome),
    criarElemento("p", `Tipo: ${pokemon.tipos.join(", ")}`),
    criarElemento("p", "Carregando descrição...", "mensagem")
  );
  const textoDaDescricao = painel.querySelector(".mensagem");

  const botaoFechar = criarElemento("button", "Fechar");
  botaoFechar.type = "button";
  botaoFechar.addEventListener("click", () => { painel.hidden = true; });
  painel.appendChild(botaoFechar);
  botaoFechar.focus();

  try {
    textoDaDescricao.textContent = await buscarDescricao(pokemon.id);
  } catch (erro) {
    textoDaDescricao.textContent = "Não consegui carregar a descrição.";
  }
}

// ---------- Início ----------

async function iniciar() {
  document.getElementById("botao-comecar").addEventListener("click", () => mostrarTela("tela-lista"));

  document.getElementById("botao-ir-pastas").addEventListener("click", () => {
    mostrarTela("tela-pastas");
    desenharPastas(); // sempre lê a gaveta de novo, para mostrar o que foi salvo agora
  });
  document.getElementById("botao-voltar-lista").addEventListener("click", () => {
    document.getElementById("detalhes-pokemon").hidden = true;
    mostrarTela("tela-lista");
    aplicarFiltrosDaLista(); // refaz os cards, pois pastas podem ter sido criadas ou apagadas
  });

  // Filtros da tela 2
  document.getElementById("pesquisa-lista").addEventListener("input", aplicarFiltrosDaLista);
  document.getElementById("filtro-tipo-lista").addEventListener("change", aplicarFiltrosDaLista);
  document.getElementById("limpar-filtros-lista").addEventListener("click", limparFiltrosDaLista);

  // Filtros e criação de pastas da tela 3
  document.getElementById("pesquisa-pastas").addEventListener("input", desenharPastas);
  document.getElementById("filtro-pasta").addEventListener("change", desenharPastas);
  document.getElementById("limpar-filtros-pastas").addEventListener("click", limparFiltrosDasPastas);
  document.getElementById("botao-criar-pasta").addEventListener("click", criarPastaNova);
  document.getElementById("nome-nova-pasta").addEventListener("keydown", evento => {
    if (evento.key === "Enter") criarPastaNova();
  });

  try {
    todosOsPokemons = await buscarListaDePokemons(QUANTIDADE_DE_POKEMONS);
    todosOsPokemons.forEach(pokemon => { pokemonsPorId[pokemon.id] = pokemon; });
  } catch (erro) {
    console.error(erro);
    document.getElementById("mensagem-lista").textContent =
      "Não consegui carregar os pokémons. Verifique a internet e recarregue a página.";
    return;
  }

  preencherFiltroDeTipos();
  mostrarPokemonsNaLista(todosOsPokemons);
  // imagem da tela 1: o primeiro pokémon da lista
  document.getElementById("imagem-pokemon-apresentacao").src = todosOsPokemons[0].imagem;
}

iniciar();
