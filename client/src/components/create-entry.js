import React, {useState, useEffect} from 'react'
import axios from "axios"

export const CreateEntry = ({ sessionIsAdmin, sessionDisplayName }) => {
    const [doctorList, setDoctorList] = useState([]);
    const [clinicList, setClinicList] = useState([]);
    const [titles, setTitles] = useState([]);
    const [entries, setEntries] = useState([]);
    const [id, setId] = useState("CREATE_NEW_ENTRY");
    const [doctor, setDoctor] = useState("");
    const [clinic, setClinic] = useState("");
    const [date, setDate] = useState("");
    const [ampm, setAmpm] = useState("");
    const [weight, setWeight] = useState(1);
    const [error, setError] = useState("");
    const onSubmit = (e) => {
        e.preventDefault();
        const newEntry = {
            id,
            doctor,
            clinic,
            date,
            am: ampm=="am"?true:false,
            weight
        }
        if (id==="CREATE_NEW_ENTRY") {addEntries(newEntry)}
        else {goToEditEntry(newEntry)};
        return 0;
    }

    const getEventList = async () => {
        try {
            const response = await fetch("/api/v1/");
            const jsonData = await response.json();
            //console.log(jsonData);
            setTitles(jsonData.fields);
            setEntries(jsonData.rows);
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
        column = [...new Set(column)];
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
            //console.log(res) //new object from post
            setError("SUCCESS")
            //1:03:37 EXPRESS API
            getEventList();
            closeWindow();
        } catch (err) {
            console.log(err.response.data.error);
            console.log("SEND ERROR");
            setError(err.response.data.error)
        }
    }

    const goToEditEntry = () => {
        //e.preventDefault(); cannot prevent default!!
        //console.log("ampm is " + ampm)
        var am;
        if (ampm == "am") {am = true}
        else if (ampm == "pm") {am = false}
        else {setError("ampm value is invalid");return 1;}
        //console.log("data here is " + { id, doctor, clinic, date, am, weight})
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
            const response = await fetch(`/api/v1/event/${id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(entry)
            });
            getEventList();
            closeWindow();
            //console.log(response);
            //clearForm(); what is this????
        } catch (err) {
            console.error(err.message);
        }
    }

    async function editEntry(id) {
        setId(id);
        setDoctor(entries[id]["doctor"]);
        //console.log(entries[id]["doctor"])
        setClinic(entries[id]["clinic"]);
        setDate(entries[id]["date"].split("T")[0]);
        setWeight(entries[id]["weight"])
        if (entries[id]["am"] == true) { setAmpm("am"); document.editForm.ampm.value = "am"}
        if (entries[id]["am"] == false) { setAmpm("pm"); document.editForm.ampm.value = "pm"}
    }

    const deleteEntry = async(id) => {
        if (window.confirm("Are you sure you want to delete?")){
            //ask before delete
            try {
                const deleteTodo = await fetch (`/api/v1/event/${id}`,{
                    method: "DELETE"
                });
                await getEventList();
                //console.log(deleteTodo);
            } catch (err) {
                console.error(err.message)
            }
        }
    }

    const addDateByOne = (date) => {
        //very string behaviour by javascript
        //one day off and i do not even know why
        let answer = date.split("T")[0];
        answer = new Date(answer);
        answer.setDate(answer.getDate()+1);
        //console.log(answer)
        return answer.toISOString().split("T")[0]
    }

    const getDoctorList = async () => {
        try {
            const response = await fetch("/api/v1/doctorlist");
            const jsonData = await response.json();
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
            //console.log(titles);
            //console.log("get clinic test list");
            //console.log(entries);
            setClinicList(getColNoRepeat(jsonData.rows, "clinic_name"));
        } catch (err) {
            console.error(err.message);
        }
    }

    const closeWindow = () => {
        setDoctor("");
        setClinic("");
        setDate("");
        setAmpm("");
        setError("");
        setWeight("");
        setId("");
    }

    useEffect(() => {
        //console.log("this is admin " +sessionIsAdmin);
        //console.log("this is display name " +sessionDisplayName)
        getDoctorList();
        getClinicList();
        getEventList();
        //console.log(doctorTable);
        //console.log(clinicTable);
    }, []);
    
    if (sessionIsAdmin === true) {
    return (
        <div>
            {/* JSON.stringify(entries) */}{/*sessionIsAdmin}{sessionDisplayName*/}
            <form name="editForm" onSubmit={onSubmit}>
                <div>
                    <div>
                        <label>Entry ID　</label>
                        <input id="idSelect" disabled value={id}></input>
                    </div>
                    <label>Doctor　{doctor}</label>  
                    <select id="chooseDoctor" value={doctor} onChange={(e) => setDoctor(e.target.value)} required>
                        <option id="disabledDoctor" selected="true" disabled="disabled" value="">Select Doctor</option>
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
                    <input id="am" type="radio" name="ampm" value="am" onChange={() => setAmpm("am")}></input>
                    <label>　PM　</label>  
                    <input id="pm" type="radio" name="ampm" value="pm" onChange={() => setAmpm("pm")}></input>
                </div>
                <div>
                    <label>Weight　</label>
                    <input type="number" step="0.01" id="weightSelect" value={weight} onChange={(e) => setWeight(e.target.value)}></input>
                </div>
                    <button>Submit</button>
                <div>
                {id==="CREATE_NEW_ENTRY"?"":<button onClick={() => setId("CREATE_NEW_ENTRY") }>Switch to entry creation</button>}
                {/*JSON.stringify(doctorList)*/}{/*JSON.stringify(clinicList)*/}{/*date*/}{/* ampm */}{/*error*/}<br />
                </div>
            </form>
            {error?error:""}
            
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
                            <td key={`${titles[4].name}x4${idx}`} style={{padding: "15px"}}>{addDateByOne(entry[`${titles[4].name}`])}</td>
                            <td key={`${titles[5].name}x5${idx}`} style={{padding: "15px"}}>{entry[`${titles[5].name}`]}</td>
                            <td key={`x4${idx}`} style={{padding: "15px"}} onClick={() => editEntry(entry.event_id)}><button>EDIT</button></td>
                            <td key={`x47${idx}`} style={{padding: "15px"}} onClick={() => deleteEntry(entry.event_id)}><button>x</button></td>
                        </tr>
                    )}
                </tbody>
            </table>

        </div>
    )} else {
        return <div>Hello {sessionDisplayName}, you have no right to access this page. Please contact the admins for rights.</div>
    }
}

export default CreateEntry