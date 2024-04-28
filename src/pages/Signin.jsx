import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FBAuth } from '../AuthConfig'
import axios from 'axios'
import { signInWithEmailAndPassword } from 'firebase/auth'
const Signin = () => {
    const nav = useNavigate('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')



    const SignIn = (e) => {
        e.preventDefault();

        if (password.length <= 5) {
            alert("Password should be at least 6 characters long");
            return;
        }

        signInWithEmailAndPassword(FBAuth, email, password)
            .then((userCredential) => { 
                
                if(userCredential) {
                    axios.put(`http://localhost:8080/edit/${userCredential.user.uid}`, {
                        Login: Date.now()
                    }).then(() => {
                        console.log('date updated')
                    }).catch((err) => {console.log(err)})
                }
                    nav('/menu')

            }).catch((err) => {
                if(err.code === 'auth/invalid-credential') {
                    alert("Wrong Password or Email")
                } else if (err.code === 'auth/user-not-found' ) {
                    alert("No user Found")
                }
                
            });
    }


    return (
        <div className='SignIn'>
            <div className="absoBtn" onClick={() => {nav('/register')}}>
                Register
            </div>
            <form  onSubmit={SignIn} action="sumbit">
                <div className="imageForm">
                    <div className="image">
                        <ion-icon name="person-circle-outline"></ion-icon>
                    </div>
                    <div className="imageText">
                        Sign In
                    </div>
                </div>
                <div className="emailForm">
                    <div className="emailText">
                        Email:
                    </div>
                    <input type="text" value={email} onChange={(e) => {setEmail(e.target.value)}} />
                </div>
                <div className="passwordForm">
                    <div className="passText">
                        Password:
                    </div>
                    <input type="password"  value={password} onChange={(e) => {setPassword(e.target.value)}} />
                </div>
                <div className="forgot" onClick={() => {nav('/recover')}}>
                    forgot password?
                </div>
                <button type='submit'>
                    LOGIN
                </button>
            </form>
        </div>
    )
}

export default Signin
