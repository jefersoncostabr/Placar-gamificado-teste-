// server.js -> npm rum dev (para rodar com nodemon)
import express from 'express';
import dotenv from 'dotenv';
import router from './routes/routes.js';
import rotasAdmin from './routes/rotasAdmin.js';
import conectaNaDatabase from './src/config/dbConnect.js';

dotenv.config();// pega as var de ambiente do arquivo .env

const conexao = await conectaNaDatabase();

conexao.on('error', (err) => console.error('Erro na conexão com o MogoDB', err));

conexao.once('open', () => console.log('Conexão com o mongoDB feita com sucesso!'));

const app = express();
app.use(express.json());
app.use('/', router); // Rota teste
app.use('/', rotasAdmin); // Rotas administrativas
// app.use('/', routerArtistas);

const PORT = process.env.PORT || 3000;// se não tiver a var de ambiente PORT usa 3000

const msg = `servidor rodando.\nhttps://placar-gamificado-teste.onrender.com\n`

app.listen(PORT, "0.0.0.0", () => console.log(msg));