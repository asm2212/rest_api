import express from 'express';
import { deleteUser, getAllUsers, updateUser } from 'controllers/user';
import { isAuthenticated, isOwner } from 'middlewares';
export default (
    router: express.Router
) => {
    router.get('/users',isAuthenticated, getAllUsers);
    router.delete('/users/:id',isAuthenticated , deleteUser,isOwner);
    router.put('/users/:id',isAuthenticated,isOwner,updateUser);
};