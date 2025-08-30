import mongoose from "mongoose";

const artistasSchema = new mongoose.Schema({
    id: {type: mongoose.Schema.Types.ObjectId},
    nome: {type: String, required: true},
    passhash: {type: String, required: true},
    role: {type: String, enum: ['admin', 'artista']},
    frequencia: {type: Number, default: 0},
    drill: {type: Number, default: 0},
    extra: {type: Number, default: 0}
}, { versionKey: false });

const artista = mongoose.model('artistas', artistasSchema);

export default artista;