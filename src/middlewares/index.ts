import express from 'express';
import { get } from 'lodash';
import { getUserByToken } from 'database/users';

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        // Retrieve the token from the 'Authorization' header
        const token = get(req, 'headers.authorization', '').replace('Bearer ', '');
        
        // If no token is found, return 401 Unauthorized
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized.' });
        }

        // Fetch the user associated with the token
        const user = await getUserByToken(token);

        // If the user is not found, return 401 Unauthorized
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized.' });
        }

        // If the token is valid, attach the user to the request object and proceed to the next middleware
        req.user = user;
        next();

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
};
