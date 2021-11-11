const {Router} = require('express');
const { check } = require('express-validator');
const { validarCampos} = require('../middleware/validar-campos');
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

router.patch('/:id', usuariosPatch);

router.delete('/:id', usuariosDelete);

module.exports = router;