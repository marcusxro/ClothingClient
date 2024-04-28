
import React, { useState, useEffect } from 'react'
import { FBAuth } from '../AuthConfig'
import { onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../comp/Sidebar'

import moment from 'moment'
import axios from 'axios'
const Report = () => {
    const [userName, setUser] = useState('')
    const [uid, setUid] = useState('')
    const nav = useNavigate("")
    useEffect(() => {
        const unsub = onAuthStateChanged(FBAuth, (acc) => {
            if (acc) {
                setUid(acc.uid)
            } else {
                nav('/')
            }
        })
        return () => { unsub() }
    }, [uid])

    const [dataAcc, setData] = useState([])

    useEffect(() => {
        axios.get('http://localhost:8080/accInfos')
            .then((res) => {
                const filteredData = res.data.filter((itm) => itm.Uid === uid)
                setUser(filteredData[0].Username)
                console.log(filteredData)
                setData(res.data)
            }).catch((err) => {
                console.log(err)
            })
    }, [uid])

    const [data, setDataInv] = useState([])

    useEffect(() => {
        axios.get('http://localhost:8080/getData')
            .then((res) => {
                setDataInv(res.data)
            }).catch((err) => {
                console.log(err)
            })
    }, [data])

    const [editedItem, setEdited] = useState([])
    const [deletedItem, setDeleted] = useState([])
    useEffect(() => {
        axios.get('http://localhost:8080/getEdited')
            .then((res) => {

                const filteredDelete = res.data.filter((itm) => itm.Status === 'Delete')
                const filteredEdit = res.data.filter((itm) => itm.Status === 'Edit')


                setEdited(filteredEdit)
                setDeleted(filteredDelete)
            }).catch((err) => {
                console.log(err)
            })
    }, [data])


    return (
        <div className='Report'>
            <Sidebar />

            <div className="repCon">
                <h1>REPORT</h1>
                <div className="tableCon">
                    <table>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>ID</th>
                                <th>Login</th>
                                <th>Logout</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataAcc.map((itm) => (
                                <tr key={itm._id}>
                                    <td>{itm.Username}</td>
                                    <td>{itm.Email}</td>
                                    <td>{itm._id}</td>
                                    <td>{itm.Login ? moment(new Date(parseInt(itm.Login, 10))).format('MMMM Do YYYY, h:mm a') : 'No Login Date'}</td>
                                    <td>{itm.Logout ? moment(new Date(parseInt(itm.Logout, 10))).format('MMMM Do YYYY, h:mm a') : 'No Logout Date'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <h1>User Activity</h1>

                <div className="activityContainer">
                            <div className="scrolls">
                            <div className="actCon">
                        {data.map((itm) => (
                            <div className="actItem" key={itm.key}>
                                <span>{itm.Username} </span> added <span>{itm.Brand}</span> on{' '}
                                <span>
                                    {itm.Date
                                        ? moment(new Date(parseInt(itm.Date, 10))).format(
                                            'MMMM Do YYYY, h:mm a'
                                        )
                                        : 'No Dates at the moment'}
                                </span>
                            </div>
                        ))}
                    </div>
                            </div>
                    <div className="scrolls">
                        <div className="actCon">
                            {editedItem.map((itm) => (
                                <div className="actItem" key={itm.key}>
                                    <span>{itm.Username} </span> edited <span>{itm.Brand}</span> on{' '}
                                    <span>
                                        {itm.Date
                                            ? moment(new Date(parseInt(itm.Date, 10))).format(
                                                'MMMM Do YYYY, h:mm a'
                                            )
                                            : 'No Dates at the moment'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                            <div className="scrolls">
                            <div className="actCon">
                        {deletedItem.map((itm) => (
                            <div className="actItem" key={itm.key}>
                                <span>{itm.Username} </span> deleted <span>{itm.Brand}</span> on{' '}
                                <span>
                                    {itm.Date
                                        ? moment(new Date(parseInt(itm.Date, 10))).format(
                                            'MMMM Do YYYY, h:mm a'
                                        )
                                        : 'No Dates at the moment'}
                                </span>
                            </div>
                        ))}
                    </div>
                            </div>
                </div>




            </div>
        </div>
    )
}

export default Report
