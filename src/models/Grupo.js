const {Schema, model} = require('mongoose');

const grupoSchema = new Schema({
    nombregrupo: String,
    admin: String
});

module.exports = model('Grupo', grupoSchema);