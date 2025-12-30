import mongoose from 'mongoose';

const lancamentoSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    valor: Number,
    // O campo data é essencial para a busca do "mais recente"
    data: { type: Date, default: Date.now }
});

const Lancamento = mongoose.model('Lancamento', lancamentoSchema);

export default Lancamento;