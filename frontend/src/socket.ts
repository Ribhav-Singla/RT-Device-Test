import { io } from 'socket.io-client'
import { atom, selector } from 'recoil';

const URL = `http://localhost:3000`
export const socket = io(URL);

export const socketState = atom({
    key: 'socketState',
    default: selector({
        key: 'socketStateSelector',
        get: async () => {
            
            let token:string | null = ""
            if(sessionStorage.getItem('userLoginAllowed') && sessionStorage.getItem('userLoginToken')){
                token = sessionStorage.getItem('userLoginToken')
                console.log('sesiontoken: ',token);
            }
            else{
                token = localStorage.getItem('token')
                console.log('localtoken: ',token);
            }

            if (token) {
                socket.auth = { token };
                socket.connect();
                return true;
            } else {
                console.error("No token found in localStorage");
                return false;
            }

        }
    })
})