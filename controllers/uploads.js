const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require("express");
const { subirArchivo } = require("../helpers");
const {Usuario, Producto} = require("../models");


const cargarArchivo = async (req, res= response) => {

    try {
      //txt md
      //const nombre = await subirArchivo (req.files, ['txt', 'md'], 'textos');
      //imgs, png, jpeg, jpg, gif
      const nombre = await subirArchivo (req.files, undefined, 'imgs');

      res.status(200).json({nombre});      
    } catch (error) {
      res.status(400).json({error});
    }
}

const actualizarImagen = async (req, res= response) => {
  const {id, coleccion} = req.params;

  let modelo;
  switch (coleccion){
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if (!modelo){
        return res.status(400).json({message:`No existe un usuario con el id ${id}.`});
      }
    break;
    case 'productos':
      modelo = await Producto.findById(id);
      if (!modelo){
        return res.status(400).json({message:`No existe un producto con el id ${id}.`});
      }
    break;    
    default: 
      return res.status(500).json({message: 'Error, pendiente configurar controllers/uploads'});
  }
  //Limpriar imagenes previas

  if (modelo.img) {
    const pathImg = path.join(__dirname, '../uploads', coleccion, modelo.img);
    if(fs.existsSync(pathImg)){
      fs.unlinkSync(pathImg);
    }
  }

  const nombre = await subirArchivo (req.files, undefined, coleccion);
  modelo.img = nombre;
  modelo.save();
  res.json(modelo);
}

const actualizarImagenClaudinary = async (req, res= response) => {
  const {id, coleccion} = req.params;

  let modelo;
  switch (coleccion){
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if (!modelo){
        return res.status(400).json({message:`No existe un usuario con el id ${id}.`});
      }
    break;
    case 'productos':
      modelo = await Producto.findById(id);
      if (!modelo){
        return res.status(400).json({message:`No existe un producto con el id ${id}.`});
      }
    break;    
    default: 
      return res.status(500).json({message: 'Error, pendiente configurar controllers/uploads'});
  }
  //Limpriar imagenes previas

  if (modelo.img) {
    const nombreArr = modelo.img.split('/');
    const n = nombreArr[ nombreArr.length -1 ];
    const [public_id] = n.split('.');
    cloudinary.uploader.destroy(public_id);
  }

  const {tempFilePath} = req.files.archivo;
  const {secure_url} = await cloudinary.uploader.upload(tempFilePath);
  modelo.img = secure_url;
  await modelo.save();
  res.json(modelo);
}

const mostrarImagen = async (req, res= response) => {
  const {id, coleccion} = req.params;

  let modelo;
  switch (coleccion){
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if (!modelo){
        return res.status(400).json({message:`No existe un usuario con el id ${id}.`});
      }
    break;
    case 'productos':
      modelo = await Producto.findById(id);
      if (!modelo){
        return res.status(400).json({message:`No existe un producto con el id ${id}.`});
      }
    break;    
    default: 
      return res.status(500).json({message: 'Error, pendiente configurar controllers/uploads'});
  }
  //Limpriar imagenes previas

  if (modelo.img) {
    const pathImg = path.join(__dirname, '../uploads', coleccion, modelo.img);
    if(fs.existsSync(pathImg)){
      return res.sendFile(pathImg);
    }
  }

  const pathImgPlaceholders = path.join(__dirname, '../assets/no-image.jpg');
  res.sendFile(pathImgPlaceholders);

}

module.exports = { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenClaudinary }