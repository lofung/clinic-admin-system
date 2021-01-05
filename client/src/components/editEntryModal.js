import React, { useState, useEffect } from 'react'
import ReactDom from 'react-dom'
import './overlay.css';

export default function Modal({ open, data, onClose }) {
    const [doctorList, setDoctorList] = useState([]);
    const [clinicList, setClinicList] = useState([]);
    const [id, setId] = useState("");
    const [doctor, setDoctor] = useState("");
    const [clinic, setClinic] = useState("");
    const [date, setDate] = useState("");
    const [ampm, setAmpm] = useState("");
    const [error, setError] = useState("");
    const [weight, setWeight] = useState("");

    const getDoctorList = async () => {
        try {
            const response = await fetch("/api/v1/doctorlist");
            const jsonData = await response.json();
            //console.log(jsonData);
            //setDoctorTable(jsonData.rows);
            //console.log(titles);
            //console.log(entries);
            setDoctorList(getColNoRepeat(jsonData.rows, "doc_name"));
        } catch (err) {
            console.error(err.message);
        }
    }

    const getClinicList = async () => {
        try {
            const response = await fetch("/api/v1/cliniclist");
            const jsonData = await response.json();
            //console.log(jsonData);
            //setClinicTable(jsonData.rows);
            //console.log(titles);
            //console.log("get clinic test list");
            //console.log(entries);
            setClinicList(getColNoRepeat(jsonData.rows, "clinic_name"));
        } catch (err) {
            console.error(err.message);
        }
    }

    function getColNoRepeat(matrix, col) {
        let column = [];
        for (let i = 0; i < matrix.length; i++) {
            column.push(matrix[i][col])
        }
        //flattern array
        column = [...new Set(column)];
        column = column.filter(function (el) {
            return el != "";
        })
        return column
        //return unique values
    }

    const onSubmit = () => {
        //e.preventDefault(); cannot prevent default!!
        //console.log("ampm is " + ampm)
        var am;
        if (ampm == "am") {am = true}
        else if (ampm == "pm") {am = false}
        else {setError("ampm value is invalid");return 1;}
        //console.log("data here is " + { "id": data.entry_id, doctor, clinic, date, am, weight})
        //alert(id)
        if (id==undefined) { setId("CREATE_NEW_ENTRY")}
        if (weight==undefined || weight=="") { setWeight(1) }
        const newEntry = {
            id,
            doctor,
            clinic,
            date,
            am,
            weight
        }
        //console.log("new entry is " + JSON.stringify(newEntry))
        onSubmitEdit(newEntry);
        return 0;
    }
    
    const onSubmitEdit = async (entry) => {
        //const { id } = req.params;
        //console.log(req.body)
        //const { regName, displayName, password } = req.body;
        //console.log("on submit edit")

        try {
            const response = await fetch(`/api/v1/event/${data.event_id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(entry)
            });
            closeWindow();
            //console.log(response);
            //clearForm(); what is this????
        } catch (err) {
            console.error(err.message);
        }
    }

    const closeWindow = () => {
        onClose();
        setDoctorList([]);
        setClinicList([]);
        setDoctor("");
        setClinic("");
        setDate("");
        setAmpm("");
        setError("");
        setWeight("");
        setId("");
    }

    useEffect(() => {
        //get possible doctor and clinic list
        getDoctorList();
        getClinicList();
        //console.log(data)
        setDoctor(data.doctor)
        //if(data.doctor) {document.getElementById("doctorSelect").value = data.doctor};
        setClinic(data.clinic)
        //if(data.clinic) {document.getElementById("clinicSelect").value = data.clinic};
        setDate(data.date)
        setWeight(data.weight)
        setId(data.event_id)
        if (data.am == true) { setAmpm("am"); document.editForm.ampm.value = "am"}
        if (data.am == false) { setAmpm("pm"); document.editForm.ampm.value = "pm"}
    }, [data]);



    if (!open) { return null }

    else {
        return ReactDom.createPortal(
            <>
                <div className="overlay" />
                <div className="formStyle">
                    {/* JSON.stringify(data)*/}
                    <form name="editForm" onSubmit={onSubmit}>
                        <div>
                            <label>Entry ID　</label>
                            <input id="idSelect" disabled value={data.event_id}></input>
                        </div>
                        <div>
                            <label>Doctor　</label>
                            <select id="doctorSelect" value={doctor} onChange={(e) => setDoctor(e.target.value)} required>
                                <option selected="true" disabled="disabled" value="">Select Doctor</option>
                                {doctorList.map((data, idx) => (
                                    <option key={`${data}ak47${idx}`} value={data}>{data}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Clinic　</label>
                            <select id="clinicSelect" value={clinic} onChange={(e) => setClinic(e.target.value)} required>
                                <option selected="true" disabled="disabled" value="">Select Clinic</option>
                                {clinicList.map((data, idx) => (
                                    <option key={`${data}ak47c${idx}`} value={data}>{data}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Date　</label>
                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required></input>
                        </div>
                        <div>
                            <label>　AM　</label>
                            <input type="radio" id="am" name="ampm" value="am" onChange={() => setAmpm("am")}></input>
                            <label>　PM　</label>
                            <input type="radio" id="pm" name="ampm" value="pm" onChange={() => setAmpm("pm")}></input>
                        </div>
                        <div>
                            <label>Weight　</label>
                            <input type="number" step="0.01" id="weightSelect" value={weight} onChange={(e) => setWeight(e.target.value)} defaultValue={data.weight}></input>
                        </div>
                        <button>Submit</button>
                        <div>
                            {error}<br />
                        </div>
                    </form>
                    <button className="cancel" onClick={() => closeWindow()}>cancel</button>
                </div>
            </>,
            document.getElementById('portal')
        )
    }
}
