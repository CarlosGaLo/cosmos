const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    const dbName = mongoose.connection.name;
    console.log('Nombre de la base de datos:', dbName);
    mongoose.connection.close();
}).catch((error) => {
    console.error('Error al conectar a MongoDB:', error);
});