async function getCryptoData() {
    try {
        const response = await fetch('/crypto-data');
        const data = await response.json();
        console.log('Dados recebidos da API:', data); // Verificação dos dados
        return data;
    } catch (error) {
        console.error('Erro ao buscar dados de criptomoedas:', error);
        return null;
    }
}



const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`); // Rótulos para as horas

// Inicializando arrays para armazenar preços com null para horas futuras
let bitcoinPrices = Array(24).fill(null);
let ethereumPrices = Array(24).fill(null);
let uniswapPrices = Array(24).fill(null);

// Função para atualizar os preços das criptomoedas
/**
 * Atualiza os preços atuais do Bitcoin, Ethereum e Uniswap
 * buscando dados da API de criptomoedas.
 * 
 * Esta função recupera dados de criptomoedas de forma assíncrona
 * e verifica a integridade dos dados antes de preencher
 * os respectivos arrays com os preços com base na hora atual.
 * 
 * @async
 * @function updatePrices
 * @returns {Promise<void>} Uma promessa que é resolvida quando os preços foram atualizados.
 * @throws {Error} Lança um erro se os dados de criptomoedas não estiverem no formato esperado.
 */
async function updatePrices() {
    const cryptoData = await getCryptoData();

    // Verifica se os dados são válidos antes de continuar
    if (cryptoData && cryptoData.bitcoin && cryptoData.ethereum && cryptoData.uniswap) {
        const currentHour = new Date().getHours();
        
        // Preenche os preços atuais nas posições corretas do array
        bitcoinPrices[currentHour] = cryptoData.bitcoin.usd;
        ethereumPrices[currentHour] = cryptoData.ethereum.usd;
        uniswapPrices[currentHour] = cryptoData.uniswap.usd;

        // Atualiza os arrays de preços com os dados recebidos da API
        console.log('Preços atualizados:', { bitcoinPrices, ethereumPrices, uniswapPrices });
    } else {
        console.error('Erro: Dados de criptomoedas não estão no formato esperado');
    }
}

function handleTransaction(action) {
    const cryptoSelect = document.getElementById('cryptoSelect').value;
    const amount = parseFloat(document.getElementById('amountInput').value);
    let price;

    // Get the current price based on the selected cryptocurrency
    const currentHour = new Date().getHours();
    switch (cryptoSelect) {
        case 'bitcoin':
            price = bitcoinPrices[currentHour];
            break;
        case 'ethereum':
            price = ethereumPrices[currentHour];
            break;
        case 'uniswap':
            price = uniswapPrices[currentHour];
            break;
        default:
            price = null;
    }

    if (price !== null && amount > 0) {
        const totalCost = price * amount;
        const message = `You ${action} ${amount} ${cryptoSelect} for a total of $${totalCost.toFixed(2)}.`;
        document.getElementById('transactionMessage').innerText = message;
    } else {
        document.getElementById('transactionMessage').innerText = 'Invalid transaction.';
    }
}

document.getElementById('buyButton').addEventListener('click', () => handleTransaction('bought'));
document.getElementById('sellButton').addEventListener('click', () => handleTransaction('sold'));




function createChart() {
    const ctx = document.getElementById('cryptoChart').getContext('2d');

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: hours, // Horas do dia no eixo X
            datasets: [
                {
                    label: 'Preço do Bitcoin (USD)',
                    data: bitcoinPrices,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)', // Preenche a área sob a linha
                    borderColor: 'rgba(255, 99, 132, 1)', // Cor da linha de Bitcoin
                    borderWidth: 2,
                    fill: false, // Remove preenchimento da área sob a linha
                    spanGaps: true, // Conecta os pontos com null ao longo do tempo
                    pointHoverBackgroundColor: 'rgba(255, 99, 132, 1)', // Cor ao passar o mouse sobre o ponto
                    pointHoverRadius: 6, // Aumenta o tamanho do ponto ao passar o mouse
                    tension: 0.1 // Suaviza a linha de conexão entre os pontos
                },
                {
                    label: 'Preço do Ethereum (USD)',
                    data: ethereumPrices,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)', // Preenche a área sob a linha
                    borderColor: 'rgba(75, 192, 192, 1)', // Cor da linha de Ethereum
                    borderWidth: 2,
                    fill: false, // Remove preenchimento da área sob a linha
                    spanGaps: true, // Conecta os pontos com null ao longo do tempo
                    pointHoverBackgroundColor: 'rgba(75, 192, 192, 1)', // Cor ao passar o mouse sobre o ponto
                    pointHoverRadius: 6, // Aumenta o tamanho do ponto ao passar o mouse
                    tension: 0.1 // Suaviza a linha de conexão entre os pontos
                },
                {
                    label: 'Preço do Ethereum (USD)',
                    data: uniswapPrices,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)', // Preenche a área sob a linha
                    borderColor: 'rgba(75, 192, 192, 1)', // Cor da linha de Ethereum
                    borderWidth: 2,
                    fill: false, // Remove preenchimento da área sob a linha
                    spanGaps: true, // Conecta os pontos com null ao longo do tempo
                    pointHoverBackgroundColor: 'rgba(75, 192, 192, 1)', // Cor ao passar o mouse sobre o ponto
                    pointHoverRadius: 6, // Aumenta o tamanho do ponto ao passar o mouse
                    tension: 0.1 // Suaviza a linha de conexão entre os pontos 
                }
            ]
        },
        options: {
            scales: {
                x: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Hora do Dia',
                        color: '#ffffff'
                    },
                    ticks: {
                        color: '#ffffff'
                    }
                },
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Preço em USD',
                        color: '#ffffff'
                    },
                    ticks: {
                        color: '#ffffff'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff'
                    }
                },
                tooltip: {
                    enabled: true, // Habilita o tooltip ao passar o mouse sobre o gráfico
                    mode: 'index', // Exibe todos os valores das moedas ao passar o mouse
                    intersect: false, // Permite que o tooltip apareça mesmo entre pontos
                    callbacks: {
                        label: function(tooltipItem) {
                            return `${tooltipItem.dataset.label}: $${tooltipItem.raw ? tooltipItem.raw.toFixed(2) : 'N/A'}`;
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

async function updateChart(chart) {
    await updatePrices();
    chart.update();
}

window.onload = async () => {
    const chart = createChart();

    // Atualiza o gráfico imediatamente na primeira carga
    await updatePrices();
    chart.update();

    // Atualiza os preços e o gráfico a cada 3 minutos
    setInterval(() => {
        updateChart(chart);
    }, 30000); // 3 minutos em milissegundos
};