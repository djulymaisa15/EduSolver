// ----------------------------------------------------
// TÓPICO 4: JAVASCRIPT BÁSICO (MANIPULAÇÃO DO DOM)
// ----------------------------------------------------

// Função para atualizar o status de conexão no painel
function atualizarStatusConexao(online) {
    const statusSpan = document.getElementById('statusConexao');
    const ultimaAtualizacaoSpan = document.getElementById('ultimaAtualizacao');
    
    // Atualiza a classe e o texto do elemento (DOM Manipulation)
    if (online) {
        statusSpan.textContent = 'ONLINE';
        statusSpan.classList.remove('offline');
        statusSpan.classList.add('online');
    } else {
        statusSpan.textContent = 'OFFLINE';
        statusSpan.classList.remove('online');
        statusSpan.classList.add('offline');
    }

    // Atualiza o horário
    const agora = new Date();
    ultimaAtualizacaoSpan.textContent = agora.toLocaleTimeString('pt-BR');
}

// Inicia o painel com status online e atualiza o horário
document.addEventListener('DOMContentLoaded', () => {
    atualizarStatusConexao(true);
});


// ----------------------------------------------------
// TÓPICO 6: EVENT LISTENERS
// ----------------------------------------------------

const btnLigarLed = document.getElementById('btnLigarLed');
const btnDesligarLed = document.getElementById('btnDesligarLed');

// Adiciona um ouvinte de evento (Event Listener) ao botão
btnLigarLed.addEventListener('click', () => {
    enviarComandoArduino('ligar_led_teste', 'LED Ligado com Sucesso!');
});

btnDesligarLed.addEventListener('click', () => {
    enviarComandoArduino('desligar_led_teste', 'LED Desligado com Sucesso!');
});


// ----------------------------------------------------
// TÓPICO 5 & 8: REQUISIÇÕES ASSÍNCRONAS (FETCH API) & APIs (JSON)
// ----------------------------------------------------

/**
 * Simula o envio de um comando para o Back-End que, por sua vez,
 * se comunicaria com o Arduino.
 * @param {string} comando O código do comando a ser enviado (ex: ligar_led_teste)
 * @param {string} mensagemSucesso Mensagem a ser exibida após o sucesso
 */
async function enviarComandoArduino(comando, mensagemSucesso) {
    console.log(`Tentando enviar comando: ${comando}`);
    
    // Objeto JSON (Tópico 8) a ser enviado ao servidor
    const dadosParaEnviar = {
        aluno_id: 123, // ID fictício
        comando: comando,
        timestamp: new Date().toISOString()
    };

    try {
        // Usa Fetch API para simular a requisição assíncrona (Tópico 5)
        // Substitua '/api/arduino/comando' pelo endpoint real do seu Back-End
        const response = await fetch('http://localhost:3000/api/arduino/comando', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosParaEnviar) // Converte o objeto JS para JSON
        });

        if (!response.ok) {
            // Se a resposta HTTP não for 2xx (ex: 404, 500)
            throw new Error(`Erro de rede ou servidor: ${response.status}`);
        }

        // Simula a resposta JSON do servidor
        const resultado = await response.json(); 
        
        // Se for bem-sucedido:
        alert(mensagemSucesso + ` Resposta do Servidor: ${resultado.status}`);
        atualizarStatusConexao(true); // Confirma que a conexão está ativa

    } catch (error) {
        // Se houver erro de conexão ou no servidor:
        console.error('Erro ao executar comando:', error);
        alert(`Falha ao enviar comando. Verifique a conexão. (${error.message})`);
        atualizarStatusConexao(false);
    }
}


// ----------------------------------------------------
// TÓPICO 7: VALIDAÇÃO DE FORMULÁRIOS (UX)
// ----------------------------------------------------

const formulario = document.getElementById('formulario-dados');
const campoComando = document.getElementById('campoA');
const mensagemErro = document.getElementById('mensagemErro');

formulario.addEventListener('submit', function(e) {
    e.preventDefault(); // Impede o envio padrão do formulário (que recarregaria a página)
    
    mensagemErro.textContent = '';
    mensagemErro.classList.add('oculto');

    const valorComando = campoComando.value.trim();

    // Lógica de Validação: verifica se o campo está vazio ou tem menos de 3 caracteres
    if (valorComando === '') {
        exibirErro('O campo de comando não pode estar vazio.');
        return;
    }
    
    if (valorComando.length < 3) {
        exibirErro('O código do comando deve ter pelo menos 3 caracteres.');
        return;
    }
    
    // Se a validação passar, simula o envio de dados
    console.log(`Dados Validados! Enviando código: ${valorComando}`);
    enviarDadosValidados(valorComando);
});


function exibirErro(mensagem) {
    mensagemErro.textContent = mensagem;
    mensagemErro.classList.remove('oculto');
    mensagemErro.style.color = 'red';
}

function enviarDadosValidados(comando) {
    // Aqui você faria outra chamada Fetch API (similar à enviarComandoArduino)
    // para enviar o comando validado para o banco de dados.
    console.log(`Simulando envio ao Banco de Dados: ${comando}`);
    alert(`Comando validado e enviado para registro: ${comando}`);
    campoComando.value = ''; // Limpa o campo após o sucesso
}
