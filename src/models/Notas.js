const {Schema, model} = require('mongoose');

const notasSchema = new Schema({
    titulo: String,
    cuerpo: String
});

module.exports = model('Notas', notasSchema);