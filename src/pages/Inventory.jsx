import React, { useState, useEffect } from 'react'
import { FBAuth } from '../AuthConfig'
import { onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Sidebar from '../comp/Sidebar'
import AddModal from '../comp/AddModal'
import moment from 'moment'

const Inventory = () => {
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


    useEffect(() => {
        axios.get('http://localhost:8080/accInfos')
            .then((res) => {
                const filteredData = res.data.filter((itm) => itm.Uid === uid)
                setUser(filteredData[0].Username)
                console.log(filteredData)
            }).catch((err) => {
                console.log(err)
            })
    }, [uid])


    const [isShow, setShow] = useState(false)
    const [query, setQuer] = useState('')
    const [data, setData] = useState([])

    useEffect(() => {
        axios.get('http://localhost:8080/getData')
            .then((res) => {
                setData(res.data)
            }).catch((err) => {
                console.log(err)
            })
    }, [data])


    const [filteredData, setFil] = useState([])

    useEffect(() => {
        const filteredData = data.filter((itm) => itm.Brand.toLowerCase().includes(query.toLocaleLowerCase()))
        setFil(filteredData)

    }, [query, data])
    return (
        <div className='Inventory'>
            <Sidebar />


            <div className="inventoryCon">
<h1>INVENTORY</h1>
                {isShow === true ? (
                    <AddModal setShow={setShow} />
                ) : (<></>)}

                <div className="upperHeader">
                    <div className="search">
                        <input value={query} onChange={(e) => { setQuer(e.target.value) }} type="text" placeholder='Search' />
                    </div>
                    <div className="addModal" onClick={() => { setShow(!isShow) }}>
                        {isShow === false ? (
                            <><ion-icon name="add-circle-outline"></ion-icon> Add New</>
                        ) : (
                            <> <ion-icon name="close-outline"></ion-icon>  close </>
                        )}
                    </div>
                </div>


                <table>
                    <thead>
                        <tr>
                            <th>Brand</th>
                            <th>Type</th>
                            <th>Color</th>
                            <th>Sizes</th>
                            <th>Quantity</th>
                            <th>Date</th>
                            <th>Added By</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredData.length === 0 && (<>No items found!</>)}
                        {filteredData.map((itm) => (
                            <tr key={itm._id}>
                                <td>
                                    {itm.Brand}
                                </td>
                                <td>
                                    {itm.Type}
                                </td>
                                <td>
                                    {itm.Color}
                                </td>
                                <td>
                                    {itm.Size}
                                </td>
                                <td>
                                    {itm.Quantity}
                                </td>
                                <td>
                                {moment(new Date(parseInt(itm.Date, 10))).format('MMMM Do YYYY, h:mm a')}
                                </td>
                                <td>
                                    {itm.Username}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>


            </div>
        </div>
    )
}

export default Inventory
