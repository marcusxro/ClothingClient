import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FBAuth } from '../AuthConfig'
import { createUserWithEmailAndPassword } from 'firebase/auth'

const Register = () => {
    const nav = useNavigate('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isEq, setIsEq] = useState('')
    const [Username, setUsername] = useState('')



    const createAcc = (e) => {
        e.preventDefault();
        if (password !== isEq) {
            return alert("Passwords do not match");
        } else {
            createUserWithEmailAndPassword(FBAuth, email, password)
            .then((userInfo) => {
                const user = userInfo.user;
                axios.post('http://localhost:8080/GetAcc', {
                    Email: email,
                    Username: Username,
                    Password: password,
                    Uid: user.uid,
                    Login: '',
                    Logout: ''
                })
                .then((response) => {
                    console.log("Details sent:", response.data);
                    alert("ACCOUNT CREATED")
                    // Handle success response from backend if needed
                })
                .catch((err) => {
                    console.error("Error sending details:", err);
                    // Handle error sending details to backend
                });
            })
            .catch((err) => {
                if (err.code === 'auth/email-already-in-use') {
                    alert("Email already in use");
                } else {
                    console.error('Error:', err.message);
                    alert("There's some error, try again later");
                }
            });
        }
    };
    

    return (
        <div className='Register'>
            <div className="absoBtn" onClick={() => { nav('/') }}>
                Login
            </div>
            <form onSubmit={createAcc} action="">
                <div className="imageForm">
                    <div className="image">
                        <ion-icon name="person-circle-outline"></ion-icon>
                    </div>
                    <div className="imageText">
                        Register
                    </div>
                </div>

                <div className="inputCon">
                    <div className="emailForm">
                        <div className="emailText">
                            Email:
                        </div>
                        <input type="text" onChange={(e) => { setEmail(e.target.value) }} value={email} />
                    </div>
                    <div className="passwordForm">
                        <div className="passText">
                            Password:
                        </div>
                        <input type="password" onChange={(e) => { setPassword(e.target.value) }} value={password} />
                    </div>

                </div>

                <div className="inputCon">
                    <div className="emailForm">
                        <div className="emailText">
                            Username:
                        </div>
                        <input type="text" onChange={(e) => { setUsername(e.target.value) }} value={Username} />
                    </div>
                    <div className="passwordForm">
                        <div className="passText">
                            Confirm Password:
                        </div>
                        <input type="password" onChange={(e) => { setIsEq(e.target.value) }} value={isEq} />
                    </div>

                </div>


                <button type='submit'>REGISTER</button>

            </form>

        </div>
    )
}

export default Register
