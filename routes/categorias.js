const {Router} = require('express');
const { check } = require('express-validator');
const { obtenerCategorias, obtenerCategoriaId, crearCategoria, actualizarCategoria, borrarCategoria  } = require('../controllers/categorias');
const { validarJWT, validarCampos, esAdminRole } = require('../middleware');
const { existCategoriaById } = require('../helpers/db-validators');

const router = Router();

//Obtener todas las categorias - publico
router.get('/', obtenerCategorias);

//Obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existCategoriaById),    
    validarCampos
], obtenerCategoriaId);

//crear categoria - privado - cualquier persona con token valido.
router.post('/', [
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

//Modificar la categoria por id - privado - cualquier persona con token valido.
router.put('/:id', [
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existCategoriaById),    
    validarCampos    
], actualizarCategoria);

//Eliminar una categoria por id - solo si es un Admin.
router.delete('/:id', [
    validarJWT,
    esAdminRole, 
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existCategoriaById),
    validarCampos
],borrarCategoria);

module.exports = router;