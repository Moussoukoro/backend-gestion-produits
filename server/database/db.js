const mongoose= require('mongoose');

const ConnectDB = async() => {
    try {

        const conn=await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB connecté: ${conn.connection.host}`);

    }catch(err){
        console.error(`Erreur:${err.message}`);
        
    }

}
module.exports = ConnectDB;