// Carrega a biblioteca bcryptjs dinamicamente para verificar a senha
await new Promise((resolve, reject) => {
    if (window.dcodeIO && window.dcodeIO.bcrypt) return resolve();
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/bcryptjs@2.4.3/dist/bcrypt.min.js";
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
});

const bcrypt = window.dcodeIO.bcrypt;
// Defina o hash da senha aqui.
const senhaHash = "$2b$10$5BklOb5zNeXiClXaxkmmH.UJR.vGTI6xD2RoEDAr.1MOkga/tzrAi"
; // Substitua pelo seu hash real

const senha = prompt("Digite a senha de administrador:");
if (!senha || !bcrypt.compareSync(senha, senhaHash)) {
    alert("Senha incorreta!");
    window.location.href = "/";
    throw new Error("Acesso negado");
}

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE = isLocal ? 'http://localhost:3000' : 'https://placar-gamificado-teste.onrender.com';

async function getArtistas() {
    try {
        const response = await fetch(API_BASE + '/usArtistas/artistas')
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
    cabecalho.forEach((col, index) => {
        const th = document.createElement('th')
        th.textContent = col
        // Adiciona dicas visuais para colunas interativas
        if (index >= 1 && index <= 3) {
            th.style.cursor = 'pointer'
            th.title = 'Clique esquerdo: +1 em todos / Clique direito: -1 em todos'
        }
        thead.appendChild(th)
    })
    tabela.appendChild(thead)

    // Criar linhas
    dados.forEach(item => {
        const tr = document.createElement('tr')

        const tdAluno = document.createElement('td')
        tdAluno.textContent = item.nome
        tdAluno.style.cursor = 'pointer'
        tdAluno.title = 'Clique esquerdo: +1 na linha / Clique direito: -1 na linha'
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
const container = document.getElementById('tabela-container')
if (container) {
    container.innerHTML = ''
    container.appendChild(criarTabela(dados))
}

function adicionarFuncionalidades() {
    const tabela = document.querySelector('#tabela-container table')
    if (!tabela) return

    // Prevenir menu de contexto no clique direito
    tabela.addEventListener('contextmenu', e => e.preventDefault())

    tabela.addEventListener('mousedown', e => {
        if (e.button !== 0 && e.button !== 2) return // Apenas esquerdo (0) e direito (2)

        const incremento = e.button === 0 ? 1 : -1
        const target = e.target

        // Função auxiliar para atualizar célula e total da linha
        const atualizarCelula = (cell) => {
            let valor = parseInt(cell.textContent) || 0
            valor += incremento
            cell.textContent = valor

            // Recalcular total da linha
            const linha = cell.parentElement
            const cells = linha.cells
            // 1=Freq, 2=Drill, 3=Extra -> 4=Pontos
            const total = (parseInt(cells[1].textContent) || 0) +
                          (parseInt(cells[2].textContent) || 0) +
                          (parseInt(cells[3].textContent) || 0)
            cells[4].textContent = total
        }

        // Clique no Título (TH) - Colunas 1, 2, 3
        if (target.tagName === 'TH') {
            const index = target.cellIndex
            if (index >= 1 && index <= 3) {
                const linhas = tabela.querySelectorAll('tr')
                // Começa do 1 para pular o cabeçalho
                for (let i = 1; i < linhas.length; i++) {
                    atualizarCelula(linhas[i].cells[index])
                }
            }
        }

        // Clique na Célula (TD)
        if (target.tagName === 'TD') {
            const index = target.cellIndex
            const linha = target.parentElement

            if (index === 0) {
                // Clique no Nome -> Atualiza colunas 1, 2 e 3 da linha
                [1, 2, 3].forEach(idx => atualizarCelula(linha.cells[idx]))
            } else if (index >= 1 && index <= 3) {
                // Clique na célula numérica
                atualizarCelula(target)
            }
        }
    })
}

function criarBotaoEnviar() {
    const btn = document.createElement('button')
    btn.textContent = 'ENVIAR DADOS'
    btn.style.cssText = 'display: block; margin: 20px auto; padding: 15px 30px; font-size: 18px; font-weight: bold; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.2);'
    
    btn.onclick = async () => {
        const tabela = document.querySelector('#tabela-container table')
        const linhas = tabela.querySelectorAll('tr')
        const dadosFinais = []
        
        // Pula cabeçalho (i=1)
        for (let i = 1; i < linhas.length; i++) {
            const cells = linhas[i].cells
            dadosFinais.push({
                nome: cells[0].textContent, // Alterado para 'nome' para facilitar a busca no banco
                frequencia: parseInt(cells[1].textContent),
                drill: parseInt(cells[2].textContent),
                extra: parseInt(cells[3].textContent)
            })
        }
        
        btn.disabled = true
        btn.textContent = 'SALVANDO...'

        try {
            // Ajuste a rota conforme necessário
            const response = await fetch(API_BASE + '/usArtistas/atualizar-lista', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosFinais)
            })

            if (response.ok) {
                alert('Placar atualizado com sucesso!')
            } else {
                throw new Error('Erro ao salvar')
            }
        } catch (error) {
            console.error(error)
            alert('Erro ao conectar com o servidor.')
        } finally {
            btn.disabled = false
            btn.textContent = 'ENVIAR DADOS'
        }
    }
    
    document.getElementById('tabela-container').appendChild(btn)
}

adicionarFuncionalidades()
criarBotaoEnviar()

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
                if (dataDisplay) dataDisplay.textContent = `Atualizado dia: ${formattedDate}`;
            }
        }
    } catch (error) {
        console.error('Erro ao carregar data de atualização:', error);
    }
}

atualizarData();