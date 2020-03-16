const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/notasjwt', {
    useNewUrlParser: true,
    useUnifiedTopology: true

}).then(db => console.log('DB conectada'))