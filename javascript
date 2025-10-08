// Array para armazenar os itens do inventário (simulação de banco de dados)
let inventario = [
    { nome: "Motor DC", quantidade: 15, localizacao: "Caixa C" },
    { nome: "Sensor Ultrassônico HC-SR04", quantidade: 8, localizacao: "Caixa A" },
    { nome: "Placa Arduino Uno R3", quantidade: 5, localizacao: "Caixa B" }
];

// Seletores do DOM
const formAdicionar = document.getElementById('form-adicionar');
const tabelaBody = document.querySelector('#tabela-inventario tbody');
const campoBusca = document.getElementById('campo-busca');

// --- Funções de Renderização e Lógica ---

/**
 * Renderiza (desenha) a tabela de inventário na tela.
 * @param {Array} lista - A lista de itens a serem exibidos.
 */
function renderizarTabela(lista) {
    tabelaBody.innerHTML = ''; // Limpa a tabela antes de redesenhar

    lista.forEach((item, index) => {
        const linha = document.createElement('tr');
        
        linha.innerHTML = `
            <td>${item.nome}</td>
            <td>${item.quantidade}</td>
            <td>${item.localizacao}</td>
            <td>
                <button class="btn-remover" data-index="${index}">Remover</button>
            </td>
        `;
        
        tabelaBody.appendChild(linha);
    });
}

/**
 * Adiciona um novo item ao inventário.
 */
function adicionarItem(event) {
    event.preventDefault(); // Impede o recarregamento da página

    const nome = document.getElementById('nome-item').value;
    const quantidade = parseInt(document.getElementById('quantidade').value);
    const localizacao = document.getElementById('localizacao').value;

    if (nome && quantidade > 0 && localizacao) {
        inventario.push({ nome, quantidade, localizacao });
        formAdicionar.reset(); // Limpa o formulário
        renderizarTabela(inventario); // Atualiza a tabela
        alert(`Item "${nome}" adicionado com sucesso!`);
    } else {
        alert("Por favor, preencha todos os campos corretamente.");
    }
}

/**
 * Remove um item do inventário.
 */
function removerItem(event) {
    if (event.target.classList.contains('btn-remover')) {
        // Encontra a linha (tr) mais próxima do botão clicado
        const linha = event.target.closest('tr');
        
        // Obtém o índice do item na lista (usando o DOM para simplicidade)
        // OBS: Em um sistema real, você usaria um ID único, não o índice.
        const nomeDoItem = linha.children[0].textContent; 
        
        // Encontra o índice real no array 'inventario'
        const indiceParaRemover = inventario.findIndex(item => item.nome === nomeDoItem);

        if (confirm(`Tem certeza que deseja remover "${nomeDoItem}"?`)) {
             inventario.splice(indiceParaRemover, 1); // Remove 1 elemento do índice
             renderizarTabela(inventario); // Atualiza a tabela
        }
    }
}

/**
 * Filtra a tabela com base no texto de busca.
 */
function filtrarTabela() {
    const termo = campoBusca.value.toLowerCase();
    
    const listaFiltrada = inventario.filter(item => 
        item.nome.toLowerCase().includes(termo) || 
        item.localizacao.toLowerCase().includes(termo)
    );

    renderizarTabela(listaFiltrada);
}


// --- Inicialização e Event Listeners ---

// 1. Carrega a tabela inicial
renderizarTabela(inventario);

// 2. Escuta o envio do formulário para adicionar itens
formAdicionar.addEventListener('submit', adicionarItem);

// 3. Escuta cliques na tabela para remover itens
tabelaBody.addEventListener('click', removerItem);

// 4. Escuta a digitação no campo de busca
campoBusca.addEventListener('keyup', filtrarTabela);
