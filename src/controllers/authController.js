const {Router } = require('express');
const router = Router();

const jwt = require('jsonwebtoken');
const config = require('../config');

const User = require('../models/User')
const Grupo = require('../models/Grupo')
const Miembros = require('../models/Miembros')
const Notas = require('../models/Notas')

const verifyToken = require('./verifyToken')
const verifyTokenGrupoActivo = require('./verifyTokenGrupoActivo')

router.post('/signup',async (req, res, next) =>{
    const { username, email, password} = req.body;
    console.log(username, email, password);
    const user = new User({
        username: username,
        email: email,
        password: password
    })
    user.password = await user.encriptarPassword(user.password);
    console.log(user);
    await user.save();

    const token = jwt.sign({id: user._id},config.secret,
        {expiresIn: 60 * 60 * 24})

    res.json({auth:true, token:token});
})

router.post('/signin', async (req, res, next) =>{
    const {email, password} = req.body;
    const user = await User.findOne({email:email});
    if(!user){
        return res.status(404).send("The email doesn't exists");
    }
    
    const passwordValido = await user.validarPassword(password);
    if(!passwordValido){
        return res.status(401).json({auth:false, token:null});
    }
    const token = jwt.sign({id: user._id}, config.secret, 
                    {expiresIn: 60 * 60 * 24});
    

    console.log(passwordValido);

    res.json({auth:true, token:token});
});

router.post('/creargrupo', verifyToken,async (req, res) =>{
    const { nombregrupo, admin } = req.body;
    console.log(nombregrupo, admin);
    const grupo = new Grupo({
        nombregrupo: nombregrupo,
        admin: admin
    })

    console.log(grupo);
    await grupo.save();

    res.json({grupocreado:true});

});

router.post('/otorgaraccesoagrupo',async (req, res, next) =>{
    const {username, nombregrupo} = req.body;
    
    console.log(username, nombregrupo);

    const miembro = new Miembros({
        username: username,
        nombregrupo: nombregrupo
    })

    console.log(miembro);
    await miembro.save();

    res.json({miembroagregado:true});
});

router.post('/activargrupoausuario', verifyToken,async (req, res, next) =>{
    const {username, nombregrupo} = req.body;
    
    const user = await User.findOne({username:username});
    if(!user){
        return res.status(404).send("El usuario no existe");
    }

    console.log(username, nombregrupo);
    await user.updateOne({grupoactivo:nombregrupo});

    const token = jwt.sign({id: user.grupoactivo},config.secret,
        {expiresIn: 60 * 60 * 24})

    res.json({auth:true, token:token});
    
});

router.post('/crearnota', verifyToken, verifyTokenGrupoActivo, async (req, res, next) =>{
    
    const { username, nombregrupo, titulo, cuerpo } = req.body;

    //verificar que el grupo es el grupo activo
    
    console.log(req.grupoActivo, nombregrupo);
    if(req.grupoActivo != nombregrupo){
        return res.send('No es tu grupo activo');
    }else{
        console.log(titulo, cuerpo);
        const nota = new Notas({
            titulo: titulo,
            cuerpo: cuerpo
        })

        console.log(nota);
        await nota.save();

        res.json({notacreada:true});
    }
        

});

router.get('/me', verifyToken, async (req, res, next) =>{

    const user = await User.findById(req.usuarioId, {password:0});
    if(!user){
        return res.status(404).send('No user found');
    }else{
        res.json(user);
    }

})

module.exports = router;