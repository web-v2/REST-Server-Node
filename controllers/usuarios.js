const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');


const usuariosGet = async (req, res=response) => {
    const {limite=5, desde=0} = req.query;
    const query = {estado: true};

    const [totalUSers, Users] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
    ]);

    res.json({totalUSers, Users});
}

const usuariosPost = async (req, res = response) => {
    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol});

    //Encriptar Password
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);
    //Guardar DB
    await usuario.save();
    res.json({usuario});
}

const usuariosPut = async (req, res = response) => {
    const {id} = req.params;
    const { _id, correo, password, google, ...resto } = req.body;

    if(password){
        //Encriptar Password
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id,resto);

    res.json({usuario});
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - Controllers'
    });
}

const usuariosDelete = async (req, res = response) => {    
    const {id} = req.params;
    const user = await Usuario.findByIdAndUpdate(id, {estado:false});  
    res.json({user});
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}