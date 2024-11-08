import React, {useState, useEffect} from 'react'

export const DoctorList = ({ sessionIsAdmin, sessionDisplayName }) => {
    const [editId, setEditId] = useState("");
    const [titles, setTitles] = useState([]);
    const [entries, setEntries] = useState([]);
    const [regName, setRegName] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [displayName, setDisplayName] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [prevRegName, setPrevRegName] = useState("");
    const [prevDisplayName, setPrevDisplayName] = useState("");

    const getDoctorList = async () => {
        try {
            const response = await fetch("/api/v1/doctorlist");
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


    const clearForm = () => {
        setEditId("");
        setRegName("");
        setDisplayName("");
        setPassword("");
        setRePassword("");
        setPrevRegName("");
        setPrevDisplayName("");
        setIsAdmin(false);
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        if (editId!==""){
            submitEditDoctor(e);
            return 0;
        }
        try {
            const response = await fetch("/api/v1/doctorlist", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ regName, displayName, password, isAdmin })
            });
            await getDoctorList();
            //console.log(response);
        } catch (err) {
            console.error(err.message);
        }
    }

    const deleteDoctor = async (id) => {
        if (window.confirm("Are you sure you want to delete?")){
            //ask before delete
            try {
                const deleteTodo = await fetch (`/api/v1/doctorlist/${id}`,{
                    method: "DELETE"
                });
                await getDoctorList();
                console.log(deleteTodo);
            } catch (err) {
                console.error(err.message)
            }
        }
    }

    const submitEditDoctor = async (id) => {
        console.log("hello world")
        try {
            const response = await fetch(`/api/v1/doctorlist/${editId}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ regName, displayName, password })
            });
            await getDoctorList();
            //console.log(response);
            clearForm();
        } catch (err) {
            console.error(err.message);
        }

    }

    useEffect(() => {
        getDoctorList();
    }, []);

    if(sessionIsAdmin===true){
    return (
        <div>
            <h4>{editId===""?"Add account (doctor or admin)":"Edit Account Details"}</h4>

            <form onSubmit={onSubmit}>
                <div>
                    <label>Set login name　</label>  
                    <input type="text" value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="input login name"></input> {prevRegName===""?"":` (${prevRegName})`}
                </div>
                <div>
                    <label>Set display name in roster and statistics　</label>  
                    <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="DO NOT input if no show at doctor list"></input> {prevDisplayName===""?"":` (${prevDisplayName})`}
                </div>
                <div>
                    <label>Set password　</label>  
                    <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} ></input>
                </div>
                <div>
                    <label>Type password again　</label>  
                    <input type="text" value={rePassword} onChange={(e) => setRePassword(e.target.value)} ></input>
                </div>
                <div>
                    <label>Admin Role　</label>  
                    <input type="checkbox" value={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} ></input>
                </div>
                    {password===rePassword?
                    <button>Submit</button>:<h6 style={{color: "red"}}>Please type password again</h6>}
                <div>
                {/* regName */ }{/* displayName */}{/* password */}{/* "he is admin " + isAdmin */}<br />
                </div>
            </form>
            <div>Instead of using indexes, the systems were intended to use the exact strings for reporting. Either the doctors wish to have an option deleted but the record remains, or some doctors would have tempers "I do not want to see that name anymore!"</div>
            <br/>
            <div>For an admin name to not show on the doctor selection menu in other pages, enter the display name as "nothing, blank space". As the doctor selection list flatterns the doctor list and removes any blank entry. The same is true for clinic selection list.</div>
            {/* JSON.stringify(entries) */}
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
                            <td key={`${titles[2].name}x2${idx}`} style={{padding: "15px"}}>{entry[`${titles[2].name}`]}</td>
                            <td key={`${titles[3].name}x3${idx}`} style={{padding: "15px"}}>****{/*entry[`${titles[3].name}`]*/}</td>
                            <td key={`${titles[4].name}x4${idx}`} style={{padding: "15px"}}>{entry[`${titles[4].name}`]===true?"true":entry[`${titles[4].name}`]===false?"false":""}</td>
                            {/*<td key={`x4${idx}`} style={{padding: "15px"}} onClick={() => editDoctor(idx)}><button>EDIT</button></td>*/}
                            <td key={`x47${idx}`} style={{padding: "15px"}}>{entry.login_id===30||entry.login_id===32||entry.login_id===33?"":<button onClick={() => deleteDoctor(entry.login_id)}>x</button>}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )} else {
        return <div>Hello {sessionDisplayName}, you have no right to access this page. Please contact the admins for rights.</div>
    }
}

export default DoctorList