const Role = require('../models/role');
const {Usuario, Categoria, Producto} = require('../models');

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

const existCategoriaById = async (id) => {
    const categoria = await Categoria.findById(id);
    if (!categoria) {
        throw new Error(`El id ${id} no existe en la base de datos`);
    }    
}

const existProductoById = async (id) => {
    const product = await Producto.findById(id);
    if (!product) {
        throw new Error(`El id ${id} no existe en la base de datos`);
    }
}

const coleccionesPermitidas = async (coleccion='', colecciones=[]) => {
    const incluida = colecciones.includes(coleccion);
    if (!incluida) {
        throw new Error(`La coleccion ${coleccion} no es permitida, [${colecciones}]`);
    }   
    return true; 
}

module.exports = {
    esRoleValido,
    emailExist,
    existUsuarioById,
    existCategoriaById,
    existProductoById,
    coleccionesPermitidas
}