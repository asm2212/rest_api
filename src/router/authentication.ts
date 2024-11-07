import express from 'express';
import { register } from 'controllers/authentication';

const router = express.Router();

// Define your routes directly on the router instance
router.post('/auth/register', register);
router.post('/auth/login', login);

export default router;
