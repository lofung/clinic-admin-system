import React, {useState, useEffect} from 'react'

export const Statistics = () => {
    const [clinicArray, setClinicArray] = useState(["", "A","B","C","D","E","F"])
    const [drArray, setDrArray] =  useState(["dr1", "dr2", "dr3", "dr4", "dr5"])
    const [data, setData] = useState([]);

    async function loadData () {
        let startMonth = document.getElementById("startMonthSelector").value;
        let endMonth = document.getElementById("endMonthSelector").value;
        console.log(startMonth);
        console.log(endMonth);
        try {
            const response = await fetch(`/api/v1/?start=${startMonth}&end=${endMonth}`);
            const answer = await response.json();
            //console.log(answer);
            setData(answer.rows);
            setDrArray([...new Set(answer.rows.map(entry=>entry.doctor))].sort())
            setClinicArray([...new Set(answer.rows.map(entry=>entry.clinic))].sort())
        } catch (err) {
            console.error(err.message);
        }
    }

    function getWeekDate (date) {
        let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[date.getDay()];
    }

    useEffect(() =>{
        loadData();
        // eslint-disable-next-line
    }, []);

    

    return (
        <div>
            <style type="text/css">
                {"@media print{@page {size: landscape}}"}
            </style>
            <div width="100%">
            {navigator.userAgent.indexOf("Firefox") != -1 ?<small style={{color:"red"}}>"The month selection table is not supported in FireFox as in 11/2020. Please select month by typing in manually e.g. 2020-11"<br /></small>:""}
                <input type="month" 
                    id="startMonthSelector"
                    defaultValue={new Date().toISOString().substring(0, 7)}
                    onChange={loadData}>
                </input>
                <button onClick={()=>window.print()}>Print</button>

                <input type="month" 
                id="endMonthSelector"
                defaultValue={new Date().toISOString().substring(0, 7)}
                style={{"float": "right"}}
                onChange={loadData}> 
                </input>{/*this make the box on the right*/}
            </div>
            <h3 align="center">Statistics</h3>
            <br />
            <table id="statTable">
                <thead>
                    <tr>
                        <th style={{"width":"12%", "height": "40px"}} ></th>
                    {clinicArray.map((clinic, idx) => (
                        <th style={{"width":"10%"}} key={clinic+"xy"+idx}>{clinic}</th>
                    ))}
                    </tr>
                </thead>
                <tbody>
                {drArray.map((dr, indexx) =>(
                    <tr key={dr+"xyz"+indexx}>
                        <th>{dr}</th>
                        {clinicArray.map((clinic, index) =>(
                            <td style={{"minWidth":"50px", "height": "40px"}} key={clinic+"xy"+index}  className="selectBox">
                                {data.filter(entry => entry.clinic ==clinic)
                                    .filter(entry=>entry.doctor==dr)
                                    .reduce((acc, curr) => {return acc+curr.weight}, 0)}
                                <span className="tooltiptext">
                                        {clinic} {dr}
                                        {data.filter(entry => entry.clinic ==clinic)
                                        .filter(entry=>entry.doctor==dr)
                                        .map(entry => <div>{entry.date} {getWeekDate(new Date(entry.date))}</div> )}
                                </span>
                             </td>
                        ))}
                        <td style={{"width":"10%", "borderWidth":"1px 1px 1px 3px","borderStyle":"ridge"}}>
                            {data.filter(entry=>entry.doctor==dr)
                                .reduce((acc, curr) => {return acc+curr.weight}, 0)}
                        </td>
                    </tr>
                ))}
                    <tr>
                        <td style={{"borderStyle":"none"}}></td>
                    {clinicArray.map((clinic, idx) => (
                        <td key={clinic+"x"+idx}
                        style={{"borderWidth":"3px 1px 1px 1px","borderStyle":"ridge"}}>{data.filter(entry=>entry.clinic==clinic)
                                .reduce((acc, curr) => {return acc+curr.weight}, 0)}</td>
                    ))}
                    </tr>
                </tbody>

            </table>
        {/*JSON.stringify(data) */} 
        {/* JSON.stringify(drArray) */}                   
        </div>
    )
}

export default Statistics