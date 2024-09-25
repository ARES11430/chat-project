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

export interface RegisterUser {
	name: string;
	lastName: string;
	userName: string;
	password: string;
}

export interface RegisterUserResponse {
	message: string;
	data: {
		user: {
			_id: string;
			name: string;
			lastName: string;
			userName: string;
		};
	};
}
