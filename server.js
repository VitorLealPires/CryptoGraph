const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

// Servindo arquivos estáticos
app.use(express.static('public'));

// Endpoint para obter preços de criptomoedas
app.get('/crypto-data', async (req, res) => {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd');
        res.json(response.data);
    } catch (error) {
        console.error('Erro ao buscar dados de criptomoedas:', error);
        res.status(500).send('Erro ao buscar dados');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
