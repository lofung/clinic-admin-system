import React, {Component, useState, useEffect} from 'react'
import axios from "axios"

export const CreateEntry = () => {
    const [doctorTable, setDoctorTable] = useState("");
    const [clinicTable, setClinicTable] = useState("");
    const [doctorList, setDoctorList] = useState([]);
    const [clinicList, setClinicList] = useState([]);
    const [titles, setTitles] = useState([]);
    const [entries, setEntries] = useState([]);
    const [doctor, setDoctor] = useState("");
    const [clinic, setClinic] = useState("");
    const [date, setDate] = useState("");
    const [ampm, setAmpm] = useState("");
    const [error, setError] = useState("");
    const onSubmit = (e) => {
        e.preventDefault();
        const newEntry = {
            doctor,
            clinic,
            date,
            am: ampm=="am"?true:false
        }
        addEntries(newEntry);
        return 0;
    }

    const getEventList = async () => {
        try {
            const response = await fetch("/api/v1/");
            const jsonData = await response.json();
            console.log(jsonData);
            setTitles(jsonData.data.fields);
            setEntries(jsonData.data.rows);
            //console.log(titles);
            //console.log(entries);
        } catch (err) {
            console.error(err.message);
        }
    }

    function getColNoRepeat(matrix, col){
        let column = [];
        for (let i=0; i<matrix.length; i++){
            column.push(matrix[i][col])
        }
        //flattern array
        column = [... new Set(column)];
        column = column.filter(function (el){
            return el!="";
        })
        return column
        //return unique values
    }

    async function addEntries(newEntry) {
        const config = {
            headers: {
                'Content-Type': "application/json"
            }
        }
        try {
            const res = await axios.post('/api/v1/', newEntry, config);
            console.log(res) //new object from post
            setError("SUCCESS")
            //1:03:37 EXPRESS API
            getEventList();
        } catch (err) {
            console.log(err.response.data.error);
            console.log("SEND ERROR");
            setError(err.response.data.error)
        }
    }

    const editEntry = async (e) => {
        console.log("hello edit doctor did not write yet")
    }

    const deleteEntry = async(id) => {
        if (window.confirm("Are you sure you want to delete?")){
            //ask before delete
            try {
                const deleteTodo = await fetch (`/api/v1/event/${id}`,{
                    method: "DELETE"
                });
                await getEventList();
                console.log(deleteTodo);
            } catch (err) {
                console.error(err.message)
            }
        }
    }

    const getDoctorList = async () => {
        try {
            const response = await fetch("/api/v1/doctorlist");
            const jsonData = await response.json();
            //console.log(jsonData);
            setDoctorTable(jsonData.rows);
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
            setClinicTable(jsonData.rows);
            //console.log(titles);
            //console.log("get clinic test list");
            //console.log(entries);
            setClinicList(getColNoRepeat(jsonData.rows, "clinic_name"));
        } catch (err) {
            console.error(err.message);
        }
    }

    useEffect(() => {
        getDoctorList();
        getClinicList();
        getEventList();
        //console.log(doctorTable);
        //console.log(clinicTable);
    }, []);

    return (
        <div>
            <form onSubmit={onSubmit}>
                <div>
                    <label>Doctor　</label>  
                    <select value={doctor} onChange={(e) => setDoctor(e.target.value)} required>
                        <option selected="true" disabled="disabled" value="">Select Doctor</option>
                        {doctorList.map((data, idx ) => (
                            <option key={`${data}ak47${idx}`} value={data}>{data}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Clinic　</label>  
                    <select value={clinic} onChange={(e) => setClinic(e.target.value)} required>
                    <option selected="true" disabled="disabled" value="">Select Clinic</option>
                        {clinicList.map((data, idx ) => (
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
                    <input type="radio" name="ampm" value="am" onChange={() => setAmpm("am")}></input>
                    <label>　PM　</label>  
                    <input type="radio" name="ampm" value="pm" onChange={() => setAmpm("pm")}></input>
                </div>
                    <button>Submit</button>
                <div>
                {/*JSON.stringify(doctorList)*/}<br />
                {/*JSON.stringify(clinicList)*/}<br />
                {/* date */}<br />
                {/* ampm */}<br />
                {error}<br />
                </div>
            </form>
            
            <table>
                <thead>
                    <tr>
                        {titles.map((title, idx) => 
                            <th key={`${title.name}`} style={{padding: "15px"}}>{title.name}</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {entries.map((entry, idx) => 
                        <tr key={`x4${idx}`}>
                            <td key={`${titles[0].name}x0${idx}`} style={{padding: "15px"}}>{entry[`${titles[0].name}`]}</td>
                            <td key={`${titles[1].name}x1${idx}`} style={{padding: "15px"}}>{entry[`${titles[1].name}`]}</td>
                            <td key={`${titles[2].name}x2${idx}`} style={{padding: "15px"}}>{entry[`${titles[2].name}`]}</td>
                            <td key={`${titles[3].name}x3${idx}`} style={{padding: "15px"}}>{entry[`${titles[3].name}`]===true?"am":entry[`${titles[3].name}`]===false?"pm":""}</td>
                            <td key={`${titles[4].name}x4${idx}`} style={{padding: "15px"}}>{entry[`${titles[4].name}`].split("T", 1)}</td>
                            <td key={`${titles[5].name}x5${idx}`} style={{padding: "15px"}}>{entry[`${titles[5].name}`]}</td>
                            <td key={`x4${idx}`} style={{padding: "15px"}} onClick={() => editEntry(idx)}><button>EDIT</button></td>
                            <td key={`x47${idx}`} style={{padding: "15px"}} onClick={() => deleteEntry(entry.event_id)}><button>x</button></td>
                        </tr>
                    )}
                </tbody>
            </table>

        </div>
    )
}

export default CreateEntry