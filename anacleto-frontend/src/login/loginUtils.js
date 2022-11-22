import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    signInWithPopup,
    GoogleAuthProvider,
    getAuth,
} from "firebase/auth";
import '../config/firebase-config';
import { auth } from "../config/firebase-config";

export const registerWithCredential = async (username, password) => {
    try {
        const user = await createUserWithEmailAndPassword(
            auth,
            username,
            password
        );
        //console.log(user);
    } catch (error) {
        console.log(error.message);
    }
};

export const registerWithGoogle = () => {
    loginWithGoogle();
}

export const loginWithCredential = async (username, password, callback) => {
    try {
        console.log(`Login for ${username} ${password}`)
        const userCred = await signInWithEmailAndPassword(
            auth,
            username,
            password
        );
        //console.log(userCred);

        window.localStorage.setItem('username', userCred.user.email);
        window.localStorage.setItem('userCredential', JSON.stringify(userCred));
        if (callback) {
            callback(userCred.user.email);
        }
    } catch (error) {
        console.log(error.message);
        if (callback) {
            callback(null);
        }
    }
};

export const loginWithGoogle = async (callback) => {
    try {

        const provider = new GoogleAuthProvider();
        //Specify additional OAuth 2.0 scopes 
        provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

        /*
        //Specify additional custom OAuth provider parameters that you want to send with the OAuth request.
        provider.setCustomParameters({
            'login_hint': 'user@example.com'
        });
        */
        const auth = getAuth();
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                console.log(`user ${user}`);

                window.localStorage.setItem('username', user.email);
                window.localStorage.setItem('userCredential', JSON.stringify(user));
                if (callback) {
                    callback(user.email);
                }
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                if (callback) {
                    callback(null);
                }
            });

    } catch (error) {
        console.log(error.message);
        if (callback) {
            callback(null);
        }
    }
}

export const logout = async () => {
    await signOut(auth);
    window.localStorage.setItem('username', null);
};

/**
     * Ritrona token firebase auth
     * @return token firebase auth
     */
export const getToken = () => {
    //Returns the current token if it has not expired or if it will not expire in the next five minutes. Otherwise, this will refresh the token and return a new one.
    if (auth?.currentUser) {
        return auth.currentUser.getIdTokenResult()
            .then((tokenResp) => {
                return Promise.resolve(`Bearer ${tokenResp.token}`);
            });
    }
    return Promise.resolve(`Bearer unset`);
}