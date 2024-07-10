//route da pagina: http://localhost:1337/tela-engenheiro

//fetch dos funcionários
async function fetchFuncionariosDashboard() {
  try {
    const response = await fetch("http://localhost:1337/adm/worker");
    //define a rota para realizar o fetch
    const data = await response.json();
    adicionarFuncionarioDashboard(data);
    //adiciona as informação dos funcionários
  } catch (error) {
    console.error("Erro ao buscar funcionários:", error);
  }
}

//função para adicionar os funcionários no html
function adicionarFuncionarioDashboard(data) {
  const coluna = document.querySelector("#container-funcionarios");
  // Adicionar um novo funcionário
  //filtra os funcionários ativos
  const activeWorkers = data.filter((worker) => worker.actives);
  //para cada funcionário ativo ele adiciona uma div da classe retangulo-funcionario
  activeWorkers.forEach((Worker) => {
    const div = document.createElement("div");
    div.classList.add("retangulo-funcionario");
    //informações na div são nomes, linhas e registros
    div.innerHTML = `
            <h3>${Worker.names}</h3>
            <p>${Worker.lines}</p>
            <p>${Worker.registrations}</p>
        `;
    coluna.appendChild(div);
  });
}

//grafico
var quantidadeConcluida = 0;
var quantidadeFazendo = 0;
var quantidadeDelegacao = 0;

async function fetchGrafico() {
  try {
    // Busca as delegações que estão fazendo
    let response = await fetch("http://localhost:1337/delegations/count-doing");
    const dataDelegacoesFazendo = await response.json();
    quantidadeFazendo = dataDelegacoesFazendo || 0;

    // Busca as delegações que estão concluídas
    response = await fetch("http://localhost:1337/delegations/count-done");
    const dataDelegacoesFeitas = await response.json();
    quantidadeConcluida = dataDelegacoesFeitas || 0;

    // Conta todas as delegações que tem no banco
    response = await fetch("http://localhost:1337/delegations");
    const dataDelegacoes = await response.json();
    quantidadeDelegacao = dataDelegacoes.length || 0;

    // Calcula a quantidade de delegações pendentes
    const quantidadePendente = quantidadeDelegacao - quantidadeConcluida - quantidadeFazendo;

    // Funções para desenhar os gráficos
    function drawChart(quantidade, selector) {
      const data = google.visualization.arrayToDataTable([
        ['', ''],
        ['', quantidade]
      ]);

      const options = {
        title: '',
        hAxis: {
          viewWindow: {
            min: 0,
            max: quantidadeDelegacao
          },
          ticks: [quantidadeDelegacao / 10, quantidadeDelegacao / 10 * 2, quantidadeDelegacao / 10 * 3, quantidadeDelegacao / 10 * 4, quantidadeDelegacao/10 *5],
          baselineColor: 'transparent',
          gridlines: { color: 'transparent' },
          textPosition: 'none'
        },
        legend: 'none',
        bar: { width: 25 }
      };

      const chart = new google.visualization.BarChart(document.querySelector(selector));
      chart.draw(data, options);
    }

    // Desenha os gráficos com os dados obtidos
    drawChart(quantidadePendente, '.grafico-pendentes');
    drawChart(quantidadeFazendo, '.grafico-fazendo');
    drawChart(quantidadeConcluida, '.grafico-feitos');

  } catch (error) {
    console.error("Erro ao buscar as contagens de delegações:", error);
  }
}

if (/^\/dashboard\/.*/.test(window.location.pathname)) {
  window.onload = async function () {
    // Carregar os scripts do Google Charts e chamar fetchGrafico
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(fetchGrafico);
    await fetchFuncionariosDashboard();
    await fetchGrafico();
  };
};