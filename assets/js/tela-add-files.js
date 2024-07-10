//variaveis globais
var numeroArquivos = 1;

//funcao para lidar com o click de finalizar
function handleFinalizarClick() {
    //de inicio, pode enviar
    let pode_enviar = true
    //para cada div de arquivo
    for (var i=1; i <= numeroArquivos; i++) {
        //pega o botão de enviar disponiveis
        if(document.querySelector(`#form-adicionar-arquivo${i} #enviar`)) {
            let testa_enviado = document.querySelector(`#form-adicionar-arquivo${i} #enviar`);
            //pega o input de nome disponiveis
            let testa_texto = document.querySelector(`#form-adicionar-arquivo${i} input[name="names"]`).value
            //se o botão de enviar está disponível e o texto está preenchido
            if (!testa_enviado.disabled && testa_texto !== ''|| (i == 1 && !testa_enviado.disabled)) {
                //não pode enviar mais
                pode_enviar = false;
            }
        }
    }
    //se pode enviar, mande o usuário de volta ao repositório
    if (pode_enviar) {
        alert("Manual criado com sucesso!")
        window.location.href = `/repositorio/${userId}`;
    }
    //se não, avise o usuário que alguns arquivos estão faltando
    else {
        alert("Algum(ns) arquivos não foram enviados")
    }
}

function handleVoltarClick() {
    fetch(`/repositorio/manual/${window.manualId}`, { 
        method: 'DELETE'
    })
    .then(response => response.json()) 
    .then(data => {
    })
    .catch(error => console.error('Erro:', error));
    let previousPage = localStorage.getItem('previousPage');
    if (previousPage) {
        window.location.href = previousPage; // Redireciona para a URL anterior
    } else {
        window.location.href = '/repositorio';
    }
}

//função para adicionar outro arquivo à tela
function handleAdicionarArquivoClick() {
    let formId;

    //pega o botão de adicionar arquvo
    const adicionarArquivo = document.getElementById("botao-adicionar-arquivos");
    //pega o form-modelo de adicionar arquivo
    const formAdicionarArquivo = document.getElementById("form-adicionar-arquivo1");
    //pega o container de forms
    const formContainer = document.getElementById("form-container")

    //adiciona 1 ao numero de arquivos disponiveis na tela
    numeroArquivos += 1;
    let numArquivoAtual = numeroArquivos; 

    //cria um novo node que é o clone do form modelo
    var novoArquivo = formAdicionarArquivo.cloneNode(true);
    //define um novo id para o novo node
    novoArquivo.id = `form-adicionar-arquivo${numeroArquivos}`;

    //insere o novo node dentro de form-container, mas antes do botão de adicionar arquivo
    formContainer.insertBefore(novoArquivo, adicionarArquivo)

    //reabilita todos os campos do novo node
    document.querySelector(`#form-adicionar-arquivo${numeroArquivos} input[name="manuals_id"]`).disabled = false;
    document.querySelector(`#form-adicionar-arquivo${numeroArquivos} input[name="names"]`).disabled = false;
    document.querySelector(`#form-adicionar-arquivo${numeroArquivos} select[name="types"]`).disabled = false;
    document.querySelector(`#form-adicionar-arquivo${numeroArquivos} input[name="url"]`).disabled = false;
    document.querySelector(`#form-adicionar-arquivo${numeroArquivos} #enviar`).disabled = false;
    document.querySelector(`#form-adicionar-arquivo${numeroArquivos} #lixeira`).disabled = true;

    //seta todos os campos preenchíveis como sem valor
    document.querySelector(`#form-adicionar-arquivo${numeroArquivos} input[name="names"]`).value = '';
    document.querySelector(`#form-adicionar-arquivo${numeroArquivos} select[name="types"]`).value = '';
    document.querySelector(`#form-adicionar-arquivo${numeroArquivos} input[name="url"]`).value = '';

    //muda a cor da lixeira para cinza, caso não já esteja
    document.querySelector(`#form-adicionar-arquivo${numeroArquivos} #lixeira`).style.backgroundColor = '#f0f0f0'
    
    //adiciona um event listener para o botão de submit
    novoArquivo.addEventListener('submit', function(event) {
        //tira o redirecionamento natural do botao
        event.preventDefault();

        //pega os dados do form enviado
        const formData = new FormData(this);

        
        fetch(this.action, { //pega o action (tipo endpoint) que o form define
            method: 'POST',
            body: formData //o corpo da requisição é os dados do form
        }).then(response => response.json()) //pega a resposta da requisicao e transforma em json
        .then(data => {

            formId = data.file.id; //guarda o id do arquivo mandado 

            // Atualiza o estado dos campos do formulário
            toggleFormFields(numArquivoAtual);

            //define a cor da lixeira como vermelha
            document.querySelector(`#form-adicionar-arquivo${numArquivoAtual} #lixeira`).style.backgroundColor = '#EB5757';
      })
      .catch(error => console.error('Error:', error));  //se der erro, manda o erro no console      
  });

  // Adiciona um event listener para o botão de lixeira
  document.querySelector(`#form-adicionar-arquivo${numeroArquivos} #lixeira`).addEventListener('click', function() {
    let respostaArquivo = confirm("Deseja mesmo deletar este arquivo?");
    if (respostaArquivo) {
        fetch(`/repositorio/manual/files/${formId}`, { //pega o caminho da route de deletar arquivo com o id do arquivo enviado
            method: 'DELETE'
        })
        .then(response => response.json()) //pega a resposta e transforma em json
        .then(data => {
        })
        .catch(error => console.error('Erro:', error));  //caso dê erro, nos informa o erro
    
        //Remove o node da tela
        novoArquivo.remove()
    }
  });

}

// Adicione os event listeners fora do evento DOMContentLoaded
if (/^\/repositorio\/create\/manual.*/.test(window.location.pathname)) {
    let formId;

    //adiciona um event listener para o form modelo
    document.getElementById('form-adicionar-arquivo1').addEventListener('submit', function(event) {
        //tira o redirecionamento natural do botao
        event.preventDefault();

        //pega os dados do form enviado
        const formData = new FormData(this);

        fetch(this.action, { //pega o action (tipo endpoint) que o form define
            method: 'POST',
            body: formData //o corpo da requisição é os dados do form
        }).then(response => response.json()) //pega a resposta da requisicao e transforma em json
        .then(data => {

            formId = data.file.id; //guarda o id do arquivo mandado 

            //Atualiza o estado dos campos do formulário-modelo
            toggleFormFields(1);

            //define a cor da lixeira para vermelho
            document.querySelector(`#form-adicionar-arquivo1 #lixeira`).style.backgroundColor = '#EB5757';
        })
        .catch(error => console.error('Error:', error));        
    });

    
    // Adiciona o ouvinte de evento de clique ao botão de lixeira
    document.querySelector(`#form-adicionar-arquivo1 #lixeira`).addEventListener('click', function() {
        let resposta = confirm("Deseja mesmo deletar este arquivo?");
        if (resposta) {
            fetch(`/repositorio/manual/files/${formId}`, { //pega o caminho da route de deletar arquivo com o id do arquivo enviado
                method: 'DELETE'
            })
            .then(response => response.json()) //pega a resposta e transforma em json
            .then(data => {
            })
            .catch(error => console.error('Erro:', error));  //caso dê erro, nos informa o erro
        
            //Reabilita os campos do form-modelo
            toggleFormFields(1);
        
            //redefine a cor da lixeira para cinza
            document.querySelector(`#form-adicionar-arquivo1 #lixeira`).style.backgroundColor = '#f0f0f0';
        }
    });
    
    //Adicionando um event listener para adicionar o arquivo
    const adicionarArquivo = document.getElementById("botao-adicionar-arquivos");
    if (adicionarArquivo) {
        adicionarArquivo.addEventListener('click', handleAdicionarArquivoClick);
    } else {
        console.log("Elemento com o ID 'botao-adicionar-arquivos' não foi encontrado.");
    }

    //Adicionando um event listener para finalizar o processo de adicionar arquivo
    const finalizar = document.getElementById("finalizar");
    if (finalizar) {
        finalizar.addEventListener('click', handleFinalizarClick) 
    } else {
        console.log("Elemento com ID 'finalizar' não foi encontrado")
    }

    //dicionando um event listener para voltar para a criação do manual
    const voltar = document.getElementById("voltar-manual");
    if (voltar) {
        voltar.addEventListener('click', handleVoltarClick) 
    } else {
        console.log("Elemento com ID 'finalizar' não foi encontrado")
    }
};

//função que habilita/desabilita os campos, serve principalmente para o arquivo modelo
function toggleFormFields(numArquivo) {
  if (document.querySelector(`#form-adicionar-arquivo${numArquivo} input[name="manuals_id"]`).disabled == true) {
    document.querySelector(`#form-adicionar-arquivo${numArquivo} input[name="manuals_id"]`).disabled = false;
    document.querySelector(`#form-adicionar-arquivo${numArquivo} input[name="names"]`).disabled = false;
    document.querySelector(`#form-adicionar-arquivo${numArquivo} select[name="types"]`).disabled = false;
    document.querySelector(`#form-adicionar-arquivo${numArquivo} input[name="url"]`).disabled = false;
    document.querySelector(`#form-adicionar-arquivo${numArquivo} #enviar`).disabled = false;
    document.querySelector(`#form-adicionar-arquivo${numArquivo} #lixeira`).disabled = true;
  }
  else {
    document.querySelector(`#form-adicionar-arquivo${numArquivo} input[name="manuals_id"]`).disabled = true;
    document.querySelector(`#form-adicionar-arquivo${numArquivo} input[name="names"]`).disabled = true;
    document.querySelector(`#form-adicionar-arquivo${numArquivo} select[name="types"]`).disabled = true;
    document.querySelector(`#form-adicionar-arquivo${numArquivo} input[name="url"]`).disabled = true;
    document.querySelector(`#form-adicionar-arquivo${numArquivo} #enviar`).disabled = true;
    document.querySelector(`#form-adicionar-arquivo${numArquivo} #lixeira`).disabled = false;
  }
  
}
