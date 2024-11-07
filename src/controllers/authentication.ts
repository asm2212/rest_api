import express from 'express';
import { createUser, getUserByEmail } from 'database/users';
import { authentication, random } from 'helpers';


export const register = async (req: express.Request, res: express.Response): Promise<express.Response> => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use.' });
        }

        const salt = random();
        const hashedPassword = authentication(salt, password);

        const user = await createUser({
            username,
            email,
            authentication: {
                salt,
                password: hashedPassword,
            },
        });

        return res.status(201).json({ user });

    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: 'Invalid request data.' });
    }
};

export const login = async (req: express.Request, res: express.Response): Promise<express.Response> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        // Find the user by email
        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
        if (!user) {
            return res.status(400).json({ error: 'User not found.' });
        }

        const expectedHash = authentication(user.authentication.salt,password);
        if(
            user.authentication.password === expectedHash
        ){
            return res.status(200).json({ user });
        }
        const salt = random();
        user.authentication.token = authentication(salt,user._id.toString); 
        await user.save();


        return res.status(200).json({ message: 'Login successful.' });

    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: 'Invalid request data.' });
    }
};
