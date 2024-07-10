//variaveis globais
var numeroArquivos = 1;
let idDoPrimeiroFile;

//funcao para lidar com o click de finalizar
function handleFinalizarAtualizarClick() {
    //de inicio, pode enviar
    let pode_enviar = true
    //para cada div de arquivo
    for (var i=1; i <= numeroArquivos; i++) {
        //pega o botão de enviar disponiveis
        if(document.querySelector(`#form-atualizar-arquivo${i} #enviar-files-atualizar`)) {
            let testa_enviado = document.querySelector(`#form-atualizar-arquivo${i} #enviar-files-atualizar`);
            //pega o input de nome disponiveis
            let testa_texto = document.querySelector(`#form-atualizar-arquivo${i} input[name="names"]`).value
            //se o botão de enviar existe e (está disponível ou o texto está preenchido)
            if (!testa_enviado.disabled && testa_texto !== ''|| (i == 1 && !testa_enviado.disabled)) {
                //não pode enviar mais
                pode_enviar = false;
            }
        }
    }
    //se pode enviar, mande o usuário de volta ao repositório
    if (pode_enviar) {
        alert("Arquivos atualizados com sucesso!")
        window.location.href = `/repositorio/${userId}`;
    }
    //se não, avise o usuário que alguns arquivos estão faltando
    else {
        alert("Algum(ns) arquivos não foram enviados")
    }
}

function handleVoltarClick() {
    let previousPage = localStorage.getItem('previousPage');
    if (previousPage) {
        window.location.href = previousPage; // Redireciona para a URL anterior
    } else {
        window.location.href = '/repositorio';
    }
}

//função para atualizar outro arquivo à tela
function handleAdicionarArquivoAtualizarClick(arquivo = '') {
    let formId;

    //pega o botão de atualizar arquvo
    const atualizarArquivo = document.getElementById("botao-adicionar-arquivos-atualizar");
    //pega o form-modelo de atualizar arquivo
    const formAdicionarArquivo = document.getElementById("form-atualizar-arquivo1");
    //pega o container de forms
    const formContainer = document.getElementById("form-container-atualizar")

    //adiciona 1 ao numero de arquivos disponiveis na tela
    numeroArquivos += 1;
    let numArquivoAtual = numeroArquivos; 

    //cria um novo node que é o clone do form modelo
    var novoArquivo = formAdicionarArquivo.cloneNode(true);
    //define um novo id para o novo node
    novoArquivo.id = `form-atualizar-arquivo${numeroArquivos}`;

    //insere o novo node dentro de form-container, mas antes do botão de atualizar arquivo
    formContainer.insertBefore(novoArquivo, atualizarArquivo)


    //adiciona os arquivos atuais
    if(arquivo != '[object PointerEvent]' && arquivo) {
        document.querySelector(`#form-atualizar-arquivo${numeroArquivos} input[name="names"]`).value = arquivo.names;
        document.querySelector(`#form-atualizar-arquivo${numeroArquivos} select[name="types"]`).value = arquivo.types;
        document.querySelector(`#form-atualizar-arquivo${numeroArquivos} input[name="url"]`).value = arquivo.url;    
    }
    //seta todos os campos preenchíveis como sem valor
    else {
        document.querySelector(`#form-atualizar-arquivo${numeroArquivos} input[name="names"]`).value = '';
        document.querySelector(`#form-atualizar-arquivo${numeroArquivos} select[name="types"]`).value = '';
        document.querySelector(`#form-atualizar-arquivo${numeroArquivos} input[name="url"]`).value = '';
        toggleFormFieldsAtualizar(numeroArquivos)
    }

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
            toggleFormFieldsAtualizar(numArquivoAtual);

            //define a cor da lixeira como vermelha
            document.querySelector(`#form-atualizar-arquivo${numArquivoAtual} #lixeira-atualizar`).style.backgroundColor = '#EB5757';
      })
      .catch(error => console.error('Error:', error));  //se der erro, manda o erro no console      
  });

  // Adiciona um event listener para o botão de lixeira
  document.querySelector(`#form-atualizar-arquivo${numeroArquivos} #lixeira-atualizar`).addEventListener('click', function() {
    let response = confirm("Deseja mesmo deletar este arquivo?");
    if (response) {
        fetch(`/repositorio/manual/files/${formId}`, { //pega o caminho da route de deletar arquivo com o id do arquivo enviado
            method: 'DELETE'
        })
        .then(response => response.json()) //pega a resposta e transforma em json
        .then(data => {
        })
        .catch(error => console.error('Erro:', error));  //caso dê erro, nos informa o erro
    
        // Atualiza o estado dos campos do formulário
        toggleFormFieldsAtualizar(numArquivoAtual);
        
        //Remove o node da tela
        novoArquivo.remove()
    }
  });

}

async function buscarFiles() {
    const files = fetch(`/repositorio/manual/files/${window.manualId}`).then(response => response.json())
    files.then(data => {
        if (data.length >= 1) {
            document.getElementById('names-files-atualizar').value = data[0]["names"]
            document.getElementById('tipo-files-atualizar').value = data[0]["types"]
            document.getElementById('URL-atualizar').value = data[0]["url"]
            toggleFormFieldsAtualizar(1)
            if (data.length > 1) {
                for (var i = 1; i < data.length; i++){
                    handleAdicionarArquivoAtualizarClick(data[i]);
                }
            }
            idDoPrimeiroFile = data[0]["id"]
            // Adiciona o ouvinte de evento de clique ao botão de lixeira
            document.querySelector(`#form-atualizar-arquivo1 #lixeira-atualizar`).addEventListener('click', function() {
            let resposta = confirm("Deseja mesmo deletar este arquivo?");
            if (resposta) {
                fetch(`/repositorio/manual/files/${idDoPrimeiroFile}`, { //pega o caminho da route de deletar arquivo com o id do arquivo enviado
                  method: 'DELETE'
                })
                .then(response => response.json()) //pega a resposta e transforma em json
                .then(data => {
                })
                .catch(error => console.error('Erro:', error));  //caso dê erro, nos informa o erro
            
                //Reabilita os campos do form-modelo
                toggleFormFieldsAtualizar(1);
            
                //redefine a cor da lixeira para cinza
                document.querySelector(`#form-atualizar-arquivo1 #lixeira`).style.backgroundColor = '#f0f0f0';
            }
            });        }
    });
}

// Adicione os event listeners fora do evento DOMContentLoaded
if (/^\/repositorio\/atualizar\/files\/.*/.test(window.location.pathname)) {
    let formId;
    buscarFiles()

    //adiciona um event listener para o form modelo
    document.getElementById('form-atualizar-arquivo1').addEventListener('submit', function(event) {
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
            toggleFormFieldsAtualizar(1);
        })
        .catch(error => console.error('Error:', error));        
    });
    //Adicionando um event listener para atualizar o arquivo
    const atualizarArquivo = document.getElementById("botao-adicionar-arquivos-atualizar");
    if (atualizarArquivo) {
        atualizarArquivo.addEventListener('click', handleAdicionarArquivoAtualizarClick);
    } else {
        console.log("Elemento com o ID 'botao-atualizar-arquivos' não foi encontrado.");
    }
    //Adicionando um event listener para finalizar o processo de atualizar arquivo
    const finalizar = document.getElementById("finalizar-files-atualizar");
    if (finalizar) {
        finalizar.addEventListener('click', handleFinalizarAtualizarClick) 
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
function toggleFormFieldsAtualizar(numArquivo) {
    if (document.querySelector(`#form-atualizar-arquivo${numArquivo} input[name="manuals_id"]`).disabled == true) {
      document.querySelector(`#form-atualizar-arquivo${numArquivo} input[name="manuals_id"]`).disabled = false;
      document.querySelector(`#form-atualizar-arquivo${numArquivo} input[name="names"]`).disabled = false;
      document.querySelector(`#form-atualizar-arquivo${numArquivo} select[name="types"]`).disabled = false;
      document.querySelector(`#form-atualizar-arquivo${numArquivo} input[name="url"]`).disabled = false;
      document.querySelector(`#form-atualizar-arquivo${numArquivo} #enviar-files-atualizar`).disabled = false;
      document.querySelector(`#form-atualizar-arquivo${numArquivo} #lixeira-atualizar`).disabled = true;
      document.querySelector(`#form-atualizar-arquivo${numArquivo} #lixeira-atualizar`).style.backgroundColor = '#f0f0f0';
    }
    else {
      document.querySelector(`#form-atualizar-arquivo${numArquivo} input[name="manuals_id"]`).disabled = true;
      document.querySelector(`#form-atualizar-arquivo${numArquivo} input[name="names"]`).disabled = true;
      document.querySelector(`#form-atualizar-arquivo${numArquivo} select[name="types"]`).disabled = true;
      document.querySelector(`#form-atualizar-arquivo${numArquivo} input[name="url"]`).disabled = true;
      document.querySelector(`#form-atualizar-arquivo${numArquivo} #enviar-files-atualizar`).disabled = true;
      document.querySelector(`#form-atualizar-arquivo${numArquivo} #lixeira-atualizar`).disabled = false;
      document.querySelector(`#form-atualizar-arquivo${numArquivo} #lixeira-atualizar`).style.backgroundColor = '#EB5757';

    }
    
  }