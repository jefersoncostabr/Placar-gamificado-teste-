async function getArtistas() {
    // const urlBase = 'https://placar-gamificado-teste.onrender.com';
    const urlBase = '' // Usar a url vazia para requisições o navegador intende que é para o mesmo servidor
    try {
        const response = await fetch(urlBase + '/usArtistas/artistas')
        const data = await response.json()
        return data
    } catch (error) {
        console.error(error)
    }
}

const dados = await getArtistas()

// Função para criar tabela
function criarTabela(dados) {
    const tabela = document.createElement('table')
    const cabecalho = ['ARTISTA', 'Frequência', 'Drill', 'Extra', 'PONTOS']

    // Criar header
    const thead = document.createElement('tr')
    cabecalho.forEach(col => {
        const th = document.createElement('th')
        th.textContent = col
        thead.appendChild(th)
    })
    tabela.appendChild(thead)

    // Criar linhas
    dados.forEach(item => {
        const tr = document.createElement('tr')

        const tdAluno = document.createElement('td')
        tdAluno.textContent = item.nome
        tr.appendChild(tdAluno)

        const tdFreq = document.createElement('td')
        tdFreq.textContent = item.frequencia
        tr.appendChild(tdFreq)

        const tdDrill = document.createElement('td')
        tdDrill.textContent = item.drill
        tr.appendChild(tdDrill)

        const tdExtra = document.createElement('td')
        tdExtra.textContent = item.extra
        tr.appendChild(tdExtra)

        const tdPontos = document.createElement('td')
        tdPontos.textContent = item.frequencia + item.drill + item.extra
        tdPontos.id = 'tdPontos'
        tr.appendChild(tdPontos)

        tabela.appendChild(tr)
    })

    return tabela
}

// Renderizar tabela no container
document.getElementById('tabela-container').appendChild(criarTabela(dados))

// Função para buscar e exibir a data de atualização
async function atualizarData() {
    const dataDisplay = document.getElementById('dataDeAtualizacao');
    
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const apiUrl = isLocal ? "http://localhost:3000/usArtistas/mais-recente" : "https://placar-gamificado-teste.onrender.com/usArtistas/mais-recente";

    try {
        const response = await fetch(apiUrl, {
            headers: { 'x-api-key': 'teste1234' }
        });

        if (response.ok) {
            const result = await response.json();
            if (result.dataCriacao) {
                const date = new Date(result.dataCriacao);
                const formattedDate = date.toLocaleDateString('pt-BR');
                dataDisplay.textContent = `Atualizado dia: ${formattedDate}`;
            }
        }
    } catch (error) {
        console.error('Erro ao carregar data de atualização:', error);
    }
}

atualizarData();