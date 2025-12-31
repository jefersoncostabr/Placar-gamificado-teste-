import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import routerArtistas from './routesArtistas.js';
// import routerLancamentos from './routesLancamentos.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get('/', (req, res) => {
    res.send('API funcionando!');
});

router.get('/rotas', (req, res) => {// urlBase + /rotas
    const PORT = process.env.PORT || 3000;// se não tiver a var de ambiente PORT usa 3000
    const listaMsgRotas = [
        `Url base quando no render: https://placar-gamificado-teste.onrender.com\n`,
        `Url base quando local: http://localhost:${PORT}\n`,
        'Teste com navegador =>\n',
        `http://localhost:${PORT}/rotas\n`,
        `http://localhost:${PORT}/usartistas/mais-recente`,
        `http://localhost:${PORT}/public/index.html\n`,
        `http://localhost:${PORT}/pr/regulamento.html\n`,
        `http://localhost:${PORT}/pr/scoreBoard.html\n`,
        `http://localhost:${PORT}/usArtistas\n`,
        `http://localhost:${PORT}/usArtistas/artistas\n`,
        `http://localhost:${PORT}/usArtistas/adms\n`,
        `http://localhost:${PORT}/usArtistas/add (POST)\n`,
        `http://localhost:${PORT}/usArtistas/del/:id (DELETE)\n`,
        `http://localhost:${PORT}/usArtistas/update/:id (PUT)\n`,
        '\nTeste com postman POST Body raw JSON =>\n\n',
        `http://localhost:${PORT}/registro\n`,
        `No corpo coloque {"username": "seu_usuario", "password": "sua_senha"}\n`,
        `Nas rotas bloqueadas coloque no header x-api-key: <senha>\n`
    ];
    res.json(listaMsgRotas);
});

// rota pública c acesso a arquivos estáticos
router.use("/public", express.static(path.join(__dirname, '../frontEnd/public')));
router.use("/pr", express.static(path.join(__dirname, '../frontEnd/protected')));

router.use('/usArtistas', routerArtistas);// definidas em arquivo separado
// para acessar estas rotas deve se usar /usArtistas antes da rota específica

export default router;