//função para redirecionar o usuário para o repositorio
function handleVoltarKanbanClick() {
    window.location.href = `/kanban/${window.userId}`;
}

if (/^\/kanban\/manual\/.*/.test(window.location.pathname)) {

    document.addEventListener('DOMContentLoaded', async () => {
        //adicionando um event listener para voltar para a criação do manual
        const voltar = document.getElementById("voltar-kanban");
        let numFiles = 0;
        const files = await fetch(`/repositorio/manual/files/${window.manualId}`).then(response => response.json())

        files.forEach((file) => {
            numFiles += 1;

            const divFiles = document.getElementById('div-files');
            const divItem = document.createElement('div');
            divItem.classList.add('item');
            divItem.id = `arquivo${numFiles}`
            divFiles.appendChild(divItem)

            const divFile = document.createElement('div');
            divFile.classList.add('file');
            divItem.appendChild(divFile);

            const aUrl = document.createElement('a');
            aUrl.innerHTML += file.names;
            aUrl.href = file.url;
            aUrl.id = 'link' + numFiles
            divFile.appendChild(aUrl);
            

            const checkbox = document.createElement('input');
            checkbox.type = "checkbox";
            checkbox.classList.add("checkbox");
            divItem.appendChild(checkbox);

            checkbox.addEventListener('click', () => {
                fetch(`/delegations/update/${window.delegationId}`, {
                    method: 'PUT', // Método HTTP
                    headers: {
                      'Content-Type': 'application/json', // Tipo de conteúdo
                    },
                    body: JSON.stringify({doing: true, done: false}) // Corpo da requisição convertido para JSON
                })
            })

        })

        //para cada arquivo, verifique o status do botao
        document.getElementById('finalizar-files').addEventListener('click', () => {
            let podeFinalizar = true;
            for (var i=1; i < files.length; i++) {
                let checkbox = `#arquivo${i} input`
                if (!(document.querySelector(checkbox).checked)) {
                    alert("Você tem arquivos não visualizados");
                    podeFinalizar = false;
                }
            }
            if (podeFinalizar) {
                fetch(`/delegations/update/${window.delegationId}`, {
                    method: 'PUT', // Método HTTP
                    headers: {
                      'Content-Type': 'application/json', // Tipo de conteúdo
                    },
                    body: JSON.stringify({doing: false, done: true}) // Corpo da requisição convertido para JSON
                })
                window.location.href = `/kanban/${window.userId}`;
            }
        })


        if (voltar) {
            voltar.addEventListener('click', handleVoltarClick) 
        } else {
            console.log("Elemento com ID 'finalizar' não foi encontrado")
        }
    })
}
