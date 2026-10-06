// Usuários de exemplo (apenas para demostração - em um site real,
// a verificação deve ser feita no servidor, nunca no navegador).
const USUARIOS = [
    {usuarios: "admin", senha:"1234", nome:"Administrador"},  
    {usuarios: "maria", senha:"abcd", nome:"Maria"}
];

const CHAVE_SESSAO = "sessaoUsuario";

//Elementos
const telaLogin= document.getElementById("tela-login");
const areaRestrita = document.getElementById("area-restrita");
const formLogin = document.getElementById("form-login");
const campoUsuario = document.getElementById("usuario");
const campoSenha = document.getElementById("senha");
const checkLembrar = document.getElementById("lembrar");
const mensagemErro = document.getElementById("mensagem-erro");
const botaoMostrar = document.getElementById("mostrar-senha");
const botaoSair = document.getElementById("botao-sair");
const nomeUsuario = document.getElementById("nome-usuario");
const painel = document.querySelector(".painel");

//----------Sessão----------
function salvarSessao(dados, lembrar) {
    const armazenamento = lembrar ? localStorage : sessionStorage;
    armazenamento.setItem(CHAVE_SESSAO, JSON.stringify(dados));
}

function lerSessão() {
    const dados =
        localStorage.getItem(CHAVE_SESSAO) || sessionStorage.getItem(CHAVE_SESSAO);
    return dados ? JSON.parse(dados) : null;
}

function limparSessao() {
    localStorage.removeItem(CHAVE_SESSAO);
    sessionStorage.removeItem(CHAVE_SESSAO);
}

//--------------Telas--------------
function mostrarAreaRestrita(sessao) {
    nomeUsuario.textContent = sessao.nome;
    telaLogin.classList.add("oculto");
    areaRestrita.classList.remove("oculto");
    document.title = "Meu Site - Área restrita";
}

function mostrarlogin() {
    areaRestrita.classList.add("oculto");
    telaLogin.classList.remove("oculto");
    document.title = "Meu site - Entrar";
    formLogin.reset();
    mensagemErro.textContent = "";
    campoUsuario.focus();
}

function mostrarErro(texto) {
    mensagemErro.textContent = texto;
    painel.classList.remove("tremer");
    void painel.offsetWidth; //reiniciar a animação
    painel.classList.add("tremer");
}

//------------Eventos------------
formLogin.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const usuario = campoUsuario.value.trim();
    const senha = campoSenha.value;

    if (!usuario || !senha) {
        mostrarErro("Preencha usuário e senha.");
    return;
}

    const encontrado = USUARIOS.find(
        (u) => u.usuario === usuario && u.senha === senha
    );

    if (!encontrado) {
        mostrarErro("Usuário ou senha incorretos. Tente novamente.");
        campoSenha.value = "";
        campoSenha.focus();
        return;
    }

    const sessao = { usuario: encontrado.usuario, nome: encontrado.nome};
    salvarSessao(sessao, checkLembrar.checked);
    mostrarAreaRestrita(sessao);
})

botaoMostrar.addEventListener("click", () => {
    const visivel = campoSenha.type === "text";
    campoSenha.type = visivel ? "password" : "text";
    botaoMostrar.textContent = visivel ? "Mostrar" : "Ocultar";
    botaoMostrar.setAttribute("aria-label", visivel ? "Mostrar senha" : "Oculta Senha");
});

botaoSair.addEventListener("click", () => {
    limparSessao();
    mostrarlogin();
});

//----------Início----------
const sessaoatual = lerSessão();
if (sessaoatual) {
    mostrarAreaRestrita(sessaoatual);
}   else {
    campoUsuario.focus();
}