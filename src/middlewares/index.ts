import express from 'express';
import { get } from 'lodash';
import { getUserByToken } from 'database/users';

// Middleware to ensure the user is authenticated
export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        // Retrieve the token from the 'Authorization' header
        const token = get(req, 'headers.authorization', '').replace('Bearer ', '');
        
        // If no token is found, return 401 Unauthorized
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized. Token missing.' });
        }

        // Fetch the user associated with the token
        const user = await getUserByToken(token);

        // If the user is not found, return 401 Unauthorized
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized. Invalid or expired token.' });
        }

        // Attach the user to the request object for use in subsequent middleware or route handlers
        req.user = user;
        next();

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
};

// Middleware to check if the current authenticated user is the owner of a resource
export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        // Retrieve the 'id' parameter from the request (e.g., the resource id like a user profile)
        const { id } = req.params;
        
        // Get the authenticated user's id from the request object (this is set by isAuthenticated)
        const currentUserId = get(req, 'user._id') as string;

        // Check if the current user is the owner of the resource
        if (currentUserId !== id) {
            return res.status(403).json({ error: 'Forbidden. You do not have permission to access this resource.' });
        }

        // If the user is the owner, proceed to the next middleware or route handler
        next();

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
};
