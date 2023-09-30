import { UserFollowerModel, UserFollowingModel, UserModel } from '../models';
import { Request, Response } from 'express';

export async function followUser(req: Request, res: Response): Promise<any> {
    const auth = req.user;
    const { username } = req.params;

    try {
        const currentUser = await UserModel.findOne({ username: auth.username });
        const userToFollow = await UserModel.findOne({ username: username });
        if (!userToFollow) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        const updateFollowing = await UserFollowingModel.findOneAndUpdate({ userId: currentUser?._id },
            { followingId: userToFollow._id },
            { upsert: true });

        const updateFollower = await UserFollowerModel.findOneAndUpdate({ userId: userToFollow._id },
            { followerId: currentUser?._id }, { upsert: true });
            
        return res.status(200).json({
            message: 'User followed',
        });
    } catch (err) {
        console.log(err);
    }
}

export async function unfollowUser(req: Request, res: Response): Promise<any> {
    const auth = req.user;
    const { username } = req.params;

    try {
        const currentUser = await UserModel.findOne({ username: auth.username });
        const userToUnfollow = await UserModel.findOne({ username: username });
        if (!userToUnfollow) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        const updateFollowing = await UserFollowingModel.findOneAndUpdate({ userId: currentUser?._id },
            {
                $pull: { followingId: userToUnfollow._id }
            }, { new: true });

        const updateFollower = await UserFollowerModel.findOneAndUpdate({ userId: userToUnfollow._id },
            { $pull: { followerId: currentUser?._id } }, { new: true });

        return res.status(200).json({
            message: 'User unfollowed',
        });
    } catch (err) {
        console.log(err);
    }
}