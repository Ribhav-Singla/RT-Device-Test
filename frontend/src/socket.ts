import { io } from 'socket.io-client'
import { atom, selector } from 'recoil';

const URL = `${import.meta.env.VITE_BACKEND_URL}`
export const socket = io(URL);

export const socketState = atom({
    key: 'socketState',
    default: selector({
        key: 'socketStateSelector',
        get: async () => {
            
            let token:string | null = ""
            if(sessionStorage.getItem('userLoginAllowed') && sessionStorage.getItem('userLoginToken')){
                token = sessionStorage.getItem('userLoginToken')
            }
            else{
                token = localStorage.getItem('token')
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