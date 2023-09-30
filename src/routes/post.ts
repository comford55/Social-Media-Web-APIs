import { Router } from 'express';
import { createPost, userLikePost, userUnlikePost } from '../controllers'
import { authorize } from '../middlewares';

export const postRouter = Router();

postRouter.post('/post', authorize, createPost);
postRouter.put('/like/:postId', authorize, userLikePost);
postRouter.delete('/like/:postId', authorize, userUnlikePost);