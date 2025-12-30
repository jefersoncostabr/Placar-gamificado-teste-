import mongoose from "mongoose";

async function conectaNaDatabase() {
  const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING;

  if (DB_CONNECTION_STRING) {
    console.log('DB_CONNECTION_STRING encontrada, tentando conectar ao MongoDB...');    
  }

  // Se não houver string de conexão, não tente conectar e retorne um objeto "safe"
  if (typeof DB_CONNECTION_STRING !== 'string' || DB_CONNECTION_STRING.trim() === '') {
    console.warn('*DB_CONNECTION_STRING não está definida. Pulando conexão com o MongoDB. A aplicação continuará sem DB (modo limitado).');
    // Retorna um objeto com os métodos usados pelo restante da aplicação (`on`, `once`)
    return {
      on: () => {},
      once: () => {},
    };
  }

  try {
    // await mongoose.connect(DB_CONNECTION_STRING, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    // });
    await mongoose.connect(DB_CONNECTION_STRING);
    console.log('Conexão com o MongoDB realizada com sucesso!');
    return mongoose.connection;
  } catch (error) {
    console.error('erro ao conectar ao mongo DB', error);
    throw error;
  }
}

export default conectaNaDatabase;