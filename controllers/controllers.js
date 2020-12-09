const EntrySchema = require('../models/entries');
const pool = require("../config/elephantsql");

//@DESC     Get all entries
//@route    GET /api/v1/
//@access   Public

exports.getEntries = async (req, res, next) => {
    try {
        const data = await pool.query("SELECT * FROM clinic_time_table");

        return res.status(200).json({
            success: true,
            count: data.length,
            data: data
        })
    } catch (err) { 
        return res.status(500).json({
            success: false,
            error: "Server Error"
        });
    }
}

//@DESC     Add entry
//@route    POST /api/v1/
//@access   Public

exports.addEntry = async (req, res, next) => {
    try {
        console.log(req.body)
        const { doctor, clinic, date, am } = req.body;
        const weight = 1;
        const entry = await pool.query("INSERT INTO clinic_time_table (clinic, doctor, am, date, weight) VALUES ($1, $2, $3, $4, $5)",
        [clinic, doctor, am, date, weight]);
    
        return res.status(201).json({
            success: true,
            data: [clinic, doctor, am, date, weight]
        })
    } catch (err) {
        if(err.name === "ValidationError"){
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                error: messages
            })
        } else {
            return res.status(500).json({
                success: false,
                error: "Server Error, \"else\" in controller"
            });
        }
    }

}

exports.editEntry = async (req, res, next) => {
    try {
        console.log("HELLO WORLD edit doctor")
        const { id } = req.params;
        console.log(req.body)
        const { regName, displayName, password } = req.body;        
        const deleteClinic = await pool.query("UPDATE clinic_time_table SET (login_name, doc_name, password) = ($2, $3, $4) WHERE login_id=$1", [ id, regName, displayName, password ])
        return res.status(201).json({
            success: true,
            message: { id, regName, displayName, password }
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: "Server Error"
        });
    }
}

//@DESC     Delete entry
//@route    DELETE /api/v1/delete/:id
//@access   Public

exports.deleteEntry = async (req, res, next) => {
    try {
        const entry = await pool.query("DELETE FROM clinic_time_table WHERE event_id = $1", [ req.params.id ]);

        if (!entry) {
            return res.status(404).json({
                success: false,
                error: "No Entry found"
            })
        }

        return res.status(200).json({
            success: true,
            data: {}
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: "Server Error"
        });
    }
}

//@DESC     Get entry
//@route    GET /api/v1/doctorlist
//@access   Public

exports.getDoctorList = async (req, res, next) => {
    try {
        const doctorList = await pool.query("SELECT * FROM login_table");
        res.json(doctorList);
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: "Server Error"
        });
    }
}


exports.addDoctor = async (req, res, next) => {
    try {
        console.log(req.body);
        const { regName, displayName, password } = req.body;
        const newDoctor = await pool.query("INSERT INTO login_table (login_name, doc_name, password) VALUES ($1, $2, $3)",
        [regName, displayName, password])
        return res.status(201).json({
            success: true,
            message: {regName, displayName, password}
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: "Server Error"
        });
    }
}

exports.editDoctor = async (req, res, next) => {
    try {
        console.log("HELLO WORLD edit doctor")
        const { id } = req.params;
        console.log(req.body)
        const { regName, displayName, password } = req.body;        
        const deleteClinic = await pool.query("UPDATE login_table SET (login_name, doc_name, password) = ($2, $3, $4) WHERE login_id=$1", [ id, regName, displayName, password ])
        return res.status(201).json({
            success: true,
            message: { id, regName, displayName, password }
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: "Server Error"
        });
    }
}

exports.deleteDoctor = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleteDoctor = await pool.query("DELETE FROM login_table WHERE login_id = $1", [ id ])
        return res.status(201).json({
            success: true,
            message: {id}
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: "Server Error"
        });
    }
}

//@DESC     Get entry
//@route    GET /api/v1/cliniclist
//@access   Public

exports.getClinicList = async (req, res, next) => {
    try {
        const clinicList = await pool.query("SELECT * FROM clinic_source_table");
        res.json(clinicList);
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: "Server Error"
        });
    }
}

exports.addClinic = async (req, res, next) => {
    try {
        //console.log("HELLO WORLD");
        const { clinicName, ampm, weekday } = req.body;
        const newClinic = await pool.query("INSERT INTO clinic_source_table (clinic_name, am, date) VALUES ($1, $2, $3)",
        [clinicName, ampm, weekday])
        return res.status(201).json({
            success: true,
            message: {clinicName, ampm, weekday}
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: "Server Error"
        });
    }
}

exports.editClinic = async (req, res, next) => {
    try {
        //console.log("HELLO WORLD")
        const { id } = req.params;
        console.log(req.body)
        const { editId, clinicName, ampm, weekday } = req.body;        
        const deleteClinic = await pool.query("UPDATE clinic_source_table SET (clinic_name, am, date) = ($2, $3, $4) WHERE clinic_id=$1", [ editId, clinicName, ampm, weekday ])
        return res.status(201).json({
            success: true,
            message: { editId, clinicName, ampm, weekday }
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: "Server Error"
        });
    }
}

exports.deleteClinic = async (req, res, next) => {
    try {
        //console.log("HELLO WORLD")
        const { id } = req.params;        
        const deleteClinic = await pool.query("DELETE FROM clinic_source_table WHERE clinic_id = $1", [ id ])
        return res.status(201).json({
            success: true,
            message: {id}
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: "Server Error"
        });
    }
}

