//variaveis globais
var numeroSubcategorias = 0;

//função para redirecionar o usuário para o repositorio
function handleVoltarAtualizarClick() {
    window.location.href = `/repositorio/${window.userId}`;
}

//função para adicionar uma subcategoria
function handleAtualizarSubcategoriaClick(value = '') {

    //pega o botao de adicionar subcategoria
    const adicionarSubcategoria = document.getElementById("adicionar-subcategoria-atualizar");

    //pega o modelo do form de adicionar manual
    const formAdicionarManual = document.getElementById("form-atualizar-manual"); 
    numeroSubcategorias += 1;

    //if para impedir que o o numero de subcategorias seja maior que 5
    if (numeroSubcategorias < 6) {
        //configurando o input da nova subcategoria
        var novaSubcategoria = document.createElement("input");
        novaSubcategoria.placeholder = "Adicione a subcategoria do manual";
        novaSubcategoria.name = `sub_categories${numeroSubcategorias}`;
        novaSubcategoria.type = "text";
        novaSubcategoria.id = `sub_categories${numeroSubcategorias}`;
        
        if(value != '[object PointerEvent]' && value) {
            novaSubcategoria.value = value;
        }

        //inserindo o novo input ao form antes do botão de adicionar categoria
        formAdicionarManual.insertBefore(novaSubcategoria, adicionarSubcategoria)

        //quando o numero de subcategorias for 5, remove o botão de adicionar subcategoria
        if(numeroSubcategorias == 5) {
            formAdicionarManual.removeChild(adicionarSubcategoria)
        }
    }
  }

async function buscarDados() {
    //puxar os dados do manual antes da atualização
    const resposta = await fetch(`/repositorio/manual/${window.manualId}`);
    const manual = await resposta.json()
    document.getElementById('names-atualizar').value = manual.names;
    document.getElementById('categories-atualizar').value = manual.categories
    for (var i = 0; i < 5; i++) {
        if (manual[`sub_categories${i}`]) {
            handleAtualizarSubcategoriaClick(manual[`sub_categories${i}`]);
        }
        else {
            continue;
        }
    }
}



if (/^\/repositorio\/atualizar\/.*/.test(window.location.pathname) && !(/^\/repositorio\/atualizar\/files\/.*/.test(window.location.pathname))) {

    localStorage.setItem('previousPage', window.location.href);

    //Adiciona um event listener no botão de voltar
    const voltarRep = document.getElementById("voltar-repositorio-atualizar");
    if (voltarRep) {
        voltarRep.addEventListener('click', handleVoltarAtualizarClick);
    } else {
        console.log("Elemento com o ID 'voltar-repositorio' não foi encontrado.");
    }

     //Adiciona um event listener no botão de adicionar categoria
     const adicionarSubcategoria = document.getElementById("adicionar-subcategoria-atualizar");
     if (adicionarSubcategoria) {
         adicionarSubcategoria.addEventListener('click', handleAtualizarSubcategoriaClick);
     } else {
         console.log("Elemento com o ID 'adicionar-subcategoria' não foi encontrado.");
     }

    //chama a função buscar dados do manual
    buscarDados();

    const finalizarAlteracao = document.getElementById('form-atualizar-manual');
    if (finalizarAlteracao) {
        finalizarAlteracao.addEventListener('submit', async function(event) {
            event.preventDefault();
            //pega os dados do form enviado
            const formData = new FormData(this);

        
            const result = await fetch(this.action, { //pega o action (tipo endpoint) que o form define
                method: 'PUT',
                body: formData 
            }).then(response => response.json()) //pega a resposta da requisicao e transforma em json
            if(result.message == "Manual updated successfully!") {
                alert("Manual alterado com sucesso");
                window.location.href = window.location.href = `/repositorio/atualizar/files/${window.userId}/${window.manualId}`;;
            }
        });
    } else {
        console.log("Elemento com o ID 'finalizar-alteracao' não foi encontrado.");
    }
};
