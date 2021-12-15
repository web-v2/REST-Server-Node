const { response } = require("express")
const { Producto } = require("../models");

const obtenerProductos = async (req, res=response) => {
    const {limite=5, desde=0} = req.query;
    const query = {estado: true};

    const [totalProductos, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
                .populate('usuario', 'nombre')
                .populate('categoria', 'nombre')
                .skip(Number(desde))
                .limit(Number(limite))
    ]);

    res.json({totalProductos, productos});
}

const obtenerProductoId = async (req, res=response) => {
    const {id} = req.params;
    const product = await Producto.findById(id).populate('usuario', 'nombre').populate('categoria', 'nombre');
    res.json({product});    
}

const crearProducto = async (req, res= response) => {
    const {estado, usuario, ...body} = req.body;
    const product = await Producto.findOne({nombre: body.nombre});
    if (product){
        return res.status(400).json({message:`El producto ${product.nombre} ya existe en la base de datos`})
    }

    //data a Guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(), 
        usuario: req.usuario._id
    }
    //Guardar en DB    
    const prod = new Producto(data);
    await prod.save();
    res.status(201).json(prod);
}

const actualizarProducto = async (req, res= response) => {
    const {id} = req.params;
    const {estado, usuario, ...data} = req.body;
    
    if(data.nombre){
        data.nombre = data.nombre.toUpperCase();
    }
    data.usuario = req.usuario._id;

    const product = await Producto.findByIdAndUpdate(id, data, {new: true});
    res.json(product);
}

const borrarProducto = async (req, res= response) => {
    const {id} = req.params;     

    const product = await Producto.findByIdAndUpdate(id, {estado: false}, {new: true});
    res.json(product);
}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProductoId,
    actualizarProducto,
    borrarProducto
}