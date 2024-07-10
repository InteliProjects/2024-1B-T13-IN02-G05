// Pesquisa de manuais

document.addEventListener('DOMContentLoaded', (event) => {
    // Adiciona um evento de mudança a todos os checkboxes na sidebar e um evento para barra de pesquisa
    document.querySelectorAll('.sidebar input[type="checkbox"]').forEach((checkbox) => {
        checkbox.addEventListener('change', filtrarPorCategoria);
    });
    document.querySelector('.search-bar input').addEventListener('keyup', filtrarPorCategoria);
});

// Função para filtrar itens da lista de resultados com base nas categorias selecionadas e na barra de pesquisa
function filtrarPorCategoria() {
    // Categorias selecionadas dos checkboxes marcados
    const categoriasSelecionadas = Array.from(document.querySelectorAll('.sidebar input[type="checkbox"]:checked')).map(checkbox => checkbox.value);
    const lista = document.querySelector("#resultsId").children;
    const busca = document.querySelector("#searchInput").value.toLowerCase();
    Array.from(lista).forEach((item) => {
        const categoria = item.getAttribute('data-category');
        // Verifica se o item pertence às categorias selecionadas ou se nenhuma categoria foi selecionada
        const haveThisCategory = categoriasSelecionadas.length === 0 || categoriasSelecionadas.includes(categoria);
        if (haveThisCategory && item.textContent.toLowerCase().includes(busca)) {
            item.style.display = ""; // Mostra o item
        } else {
            item.style.display = "none"; // Esconde o item
        }
    });
}

// PESQUISA MONTADORES POR LINHA E NOME - TELA DE DELEGAÇÕES

document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelectorAll('.sidebar input[type="checkbox"]').forEach((checkbox) => {
        checkbox.addEventListener('change', filtrarPorLinha);
    });
    document.querySelector('.search-bar input').addEventListener('keyup', filtrarPorLinha);
});

function filtrarPorLinha() {
    const categoriasSelecionadas = Array.from(document.querySelectorAll('.sidebar input[type="checkbox"]:checked')).map(checkbox => checkbox.value);
    const lista = document.querySelector("#resultsId").children;
    const busca = document.querySelector("#searchInput").value.toLowerCase();
    Array.from(lista).forEach((item) => {
        const categoria = item.getAttribute('data-category');
        const haveThisCategory = categoriasSelecionadas.length === 0 || categoriasSelecionadas.includes(categoria);
        if (haveThisCategory && item.textContent.toLowerCase().includes(busca)) {
            item.style.display = ""; // Mostra o item
        } else {
            item.style.display = "none"; // Esconde o item
        }
    });
}
