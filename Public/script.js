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

async function updatePrices() {
    const cryptoData = await getCryptoData();

    // Verifica se os dados são válidos antes de continuar
    if (cryptoData && cryptoData.bitcoin && cryptoData.ethereum) {
        const currentHour = new Date().getHours();
        
        // Preenche os preços atuais nas posições corretas do array
        bitcoinPrices[currentHour] = cryptoData.bitcoin.usd;
        ethereumPrices[currentHour] = cryptoData.ethereum.usd;

        console.log('Preços atualizados:', { bitcoinPrices, ethereumPrices });
    } else {
        console.error('Erro: Dados de criptomoedas não estão no formato esperado');
    }
}

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
