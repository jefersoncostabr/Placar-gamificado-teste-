
import express from 'express';
import artista from '../src/models/artistas.js';

const routerArtistas = express.Router();

// GET all
routerArtistas.get('/', async (req, res) => {
    const artistasRecebidos = await artista.find({});
    if (artistasRecebidos.length === 0) {
        res.status(404).json({ message: 'Nenhum artista encontrado' });
    } else {
        res.status(200).json(artistasRecebidos);
    }
});

// GET artistas
routerArtistas.get('/artistas', async (req, res) => {
    // todos que não tem adm no role
    const artistasRecebido = await artista.find({ role: { $ne: 'admin' } });
    if (artistasRecebido.length === 0) {
        res.status(404).json({ message: 'Nenhum artista encontrado' });
    } else {
        res.status(200).json(artistasRecebido);
    }
});

// GET admins
routerArtistas.get('/adms', async (req, res) => {
    // todos que não tem adm no role
    const artistasRecebido = await artista.find({ role: 'admin'  });
    if (artistasRecebido.length === 0) {
        res.status(404).json({ message: 'Nenhum adm encontrado' });
    } else {
        res.status(200).json(artistasRecebido);
    }
});

// DELETE
routerArtistas.delete('/del/:id', async (req, res) => {
    const id = req.params.id;
    const artistaDeletado = await artista.findByIdAndDelete(id);
    if (!artistaDeletado) {
        res.status(404).json({ message: 'Artista não encontrado' });
    } else {
        res.status(200).json({ message: 'Artista deletado com sucesso' });
    }
});

// POST
routerArtistas.post('/add', async (req, res) => {
    const novoArtista = new artista(req.body);
    try {
        const artistaSalvo = await novoArtista.save();
        res.status(201).json(artistaSalvo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Put
routerArtistas.put('/update/:id', async (req, res) => {
    const id = req.params.id;
    const artistaAtualizado = await artista.findByIdAndUpdate(id, req.body, { new: true });
    if (!artistaAtualizado) {
        res.status(404).json({ message: 'Artista nao encontrado' });
    } else {
        res.status(200).json(artistaAtualizado);
    }
});

export default routerArtistas;