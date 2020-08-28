require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');

//Crear servidor express
const app = express();

//CORS
app.use( cors() );

//Base de datos
dbConnection();

//Rutas
app.get('/', (req, res) => {

    res.json({
        ok:true,
        msg: "hola mundo"
    });

});

app.listen( process.env.PORT, () => {
    console.log('Servidor corriendo en puerto' + 3000 );
});


// mean_user
// jy73EbUXrG9ZNGgB