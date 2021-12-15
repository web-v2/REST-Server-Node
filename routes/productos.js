const {Router} = require('express');
const { check } = require('express-validator');
const { obtenerProductos, obtenerProductoId, crearProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { validarJWT, validarCampos, esAdminRole } = require('../middleware');
const { existCategoriaById, existProductoById } = require('../helpers/db-validators');

const router = Router();


router.get('/', obtenerProductos);

router.get('/:id', [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existProductoById),    
    validarCampos
], obtenerProductoId);

router.post('/', [
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','No es un id de Mongo válido').isMongoId(),
    check('categoria').custom(existCategoriaById), 
    validarCampos
], crearProducto);

router.put('/:id', [
    validarJWT,
    check('id', 'No es un id de Mongo válido').isMongoId(),    
    check('id').custom(existProductoById),      
    validarCampos    
], actualizarProducto);

router.delete('/:id', [
    validarJWT,
    esAdminRole, 
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existProductoById),
    validarCampos
],borrarProducto);

module.exports = router;