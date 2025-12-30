import express from 'express';
import Lancamento from './Lancamento.js';

const router = express.Router();

/**
 * RESUMO DE USO (Postman/Front-end/Navegador):
 * 
 * Método: GET
 * URL: http://localhost:3000/XXXXXXXX/mais-recente
 * Descrição: Retorna o único documento de lançamento com a data mais recente (ordem decrescente).
 * Teste rápido: Pode ser acessado diretamente pela barra de endereço do navegador.
 */

// Rota: GET /lancamentos/mais-recente
router.get('/mais-recente', async (req, res) => {
    try {
        // Busca um único documento (.findOne)
        // Ordenado pela data de forma decrescente (-1)
        const recente = await Lancamento.findOne().sort({ data: -1 });

        if (!recente) {
            return res.status(404).json({ message: "Nenhum lançamento encontrado." });
        }

        res.status(200).json(recente);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar lançamento recente", details: error.message });
    }
});

export default router;