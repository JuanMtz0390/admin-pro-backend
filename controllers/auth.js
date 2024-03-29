const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { googleverify } = require('../helpers/google-verify');

const login = async(req, res) => {

    const { email, password } = req.body;

    try {

        //verificar email
        const usuarioDB = await Usuario.findOne({ email }); 

        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no valido'
            });
        }

        //verificar password
        const validPassword = bcrypt.compareSync( password, usuarioDB.password );

        if ( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no vaida'
            });
        }

        //Generar JWT
        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            token
        })


        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'hable con el administrador'
        });
        
    }

}

const googleSignIn = async(req, res ) =>{
    
    const googleToken = req.body.token;

    try {
        const { name, email, picture } = await googleverify(googleToken);

        const usuarioDB = usuario.findOne({ email });
        let usuario;
        // si no existe el usuario

        if (! usuarioDB ) {
            usuario = new usuario({
                nombre: name,
                email,
                password: '@@',
                img: picture,
                google: true

            });
        }else{
            // si existe usuario
            usuario = usuarioDB;
            usuario.google = true;
        }

        //Guardar en Base de datos
        await usuario.save();

         //Generar JWT
         const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            token
        });
    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'Token no es correcto'
        });
        
    }

}

const renewToken = async(req, res) => {

    const uid = req.uid;

    //Generar Token
    const token = await generarJWT(uid);

    res.json({
        ok: true,
        token
    })
}

module.exports = {
    login,
    googleSignIn,
    renewToken
}