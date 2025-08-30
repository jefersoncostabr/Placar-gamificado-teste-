import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();
const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING;

async function conectaNaDatabase() {
    try {
        mongoose.connect(DB_CONNECTION_STRING
    );
        console.log('Conexão com o MongoDB realizada com sucesso!');
        return mongoose.connection;
    } catch (error) {
        console.error('erro ao conectar ao mongo DB',error);
    }
}

export default conectaNaDatabase;