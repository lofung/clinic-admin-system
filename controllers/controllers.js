const EntrySchema = require('../models/entries');
const pool = require("../config/elephantsql");
const bcrypt = require("bcryptjs");

//@DESC     Get all entries
//@route    GET /api/v1/
//@access   Public

exports.getEntries = async (req, res, next) => {
    try {
        let query = null;
        let start = null;
        let end = null;
        console.log(req.query)
        if (req.query.query) { query = req.query.query}
        if (req.query.start) { start = req.query.start}
        if (req.query.end) { end = req.query.end}
        console.log({ start, end, query });

        if (start && end){
            start = `${start}-01`;
            end = new Date(end.split("-")[0], end.split("-")[1], 1).toISOString().split("T")[0];
        }

        if (query){
            //console.log("triggered if query")
            start = `${query}-01`;
            //console.log(query);
            end = new Date(query.split("-")[0], query.split("-")[1], 1).toISOString().split("T")[0];
            //toISOString() has weird behaviour. the current setting will give last date of month.
            //console.log(end)
        }

        console.log({ start, end, query });

        let result;
        //console.log({ start, end, query });
        if (start && end) {
            //console.log("triggered to run start && end")
            result = await pool.query("SELECT *, date::text FROM clinic_time_table WHERE date BETWEEN $1 AND $2", [start.toString(), end.toString()]);
        } else {
            //console.log("full query")
            result = await pool.query("SELECT * FROM clinic_time_table");
        }
        //console.log(result.rows);
        res.json(result);
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
    //const response = await fetch(`/event/${data.event_id}`, {
    //body: JSON.stringify({ "id": data.entry_id, doctor, clinic, date, am, weight })
    //console.log("HELLO WORLD edit entry")
    const { id, doctor, clinic, date, am, weight } = req.body;
    console.log("sent data into backend is " + id + " " + doctor + " " + clinic + " " + date + " " + am + " " + weight);
    if (id =="CREATE_NEW_ENTRY") {
        console.log("ID is create new entry, now create new entry");
        try {
            console.log("new entry is created")
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
    } else { //THIS IS THE REAL UPDATE PART
        try {
            console.log("new entry is updated")
            console.log(req.body)
            const { id, doctor, clinic, date, am, weight } = req.body;
            const entry = await pool.query("UPDATE clinic_time_table SET (clinic, doctor, am, date, weight) = ($1, $2, $3, $4, $5) WHERE (event_id) = ($6)",
            [clinic, doctor, am, date, weight, id]);
            //id is at the END!!!!!!!! care!!!!!!!!
        
            return res.status(201).json({
                success: true,
                data: {clinic, doctor, am, date, weight, id, weight}
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
        //console.log(doctorList)
        res.json(doctorList);
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: "Server Error"
        });
    }
}


exports.addDoctor = async (req, res, next) => {
    console.log(req.body);
    const { regName, displayName, password, isAdmin } = req.body;

    bcrypt.genSalt(10, (err, salt) => 
            bcrypt.hash(password, salt, async (err, hash)=> {
                if(err) throw err;
                //console.log(hash)
                //console.log("login ID is " + regName + "!! name is " + displayName + "!! hashpassword is " + hash + " admin is " + isAdmin)
                //console.log(hash.length)
                try {
                    const newDoctor = await pool.query("INSERT INTO login_table (login_name, doc_name, password, is_Admin) VALUES ($1, $2, $3, $4)",
                    [regName, displayName, hash, isAdmin])
                    return res.status(201).json({
                        success: true,
                        message: {regName, displayName, isAdmin}
                    })
                } catch (err) {
                    return res.status(500).json({
                        success: false,
                        error: "Server Error, can retrieve register draft but cannot register"
                    });
                }
        }))
}

exports.editDoctor = async (req, res, next) => {
    try {
        //console.log("HELLO WORLD edit doctor")
        const { id } = req.params;
        //console.log(req.body)
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
        //console.log(req.body)
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

