import { io } from 'socket.io-client'
import { atom, selector } from 'recoil';

const URL = `http://localhost:3000`
export const socket = io(URL);

export const socketState = atom({
    key: 'socketState',
    default: selector({
        key: 'socketStateSelector',
        get: async () => {
            const token = localStorage.getItem('token')
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