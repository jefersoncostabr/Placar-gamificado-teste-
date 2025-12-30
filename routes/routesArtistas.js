
import express from 'express';
import artista from '../src/models/artistas.js';

const routerArtistas = express.Router();

// Configuração de CORS para permitir requisições de outras origens
routerArtistas.use((req, res, next) => { 
    // res.header("Access-Control-Allow-Origin", "https://placar-gamificado-teste.onrender.com", "http://localhost:3000"); // Permite qualquer origem.
    res.header("Access-Control-Allow-Origin", "*"); // Permite qualquer origem.
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-api-key");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// Middleware de proteção simples
const verificarPermissao = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    // Em produção, use variáveis de ambiente (process.env.API_SECRET)
    if (apiKey === 'teste1234') {
        next();
    } else {
        console.warn('Acesso negado: Credenciais inválidas.');
        res.status(403).json({ message: 'Acesso negado: Credenciais inválidas.' });
    }
};

// GET mais recente (Mover para o topo para garantir prioridade e evitar conflitos)
routerArtistas.get('/mais-recente',verificarPermissao, async (req, res) => { // http://localhost:porta/usArtistas/mais-recente
    try {
        console.log('Buscando artista mais recente');
        // .sort({ _id: -1 }) ordena do ID mais novo para o mais antigo
        const artistaRecente = await artista.findOne().sort({ _id: -1 });
        
        if (!artistaRecente) {
            return res.status(200).json({ message: 'Nenhum artista encontrado' });
        }

        // O _id do MongoDB possui a data de criação embutida. Podemos extraí-la assim:
        const dataCriacao = artistaRecente._id.getTimestamp();
        console.log('Data retornada (UTC):', dataCriacao);
        console.log('Data formatada (BR):', dataCriacao.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }));

        // Convertemos o documento do Mongoose para objeto simples e adicionamos a data
        res.status(200).json({ ...artistaRecente.toObject(), dataCriacao });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET all
routerArtistas.get('/',verificarPermissao, async (req, res) => { // urlBase + /usArtistas/
    const artistasRecebidos = await artista.find({});
    if (artistasRecebidos.length === 0) {
        res.status(404).json({ message: 'Nenhum artista encontrado' });
    } else {
        res.status(200).json(artistasRecebidos);
    }
});

// GET artistas
routerArtistas.get('/artistas', async (req, res) => {// urlBase + /usArtistas/artistas
    // todos que não tem adm no role
    const artistasRecebido = await artista.find({ role: { $ne: 'admin' } });
    if (artistasRecebido.length === 0) {
        res.status(404).json({ message: 'Nenhum artista encontrado' });
    } else {
        res.status(200).json(artistasRecebido);
    }
});

// GET admins
routerArtistas.get('/adms', verificarPermissao, async (req, res) => {// urlBase + /usArtistas/adms
    // todos que não tem adm no role
    const artistasRecebido = await artista.find({ role: 'admin'  });
    if (artistasRecebido.length === 0) {
        res.status(404).json({ message: 'Nenhum adm encontrado' });
    } else {
        res.status(200).json(artistasRecebido);
    }
});

// DELETE
routerArtistas.delete('/del/:id', verificarPermissao, async (req, res) => {// urlBase + /usArtistas/del/:id
    const id = req.params.id;
    const artistaDeletado = await artista.findByIdAndDelete(id);
    if (!artistaDeletado) {
        res.status(404).json({ message: 'Artista não encontrado' });
    } else {
        res.status(200).json({ message: 'Artista deletado com sucesso' });
    }
});

// POST
routerArtistas.post('/add', verificarPermissao, async (req, res) => {// urlBase + /usArtistas/add
    const novoArtista = new artista(req.body);
    try {
        const artistaSalvo = await novoArtista.save();
        res.status(201).json(artistaSalvo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Put
routerArtistas.put('/update/:id', verificarPermissao, async (req, res) => {// urlBase + /usArtistas/update/:id
    const id = req.params.id;
    const artistaAtualizado = await artista.findByIdAndUpdate(id, req.body, { new: true });
    if (!artistaAtualizado) {
        res.status(404).json({ message: 'Artista nao encontrado' });
    } else {
        res.status(200).json(artistaAtualizado);
    }
});

export default routerArtistas;