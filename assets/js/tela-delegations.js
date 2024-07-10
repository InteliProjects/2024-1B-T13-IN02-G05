async function fetchFuncionarios() {
    try {
        const response = await fetch('/adm/worker');
        const data = await response.json();
        adicionarFuncionario(data);
    } catch (error) {
        console.error('Erro ao buscar funcionários:', error);
    }
}


function adicionarFuncionario(data) {
    const coluna = document.querySelector('#resultsId');
    // Adicionar um novo funcionário
    data.forEach( Worker=> {
        const div = document.createElement('div');
        div.classList.add('result-item');
        div.dataset.category = Worker.lines;
        div.innerHTML = `
            <div class='worker-container'>
                <div class='worker-img-data'>
                    <img src='/icons/icone-pessoa.png' alt='imagem de pessoa'>
                    <div class='worker-data'>
                        <div class='worker-name'>
                            <p class='name'>${Worker.names}</p>
                        </div>
                        <div class='worker-role'>
                            <p class='role'>${Worker.lines}</p>
                        </div>
                    </div>
                </div>
                <div class='worker-checkbox-div'>
                    <input value='${Worker.id}' type='checkbox' class='worker-checkbox'>
                </div>
            </div>
        `;
        coluna.appendChild(div);
    });
}

async function fetchManuais(){
    try{
        const response = await fetch('/repositorio/manual');
        const manuals = await response.json();
        adicionarManuais(manuals);
    } catch (error) {
        console.error('Erro ao buscar funcionarios:', error);
    }
}

function adicionarManuais(manuals){
    const dropdown = document.querySelector('#manual-select')
    //Adicionar o manual ao dropdown
    manuals.forEach(manual => {
        const option = document.createElement('option');
        option.classList.add('manual-option');
        option.textContent = manual.names;
        option.value = manual.id
        dropdown.appendChild(option);
    });
}

async function acharLinhas() {
    try {
        const response = await fetch('/adm/worker/lines');
        const linhasUnicas = await response.json();

        const filtro = document.getElementById('filtro-linhas');
        linhasUnicas.forEach(linha => {
            const li = document.createElement('li');
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.value = linha;
            input.dataset.category = linha;
            input.addEventListener('change', () => {filtrarPorLinha()});
            li.appendChild(input);
            li.appendChild(document.createTextNode(linha));
            filtro.appendChild(li);
        });
    } catch (error) {
        console.error(error);
    }
}

if (/^\/delegacao\/.*/.test(window.location.pathname))  {
    window.onload = function() {
        fetchFuncionarios();
        fetchManuais();
        acharLinhas()

        //logica do botão de selecionar tudo que está visivel
        let selecionaTudo = document.getElementById('selecionarTudo');
    selecionaTudo.addEventListener('click', () => {
        const checkboxes = document.querySelectorAll('#resultsId .result-item input[type="checkbox"]');
        if (selecionaTudo.checked) {
            checkboxes.forEach(checkbox => {
                if (checkbox.closest('.result-item').style.display === "") {
                    checkbox.checked = true;
                }
            });
        } else {
            checkboxes.forEach(checkbox => {
                if (checkbox.closest('.result-item').style.display === "") {
                    checkbox.checked = false;
                }
            });
        }
    });
        //logica do botao create-task
        document.getElementById('create-task').addEventListener('click', async () => {
            //pegando as checkbox selecionadas e os manuais
            const checkboxes = document.querySelectorAll('#resultsId input[type="checkbox"]:checked');
            const manual = document.getElementById('manual-select');

            //verificando se o usuário escolheu pelo menos um manual e um montador
            if (!manual.value) {
                alert("Selecione um manual");
                manual.style.borderColor = 'red';
            }
            else if(checkboxes.length < 1) {
                alert("Selecione pelo menos um montador");
                manual.style.borderColor = '#cccccc';
                document.querySelector(".content").style.borderColor = 'red';
            }
            //mandando uma requisição para cada checkbox selecionada
            else {
                checkboxes.forEach(async (checkbox) => {
                    
                    await fetch('/delegations/create', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            engineers_id: window.engineerId,
                            workers_id: checkbox.value,
                            manuals_id: manual.value 
                        })
                    });
                });
                //feedback para o usuário
                alert("Delegações criadas com sucesso");
                location.reload(); 
            }
        });
    }
}

