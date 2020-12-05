const Hospital = require('../models/hospital');


const getHospital = async(req, res) => {

    const hospitales = await Hospital.find()
                                   .populate('usuario', 'nombre')


    res.json({
        ok: true,
        hospitales
    });
}

const crearHospital = async (req, res) => {

    const uid = req.uid;

    const hospital = new Hospital({
        usuario: uid,
        ...req.body

    });

    try {

        const hospitalDB = await hospital.save();

        res.json({
        ok: true,
        hospital: hospitalDB
    });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
        
    }

    
}
const actualizarHospital = (req, res) => {
    res.json({
        ok: true,
        msg: 'actualizar hospitales'
    });
}
const borrarHospital = (req, res) => {
    res.json({
        ok: true,
        msg: 'borrrar hospitales'
    });
}

module.exports = {
    getHospital,
    crearHospital,
    actualizarHospital,
    borrarHospital
}