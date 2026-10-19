/* ===========================================================
   Na fila — ponto de partida de 16/10

   É a playlist completa de 07/10. Se a sua não está
   funcionando inteira, comece por esta.

   A fila é um array de textos. Cada botão faz UMA operação
   no array e depois chama a mostrarFila(), que redesenha a
   lista a partir dele.

     Adicionar ao fim       push      põe no fim
     Tocar depois desta     unshift   põe no começo
     Próxima                shift     tira do começo
     Desfazer última        pop       tira do fim
     Remover da fila        indexOf + splice   tira do meio
     (aviso de repetida)    includes  já está na lista?
   =========================================================== */


/* -----------------------------------------------------------
   Funções que só devolvem
   ----------------------------------------------------------- */

// Um <li> para cada música da fila.
function montarItensDaFila(fila) {
    let itens = '';
    for (let i = 0; i < fila.length; i++) {
        itens = itens + `<li>${fila[i]}</li>`;
    }
    return itens;
}

// montarTextoDaContagem(0) → 'Fila vazia'
// montarTextoDaContagem(1) → '1 música na fila'
// montarTextoDaContagem(3) → '3 músicas na fila'
function montarTextoDaContagem(quantidade) {
    if (quantidade === 0) {
        return 'Fila vazia';
    }
    if (quantidade === 1) {
        return '1 música na fila';
    }
    return quantidade + ' músicas na fila';
}

// Devolve o problema da música nova, ou '' se estiver tudo certo.
// montarAvisoDaNovaMusica('', fila)     → 'Escreva o nome da música.'
// montarAvisoDaNovaMusica('APT.', fila) → 'APT. já está na fila.' (se estiver)
function montarAvisoDaNovaMusica(musica, fila) {
    if (musica === '') {
        return 'Escreva o nome da música.';
    }
    if (fila.includes(musica)) {
        return musica + ' já está na fila.';
    }
    return '';
}


/* -----------------------------------------------------------
   Selecionar e lembrar
   ----------------------------------------------------------- */

const formulario = document.querySelector('.formulario');
const campoMusica = document.querySelector('.campo-musica');
const aviso = document.querySelector('.aviso');

const botaoProxima = document.querySelector('.botao-proxima');
const botaoFurar = document.querySelector('.botao-furar');
const botaoRemover = document.querySelector('.botao-remover');
const botaoDesfazer = document.querySelector('.botao-desfazer');

const telaContagem = document.querySelector('.contagem');
const telaMusicaAtual = document.querySelector('.musica-atual');
const telaLista = document.querySelector('.lista');

// A fila começa com três músicas, para já ter o que ver.
const fila = ['APT.', 'Die With A Smile', 'BIRDS OF A FEATHER'];


/* -----------------------------------------------------------
   Funções que mexem na tela
   ----------------------------------------------------------- */

// Redesenha a lista inteira a partir do array.
// Toda operação na fila termina chamando esta função.
function mostrarFila() {
    telaLista.innerHTML = montarItensDaFila(fila);
    telaContagem.textContent = montarTextoDaContagem(fila.length);

    // Fila vazia: não há próxima para tocar.
    botaoProxima.disabled = fila.length === 0;
}

function lerMusica() {
    return campoMusica.value.trim();
}

function limparCampo() {
    campoMusica.value = '';
}

mostrarFila();


/* -----------------------------------------------------------
   Escutar
   ----------------------------------------------------------- */

// input: começou a digitar de novo, o aviso antigo sai.
campoMusica.addEventListener('input', function () {
    aviso.textContent = '';
});

// push: põe no fim
formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();

    const musica = lerMusica();
    aviso.textContent = montarAvisoDaNovaMusica(musica, fila);

    if (aviso.textContent === '') {
        fila.push(musica);
        limparCampo();
        mostrarFila();
    }
});

// unshift: põe no começo, a próxima a tocar
botaoFurar.addEventListener('click', function () {
    const musica = lerMusica();
    aviso.textContent = montarAvisoDaNovaMusica(musica, fila);

    if (aviso.textContent === '') {
        fila.unshift(musica);
        limparCampo();
        mostrarFila();
    }
});

// shift: tira do começo, e devolve o que tirou.
// Com a fila vazia, o botão já está desabilitado.
botaoProxima.addEventListener('click', function () {
    telaMusicaAtual.textContent = fila.shift();
    aviso.textContent = '';
    mostrarFila();
});

// pop: tira do fim, e também devolve o que tirou
botaoDesfazer.addEventListener('click', function () {
    if (fila.length === 0) {
        aviso.textContent = 'A fila está vazia.';
    } else {
        const removida = fila.pop();
        aviso.textContent = removida + ' saiu da fila.';
        mostrarFila();
    }
});

// indexOf + splice: acha a posição e tira dali
botaoRemover.addEventListener('click', function () {
    const musica = lerMusica();
    const posicao = fila.indexOf(musica);

    if (musica === '') {
        aviso.textContent = 'Escreva o nome da música.';
    } else if (posicao === -1) {
        aviso.textContent = musica + ' não está na fila.';
    } else {
        fila.splice(posicao, 1);
        aviso.textContent = musica + ' saiu da fila.';
        limparCampo();
        mostrarFila();
    }
});
