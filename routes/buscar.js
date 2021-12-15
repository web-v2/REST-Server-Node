const {Router} = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware');
const { buscar } = require('../controllers/buscar');

const router = Router();

router.get('/:coleccion/:termino', buscar);
router.get('/:coleccion/', function (req, res) {
    res.status(400).json({
        message: 'Error, No es especifico termino de busqueda!'
    })
});

module.exports = router;