async function handleAdicionarManuais() {
    try {
        // Pegando os dados das delegações deste usuário
        const response = await fetch(`/delegations/search/${window.userId}`, {
            method: 'GET',
        });
        if (!response.ok) {
            throw new Error('Erro ao buscar dados das delegações');
        }
        const dadosDelegations = await response.json();

        // Pegando as colunas existentes
        const tasksFeitasHTML = document.querySelector('#tasks-feitas');
        const tasksFazendoHTML = document.querySelector('#tasks-fazendo');
        const tasksFazerHTML = document.querySelector('#tasks-fazer');

        if (!tasksFeitasHTML || !tasksFazendoHTML || !tasksFazerHTML) {
            throw new Error('Colunas de tarefas não encontradas');
        }

        // Para cada uma das delegações
        for (let i = 0; i < dadosDelegations.length; i++) {

            // Criando um novo manual
            let novoManual = document.createElement('div');
            novoManual.classList.add('task');
            if(dadosDelegations[i]["manuals_id"]) {
                novoManual.setAttribute('id', dadosDelegations[i]["manuals_id"]["id"]);

                // Criando a imagem dentro do manual
                let novaImagem = document.createElement('img');
                novaImagem.classList.add('img-manual');
                switch (dadosDelegations[i]["manuals_id"]["categories"]) {
                    case 'Computadores':
                        novaImagem.setAttribute('src', '/icons/computador.png');
                        break;
                    case 'Eletrônicos e Acessórios':
                        novaImagem.setAttribute('src', '/icons/rato.png');
                        break;
                    case 'Softwares e Soluções':
                        novaImagem.setAttribute('src', '/icons/armazenamento-na-nuvem.png');
                        break;
                    case 'Infraestrutura':
                        novaImagem.setAttribute('src', '/icons/lan.png');
                        break;
                    default:
                        novaImagem.setAttribute('src', '/icons/default.png'); // Ícone padrão
                        break;
                }
                novoManual.appendChild(novaImagem);
    
                // Criando nome e categoria
                let divNomeCategoria = document.createElement('div');
                divNomeCategoria.classList.add('div-nome-categoria');
    
                let novoName = document.createElement('div');
                novoName.classList.add('nome-manual');
                novoName.textContent = dadosDelegations[i].manuals_id.names;
                divNomeCategoria.appendChild(novoName);
    
                let novaCategoria = document.createElement('div');
                novaCategoria.classList.add('categoria-manual');
                novaCategoria.textContent = `Categoria: ${dadosDelegations[i].manuals_id.categories}`;
                divNomeCategoria.appendChild(novaCategoria);
    
                novoManual.appendChild(divNomeCategoria);
    
                // Selecionando em qual coluna o manual vai ficar
                if (!dadosDelegations[i].doing && !dadosDelegations[i].done) {
                    tasksFazerHTML.appendChild(novoManual);
                } else if (dadosDelegations[i].doing && !dadosDelegations[i].done) {
                    tasksFazendoHTML.appendChild(novoManual);
                } else if (!dadosDelegations[i].doing && dadosDelegations[i].done) {
                    tasksFeitasHTML.appendChild(novoManual);
                }
    
                // Selecionando para qual página ele deve ser redirecionado
                novoManual.addEventListener('click', () => {
                    const manualId = novoManual.getAttribute('id');
                    // Redirecionar para a página com os dados do manual
                    window.location.href = `/kanban/manual/${window.userId}/${manualId}/${dadosDelegations[i]["id"]}`;
                });
            }
            
        }
    } catch (error) {
        console.error('Erro ao adicionar manuais:', error);
    }
}

// Verificar a rota e chamar a função handleAdicionarManuais
if (/^\/kanban\/.*/.test(window.location.pathname) && !(/^\/kanban\/manual\/.*/.test(window.location.pathname))) {
    handleAdicionarManuais();
}
