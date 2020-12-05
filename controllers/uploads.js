const path = require('path');
const fs = require('fs');

const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizar-imagen');

const fileUpload = (req, res ) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    //validar tipo
    const tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if( !tiposValidos.includes(tipo) ){
        return res.status(400).jason({
            ok:false,
            msg: 'No es un medico, usuario u hospital (tipo)'
        });
    }

    //Validar que existe archivo
    if(!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No se ha seleccionado un archivo'
        });
    }

    //Procesar imagen

    const file = req.files.imagen;

    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[ nombreCortado.length -1 ];

    //Validar extension
    const extensionesValidas = ['png','jpg','jpeg','gif'];
    if ( !extensionesValidas.includes( extensionArchivo) ) {
        return res.status(400).json({
            ok: true,
            msg: 'No es una extension de imagen valida'
        });
    }

    //Generar el nombre del archivo

    const nombreArchivo = `${ uuidv4() }.${ extensionArchivo }`;

    // Path para guardar la imagen
    const path = `./uploads/${ tipo }/${ nombreArchivo }`;

    //Mover la imagen a carpeta correspondiente
    file.mv( path, (err) => {
        if (err) {
            console.log(err)
            return res.status(500).json({
                ok: false,
                msg: ' error al mover la imagen '
            });
        }
    
    //Actualizar base de datos
    actualizarImagen( tipo, id, nombreArchivo ); //parametros que vamos a recibir

        res.json({
            ok: true,
            msg: 'Archivo Subido',
            nombreArchivo
        });
    });

}

const retornaImagen = (req, res ) => {
    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join(__dirname, `../uploads/${ tipo }/${ foto }`);
    //imagen por defecto
    if( fs.existsSync(pathImg)){
        res.sendFile(pathImg);
    }else{
        const pathImg = path.join(__dirname, `../uploads/no-imagen.jpg`);
        res.sendFile(pathImg);
    }
}

module.exports = { 
    fileUpload,
    retornaImagen
}