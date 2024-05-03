import React, { useState, useEffect } from 'react';
import { FBAuth } from '../AuthConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../comp/Sidebar';
import AddModal from '../comp/AddModal';
import moment from 'moment';

const Inventory = () => {
    const [userName, setUser] = useState('');
    const [uid, setUid] = useState('');
    const nav = useNavigate('');

    useEffect(() => {
        const unsub = onAuthStateChanged(FBAuth, (acc) => {
            if (acc) {
                setUid(acc.uid);
            } else {
                nav('/');
            }
        });
        return () => {
            unsub();
        };
    }, [uid]);

    useEffect(() => {
        axios
            .get('http://localhost:8080/accInfos')
            .then((res) => {
                const filteredData = res.data.filter((itm) => itm.Uid === uid);
                setUser(filteredData[0].Username);
                console.log(filteredData);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [uid]);

    const [isShow, setShow] = useState(false);
    const [query, setQuer] = useState('');
    const [data, setData] = useState([]);
    const [filteredData, setFil] = useState([]);

    useEffect(() => {
        axios
            .get('http://localhost:8080/getData')
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [data]);

    useEffect(() => {
        const filteredData = data.filter((itm) =>
            itm.Brand.toLowerCase().includes(query.toLocaleLowerCase())
        );
        setFil(filteredData);
    }, [query, data]);

    const [selectVal, setSelectVal] = useState('');
    const [Type, setType] = useState('');
    const [Color, setColor] = useState('');
    const [Size, setSize] = useState('');

    useEffect(() => {
        let filteredData = data;
        if (selectVal === 'Type') {
            filteredData = filteredData.filter((itm) => itm.Type === Type);
        } else if (selectVal === 'Color') {
            filteredData = filteredData.filter((itm) => itm.Color === Color);
        } else if (selectVal === 'Size') {
            filteredData = filteredData.filter((itm) => itm.Size === Size);
        }
        setFil(filteredData);
    }, [selectVal, Type, Color, Size, data]);

    return (
        <div className='Inventory'>
            <Sidebar />
            <div className='inventoryCon'>
                <h1>INVENTORY</h1>
                {isShow === true ? (
                    <AddModal setShow={setShow} />
                ) : (
                    <></>
                )}
                <div className='upperHeader'>
                    <div className='search'>
                        <input
                            value={query}
                            onChange={(e) => {
                                setQuer(e.target.value);
                            }}
                            type='text'
                            placeholder='Search'
                        />
                    </div>
                    <div className='addModal' onClick={() => setShow(!isShow)}>
                        {isShow === false ? (
                            <>
                                <ion-icon name='add-circle-outline'></ion-icon> Add New
                            </>
                        ) : (
                            <>
                                {' '}
                                <ion-icon name='close-outline'></ion-icon> close{' '}
                            </>
                        )}
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
                    <select required value={Size} onChange={(e) => setSize(e.target.value)}>
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
                    <select required value={Type} onChange={(e) => setType(e.target.value)}>
                        <option value=''>Enter Type</option>
                        <option value='Polo Shirt'>Polo Shirt</option>
                        <option value='Knitted Shirt'>Knitted Shirt</option>
                        <option value='Halter Top'>Halter Top</option>
                        <option value='T-Shirt'>T-Shirt</option>
                    </select>
                )}

                {selectVal === 'Color' && (
                    <select required value={Color} onChange={(e) => setColor(e.target.value)}>
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
                        </tr>
                    </thead>

                    <tbody>
                        {filteredData.length === 0 && <>{selectVal ? "No items found with selected criteria!" : "No items found!"}</>}
                        {filteredData.slice().reverse().map((itm) => (
                            <tr key={itm._id} className={`${parseInt(itm.Quantity) <= 50 && 'lowStock'}`}>
                                <td>{itm.Brand}</td>
                                <td>{itm.Type}</td>
                                <td>{itm.Color}</td>
                                <td>{itm.Size}</td>
                                <td>{itm.Quantity}</td>
                                <td>{moment(new Date(parseInt(itm.Date, 10))).format('MMMM Do YYYY, h:mm a')}</td>
                                <td>{itm.Username}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Inventory;
