import React, { useState, useEffect } from 'react'
import { FBAuth } from '../AuthConfig'
import { onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Sidebar from '../comp/Sidebar'
import AddModal from '../comp/AddModal'
import moment from 'moment'

const FileMain = () => {
    const [userName, setUser] = useState('')
    const [uid, setUid] = useState('')
    const nav = useNavigate("")
    const [email, setEmail] = useState('')
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
                setEmail(filteredData[0].Email)
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



    const [Brand, setBrand] = useState('')
    const [Type, setType] = useState('')
    const [Color, setColor] = useState('')
    const [Size, setSize] = useState('')
    const [Quantity, setQuantity] = useState('')

    const [isEq, setIsEq] = useState('')


    const getVal = (val) => {
        setBrand(val.Brand)
        setType(val.Type)
        setColor(val.Color)
        setSize(val.Size)
        setQuantity(val.Quantity)
    }


    const editItem = (itemId, dataObj) => {
        axios.post(`http://localhost:8080/editItem`, {
            Brand: Brand,
            Type: Type,
            Color: Color,
            Size: Size,
            Quantity: Quantity,
            Username: userName,
            Status: "Edit",
            Uid: uid
        }).then(() => {
            axios.put(`http://localhost:8080/editItem/${itemId}`, {
                Brand: Brand,
                Type: Type,
                Color: Color,
                Size: Size,
                Quantity: Quantity,
            }).then(() => {
                console.log("item edited")
            }).catch((err) => {
                console.log(err)
            })

            axios.post(`http://localhost:8080/Alert`, {
                Email: email,
                Username: userName,
                Date: Date.now(),
                Quantity: Quantity,
                OldQuan: dataObj.Quantity,
                Product: dataObj.Brand,
                Uid: uid
            }).then(() => {
                console.log("item edited")
            }).catch((err) => {
                console.log(err)
            })


        }).catch((err) => {
            console.log(err)
        })


    }

    const deleteItem = (itemId, data) => {

        axios.post(`http://localhost:8080/editItem`, {
            Brand: data.Brand,
            Type: data.Type,
            Color: data.Color,
            Size: data.Size,
            Quantity: data.Quantity,
            Username: userName,
            Status: "Delete",
            Uid: uid
        }).then(() => {
            axios.delete(`http://localhost:8080/itemEdit/${itemId}`)
                .then((response) => {
                    console.log("item deleted")
                    console.log(response.data); // Log the response from the server
                }).catch((err) => {
                    console.log(err)
                })

        }).catch((err) => {
            console.log(err)
        })

    }



    const [selectVal, setSelectVal] = useState('');
    const [Types, setTypes] = useState('');
    const [Colors, setColors] = useState('');
    const [Sizes, setSizes] = useState('');

    useEffect(() => {
        let updatedData = data; // Use let instead of const
        
        if (selectVal === 'Type') {
            updatedData = data.filter((itm) => itm.Type === Types);
        } else if (selectVal === 'Color') {
            updatedData = data.filter((itm) => itm.Color === Colors);
        } else if (selectVal === 'Size') {
            updatedData = data.filter((itm) => itm.Size === Sizes);
        }
        setFil(updatedData);
    }, [selectVal, Types, Colors, Sizes, filteredData, data]);
    
    



    return (
        <div className='FileMain'>
            <Sidebar />
            <div className="inventoryCon">



                <div className="upperHeader">
                    <h1 className="text">
                        FILE MAINTENANCE
                    </h1>
                    <div className="search">
                        <input value={query} onChange={(e) => { setQuer(e.target.value) }} type="text" placeholder='Search' />
                    </div>

                </div>

                <select
                    name=''
                    id=''
                    value={selectVal}
                    onChange={(e) => {
                        setSelectVal(e.target.value);
                    }}
                >
                    <option value=''>Find by</option>
                    <option value='Size'>Size</option>
                    <option value='Type'>Type</option>
                    <option value='Color'>Color</option>
                </select>

                {selectVal === 'Size' && (
                    <select required value={Sizes} onChange={(e) => setSizes(e.target.value)}>
                        <option value=''>Choose Size</option>
                        <option value='XXS'>XXS</option>
                        <option value='XS'>XS</option>
                        <option value='S'>S</option>
                        <option value='M'>M</option>
                        <option value='L'>L</option>
                        <option value='XL'>XL</option>
                        <option value='XXL'>XXL</option>
                    </select>
                )}
                {selectVal === 'Type' && (
                    <select required value={Types} onChange={(e) => setTypes(e.target.value)}>
                        <option value=''>Enter Type</option>
                        <option value='Polo Shirt'>Polo Shirt</option>
                        <option value='Knitted Shirt'>Knitted Shirt</option>
                        <option value='Halter Top'>Halter Top</option>
                        <option value='T-Shirt'>T-Shirt</option>
                    </select>
                )}

                {selectVal === 'Color' && (
                    <select required value={Colors} onChange={(e) => setColors(e.target.value)}>
                        <option value=''>Choose Color</option>
                        <option value='White'>White</option>
                        <option value='Red'>Red</option>
                        <option value='Blue'>Blue</option>
                        <option value='Green'>Green</option>
                        <option value='Yellow'>Yellow</option>
                        <option value='Black'>Black</option>
                        <option value='Purple'>Purple</option>
                    </select>
                )}

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
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredData.length === 0 && (<>No items found!</>)}
                        {filteredData.slice().reverse().map((itm) => (
                            <tr key={itm._id} className={`${parseInt(itm.Quantity) <= 50 && "lowStock"}`}>
                                <td>
                                    {itm._id === isEq ?
                                        <input type="text" placeholder='Enter Brand' value={Brand} onChange={(e) => { setBrand(e.target.value) }} />
                                        : itm.Brand}
                                </td>
                                <td>
                                    {itm._id === isEq ?
                                        <select required value={Type} onChange={(e) => { setType(e.target.value) }} >
                                            <option value="">Enter Type</option>
                                            <option value="Polo Shirt">Polo Shirt</option>
                                            <option value="Knitted Shirt">Knitted Shirt</option>
                                            <option value="Halter Top">Halter Top</option>
                                            <option value="T-Shirt">T-Shirt</option>
                                        </select>
                                        : itm.Type}
                                </td>
                                <td>
                                    {itm._id === isEq ?
                                        <select required value={Color} onChange={(e) => { setColor(e.target.value) }} >
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

                                        : itm.Color}
                                </td>
                                <td>
                                    {itm._id === isEq ?
                                        <select required value={Size} onChange={(e) => { setSize(e.target.value) }} >
                                            <option value="">Choose Size</option>
                                            <option value="XXS">XXS</option>
                                            <option value="XS">XS</option>
                                            <option value="S">S</option>
                                            <option value="M">M</option>
                                            <option value="L">L</option>
                                            <option value="XL">XL</option>
                                            <option value="XXL">XXL</option>
                                        </select>

                                        : itm.Size}
                                </td>
                                <td>
                                    {itm._id === isEq ?
                                        <input type="number" placeholder='Enter Quantity' value={Quantity} onChange={(e) => { setQuantity(e.target.value) }} />
                                        : itm.Quantity}
                                </td>
                                <td>
                                    {moment(new Date(parseInt(itm.Date, 10))).format('MMMM Do YYYY, h:mm a')}
                                </td>
                                <td>
                                    {itm.Username}
                                </td>
                                <td>
                                    {isEq === itm._id ? (
                                        <>
                                            <button onClick={() => { setIsEq(null); editItem(itm._id, itm) }}>SAVE</button>
                                            <button onClick={() => { setIsEq(null); }}> CANCEL</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => { setIsEq(itm._id); getVal(itm) }}>EDIT</button>
                                            <button onClick={() => { deleteItem(itm._id, itm) }}>DELETE</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>


            </div>
        </div>
    )
}

export default FileMain
