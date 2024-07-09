import axios from "axios";
import { atom, selector } from "recoil";


export const userAtom = atom({
    key: 'userAtom',
    default: selector({
        key: 'userAtomSelector',
        get: async ({ get }) => {
            try {
                const response = await axios.get('http://localhost:3000/api/v1/user/me', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                })
                return response.data   
            } catch (error) {
                console.log('error occured in recoil: ',error);
                return ""
            }
        }
    })
})