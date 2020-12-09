import React, { useState, useEffect } from 'react'
import "../App.css"
//import TimetableEntry from "./timetableEntry.js";



export const DisplayTimeTable = () => {

    
    const [monthArray, setMonthArray] = useState([//initial
        [0,0,0,0,0,0]
    ])
    const [data, setData] = useState([]);

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
                value: new Date().toISOString().split("T")[0]
                //forcing the current date into object even when target is not here
            }
        });
        // eslint-disable-next-line
    }, []);

    return (

        <div>
            <div>
            {navigator.userAgent.indexOf("Firefox") != -1 ?<small style={{color:"red"}}>"The month selection table is not supported in FireFox as in 11/2020. Please select month by typing in manually e.g. 2020-11"<br /></small>:""}
                <input type="month" 
                    id="monthSelector"
                    defaultValue={new Date().toISOString().substring(0, 7)}
                    onChange={changeMonth}>
                </input>
                <button onClick={()=>window.print()}>Print</button>
                <h3 align="center">Roster</h3>
                {/*JSON.stringify(data)*/}
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
                                    {day==0?"":<b>{day}</b>}
                                    <table style={{width: "90%"}}>
                                        <tbody style={{border:'1px solid #d3d3d3'}}>
                                            <tr>
                                                <th className="selectBox">
                                                    am<button className="edit-btn" />
                                                </th>
                                            </tr>
                                            {}
                                            {data.filter(entry => entry.am === true)
                                                .filter(entry => entry.date.split("-")[2] == day).length>0?
                                                [...new Set(data.filter(entry => entry.am === true)
                                                .filter(entry => entry.date.split("-")[2] == day)
                                                .map(entry => entry.clinic))]
                                                .map((clinic, index) =>
                                                    <tr><td key={clinic + week + idx + index + "am"} style={{ minHeight: "50px", overflow: "hidden" }}><span>{clinic}<button className="edit-btn" /></span><br/>
                                                        {
                                                            data.filter(element => element.am === true)
                                                                .filter(element => element.date.split("-")[2] == day)
                                                                .filter(element => element.clinic == clinic)
                                                                .map(element =>
                                                                    <span>{element.doctor}<button className="delete-btn" />, </span>)
                                                        }
                                                    </td></tr>
                                                ):
                                                <tr><td style={{"height": "50px"}}></td></tr>}
                                            <tr>
                                                <th className="selectBox">
                                                    pm<button className="edit-btn" />
                                                </th>
                                            </tr>
                                            {data.filter(entry => entry.am === true)
                                            .filter(entry => entry.date.split("-")[2] == day).length>0?
                                            [...new Set(data.filter(entry => entry.am === false)
                                                .filter(entry => entry.date.split("-")[2] == day)
                                                .map(entry => entry.clinic))]
                                                .map((clinic, index) =>
                                                    <tr><td key={clinic + week + idx + index + "pm"}><span>{clinic}<button className="edit-btn" /></span><br/>
                                                        {
                                                            data.filter(element => element.am === false)
                                                                .filter(element => element.date.split("-")[2] == day)
                                                                .filter(element => element.clinic == clinic)
                                                                .map(element =>
                                                                    <span>{element.doctor}<button className="delete-btn" />, </span>)
                                                        }
                                                    </td></tr>
                                                ):
                                                <tr><td style={{"height": "50px"}}></td></tr>}
                                        </tbody>
                                    </table>
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