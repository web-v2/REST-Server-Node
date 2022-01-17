const validarCampos = require('../middleware/validar-campos');
const validarJWT  = require('../middleware/validar-jwt');
const validarRoles = require('../middleware/validar-roles');
const validarArchivoSubir  = require('../middleware/validar-archivo')

module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validarRoles,
    ...validarArchivoSubir
}