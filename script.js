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
let votos = []; // Enviar os dados para o servidor

// ******************* ETAPAS (1 ou 2) *******************
function comecarEtapa() {
    let etapa = etapas[etapaAtual];

    let digitoHtml = '';
    numero = '';
    votoBranco = false;

    //Verifica se está na etapa 0 (vereador) ou 1 (prefeito) e adiciona proporcionalmente o número de caixinhas para dígito, que pode ser 5 ou 2 caixas.
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

// Procura o Vereador ou Prefeito de acordo ao número digitado pelo usuário e imprime na tela (se existir)
function atualizarInterface() {
    let etapa = etapas[etapaAtual];

    //Procura candidato
    //Retorna um array com o candidato selecionado
    let candidato = etapa.candidatos.filter(candidato => candidato.numero === numero);

    if (candidato.length > 0) { // Encontrou um candidato
        candidato = candidato[0];
        tituloCandidato.style.display = 'block';
        dadosCandidato.innerHTML = `Nome: ${candidato.nome} <br/>Partido: ${candidato.partido}`
        instruncoes.style.display = 'block';

        let fotosHtml = '';
        for (let i in candidato.fotos) {
            if(candidato.fotos[i].small){
                fotosHtml += `<div class="img-candidato small"> <img src="./images/${candidato.fotos[i].url}" alt="Imagem do Vice Candidato"> ${candidato.fotos[i].legenda} </div>`
            } else{
                fotosHtml += `<div class="img-candidato"> <img src="./images/${candidato.fotos[i].url}" alt="Imagem do Vice Candidato"> ${candidato.fotos[i].legenda} </div>`
            }
            
        }
        imgCandidato.innerHTML = fotosHtml;

    } else { // Voto Nulo
        tituloCandidato.style.display = 'block';
        instruncoes.style.display = 'block';
        dadosCandidato.innerHTML = '<div class="aviso--grande pisca">VOTO NULO</div>';
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

// **************** BOTÃO CORRIGE ****************
function corrige() {
    comecarEtapa();
}

// **************** BOTÃO CONFIRMA ****************
function confirma() {
    let etapa = etapas[etapaAtual];
    let votoConfirmado = false;

    if(votoBranco === true){ // voto em branco
        votoConfirmado = true;
        //Array com informações para enviar ao servidor
        votos.push({
            etapa: etapas[etapaAtual].titulo,
            voto: 'branco'
        });
    } else if(numero.length === etapa.numeros){ //votou em algum candidato ou nulo
        votoConfirmado = true;
        //Array com informações para enviar ao servidor
        votos.push({
            etapa: etapas[etapaAtual].titulo,
            voto: numero
        });
    }

    if(votoConfirmado){
        etapaAtual++;

        if(etapas[etapaAtual] !== undefined){
            comecarEtapa();
        } else {
            document.querySelector('.tela').innerHTML = '<div class="aviso--gigante pisca">FIM!</div>'
        }
    }
}

comecarEtapa();