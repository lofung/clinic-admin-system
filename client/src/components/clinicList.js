import React, {useState, useEffect} from 'react'

export const ClinicList = ({ sessionIsAdmin, sessionDisplayName }) => {
    const [editId, setEditId] = useState("");
    const [titles, setTitles] = useState([]);
    const [entries, setEntries] = useState([]);
    const [clinicName, setClinicName] = useState("");
    const [ampm, setAmpm] = useState("");
    const [weekday, setWeekday] = useState("Monday");
    const [prevClinicName, setPrevClinicName] = useState("");
    const [prevAmpm, setPrevAmpm] = useState("");
    const [prevWeekday, setPrevWeekday] = useState("");


    const getClinicList = async () => {
        try {
            const response = await fetch("/api/v1/cliniclist");
            const jsonData = await response.json();
            //console.log(jsonData);
            setTitles(jsonData.fields);
            setEntries(jsonData.rows);
            //console.log(titles);
            //console.log("get clinic test list");
            //console.log(entries);
        } catch (err) {
            console.error(err.message);
        }
    }

    const clearForm = () => {
        setEditId("");
        setClinicName("");
        setAmpm("");
        setWeekday("Monday");
        setPrevClinicName("");
        setPrevAmpm("");
        setPrevWeekday("");
        document.getElementById('buttonAM').checked = false;
        document.getElementById('buttonPM').checked = false;
    }

    
    useEffect(getClinicList, []);

    const onSubmit = async (e) => {
        //console.log("ampm is " + ampm)
        e.preventDefault();
        if (editId!==""){
            onSubmitEdit(e);
            return 0;
        }
        try {
            const response = await fetch("/api/v1/cliniclist", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ clinicName, ampm, weekday })
            });
            await getClinicList();
            //console.log(response);
            clearForm();
        } catch (err) {
            console.error(err.message);
        }
    }

    const onSubmitEdit = async (e) => {
        e.preventDefault();
        //console.log("on submit edit")
        //console.log("ampm is " + ampm)
        try {
            const response = await fetch(`/api/v1/cliniclist/${editId}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ editId, clinicName, ampm, weekday })
            });
            await getClinicList();
            //console.log(response);
            clearForm();
        } catch (err) {
            console.error(err.message);
        }
    }

    const deleteClinic = async (id) => {
        if (window.confirm("Are you sure you want to delete?")){
            //ask before delete
            try {
                const deleteTodo = await fetch (`/api/v1/cliniclist/${id}`,{
                    method: "DELETE"
                });
                await getClinicList();
                //console.log(deleteTodo);
            } catch (err) {
                console.error(err.message)
            }
        }
    }

    if (sessionIsAdmin===true){
    return (
        <div>
            <h4>{editId===""?"Add clinic":"Edit Clinic Entry"}</h4>
            {editId===""?"":<button onClick={clearForm}>Add new clinic / clear form</button>}<br />
            {editId===""?"":`Change entry ${editId}`}

            <form onSubmit={onSubmit}>
                <div>
                    <label>Set clinic name　</label>
                    <input type="text" value={clinicName} onChange={(e) => setClinicName(e.target.value)} list="clinicList" placeholder="select from below OR type new clinic name"></input>
                    {prevClinicName?` (${prevClinicName})`:""}
                    <datalist id="clinicList">
                        {entries.map((data, idx ) => (
                            <option key={`${data.clinic_name}ak47${idx}`} value={data.clinic_name}>{data.clinic_name}</option>
                        ))}
                    </datalist>
                </div>
                <div>
                    <label>Set week day　</label>  
                    <select name="weekday" onChange={(e) => setWeekday(e.target.value)}>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="-----" disabled>--------</option>
                        <option value="Saturday" style={{color: "blue"}}>Saturday</option>
                        <option value="Sunday" style={{color: "red"}}>Sunday</option>
                    </select>
                    {prevWeekday?` (${prevWeekday})`:""}
                </div>
                <div>
                    <label>　AM　</label>  
                    <input id="buttonAM" type="radio" value="AM" name="ampm" onChange={(e) => setAmpm(true)}/>
                    <label>　PM　</label>  
                    <input id="buttonPM" type="radio" value="PM" name="ampm" onChange={(e) => setAmpm(false)}/>
                    {prevAmpm?` (${prevAmpm?"AM":"PM"})`:""}
                </div>
                    <button>Submit</button>
                <div>
                {/* weekday */}
                {ampm===true?"true":ampm===false?"false":"null"}
                {/* password */}
                </div>
            </form>

            <br />
            <br />
            <h4>Current list</h4>
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
                            <td key={`${titles[2].name}x2${idx}`} style={{padding: "15px"}}>{entry[`${titles[2].name}`]===true?"am":entry[`${titles[2].name}`]===false?"pm":""}</td>
                            <td key={`${titles[3].name}x3${idx}`} style={{padding: "15px"}}>{entry[`${titles[3].name}`]}</td>
                            {/*<td key={`${titles[3].name}edit${idx}`} style={{padding: "15px"}} onClick={() => editClinic(idx)}><button>EDIT</button></td>*/}
                            <td key={`${titles[3].name}gx4${idx}`} style={{padding: "15px"}} onClick={() => deleteClinic(entry.clinic_id)}><button>x</button></td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )} else {
        return <div>Hello {sessionDisplayName}, you have no right to access this page. Please contact the admins for rights.</div>
    }
}

export default ClinicList