export function goToNovoChamado(navigate) {
  sessionStorage.setItem("navegacaoInterna", "1");
  navigate("/chamados/novo");
}