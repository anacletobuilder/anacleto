import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import Logo from '../img/anacleto.png';
import "./login.css";
import {
    registerWithCredential,
    registerWithGoogle
} from "./loginUtils"

function Registration(props) {
    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [rememberme, setRememberme] = useState("");
    const [showMessage, setShowMessage] = useState(false); //TODO varibilio per gestire il dialog
    const [dialogTitle, setDialogTitle] = useState("");
    const [dialogMessage, setDialogMessage] = useState("");

    const [user, setUser] = useState({});


	useEffect(() => {
        return () => {
            console.log('Login component is unmounting');
        };
    }, []);


    return (

        <div className="flex align-items-center justify-content-center">
            <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
                <div className="text-center mb-5">
                    <img src={Logo} alt="hyper" height={50} className="mb-3" />
                    <div className="text-900 text-3xl font-medium mb-3">Sign-in</div>
                    <span className="text-600 font-medium line-height-3">Crete new user!</span>
                </div>

                <div>
                    <span className="p-float-label mt-6">
                        <InputText id="login_username" name="login_username" className="w-full"
                            onChange={(e) => setLoginUsername(e.target.value)} />
                        <label htmlFor="login_username" className="p-component block font-medium">Username</label>
                    </span>

                    <span className="p-float-label mt-4">
                        <Password id="login_password" name="login_password" type="password" className="w-full" inputClassName="w-full"
                            feedback={false}
                            toggleMask={true}
                            onChange={(e) => setLoginPassword(e.target.value)} />
                        <label htmlFor="login_password" className="p-component block font-medium">Password</label>
                    </span>


                    <Button label="Register" icon="pi pi-user" className="w-full mt-6" onClick={() => registerWithCredential(loginUsername, loginPassword)} />
                </div>

                <Button label="Register Google" icon="pi pi-user" className="w-full mt-6" onClick={registerWithGoogle} />

            </div>
        </div>
    );
}

export default Registration;

