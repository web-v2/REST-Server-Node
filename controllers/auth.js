const { response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT} = require('../helpers/generar-jwt');
const login = async (req, res = response) => {
    const {correo, password} = req.body;
    try {
        //Verificar si el Correo existe
        const user = await Usuario.findOne({correo});
        if(!user) {
            return res.status(400).json({message:"Error, Usuario/Password no son correctos - correo"});
        }
        //Verificar si el usuario esta activo        
        if(!user.estado) {
            return res.status(400).json({message:"Error, Usuario/Password no son correctos - estado:false"});
        }        
        //Verificar la contraseña 
        const validPassword = bcryptjs.compareSync(password, user.password);
        if(!validPassword) {
            return res.status(400).json({message:"Error, Usuario/Password no son correctos - password"});
        }
        //Generar el JWT
        const token = await generarJWT(user.id);


        res.json({
            user,
            token
        });        
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            msg: "Error en el Servidor al procesar la request"
        })
    }
}


module.exports = {login}