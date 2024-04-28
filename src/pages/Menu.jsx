import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FBAuth } from '../AuthConfig'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

const Menu = () => {
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

    const handlesignOut = () => {
        axios.put(`http://localhost:8080/edit/${uid}`, {
            Logout: Date.now()
        }).then(() => {
            console.log('date updated')
            signOut(FBAuth)
                .then(() => {
                    nav('/')
                }).catch((err) => {
                    console.log(err)
                })
        }).catch((err) => { console.log(err) })


    }

    return (
        <div className='Menu'>
            <div className="menuCon">
                <div className="user">
                    <div className="imageText">
                        <ion-icon name="person-circle-outline"></ion-icon>  {userName ? userName : "loading.."}
                    </div>
                    <div className="signOut" onClick={() => { handlesignOut() }}>
                        <ion-icon name="log-out-outline"></ion-icon>
                    </div>
                </div>

                <div className="menuItems">
                    <div className="item" onClick={() => { nav('/inventory') }}>
                        <div className="image">
                            <ion-icon name="shirt-outline"></ion-icon>
                        </div>
                        <div className="text">
                            INVENTORY
                        </div>
                    </div>
                    <div className="item"  onClick={() => {nav('/report')}}>
                        <div className="image">
                            <ion-icon name="person-circle-outline"></ion-icon>
                        </div>
                        <div className="text">
                            REPORT
                        </div>
                    </div>
                    <div className="item" onClick={() => {nav('/file-maintenance')}}>
                        <div className="image">
                            <ion-icon name="settings-outline"></ion-icon>
                        </div>
                        <div className="text">
                            FILE MAINTENANCE
                        </div>
                    </div>
                    <div className="item" onClick={() => {nav('/alert')}}>

                        <div className="image">
                            <ion-icon name="warning-outline"></ion-icon>
                        </div>
                        <div className="text">
                            ALERT
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Menu
