const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async (req=request, res=response, next) => {

    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({ message: 'Error[401]: No existe token en la petición' });
    }

    try {
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const usuario = await Usuario.findById(uid);   
        if (!usuario) {
            return res.status(401).json({ message: 'Error[401]: Token invalid - No existe Usuario' });
        }         
        if (!usuario.estado) {
            return res.status(401).json({ message: 'Error[401]: Token invalid - Usuario con estado en False' });
        }
        req.usuario = usuario;
        next();
    } catch (error) {
        console.log(token);
        return res.status(401).json({ message: 'Error[401]: Token invalid' });
    }

}

module.exports = {validarJWT}