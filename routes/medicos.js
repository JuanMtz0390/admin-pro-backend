//Medicos ruta '/api/medicos'

const { Router } = require('express');
const { check } = require('express-validator');

const { getMedicos, crearMedico, actualizarMedico, borrarMedico } = require('../controllers/medicos');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt'); 

const router = Router();

router.get('/', getMedicos );

router.post('/',
    [
        validarJWT,
        check('nombre', 'El nombre del Medico es necesario').not().isEmpty(),
        check('hospital', 'El hospitad id debe ser valido').isMongoId(),
        validarCampos
    ], 
    crearMedico
);

router.put('/:id',[

    validarJWT,
    check('nombre', 'El nombre es necesario').not().isEmpty(),
    validarCampos

    ],
    actualizarMedico
);

router.delete('/:id',[

    validarJWT
        
    ],
    borrarMedico
);


module.exports = router;
