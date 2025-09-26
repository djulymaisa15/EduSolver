/**
 * ARQUIVO: script.js
 * FUNÇÃO: Simular a lógica de Front-End para atualizar o Dashboard
 */

// 1. Dados simulados (normalmente viriam de uma API REST ou WebSocket)
const dadosSimulados = {
    totalKits: 50,
    disponiveis: 35,
    emprestados: 12,
    atrasados: 3,
    log: [
        { recurso: "Kit Arduino UNO R3", usuario: "Ana Silva", acao: "Empréstimo", status: "Empre", data: "09:20:00" },
        { recurso: "Sensor Ultrassônico", usuario: "Pedro Santos", acao: "Devolução", status: "Devol", data: "09:22:15" },
        { recurso: "Kit Robótica VEX", usuario: "João Oliveira", acao: "Empréstimo", status: "Empre", data: "09:25:30" },
        { recurso: "Kit Raspberry Pi", usuario: "Maria Souza", acao: "Atrasado", status: "Atraso", data: "Ontem" },
    ]
};

// 2. Função para atualizar os Cartões KPI
function atualizarKitsStatus(dados) {
    document.getElementById('totalKits').textContent = dados.totalKits;
    document.getElementById('kitsDisponiveis').textContent = dados.disponiveis;
    document.getElementById('kitsEmprestados').textContent = dados.emprestados;
    document.getElementById('kitsAtrasados').textContent = dados.atrasados;
}

// 3. Função para renderizar a Tabela de Logs
function renderizarLog(logData) {
    const tbody = document.getElementById('logMovimentacoes');
    tbody.innerHTML = ''; // Limpa logs antigos antes de adicionar novos

    logData.forEach(item => {
        const row = tbody.insertRow();
        
        // Define a classe do badge com base na ação
        let badgeClass = '';
        if (item.acao === 'Empréstimo') {
            badgeClass = 'emprestimo';
        } else if (item.acao === 'Devolução') {
            badgeClass = 'devolucao';
        } else if (item.acao === 'Atrasado') {
             badgeClass = 'atraso';
        }

        // Popula as células
        row.insertCell(0).textContent = item.recurso;
        row.insertCell(1).textContent = item.usuario;
        row.insertCell(2).textContent = item.acao;
        
        // Célula do Status com Badge
        const statusCell = row.insertCell(3);
        statusCell.innerHTML = `<span class="badge ${badgeClass}">${item.status}</span>`;
        
        row.insertCell(4).textContent = item.data;
    });
}

// 4. Inicializa o Dashboard ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    atualizarKitsStatus(dadosSimulados);
    renderizarLog(dadosSimulados.log);

    // Simulação de atualização em tempo real (como se fosse o Arduino enviando um novo dado a cada 5 segundos)
    // setInterval(() => {
    //     // Simula a chegada de um novo empréstimo
    //     dadosSimulados.emprestados += 1;
    //     dadosSimulados.disponiveis -= 1;
    //     dadosSimulados.log.unshift({ recurso: "Módulo WiFi ESP", usuario: "Novo Aluno", acao: "Empréstimo", status: "Empre", data: new Date().toLocaleTimeString() });

    //     // Mantém apenas os 5 logs mais recentes
    //     dadosSimulados.log = dadosSimulados.log.slice(0, 5); 

    //     atualizarKitsStatus(dadosSimulados);
    //     renderizarLog(dadosSimulados.log);
        
    // }, 5000); // Atualiza a cada 5 segundos
});
