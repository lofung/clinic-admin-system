import React, { useState, useEffect } from 'react'
import "../App.css"
import Modal from './editEntryModal'
//import TimetableEntry from "./timetableEntry.js";



export const DisplayTimeTable = ({sessionIsAdmin, sessionDisplayName}) => {

    
    const [monthArray, setMonthArray] = useState([//initial
        [0,0,0,0,0,0]
    ])
    const [data, setData] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [tempData, setTempData] = useState(0);

    
    function doctorDropStart(input) {
        //console.log("drag start " + input.id)
        input.event_id = input.id
        input.doctor = data.filter(entry=>entry.event_id===input.id)[0]['doctor']

        setTempData(input);
    }

    function onDrop(obj) {
        console.log("dropping in " + obj.am + " " + obj.date)
        let tempObj = Object.assign({}, tempData);
        tempObj.am = obj.am
        tempObj.date = obj.date
        tempObj.weight = 1
        if(obj.clinic) {tempObj.clinic = obj.clinic}
        setTempData(tempObj)
        setIsFormOpen(true);
    }

    async function deleteEntry (id) {
        //get id from the object, and then delete things from it
        console.log("we are deleting this entry! " + id);
    }

    
    function pad(n, width, z) { //for padding zeros https://stackoverflow.com/questions/10073699/pad-a-number-with-leading-zeros-in-javascript
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
      }

    function editEntry (obj) {
        //get id from the object, and then recall everything in the form
        //console.log("we are editing this entry! " + JSON.stringify(obj));
        if (obj.id === undefined){
            obj.event_id = "CREATE_NEW_ENTRY";
            console.log("creating entry because no id!!!")
            if (obj.clinic === undefined){
                obj.clinic = ""
            }
            if (obj.doctor === undefined){
                obj.doctor = ""
            }
            if (obj.am === undefined){
                obj.am = ""
            }
            obj.date = document.getElementById("monthSelector").value + "-" + pad(obj.day, 2) //must use pad(X, 2) to pad number to 02 for date to work
            if (obj.weight === undefined){
                obj.weight = 1
            }
        } else {
            obj = data.filter(entry => entry.event_id===obj.id)[0];
        }
        //console.log(obj.date)
        //console.log(typeof obj.date)
        setTempData(obj);
        setIsFormOpen(true);

    }


    async function changeMonth (e) {
        //console.log(e.target.value);
        //console.log(new Date(e.target.value+"-01").getDay());
        let thisMonth = e.target.value.split("-")[1]
        let thisYear = e.target.value.split("-")[0]
        let emptyDays = new Date(thisYear + "-" + thisMonth +"-01").getDay();
        //6-Saturday
        let daysInMonth = new Date(thisYear, thisMonth, 0).getDate();
        //console.log(daysInMonth)
        let tempArray = []
        for (let i=0; i<emptyDays; i++){ tempArray.push(0) }; //add empty days in array
        for (let i=0; i<daysInMonth; i++) { tempArray.push(i+1)}; //add normal days in array
        //console.log(tempArray);
        //console.log(tempArray.slice(0,7));
        let resultArray = [];
        for (let i=0; i<tempArray.length; i=i+7){
            resultArray.push(tempArray.slice(i,i+7));
        }

        //console.log(resultArray);
        setMonthArray(resultArray);
        try {
            const response = await fetch(`/api/v1/?query=${thisYear}-${thisMonth}`);
            const answer = await response.json();
            //console.log(answer);
            if (answer){
                setData(answer.rows)
            }

        } catch (err) {
            console.error(err.message);
        }
    }

    useEffect(() =>{
        changeMonth({
            target:{
                value: new Date(2020, 11, 1).toISOString().split("T")[0]
                //forcing the current date into object even when target is not here
                //bad pracitse, but deal with it!!
                //if you call changeMonth must add this line,
                //or otherwise you can copy below in modal
            }
        });
        // eslint-disable-next-line
    }, []);

    return (
        <div>
            {/*sessionDisplayName} admin? {/*sessionIsAdmin?"true":"false"*/}{/*JSON.stringify(data)*/}{/*JSON.stringify(tempData)*/}
            <Modal data={tempData} open={isFormOpen} onClose={() => {setIsFormOpen(false); setTempData({}); 
                changeMonth({target:{value: document.getElementById('monthSelector').value
                        //forcing the current date into object even when target is not here
                    }
                })}} />
            <div>
            {navigator.userAgent.indexOf("Firefox") != -1 ?<small style={{color:"red"}}>"The month selection table is not supported in FireFox as in 11/2020. Please select month by typing in manually e.g. 2020-11"<br /></small>:""}
                <input type="month" 
                    id="monthSelector"
                    defaultValue={new Date(2020, 11, 1).toISOString().substring(0, 7)}
                    onChange={changeMonth}>
                </input>
                <button onClick={()=>window.print()}>Print</button>
                <h3 align="center">Roster</h3>
                {/* JSON.stringify(data) */}
                {/*Array.isArray(data)?"true":"false"*/}
                <br />
                {/* load warning signal for firefix, since does not have feature for monthy selector */}
                
            </div>
            <br />
            <div style={{margin: 'auto'}}>
                <table style={{width: '100%'}}>
                    <thead id="tableHead">
                        <tr>
                            <th style={{width: "14%"}}>Sunday</th>
                            <th style={{width: "14%"}}>Monday</th>
                            <th style={{width: "14%"}}>Tuesday</th>
                            <th style={{width: "14%"}}>Wednesday</th>
                            <th style={{width: "14%"}}>Thursday</th>
                            <th style={{width: "14%"}}>Friday</th>
                            <th style={{width: "14%"}}>Saturday</th>
                        </tr>
                    </thead>
                    <tbody>
                    {monthArray.map((week, idx) => 
                        <tr key={week + idx}>
                            {week.map((day) => 
                                <td style={{"verticalAlign": "top"}}>
                                    {day==0?"":<><b>{day}</b>
                                    <table style={{width: "90%"}}>
                                        <tbody style={{border:'1px solid #d3d3d3'}}>
                                            <tr>
                                                <th className="selectBox" onDrop={()=>onDrop({"am": true, "date":document.getElementById("monthSelector").value + "-" + pad(day, 2)})} onDragOver={(e)=>e.preventDefault()} onDragEnter={(e)=>e.preventDefault()}>
                                                    am<button onClick={() => editEntry({day, "am": true})}  className="edit-btn" />
                                                </th>
                                            </tr>
                                            {}
                                            {data.filter(entry => entry.am === true)
                                                .filter(entry => entry.date.split("-")[2] == day).length>0?
                                                [...new Set(data.filter(entry => entry.am === true)
                                                .filter(entry => entry.date.split("-")[2] == day)
                                                .map(entry => entry.clinic))]
                                                .map((clinic, index) =>
                                                    <tr><td key={clinic + week + idx + index + "am"} style={{ minHeight: "50px", overflow: "hidden" }}><span onDrop={()=>onDrop({"am": true, "clinic": clinic,"date":document.getElementById("monthSelector").value + "-" + pad(day, 2)})}  onDragOver={(e)=>e.preventDefault()} onDragEnter={(e)=>e.preventDefault()}>{clinic}<button className="edit-btn"  onClick={() => editEntry({day, "am": true, clinic})}  /></span><br/>
                                                        {
                                                            data.filter(element => element.am === true)
                                                                .filter(element => element.date.split("-")[2] == day)
                                                                .filter(element => element.clinic == clinic)
                                                                .map(element =>
                                                                    <span draggable="true" onDragStart={() => doctorDropStart({id: element.event_id})}>{element.doctor}, <button onClick={() => editEntry({id: element.event_id})} className="edit-btn" /><button onClick={() => deleteEntry(element.event_id)} className="delete-btn right-btn" /></span>)
                                                        }
                                                    </td></tr>
                                                ):
                                                <tr><td style={{"height": "50px"}}></td></tr>}
                                            <tr>
                                                <th className="selectBox" onDrop={()=>onDrop({"am": false, "date":document.getElementById("monthSelector").value + "-" + pad(day, 2)})}  onDragOver={(e)=>e.preventDefault()} onDragEnter={(e)=>e.preventDefault()}>
                                                    pm<button onClick={() => editEntry({day, "am": false})} className="edit-btn" />
                                                </th>
                                            </tr>
                                            {data.filter(entry => entry.am === false)
                                            .filter(entry => entry.date.split("-")[2] == day).length>0?
                                            [...new Set(data.filter(entry => entry.am === false)
                                                .filter(entry => entry.date.split("-")[2] == day)
                                                .map(entry => entry.clinic))]
                                                .map((clinic, index) =>
                                                    <tr><td key={clinic + week + idx + index + "pm"}><span onDrop={()=>onDrop({"am": false, "clinic": clinic,"date":document.getElementById("monthSelector").value + "-" + pad(day, 2)})}  onDragOver={(e)=>e.preventDefault()} onDragEnter={(e)=>e.preventDefault()}>{clinic}<button onClick={() => editEntry({day, "am": false, clinic})}  className="edit-btn" /></span><br/>
                                                        {
                                                            data.filter(element => element.am === false)
                                                                .filter(element => element.date.split("-")[2] == day)
                                                                .filter(element => element.clinic == clinic)
                                                                .map(element =>
                                                                    <span draggable="true" onDragStart={() => doctorDropStart({id: element.event_id})}>{element.doctor}, <button onClick={() => editEntry({id: element.event_id})} className="edit-btn" /><button onClick={() => deleteEntry(element.event_id)} className="delete-btn right-btn" /></span>)
                                                        }
                                                    </td></tr>
                                                ):
                                                <tr><td style={{"height": "50px"}}></td></tr>}
                                        </tbody>
                                    </table></>}
                                </td>
                            )}
                        </tr>
                    )}</tbody>
                </table>
            </div>
        </div>

    )
}

export default DisplayTimeTable