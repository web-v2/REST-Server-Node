const {Router} = require('express');
const { check } = require('express-validator');
const {validarCampos, validarJWT, esAdminRole, tieneRole } = require('../middleware');

const { esRoleValido, emailExist, existUsuarioById } = require('../helpers/db-validators');
const { usuariosGet, usuariosPost, usuariosPut, usuariosPatch, usuariosDelete } = require('../controllers/usuarios');


const router = Router();

router.get('/', usuariosGet);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe ser mayor a 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom(emailExist),
    check('rol').custom(esRoleValido),
    validarCampos
] ,usuariosPost);
    
router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existUsuarioById),
    check('rol').custom(esRoleValido),
    validarCampos
], usuariosPut);

router.patch('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existUsuarioById),]);

router.delete('/:id', [
    validarJWT,
    //esAdminRole,
    tieneRole('ADMIN_ROLE','VENTAS_ROLE'), //Se puede trabajar con varios roles
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existUsuarioById),
    validarCampos] ,usuariosDelete);

module.exports = router;