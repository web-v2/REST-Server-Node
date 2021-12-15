const { response } = require("express")
const { Categoria, Usuario } = require("../models");

const obtenerCategorias = async (req, res=response) => {
    const {limite=5, desde=0} = req.query;
    const query = {estado: true};

    const [totalCategorias, Categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
                .populate('usuario', 'nombre')
                .skip(Number(desde))
                .limit(Number(limite))
    ]);

    res.json({totalCategorias, Categorias});
}

const obtenerCategoriaId = async (req, res=response) => {
    const {id} = req.params;
    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');
    res.json({categoria});    
}

const crearCategoria = async (req, res= response) => {
    const nombre = req.body.nombre.toUpperCase();
    categoriaDB = await Categoria.findOne({nombre});
    if (categoriaDB){
        return res.status(400).json({message:`La Categoria ${categoriaDB.nombre} ya existe en la base de datos`})
    }

    //data a Guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }
    //Guardar en DB    
    const cat = new Categoria(data);
    await cat.save();
    res.status(201).json(cat);
}

const actualizarCategoria = async (req, res= response) => {
    const {id} = req.params;
    const {estado, usuario, ...data} = req.body;
    
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true});
    res.json(categoria);
}

const borrarCategoria = async (req, res= response) => {
    const {id} = req.params;     

    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, {estado: false}, {new: true});
    res.json(categoriaBorrada);
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoriaId,
    actualizarCategoria,
    borrarCategoria
}