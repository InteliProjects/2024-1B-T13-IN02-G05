async function fetchManuaisRepositorio() {
    try {
        const response = await fetch('/repositorio/manual');
        const data = await response.json();
        adicionarManual(data);
    } catch (error) {
        console.error('Erro ao buscar funcionários:', error);
    }
}


function adicionarManual(data) {
    const coluna = document.querySelector('#resultsId');
    let numeroManuais = 0;
    // Adicionar um novo funcionário
    data.forEach( Manual => {
        numeroManuais += 1;
        let idLixeira = 'lixeira' + numeroManuais 
        let idAtualizar = 'atualizar' + numeroManuais;
        const div = document.createElement('div');
        div.classList.add('result-item');
        let urlCategoria; 
        switch(Manual.categories){
            case 'Computadores':
                urlCategoria = '/icons/computador.png';
                break;
            case 'Eletrônicos e Acessórios':
                urlCategoria =  '/icons/rato.png';
                break;
            case 'Softwares e Soluções':
                urlCategoria = '/icons/armazenamento-na-nuvem.png';
                break;
            case 'Infraestrutura':
                urlCategoria = '/icons/lan.png';
        }
        div.innerHTML = `
            <div class='manual-container' id='manual-container' data-category=${Manual.categories}>
                <div class='manual-img-data'>
                    <img src=${urlCategoria} alt='imagem da categoria'>
                    <div class='manual-data'>
                        <p class='name'>Nome: ${Manual.names}</p>
                        <p class='category'>Categoria: ${Manual.categories}</p>
                    </div>
                </div>
                <div class='manual-icon-div'>
                    <button type="submit" class="button pequeno lixeira" id=${idLixeira}><img src="/lixeira-branca.png" alt="Ícone de jogar arquivo fora"></button>
                    <button type="submit" class="button pequeno" id=${idAtualizar}><img src="/atualizar.png" alt="Ícone de atualizar um arquivo"></button>
                </div>
            </div>
        `;
        div.setAttribute('data-category', Manual.categories);
        coluna.appendChild(div);
        // Adiciona um event listener para o botão de lixeira
        document.querySelector(`#${idLixeira}`).addEventListener('click', async function() {
            let res = confirm("Deseja mesmo deletar esse manual?");
            if (res) {
                try {
 
                    await fetch(`/repositorio/manual/${Manual.id}`, { 
                        method: 'DELETE'
                    }).then(response => response.json());
        
                    // Remove o node do manual da tela
                    div.remove();
                } catch (error) {
                    console.error('Erro:', error);
                }
            }
        });
         document.querySelector(`#${idAtualizar}`).addEventListener('click', async function() {
            window.location.href = `/repositorio/atualizar/${window.userId}/${Manual.id}`;
         })
    });
}

if (/^\/repositorio\/.*/.test(window.location.pathname) && !(/^\/repositorio\/create\/.*/.test(window.location.pathname)) && !(/^\/repositorio\/atualizar\/.*/.test(window.location.pathname)))  {
    window.onload = function() {
        fetchManuaisRepositorio();
    }
    document.getElementById
}
