//variaveis globais
var numeroSubcategorias = 0;

//função para redirecionar o usuário para o repositorio
function handleVoltarClick() {
    window.location.href = `/repositorio/${window.userId}`;
}

//função para adicionar uma subcategoria
function handleAdicionarSubcategoriaClick() {

    //pega o botao de adicionar subcategoria
    const adicionarSubcategoria = document.getElementById("adicionar-subcategoria");

    //pega o modelo do form de adicionar manual
    const formAdicionarManual = document.getElementById("form-adicionar-manual"); 
    numeroSubcategorias += 1;

    //if para impedir que o o numero de subcategorias seja maior que 5
    if (numeroSubcategorias < 6) {
        //configurando o input da nova subcategoria
        var novaSubcategoria = document.createElement("input");
        novaSubcategoria.placeholder = "Adicione a subcategoria do manual";
        novaSubcategoria.name = `sub_categories${numeroSubcategorias}`;
        novaSubcategoria.type = "text";
        novaSubcategoria.id = `sub_categories${numeroSubcategorias}`;

        //inserindo o novo input ao form antes do botão de adicionar categoria
        formAdicionarManual.insertBefore(novaSubcategoria, adicionarSubcategoria)

        //quando o numero de subcategorias for 5, remove o botão de adicionar subcategoria
        if(numeroSubcategorias == 5) {
            formAdicionarManual.removeChild(adicionarSubcategoria)
        }
    }
  }


if (/^\/repositorio\/create\/.*/.test(window.location.pathname)) {

    //pegando a previousPage
    localStorage.setItem('previousPage', window.location.href);

    //Adiciona um event listener no botão de voltar
    const voltarRep = document.getElementById("voltar-repositorio");
    if (voltarRep) {
        voltarRep.addEventListener('click', handleVoltarClick);
    } else {
        console.log("Elemento com o ID 'voltar-repositorio' não foi encontrado.");
    }

    //Adiciona um event listener no botão de adicionar categoria
    const adicionarSubcategoria = document.getElementById("adicionar-subcategoria");
    if (adicionarSubcategoria) {
        adicionarSubcategoria.addEventListener('click', handleAdicionarSubcategoriaClick);
    } else {
        console.log("Elemento com o ID 'adicionar-subcategoria' não foi encontrado.");
    }
};
