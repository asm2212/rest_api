import express from 'express';
import { deleteUserById, getUsers } from 'database/users';

export const getAllUsers = async(req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users.' });
    }
}

export const deleteUser = async(req: express.Request, res: express.Response) => {
    try {
      const {id} = req.params;
       const deletedUser = await deleteUserById(id);
       res.status(200).json(deletedUser);
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user.' });
    }
}

// Add update user functionality using the user ID
export const updateUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;  // Get the user ID from the URL parameters
        const { username, email, password } = req.body;  // Get updated user data from the request body

        // Check if at least one field is provided to update
        if (!username && !email && !password) {
            return res.status(400).json({ error: 'No update data provided.' });
        }

        // Call the database function to update the user by ID
        const updatedUser = await updateUserById(id, { username, email, password });

        // If the user was not found, return a 404 response
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.status(200).json(updatedUser);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update user.' });
    }
};