import { create } from 'zustand';
import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_CRYPTO_SECRET_KEY;

interface AuthStore {
	isLoggedIn: boolean;
	userName: string;
	name: string;
	lastName: string;
	setIsLoggedIn: (loggedIn: boolean) => void;
	setUserName: (email: string) => void;
	setName: (name: string) => void;
	setLastName: (lastName: string) => void;
}

const encrypt = (data: string) => {
	return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};

const decrypt = (ciphertext: string) => {
	const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
	return bytes.toString(CryptoJS.enc.Utf8);
};

export const useAuthStore = create<AuthStore>((set) => ({
	isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
	userName: localStorage.getItem('userName') ? decrypt(localStorage.getItem('userName') || '') : '',
	name: localStorage.getItem('name') ? decrypt(localStorage.getItem('name') || '') : '',
	lastName: localStorage.getItem('lastName') ? decrypt(localStorage.getItem('lastName') || '') : '',
	setIsLoggedIn: (loggedIn: boolean) => {
		set({ isLoggedIn: loggedIn });
		localStorage.setItem('isLoggedIn', loggedIn.toString());
	},
	setName: (name: string) => {
		const encryptedName = encrypt(name);
		set({ name });
		localStorage.setItem('name', encryptedName);
	},
	setUserName: (userName: string) => {
		const encryptedEmail = encrypt(userName);
		set({ userName });
		localStorage.setItem('userName', encryptedEmail);
	},
	setLastName: (lastName: string) => {
		const encryptedLastName = encrypt(lastName);
		set({ lastName });
		localStorage.setItem('lastName', encryptedLastName);
	}
}));
