export interface Login {
	userName: string;
	password: string;
}

export interface LoginResponse {
	message: string;
	data: {
		userName: string;
		name: string;
		lastName: string;
	};
}
