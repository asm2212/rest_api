import express from 'express';
import { createUser, getUserByEmail } from 'database/users';
import { random,authentication } from 'helpers';

export const register = async(req: express.Request, res: express.Response) => {
    try {
        const { username, email,password } = req.body;
        
        // Validate the input data
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use.' });
        }
    const salt = random();
    const user = await createUser({
        username,
        email,
       authentication: {
        email,
        username,
        authentication: {
            salt,
            password: authentication(salt, password),
        }
       }
    });
    return res.status(201).json({ user });

    }catch(error){
        console.error(error);
        return res.status(400).json({ error: 'Invalid request data.' });
    }
}