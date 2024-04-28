import React, { useState, useEffect } from 'react'
import { FBAuth } from '../AuthConfig'
import { onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'



const AddModal = ({setShow}) => {
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

    const [Brand, setBrand] = useState('')
    const [Type, setType] = useState('')
    const [Color, setColor] = useState('')
    const [Size, setSize] = useState('')
    const [Quantity, setQuantity] = useState('')


    const sendData = () => {

        if(!Brand || !Type || !Color || !Size || !Quantity) {
            return alert("Please complete inputs")
        }
        axios.post('http://localhost:8080/Post', {
            Brand: Brand,
            Type: Type,
            Color: Color,
            Size: Size,
            Quantity: Quantity,
            Username: userName,
            Uid: uid,
        })
        .then(() => {
            console.log("data sent")
            setBrand('')
            setType('')
            setColor('')
            setSize('')
            setQuantity(0)
        }).catch((err) => {console.log(err)})
    }

    return (
        <div className='AddModal'>
            <div className="close">
                <button onClick={() => {setShow(prevClick => !prevClick)}}>
                    close <ion-icon name="close-outline"></ion-icon>
                </button>
            </div>
            <input required type="text" placeholder='Enter Brand' value={Brand} onChange={(e) => {setBrand(e.target.value)}} />

            <select required value={Type} onChange={(e) => {setType(e.target.value)}} >
                <option value="">Enter Type</option>
                <option value="Polo Shirt">Polo Shirt</option>
                <option value="Knitted Shirt">Knitted Shirt</option>
                <option value="Halter Top">Halter Top</option>
                <option value="T-Shirt">T-Shirt</option>
            </select>

            <select required value={Color} onChange={(e) => {setColor(e.target.value)}} >
                <option value="">Choose Color</option>
                <option value="White">White</option>
                <option value="Red">Red</option>
                <option value="Blue">Blue</option>
                <option value="Green">Halter Top</option>
                <option value="Yellow">Yellow</option>
                <option value="Black">Black</option>
                <option value="Green">Green</option>
                <option value="Purple">Purple</option>
            </select>

            <select required value={Size} onChange={(e) => {setSize(e.target.value)}} >
                <option value="">Choose Size</option>
                <option value="XXS">XXS</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
            </select>

            <input  required type="number"  placeholder='Enter Quantity' value={Quantity} onChange={(e) => {setQuantity(e.target.value)}} />

            <button onClick={() => {sendData()}}>SUBMIT</button>
        </div>
    )
}

export default AddModal
