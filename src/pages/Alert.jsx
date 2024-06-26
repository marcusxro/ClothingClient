import React, { useEffect, useState } from 'react'
import Sidebar from '../comp/Sidebar'
import axios from 'axios'
import moment from 'moment'
const Alert = () => {
    const [data, setData] = useState([])

    useEffect(() => {
        axios.get('http://localhost:8080/getAlerts')
            .then((res) => {
                setData(res.data)
            }).catch((err) => { console.log(err) })
    }, [data])


    return (
        <div className='Alert'>
            <Sidebar />

            <div className="alertContent">
                <h1>
                    Alerts
                </h1>

                <div className="alertConContent">
                    {data.map((itm) => (
                        <div key={itm.key} className={`alertItem ${parseInt(itm.Quantity) <= 50 && "warning"}`}>
                            <span className='goRight'> {parseInt(itm.Quantity) < 50 ?
                                <div className='warningIcon'>
                                    <ion-icon name="warning-outline"></ion-icon>
                                    </div>
                                : (<></>)}</span>
                            <span>{itm.Username}</span> updated
                            <span> {itm.Product}</span>'s quantity from {itm.OldQuan} to
                            <span>         {itm.Quantity}</span> on <span> {moment(new Date(parseInt(itm.Date, 10))).format('MMMM Do YYYY, h:mm a')}</span>




                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Alert
