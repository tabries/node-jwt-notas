const {Schema, model} = require('mongoose');

const miembroSchema = new Schema({
    username: String,
    nombregrupo: String
});

module.exports = model('Miembros', miembroSchema);