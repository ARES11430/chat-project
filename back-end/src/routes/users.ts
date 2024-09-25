import express from 'express';

import { createUser } from '../controllers/users/userController';

const router = express.Router();

router.post('/create-user', createUser);
