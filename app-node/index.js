const express = require('express');
const NodeCache = require('node-cache');
const client = require('prom-client');

const app = express();
const port = 3000;

// Coleta métricas padrão do sistema
client.collectDefaultMetrics();

// Define o contador customizado
const timeCounter = new client.Counter({
  name: 'time_requests_total',
  help: 'Total de requisições à rota /time',
});

// Cache de 60 segundos
const cache = new NodeCache({ stdTTL: 60 });

// Rota /hello
app.get('/hello', (req, res) => {
  res.send('Olá do Express!');
});

// Rota /time (com cache + métrica)
app.get('/time', (req, res) => {
  timeCounter.inc(); // contabiliza
  const cached = cache.get('time');
  if (cached) {
    return res.send(`(cache) ${cached}`);
  }

  const time = new Date().toISOString();
  cache.set('time', time);
  res.send(time);
});

// Rota de métricas Prometheus
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`App rodando em http://localhost:${port}`);
});
