// Variáveis de tradução
const translations = {
    en: {
        monthCurrent: 'Current Month',
        nextMonth: 'Next Month',
        income: 'Income',
        fixedExpenses: 'Fixed Expenses',
        variableExpenses: 'Variable Expenses',
        totalExpenses: 'Total Expenses',
        remainingBalance: 'Remaining Balance',
        addLine: 'Add Line to Fixed Expenses',
        addVariableLine: 'Add Line to Variable Expenses',
        addIncomeLine: 'Add Line to Income',
        totalFixedExpenses: 'Total Fixed Expenses',
        totalVariableExpenses: 'Total Variable Expenses',
        totalIncome: 'Total Income',
        noIncomeRecorded: 'No income recorded',
        noVariableExpenses: 'No variable expenses recorded',
    },
    pt: {
        monthCurrent: 'Mês Atual',
        nextMonth: 'Próximo Mês',
        income: 'Renda',
        fixedExpenses: 'Despesas Fixas',
        variableExpenses: 'Despesas Variáveis',
        totalExpenses: 'Total Despesas',
        remainingBalance: 'Saldo Restante',
        addLine: 'Adicionar Linha em Despesas Fixas',
        addVariableLine: 'Adicionar Linha em Despesas Variáveis',
        addIncomeLine: 'Adicionar Linha em Renda',
        totalFixedExpenses: 'Total de Despesas Fixas',
        totalVariableExpenses: 'Total de Despesas Variáveis',
        totalIncome: 'Total de Renda',
        noIncomeRecorded: 'Nenhuma renda registrada',
        noVariableExpenses: 'Nenhuma despesa variável registrada',
    }
};

// Alternar entre idiomas
function changeLanguage(lang) {
    document.getElementById('mesAtual').textContent = translations[lang].monthCurrent;
    document.getElementById('proximoMes').textContent = translations[lang].nextMonth;

    document.querySelector('table#renda caption').textContent = translations[lang].income;
    document.querySelector('table#despesas-fixas caption').textContent = translations[lang].fixedExpenses;
    document.querySelector('table#despesas-variaveis caption').textContent = translations[lang].variableExpenses;
    document.querySelector('.table-summary caption').textContent = translations[lang].totalExpenses;
}

// Alternar modo escuro
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

// Adicionar linha dinamicamente
function adicionarLinha(tbodyId) {
    const tbody = document.querySelector(`#${tbodyId} tbody`);
    const novaLinha = document.createElement('tr');
    novaLinha.innerHTML = `
        <td contenteditable="true">Nova entrada</td>
        <td contenteditable="true">R$ 0,00</td>
        <td contenteditable="true">${new Date().toLocaleDateString('pt-BR')}</td>
        <td contenteditable="true"></td>
    `;
    tbody.appendChild(novaLinha);
}

// Obter mês atual
function obterMesAtual(data = new Date()) {
    return data.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' });
}

// Obter próximo mês
function obterProximoMes(data = new Date()) {
    const novaData = new Date(data);
    novaData.setMonth(data.getMonth() + 1);
    return novaData.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' });
}

// Navegar pelos meses
function navegarMes(direcao) {
    const dataAtual = new Date();
    dataAtual.setMonth(dataAtual.getMonth() + direcao);
    document.getElementById('mesAtual').textContent = obterMesAtual(dataAtual);
    document.getElementById('proximoMes').textContent = obterProximoMes(dataAtual);
}

// Preencher tabelas
function preencherTabelas(data) {
    preencherTabela('#renda tbody', data.income);
    preencherTabela('#despesas-fixas tbody', data.fixedExpenses);
    preencherTabela('#despesas-variaveis tbody', data.variableExpenses);

    const resumoTabela = document.querySelector('.table-summary tbody');
    resumoTabela.innerHTML = `
        <tr><td>${translations['pt'].totalFixedExpenses}</td><td>${data.summary.totalFixedExpenses}</td></tr>
        <tr><td>${translations['pt'].totalVariableExpenses}</td><td>${data.summary.totalVariableExpenses}</td></tr>
        <tr><td>${translations['pt'].totalIncome}</td><td>${data.summary.totalIncome}</td></tr>
        <tr><td>${translations['pt'].remainingBalance}</td><td>${data.summary.remainingBalance}</td></tr>
    `;
}

function preencherTabela(selector, items) {
    const tbody = document.querySelector(selector);
    tbody.innerHTML = ''; // Limpar conteúdo existente
    items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td contenteditable="true">${item.description || item.source}</td>
            <td contenteditable="true">${item.amount}</td>
            <td>${item.date}</td>
            <td>${item.notes}</td>
        `;
        tbody.appendChild(row);
    });
}

// Buscar dados do servidor
async function fetchData() {
    try {
        const response = await fetch('http://localhost:3000/users');
        if (!response.ok) throw new Error(`Erro: ${response.status}`);
        const data = await response.json();
        preencherTabelas(data.data);
    } catch (error) {
        console.error('Erro ao obter dados:', error.message);
    }
}

// Inicializar página
window.onload = function () {
    fetchData();
    document.getElementById('mesAtual').textContent = obterMesAtual();
    document.getElementById('proximoMes').textContent = obterProximoMes();
};
