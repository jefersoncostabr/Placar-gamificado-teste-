import express from 'express';
// ATENÇÃO: Verifique se o caminho abaixo corresponde ao local do seu Model 'Artista'
import Artista from '../src/models/artistas.js'; 

const router = express.Router();

// Rota para atualização em massa (eficiente)
router.post('/usArtistas/atualizar-lista', async (req, res) => {
    try {
        const dados = req.body;
        
        if (!Array.isArray(dados)) {
            return res.status(400).json({ error: 'Formato de dados inválido. Esperado um array.' });
        }

        // Cria as operações de atualização em lote para o MongoDB
        const operations = dados.map(item => ({
            updateOne: {
                filter: { nome: item.nome }, // Busca pelo nome
                update: { 
                    $set: { 
                        frequencia: item.frequencia, 
                        drill: item.drill, 
                        extra: item.extra 
                    } 
                }
            }
        }));

        if (operations.length > 0) {
            await Artista.bulkWrite(operations);
        }

        res.status(200).json({ message: 'Dados atualizados com sucesso!' });
    } catch (error) {
        console.error('Erro na rota de atualização:', error);
        res.status(500).json({ error: 'Erro interno ao salvar dados' });
    }
});

export default router;