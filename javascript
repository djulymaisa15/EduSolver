// --- 1. Configuração Inicial ---

// Elementos do DOM
const connStatusCircle = document.getElementById('conn-status');
const connStatusText = document.getElementById('conn-text');
const kpiBateria = document.getElementById('kpi-bateria');
const kpiTemperatura = document.getElementById('kpi-temperatura');
const kpiDistancia = document.getElementById('kpi-distancia');
const kpiMotor = document.getElementById('kpi-motor');
const eventLog = document.getElementById('event-log');
const toggleLedButton = document.getElementById('toggle-led');
const ledStatus = document.getElementById('led-status');

let ledIsOn = false;

// Dados para simulação do gráfico
const labels = [];
const batteryData = [];
const tempData = [];

// --- 2. Funções de Conexão e Log ---

function updateConnectionStatus(status) {
    connStatusCircle.classList.remove('offline', 'connecting', 'online');
    if (status === 'connecting') {
        connStatusCircle.classList.add('connecting');
        connStatusText.textContent = 'Conectando...';
    } else if (status === 'online') {
        connStatusCircle.classList.add('online');
        connStatusText.textContent = 'Online';
    } else {
        connStatusCircle.classList.add('offline');
        connStatusText.textContent = 'Desconectado';
    }
}

function addLogEntry(message) {
    const now = new Date();
    const time = now.toTimeString().split(' ')[0]; // HH:MM:SS
    const newEntry = document.createElement('li');
    newEntry.innerHTML = `[${time}] ${message}`;
    
    // Adiciona no topo da lista (eventos mais recentes)
    if (eventLog.firstChild) {
        eventLog.insertBefore(newEntry, eventLog.firstChild);
    } else {
        eventLog.appendChild(newEntry);
    }
    
    // Limita o número de logs para não sobrecarregar a tela
    if (eventLog.children.length > 10) {
        eventLog.removeChild(eventLog.lastChild);
    }
}

// --- 3. Inicialização do Gráfico (Chart.js) ---

const ctx = document.getElementById('resourceChart').getContext('2d');
const resourceChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: 'Tensão da Bateria (V)',
            data: batteryData,
            borderColor: '#ffc107', // warning-color
            backgroundColor: 'rgba(255, 193, 7, 0.1)',
            tension: 0.3,
            fill: true
        },
        {
            label: 'Temperatura (°C)',
            data: tempData,
            borderColor: '#17a2b8', // info-color
            backgroundColor: 'rgba(23, 162, 184, 0.1)',
            tension: 0.3,
            fill: false
            
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: false,
                title: { display: true, text: 'Valor' }
            },
            x: {
                title: { display: true, text: 'Tempo' }
            }
        }
    }
});

// --- 4. Função de Simulação e Atualização de Dados ---

function fetchData() {
    // ESTA É A PARTE QUE EM UM PROJETO REAL FARIA UMA REQUISIÇÃO AJAX/WEBSOCKET
    // Para um microcontrolador, você faria: fetch('/api/data') ou websocket.send('GET_DATA')

    // SIMULAÇÃO DE DADOS ALEATÓRIOS DO ROBÔ
    const battery = (Math.random() * (12.6 - 9.0) + 9.0).toFixed(2); // 9.0V a 12.6V
    const temp = (Math.random() * (45.0 - 25.0) + 25.0).toFixed(1); // 25°C a 45°C
    const distance = Math.floor(Math.random() * 200) + 1; // 1cm a 200cm
    const speed = Math.floor(Math.random() * 100);
    const motorState = speed > 0 ? `Movendo (${speed}%)` : 'Parado';

    // 1. Atualiza KPIs
    kpiBateria.textContent = `${battery} V`;
    kpiBateria.className = 'kpi-value ' + (battery < 10.0 ? 'danger' : (battery < 11.5 ? 'warning' : 'success'));

    kpiTemperatura.textContent = `${temp} °C`;
    kpiTemperatura.className = 'kpi-value ' + (temp > 40.0 ? 'warning' : 'info');

    kpiDistancia.textContent = `${distance} cm`;
    kpiDistancia.className = 'kpi-value ' + (distance < 15 ? 'danger' : 'success');

    kpiMotor.textContent = motorState;
    kpiMotor.className = 'kpi-value ' + (speed > 0 ? 'primary' : 'secondary');

    // 2. Atualiza Log de Eventos (condicional)
    if (distance < 15 && Math.random() < 0.3) { // 30% de chance de logar
        addLogEntry(`⚠️ **ALERTA**: Obstáculo detectado a ${distance} cm.`);
    }

    // 3. Atualiza Gráfico
    const now = new Date();
    const timeLabel = now.toTimeString().split(' ')[0].substring(3, 8); // MM:SS
    
    // Adiciona o novo ponto de dados
    labels.push(timeLabel);
    batteryData.push(battery);
    tempData.push(temp);

    // Remove o ponto mais antigo se tiver muitos (mantém os últimos 20)
    if (labels.length > 20) {
        labels.shift();
        batteryData.shift();
        tempData.shift();
    }

    // Atualiza o gráfico na tela
    resourceChart.update();
}

// --- 5. Eventos e Inicialização ---

// Função de Controle (Simulação de Envio de Comando)
toggleLedButton.addEventListener('click', () => {
    ledIsOn = !ledIsOn; // Inverte o estado
    const statusText = ledIsOn ? 'ON' : 'OFF';
    ledStatus.textContent = statusText;
    
    if(ledIsOn) {
        addLogEntry(`Comando enviado: LED LIGADO. (Status: ${statusText})`);
    } else {
        addLogEntry(`Comando enviado: LED DESLIGADO. (Status: ${statusText})`);
    }
    
    // Aqui você enviaria o comando real para o hardware:
    // fetch('/api/control/led?state=' + (ledIsOn ? 'on' : 'off'));
});


// Simula a conexão no início
updateConnectionStatus('connecting');

// Simula a conexão bem-sucedida após 2 segundos
setTimeout(() => {
    updateConnectionStatus('online');
    addLogEntry('✅ Conexão com o robô estabelecida com sucesso.');
    // Inicia a busca de dados a cada 3 segundos
    setInterval(fetchData, 3000); 
    fetchData(); // Primeira busca imediata
}, 2000);
