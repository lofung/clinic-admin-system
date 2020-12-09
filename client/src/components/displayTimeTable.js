import React, { useState, useEffect ,Component } from 'react'
import axios from "axios";

export const DisplayTimeTable = () => {
    const changeMonth = (e) => {
        //console.log(e.target.value);
        //console.log(new Date(e.target.value+"-01").getDay());
        let emptyDays = new Date(e.target.value+"-01").getDay();
        //6-Saturday
        let daysInMonth = new Date(e.target.value.split("-")[0], e.target.value.split("-")[1], 0).getDate();
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
    }

    async function getEntries() {
        try {
            const res = await axios.get('/api/v1/');

            setData(res.data.data);
        } catch (err) {
            console.log(err.response.data.error);
        }
    }

    const [monthArray, setMonthArray] = useState([//initial
                        [0,0,0,0,0,0]
                    ])
    const [data, setData] = useState({});

    useEffect(() =>{
        getEntries();
        // eslint-disable-next-line
    }, []);

    return (
        <div>
            <div>
                <input type="month" 
                    //defaultValue={new Date().toISOString().substr(0,7)}
                    onChange={changeMonth}>
                </input>
            </div>
            <br />
            <div style={{margin: 'auto'}}>
                <table style={{width: '100%'}}>
                    <tr>
                        <th>Sunday</th>
                        <th>Monday</th>
                        <th>Tuesday</th>
                        <th>Wednesday</th>
                        <th>Thursday</th>
                        <th>Friday</th>
                        <th>Saturday</th>
                    </tr>
                    {monthArray.map((week) => 
                        <tr>
                            {week.map((day) => 
                                <td>
                                    {day==0?"":day}
                                    {day==0?"":
                                    <>
                                        <tr>
                                            <td>am</td>
                                        </tr>
                                        <tr>
                                            <td>pm</td>
                                        </tr>
                                    </>}

                                </td>
                            )}
                        </tr>
                    )}
                </table>
            </div>
        </div>

    )
}

export default DisplayTimeTable