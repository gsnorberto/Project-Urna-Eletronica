let tituloCandidato = document.querySelector('.titulo-candidato span');
let cargoCandidato = document.querySelector('.cargo-candidato span');
let digitoCandidato = document.querySelector('.digito-candidato');
let dadosCandidato = document.querySelector('.dados-candidato');
let imgCandidato = document.querySelector('.d-1-right');
let instruncoes = document.querySelector('.d-2');

//São duas etapas: Vereador (etapa 0) e Prefeito (etapa 1)
let etapaAtual = 0;
let numero = '';
let votoBranco = false;

// ******************* ETAPAS *******************
function comecarEtapa() {
    let etapa = etapas[etapaAtual];

    let digitoHtml = '';
    numero = '';
    votoBranco = false;

    for (let i = 0; i < etapa.numeros; i++) {
        if (i === 0) {
            digitoHtml += '<div class="num pisca"></div>'
        } else {
            digitoHtml += '<div class="num"></div>'
        }
    }

    tituloCandidato.style.display = 'none'; //Seu voto para
    cargoCandidato.innerHTML = etapa.titulo; //Vereado/prefeito
    digitoCandidato.innerHTML = digitoHtml; // ** ou *****
    dadosCandidato.innerHTML = ''; //nome, partido, vice-prefeito
    instruncoes.style.display = 'none'; //infos da parte inferior da tela
    imgCandidato.innerHTML = '';
}

function atualizarInterface() {
    let etapa = etapas[etapaAtual];

    //Procura candidato
    //Retorna um array com o candidato selecionado
    let candidato = etapa.candidatos.filter(candidato => candidato.numero === numero);

    // Encontrou candidato
    if (candidato.length > 0) {
        candidato = candidato[0];
        tituloCandidato.style.display = 'block';
        dadosCandidato.innerHTML = `Nome: ${candidato.nome} <br/>Partido: ${candidato.partido}`
        instruncoes.style.display = 'block';

        let fotosHtml = '';
        for (let i in candidato.fotos) {
            fotosHtml += `<div class="img-candidato small"> <img src="./images/${candidato.fotos[i].url}" alt="Imagem do Vice Candidato"> ${candidato.fotos[i].legenda} </div>`
        }

        imgCandidato.innerHTML = fotosHtml;
    } else {
        tituloCandidato.style.display = 'block';
        instruncoes.style.display = 'block';
        dadosCandidato.innerHTML = '<div class="aviso--grande pisca">VOTO NULO</div>';
    }

}


// ******************* BOTÕES *******************
function clicou(n) {
    let elNumero = document.querySelector('.num.pisca')
    if (elNumero !== null) {
        elNumero.innerHTML = n;
        numero = `${numero}${n}` //concatenar números e guardar na url

        //remove o pisca da posição que está sendo digitada, e insere na próxima posição 
        elNumero.classList.remove('pisca');
        if (elNumero.nextElementSibling !== null) {
            elNumero.nextElementSibling.classList.add('pisca')
        } else { //chegou no último dígito
            atualizarInterface();
        }
    }
}
//Para votar em branco os dígitos da urna devem estar vazios
function branco() {

    numero === '';
    votoBranco = true;

    tituloCandidato.style.display = 'block';
    instruncoes.style.display = 'block';
    digitoCandidato.innerHTML = '';
    imgCandidato.innerHTML = '';
    //digitoCandidato.style.display = 'none';
    dadosCandidato.innerHTML = '<div class="aviso--grande pisca">VOTO EM BRANCO</div>';

}
function corrige() {
    comecarEtapa();
}
function confirma() {
    let etapa = etapas[etapaAtual];
    let votoConfirmado = false;

    if(votoBranco === true){ // voto em branco
        votoConfirmado = true;
        console.log("Confirmando como Branco");
    } else if(numero.length === etapa.numeros){ //votou em algum candidato ou nulo
        votoConfirmado = true;
        console.log("Confirmando como Numero");
    }

    if(votoConfirmado){
        etapaAtual++;

        if(etapas[etapaAtual] !== undefined){
            comecarEtapa();
        } else {
            dadosCandidato.innerHTML = '<div class="aviso--grande pisca">FIM!</div>';
        }
    }
}

comecarEtapa();