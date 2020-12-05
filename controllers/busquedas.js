
const Usuarios = require('../models/usuario');
const Medicos = require('../models/medico');
const Hospitales = require('../models/hospital');

const getTodo = async(req, res) => {

    const busqueda = req.params.busqueda;
    const regex = new RegExp( busqueda, 'i');

    const [ usuarios, medicos, hospitales ] = await Promise.all([
        Usuarios.find({ nombre: regex }),
        Medicos.find({ nombre: regex }),
        Hospitales.find({ nombre: regex })

    ]);

    res.json({
        ok: true,
        usuarios,
        medicos,
        hospitales
    })
}

const getColeccion = async(req, res) => {

    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regex = new RegExp( busqueda, 'i');

    let data = [];

    switch ( tabla ) {
        case 'usuarios':
            data = await Usuarios.find({ nombre: regex });
            
            break;
 
        case 'medicos':
            data = await Medicos.find({ nombre: regex })
                                .populate('usuario', 'nombre img')
                                .populate('hospital', 'nombre img');
            
            break;

        case 'hospitales':
            data = await Hospitales.find({ nombre: regex })
                                   .populate('usuario', 'nombre img');

            
            break;
    
        default:
            return res.status(400).json({
                ok: false,
                msg: 'las tablas son usuarios/medicos/hospitales'
            });
    }

    res.json({
        ok: true,
        resultados: data
    })
}


module.exports = {
    getTodo,
    getColeccion
}