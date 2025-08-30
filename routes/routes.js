import express from 'express';
import routerArtistas from './routesArtistas.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('API de autenticação com Express e bcrypt funcionando!');
});

// rota pública c acesso a arquivos estáticos
router.use("/public", express.static("frontEnd/public"));
router.use("/pr", express.static("frontEnd/protected"));

router.use('/usArtistas', routerArtistas);

export default router;