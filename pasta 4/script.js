// código atualizado
/* ===========================================================
   Cadastro de endereço — o JavaScript

   O HTML e o CSS estão prontos. Vamos escrever este arquivo
   juntos, em quatro partes:

   1. Busca: a função que pede o endereço à ViaCEP
   2. Tela: uma função para cada estado da tela
   3. Evento: o envio do formulário, que junta tudo
   4. O tema
   =========================================================== */
// Buscando: o aviso e o botão desativado, para ninguém
// disparar dois pedidos iguais.
const botaoBuscar = document.querySelector('.botao-buscar');
const telaStatus = document.querySelector('.status');

function mostrarCarregando() {
   telaStatus.textContent = 'Buscando o CEP...';
   telaStatus.classList.remove('erro');
   telaStatus.classList.remove('sucesso');
   botaoBuscar.disabled = true;
}

async function buscarCep(cep) {
    // Formato errado (como 123): nem fazemos o pedido.
    // Não dá para deixar isso com a ViaCEP: a resposta 400 dela
    // é bloqueada pelo navegador (CORS), e o fetch rejeita como
    // se estivesse sem internet.
   if (cep.length !== 8) {
      throw new Error('CEP em formato inválido.');
   }

   const url = `https://viacep.com.br/ws/${cep}/json/`;

    // Sem internet, ou o navegador bloqueou a resposta: o fetch
    // rejeita. Trocamos a mensagem técnica ("Failed to fetch")
    // por uma que o usuário entende.
    // Cuidado: o if do formato não pode ficar aqui dentro. O catch
    // pega QUALQUER erro do try, inclusive um throw nosso.
   let resposta;
   try {
      resposta = await fetch(url);
   } catch (erro) {
      throw new Error('Não foi possível falar com a ViaCEP. Tente de novo.');
   }

    // O servidor respondeu com erro (um 500, por exemplo).
    // Um 404 ou um 500 NÃO rejeitam o fetch: quem confere somos nós.
   if (resposta.ok === false) {
      throw new Error('A ViaCEP está com problemas. Tente mais tarde.');
   }

    // CEP com 8 números que não existe: status 200, mas o JSON
    // vem com { "erro": "true" }. Só testando a API descobrimos isso.
   const endereco = await resposta.json();
   if (endereco.erro) {
      throw new Error('CEP não encontrado.');
   }

   return endereco;
}

const campoRua = document.querySelector('.campo-rua');
const campoBairro = document.querySelector('.campo-bairro');
const campoCidade = document.querySelector('.campo-cidade');
const campoUf = document.querySelector('.campo-uf');
const campoNumero = document.querySelector('.campo-numero');
// Os nomes vêm da ViaCEP: logradouro é a rua, localidade é a cidade.
function mostrarEndereco(endereco) {    
   campoRua.value = endereco.logradouro;
   campoBairro.value = endereco.bairro;
   campoCidade.value = endereco.localidade;
   campoUf.value = endereco.uf;
   telaStatus.textContent = 'Endereço encontrado! Complete o número.';
   telaStatus.classList.add('sucesso');
   campoNumero.focus();
}

function esperar(funcao, tempoEmMilissegundos) {
   setTimeout(funcao, tempoEmMilissegundos);
}

// O fim da busca, tenha dado certo ou não.
function esconderCarregando() {
   botaoBuscar.disabled = false;
}

const formulario = document.querySelector('.busca-cep');
const campoCep = document.querySelector('.campo-cep');

formulario.addEventListener('submit', async function (evento) {
   evento.preventDefault();
     const cep = campoCep.value.replace('-', '');   // a API quer só números
   console.log(`CEP digitado: ${cep}`);

   mostrarCarregando();
   
     // esperar(esconderCarregando, 3000);

   try {
      const endereco = await buscarCep(cep);
      console.log(`endereço recebido pela função "buscarCep": ${endereco}`);
      mostrarEndereco(endereco);
   } catch (erro) {
      console.log(`Ocorreu um erro ${erro}`);
   } finally {
      esconderCarregando();
   }
});
const CHAVE_TEMA = 'endereco-tema';

// matchMedia faz, no JavaScript, a mesma pergunta de uma
// media query: "o sistema está no modo escuro?"
function descobrirTemaDoSistema() {
   if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'escuro';
   }
   return 'claro';
}

// A escolha salva, ou o tema do sistema na primeira vez.
function carregarTema() {
   const salvo = localStorage.getItem(CHAVE_TEMA);
   if (salvo === null) {
      return descobrirTemaDoSistema();
   }
   return salvo;
}

const botaoTema = document.querySelector('.botao-tema');
let temaAtual = carregarTema();
aplicarTema(temaAtual);

// document.documentElement é o <html>: o mesmo :root do CSS.
function aplicarTema(tema) {
   if (tema === 'escuro') {
      document.documentElement.classList.add('escuro');
      botaoTema.textContent = 'Tema claro';
   } else {
      document.documentElement.classList.remove('escuro');
      botaoTema.textContent = 'Tema escuro';
   }
}

botaoTema.addEventListener('click', function () {
   if (temaAtual === 'escuro') {
      temaAtual = 'claro';
   } else {
      temaAtual = 'escuro';
   }
    // O tema é um texto: vai para o localStorage sem JSON.
   localStorage.setItem(CHAVE_TEMA, temaAtual);
   aplicarTema(temaAtual);
});