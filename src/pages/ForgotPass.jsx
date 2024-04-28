import React, { useState, useEffect, useRef } from 'react'
import { sendPasswordResetEmail } from 'firebase/auth';
import { FBAuth } from '../AuthConfig';
import { useNavigate } from 'react-router-dom';

const ForgotPass = () => {
    const [email, setEmail] = useState('');


    const resetPassword = (e) => {
        e.preventDefault()
        sendPasswordResetEmail(FBAuth, email)
            .then(() => {
                const user = FBAuth.currentUser;
                // Refresh the user to ensure the latest data is fetched
                return user.reload();
            })
            .then(() => {
                setEmail('');
                alert("Verification sent!")
            })
            .catch((error) => {
                console.error('Error sending or reloading user:', error);
                // Log the error for debugging
                if (error.code === 'auth/user-not-found') {
                    alert("USER NOT FOUND!")
                } else {
                    console.error('Error sending password reset email:', error.message);
                }
                setEmail('');
            });
    };


const nav = useNavigate()
    return (
        <div className='ForgotPass'>
            <div className="absoBtn" onClick={() => {nav('/')}}>
                LOGIN
            </div>
            <form onSubmit={resetPassword} action="">
                <div className="forgetText">
                    RECOVER
                </div>
                <input placeholder='Enter email' type="email" value={email} onChange={(e) => { setEmail(e.target.value) }} />
                <button type='submit'>RESET</button>
            </form>
        </div>
    )
}

export default ForgotPass
