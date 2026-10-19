/* ===========================================================
   Minha playlist — etapa 1: cada música tem um gênero

   Cada música agora é um objeto, com título e gênero. A
   renderizar() desenha a lista com createElement, como em
   16/10, e cada <li> ganha um atributo data-genero. Quem
   decide a cor de cada gênero é o CSS.
   =========================================================== */


/* -----------------------------------------------------------
   Funções que só devolvem
   ----------------------------------------------------------- */

// montarTextoDaContagem(0) → 'Nenhuma música'
// montarTextoDaContagem(1) → '1 música'
// montarTextoDaContagem(6) → '6 músicas'
function montarTextoDaContagem(quantidade) {
    if (quantidade === 0) {
        return 'Nenhuma música';
    }
    if (quantidade === 1) {
        return '1 música';
    }
    return quantidade + ' músicas';
}


/* -----------------------------------------------------------
   Selecionar e lembrar
   ----------------------------------------------------------- */

const formulario = document.querySelector('.formulario');
const campoTitulo = document.querySelector('.campo-titulo');
const campoGenero = document.querySelector('.campo-genero');
const aviso = document.querySelector('.aviso');

const telaContagem = document.querySelector('.contagem');
const telaLista = document.querySelector('.lista');

const iconeRemover = `
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path d="M6 6 L18 18 M18 6 L6 18"
              stroke="currentColor" stroke-width="3" stroke-linecap="round" />
    </svg>`;

// Cada música é um objeto: o título e o gênero.
const musicas = [
    { titulo: 'APT.', genero: 'pop' },
    { titulo: 'The Emptiness Machine', genero: 'rock' },
    { titulo: 'Tubarão Te Amo', genero: 'funk' },
    { titulo: 'Espresso', genero: 'pop' },
    { titulo: 'Bohemian Rhapsody', genero: 'rock' },
    { titulo: 'BIRDS OF A FEATHER', genero: 'pop' }
];


/* -----------------------------------------------------------
   Funções que criam elementos
   ----------------------------------------------------------- */

function criarItemDaMusica(musica, posicao) {
    const item = document.createElement('li');

    // O atributo data-genero não aparece na tela. Ele está ali
    // para o CSS escolher a cor: li[data-genero="pop"].
    item.setAttribute('data-genero', musica.genero);

    const titulo = document.createElement('span');
    titulo.classList.add('titulo');
    titulo.textContent = musica.titulo;

    const etiqueta = document.createElement('span');
    etiqueta.classList.add('etiqueta');
    etiqueta.textContent = musica.genero;

    const botaoRemover = document.createElement('button');
    botaoRemover.type = 'button';
    botaoRemover.classList.add('botao-remover');
    botaoRemover.innerHTML = iconeRemover;
    botaoRemover.setAttribute('aria-label', 'Remover ' + musica.titulo);

    botaoRemover.addEventListener('click', function () {
        musicas.splice(posicao, 1);
        aviso.textContent = musica.titulo + ' saiu da playlist.';
        renderizar();
    });

    item.appendChild(titulo);
    item.appendChild(etiqueta);
    item.appendChild(botaoRemover);
    return item;
}


/* -----------------------------------------------------------
   Desenhar a tela a partir dos dados
   ----------------------------------------------------------- */

function renderizar() {
    telaLista.innerHTML = '';

    for (let i = 0; i < musicas.length; i++) {
        telaLista.appendChild(criarItemDaMusica(musicas[i], i));
    }

    telaContagem.textContent = montarTextoDaContagem(musicas.length);
}

renderizar();


/* -----------------------------------------------------------
   Escutar
   ----------------------------------------------------------- */

campoTitulo.addEventListener('input', function () {
    aviso.textContent = '';
});

formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();

    const musica = {
        titulo: campoTitulo.value.trim(),
        genero: campoGenero.value
    };

    if (musica.titulo === '') {
        aviso.textContent = 'Escreva o nome da música.';
    } else {
        musicas.push(musica);
        campoTitulo.value = '';
        renderizar();
    }
});
