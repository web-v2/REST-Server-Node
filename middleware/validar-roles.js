const { request, response } = require("express");

const esAdminRole = (req=request, res=response, next) => {

    if (!req.usuario) {
        return res.status(500).json({message:'Error[500]: No se puede verificar Role sin validar token'});
    } 
    const {rol, nombre} = req.usuario;

    if (rol != 'ADMIN_ROLE'){
        return res.status(401).json({message:'Error[401]: Usuario debe ser Administrador'});
    }

    next();
}

const tieneRole = (...roles) => {
    return (req=request, res=response, next) => {
        if (!req.usuario) {
            return res.status(500).json({message:'Error[500]: No se puede verificar Role sin validar token'});
        }

        if (!roles.includes(req.usuario.rol)) {
            return res.status(401).json({message: `Error[401]: El servicio requiere de uno de estos roles: ${roles}`});
        }
    next();
    }    
}

module.exports = {esAdminRole, tieneRole}