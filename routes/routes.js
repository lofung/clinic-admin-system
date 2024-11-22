const express = require('express');
const { builtinModules } = require('module');
const router = express.Router();
const { getEntries, addEntry, editEntry, deleteEntry, getDoctorList, addDoctor, editDoctor, deleteDoctor, getClinicList, addClinic, deleteClinic, editClinic, checkConnection } = require('../controllers/controllers');

router
    .route("/")
    .get(getEntries)
    .post(addEntry);

router
    .route("/checkconnection")
    .get(checkConnection);

router
    .route("/event/:id")
    .put(editEntry)
    .delete(deleteEntry)

router
    .route("/doctorlist")
    .get(getDoctorList)
    .post(addDoctor);

router
    .route("/doctorlist/:id")
    .delete(deleteDoctor)
    .put(editDoctor)

router
    .route("/cliniclist")
    .get(getClinicList)
    .post(addClinic);

router
    .route("/cliniclist/:id")
    .delete(deleteClinic)
    .put(editClinic)

module.exports = router;