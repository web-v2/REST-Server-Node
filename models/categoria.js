const { Schema, model, SchemaTypes } = require('mongoose');

const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio.'],
        unique: true
    },
    estado:{
        type: Boolean,
        default: true,
        required: [true, 'El estado es obligatorio.']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El usuario es obligatorio.']
    }
});

CategoriaSchema.methods.toJSON = function(){
    const {__v, estado, ...categoria} = this.toObject();
    return categoria;
}

module.exports = model('Categoria', CategoriaSchema);