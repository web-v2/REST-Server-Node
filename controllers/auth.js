const { response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT, googleVerify } = require('../helpers');


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

const googleSingIn = async (req, res= response) => {
    const {id_token} = req.body;
    try {

        const {nombre, img, correo} = await googleVerify(id_token);
        
        let usuario = await Usuario.findOne({correo});
        if (!usuario) {
            const data = {
                nombre,
                correo, 
                password: 'regiter google',
                rol: 'USER_ROLE',
                img,
                google: true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        if (!usuario.estado){
            return res.status(401).json({
                message: 'Error, usuario bloqueado!'
            });
        }

        //Generar el JWT
        const token = await generarJWT(usuario.id);
        res.json({usuario,token});     

    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: 'Error, no se pudo verificar el Token'
        });
    }
}

module.exports = {login,googleSingIn}