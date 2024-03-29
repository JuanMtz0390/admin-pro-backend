const Medico = require('../models/medico');

const getMedicos = async(req, res) => {

    const medicos = await Medico.find()
                                .populate('usuario','nombre')
                                .populate('hospital', 'nombre')
                                

    res.json({
        ok: true,
        medicos
    });
}
const crearMedico = async(req, res) => {

    const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        ...req.body
    });

   
    try {

        const medicoDB = await medico.save();


        res.json({
            ok: true,
            msg:'crearMedico'
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: "Hable con el administrador"
        });
        
    }
}
const actualizarMedico = async(req, res) => {


    const id = req.params.id;
    const uid = req.uid;

    try {
        const medico = await Medico.findById(id);

        if(!medico){
            return res.status(404).json({
                ok: true,
                msg: 'Medico no encontrado por id'
            });
        }

        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }

        const medicoActualizado = await Medico.findByIdAndUpdate(id, cambiosMedico, {new: true});

        res.json({
            ok: true,
            msg: 'Medico actualizado',
            medico:medicoActualizado
        })
        
    } catch (error) {
        console.log(error);
        res. status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
        
    }


    res.json({
        ok: true,
        msg: 'actualizar medicos'
    });
}
const borrarMedico = async (req, res) => {

    
    const id = req.params.id;

    try {
        const medico = await Medico.findById(id);

        if(!medico){
            return res.status(404).json({
                ok: true,
                msg: 'Medico no encontrado por id'
            });
        }

        await Medico.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Medico eliminado'
        })
        
    } catch (error) {
        console.log(error);
        res. status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
        
    }
    
}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico,
}