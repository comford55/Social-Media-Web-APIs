import { Router } from 'express';
import { register, login, getProfile, updateProfile, followUser, unfollowUser, changePassword } from '../controllers'
import { authorize } from '../middlewares';

export const userRouter = Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/:username', authorize, getProfile);
userRouter.put('/:username', authorize, updateProfile);
userRouter.put('/follow/:username', authorize, followUser);
userRouter.delete('/follow/:username', authorize, unfollowUser);
userRouter.patch('/change-password/:username', authorize, changePassword);