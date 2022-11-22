import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import React, { useState, useEffect, useRef} from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Messages } from 'primereact/messages';
import { Message } from 'primereact/message';
import Logo from '../img/anacleto.png';
import LogoBuilder from '../img/anacleto_builder.png';
import {
    loginWithCredential,
    loginWithGoogle
} from "./loginUtils"

import "./login.css";

function Login(props) {
    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [rememberme, setRememberme] = useState("");
    const messages = useRef(null);


    useEffect(() => {
        return () => {
            console.log('Login component is unmounting');
        };
    }, []);


    const _loginWithCredential = function(username, password){

        const callback = function(_username){
            props.setUsername(_username);

            if(!_username){
                messages.current.show({severity: 'error', summary: '', detail: 'Login fail, user or email not valid'});
            }
        }

        //passo al
        loginWithCredential(username, password, callback)
    }
    

    return (

        <div className="flex align-items-center justify-content-center">
            <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
                <div className="text-center mb-5">
                    <img src={props.isBuilder ? LogoBuilder : Logo} alt="hyper" height={80} className="mb-3" />
                    <div className="p-component text-900 text-3xl font-medium mb-3">Welcome</div>
                    <span className="p-component text-600 font-medium line-height-3">{props.subtitle}</span>
                </div>

                <div>
                    <span className="p-float-label mt-6">
                        <InputText id="login_username" name="login_username" className="w-full"
                            onChange={(e) => setLoginUsername(e.target.value)} />
                        <label htmlFor="login_username" className="p-component block font-medium">Email</label>
                    </span>

                    <span className="p-float-label mt-5">
                        <Password id="login_password" name="login_password" type="password" className="w-full" inputClassName="w-full"
                            feedback={false}
                            toggleMask={true}
                            onChange={(e) => setLoginPassword(e.target.value)} />
                        <label htmlFor="login_password" className="p-component block font-medium">Password</label>
                    </span>


                    <div className="flex align-items-center justify-content-between mt-4">
                        <div className="flex align-items-center">
                            <Checkbox id="rememberme" onChange={e => setRememberme(e.checked)} checked={rememberme} binary className="mr-2" />
                            <label className='p-component' htmlFor="rememberme">Remember me</label>
                        </div>
                        <a className="p-component font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">Forgot your password?</a>
                    </div>

                    <Button label="Login" icon="pi pi-user" className="w-full mt-6" onClick={() => _loginWithCredential(loginUsername, loginPassword)} />
                    <Messages ref={messages}></Messages>
                </div>

                <div class="p-divider p-component p-divider-horizontal p-divider-solid p-divider-center my-6" role="separator">
                    <div class="p-divider-content">
                        <span class="text-600 font-normal text-sm">OR</span>
                    </div>
                </div>

                <Button label="Login with Google" icon="pi pi-google" className="w-full mt-2 p-button-secondary" onClick={() => loginWithGoogle(props.setUsername)} />

            </div>
        </div>
    );
}

export default Login;

