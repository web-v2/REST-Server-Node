const { response } = require("express");
const { ObjectId } = require("mongoose").Types;
const {Usuario, Categoria, Producto, Role} = require("../models");

const coleccionesPermitidas = [
    'usuarios', 'roles', 'categorias', 'productos'
];

const buscarUsuarios = async (termino='', res= response) => {
    const isMongoId = ObjectId.isValid(termino);
    if(isMongoId){
        const resp = await Usuario.findById(termino);
        return res.json({
            result: (resp.estado) ? [resp] : []
        });
    }
    
    const regex = new RegExp(termino, 'i');
    const [totalRegistros, datos] = await Promise.all([
        Usuario.countDocuments({
            $and: [{estado:true}],
            $or: [{nombre: regex}, {correo: regex}]
        }),
        Usuario.find({
            $and: [{estado:true}],
            $or: [{nombre: regex}, {correo: regex}]
        })
    ]);

    res.json({totalRegistros, results: datos});

}

const buscarRoles = async (termino='', res= response) => {
    const isMongoId = ObjectId.isValid(termino);
    if(isMongoId){
        const resp = await Role.findById(termino);
        return res.json({
            result: (resp) ? [resp] : []
        });
    }
    
    const regex = new RegExp(termino, 'i');
    const [totalRegistros, datos] = await Promise.all([
        Role.countDocuments({rol: regex}),
        Role.find({rol: regex})
    ]);

    res.json({totalRegistros, results: datos});

}

const buscarCategorias = async (termino='', res= response) => {
    const isMongoId = ObjectId.isValid(termino);
    if(isMongoId){
        const resp = await Categoria.findById(termino);
        return res.json({
            result: (resp.estado) ? [resp] : []
        });
    }
    
    const regex = new RegExp(termino, 'i');
    const [totalRegistros, datos] = await Promise.all([
        Categoria.countDocuments({nombre: regex, estado: true}),
        Categoria.find({nombre: regex, estado: true})
    ]);

    res.json({totalRegistros, results: datos});

}

const buscarProductos = async (termino='', res= response) => {
    const isMongoId = ObjectId.isValid(termino);
    if(isMongoId){
        const resp = await Producto.findById(termino).populate('categoria', 'nombre');
        return res.json({
            result: (resp.estado) ? [resp] : []
        });
    }
    
    const regex = new RegExp(termino, 'i');
    const [totalRegistros, datos] = await Promise.all([
        Producto.countDocuments({nombre: regex, estado: true}),
        Producto.find({nombre: regex, estado: true}).populate('categoria', 'nombre')
    ]);

    res.json({totalRegistros, results: datos});

}

const buscar = (req, res= response) => {
    const {coleccion, termino} = req.params;

    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({message:"Error, Colección de busqueda no permitida o No encontrada"})
    }  

    switch(coleccion){
        case 'usuarios':
            buscarUsuarios(termino, res);
        break;
        case 'roles':
            buscarRoles(termino, res);
        break;
        case 'categorias':
            buscarCategorias(termino, res);
        break;        
        case 'productos':
            buscarProductos(termino, res);
        break;
        default: 
            res.status(500).json({message: "Error, coleccion no definida en el switch"});       
    }
}

module.exports = {
    buscar
}