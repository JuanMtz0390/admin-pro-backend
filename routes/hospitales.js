//hospitales ruta '/api/hospitales'

const { Router } = require('express');
const { check } = require('express-validator');

const { getHospital, crearHospital, actualizarHospital, borrarHospital } = require('../controllers/hospitales');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', getHospital );

router.post('/',[

    validarJWT,
    check('nombre', 'El nombre del hospita es obligatorio').not().isEmpty(),
    validarCampos,

    ], 
    crearHospital
);

router.put('/:id',[

    validarJWT,
    check('nombre', 'el nombre es necesario').not().isEmpty(),
    validarCampos

    ],
    actualizarHospital
);

router.delete('/:id',[

    validarJWT
            
    ],
    borrarHospital
);


module.exports = router;
