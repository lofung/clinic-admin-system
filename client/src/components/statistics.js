import React, {useState, Component} from 'react'

export const Statistics = () => {
    const [clinicArray, setClinicArray] = useState(["", "A","B","C","D","E","F"])
    const [drArray, setDrArray] =  useState(["dr1", "dr2", "dr3", "dr4", "dr5"])

    return (
        <div>
            <table>
                <tr>
                {clinicArray.map(clinic => (
                    <td style={{"minWidth":"50px"}}>{clinic}</td>
                ))}
                </tr>
                {drArray.map(dr =>(
                    <tr>
                        {clinicArray.map((clinic, index) =>(
                            <td style={{"minWidth":"50px"}}>
                                {index===0?dr:dr + " x " + clinic}
                            </td>
                        ))}
                    </tr>
                ))}

            </table>

        </div>
    )
}

export default Statistics