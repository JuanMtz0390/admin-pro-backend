const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');

const { validationResult } = require('express-validator');
const { TokenExpiredError } = require('jsonwebtoken');
const { generarJWT } = require('../helpers/jwt');


const getUsuarios = async(req, res) => {

    const usuarios = await Usuario.find({}, 'nombre email role google');

    res.json({
        ok: true,
        usuarios
    });

}

const crearUsuario = async(req, res) => {

    const { email, password, nombre } = req.body;

    try {

        const existeEmail = await Usuario.findOne({ email });

        if ( existeEmail ){
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado'
            });
        }

        const usuario = new Usuario( req.body);

        //encriptar password
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        //guardar usuario
        await usuario.save();
    
        //token
        const token = await generarJWT(usuario.id);
    
        res.json({
            ok: true,
            usuario,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }

}

const actualizarUsuario = async(req, res ) => {

    const uid = req.params.id;

    try {

        //buscar por id
        const usuarioDB = await Usuario.findById( uid );

        if( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese id'
            });
        }

        //Actualizar

        const {password, google, email, ...campos} = req.body;

        if ( usuarioDB.email !== email ){
     
            const existeEmail = await Usuario.findOne({ email });
            if ( existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'ya existe un usuario con ese email'
                });
            }

        }

        campos.email = email;
        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, { new: true } );

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
}

const deleteUsuario = async(req , res) => {

    const uid = req.params.id;

    try {

        //buscar por id
        const usuarioDB = await Usuario.findById( uid );

        if( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese id'
            });
        }

        await Usuario.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'Usuario Eliminado'
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No existe usuario'
        });
        
    }

}

module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    deleteUsuario,
}