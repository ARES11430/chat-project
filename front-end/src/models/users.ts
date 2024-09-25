export interface UserResponse {
	data: {
		users: [
			{
				_id: string;
				name: string;
				lastName: string;
				userName: string;
				createdAt: Date;
			}
		];
	};
}
