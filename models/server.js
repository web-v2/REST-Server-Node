const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');
class server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuarioPath = '/api/usuarios';
        this.authPath = '/api/auth';

        //Conectar a BD
        this.conectarDB();

        //Middleware
        this.middleware();
        //Rutas de mi App
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middleware(){
        //CORS
        this.app.use(cors());
        //Parse del body
        this.app.use(express.json());
        //Direcctorio publico
        this.app.use(express.static('public'));
    }   

    routes(){
        this.app.use(this.authPath, require('../routes/auth'));
        this.app.use(this.usuarioPath, require('../routes/usuarios'));
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('App Corriendo en: ', this.port);
        });
    }
}

module.exports = server;