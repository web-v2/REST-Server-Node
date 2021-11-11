const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRoleValido = async(rol = '')=>{
    const existeRol = await Role.findOne({rol});
    if (!existeRol){
        throw new Error(`El rol ${rol} no esta registrado en la base de datos`);
    }
}

const emailExist = async(correo = '')=>{    
    const existEmail = await Usuario.findOne({correo});
    if(existEmail){
        throw new Error(`El correo ${correo} ya esta registrado en la base de datos`);
    }
}

const existUsuarioById = async (id) => {
    const user = await Usuario.findById(id);
    if (!user) {
        throw new Error(`El id ${id} no existe en la base de datos`);
    }
}

module.exports = {
    esRoleValido,
    emailExist,
    existUsuarioById
}