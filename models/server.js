const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { dbConnection } = require('../database/config');

class server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.paths = {
            usuarios:   '/api/usuarios',
            auth:       '/api/auth',
            categorias: '/api/categorias',
            productos:  '/api/productos',
            buscar:     '/api/buscar',
            uploads:    '/api/uploads'            
        };

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
        // Fileupload - Carga de archivos
        this.app.use( fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }   

    routes(){
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('App Corriendo en: ', this.port);
        });
    }
}

module.exports = server;