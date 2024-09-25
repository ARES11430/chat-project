import express from 'express';

import { createUser, getUsers } from '../controllers/users/userController';

const router = express.Router();

router.post('/create-user', createUser);

router.get('/all-users', getUsers);

export default router;
