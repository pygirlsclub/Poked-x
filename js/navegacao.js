// Troca de tela: tira a classe "tela-ativa" de todas e põe só na escolhida.

function mostrarTela(idDaTela) {
  document.querySelectorAll(".tela").forEach(tela => {
    tela.classList.remove("tela-ativa");
  });
  document.getElementById(idDaTela).classList.add("tela-ativa");
}
