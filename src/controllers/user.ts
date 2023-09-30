import { UserModel, PostModel, ImageModel, UserFollowerModel, UserFollowingModel } from '../models';
import { Request, Response, Router } from 'express';
import { registerValidator, createToken, updateProfileValidator, passwordValidator } from '../middlewares';
import bcrypt from 'bcrypt';

function passwordEncrypt(password: string) {
    const salt: number = 10;
    return bcrypt.hash(password, salt);
}

interface RegisterInfo {
    username: string;
    name: string;
    email: string;
    password: string;
    avatar?: string;
}

interface Profile {
    username: string;
    name: string;
    email: string;
    avatar?: string;
    meta?: {
        following: number;
        follower: number;
    };
}

interface UserData {
    username: string;
    name: string;
    email: string;
    avatar?: string;
}

export async function register(req: Request, res: Response): Promise<any> {
    const info: RegisterInfo = req.body;

    const validated = registerValidator.validate(req.body);
    if (validated.error) {
        return res.status(400).json(validated.error.details[0].message);
    }

    try {
        // check existed user and email
        const existedUsername = await UserModel.find({ username: info.username });
        const existedEmail = await UserModel.find({ email: info.email });
        if (existedUsername.length > 0 || existedEmail.length > 0) {
            if (existedUsername.length > 0) {
                return res.status(400).json('User existed');
            } else {
                return res.status(400).json('Email existed');
            }
        }

        const passwordEncrypted: string = await passwordEncrypt(info.password!);

        let insertedAvatar
        if (info.avatar !== undefined) {
            const userAvatar = new ImageModel({
                image: info.avatar
            });

            insertedAvatar = await userAvatar.save();
        }

        const user = new UserModel({
            username: info.username,
            name: info.name,
            email: info.email,
            password: passwordEncrypted,
            avatar: insertedAvatar !== undefined ? insertedAvatar._id : undefined
        })

        await user.save();

        const token = await createToken(user.username, user.email);

        return res.status(201).json({ jwt: token, data: user });
    } catch (err) {
        console.log(err);
    }
}

export async function login(req: Request, res: Response): Promise<any> {
    const { email, password } = req.body;

    try {
        const existedUser = await UserModel.find({ email });
        if (existedUser.length === 0) {
            return res.status(401).json('Invalid email or password');
        }

        const user = existedUser[0];
        const isMatch: boolean = await bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(401).json('Invalid email or password');
        }

        const token = await createToken(user.username, user.email);

        const avatar = await ImageModel.findOne({ _id: user.avatar });

        const userData: UserData = {
            username: user.username,
            name: user.name,
            email: user.email,
            avatar: avatar?.image
        }

        return res.status(200).json({ jwt: token, data: userData });
    } catch (err) {
        console.log(err);
    }
}

export async function getProfile(req: Request, res: Response): Promise<any> {
    const { username } = req.params;

    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
            return res.status(404).json('User not found');
        }
        const avatar = await ImageModel.findOne({ _id: user.avatar });
        const follower = await UserFollowerModel.findOne({ userId: user._id });
        const following = await UserFollowingModel.findOne({ userId: user._id });

        const profile: Profile = {
            username: user.username,
            name: user.name,
            email: user.email,
            avatar: avatar?.image,
            meta: {
                follower: follower !== null ? follower?.followerId.length as number : 0,
                following: following !== null ? following?.followingId.length as number : 0
            }
        }

        return res.status(200).json({ data: profile });
    } catch (err) {
        console.log(err);
    }
}

export async function updateProfile(req: Request, res: Response): Promise<any> {
    const { username } = req.params;
    const info = req.body;

    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
            return res.status(404).json('User not found');
        }

        // validate request body
        const validated = updateProfileValidator.validate({ username: info.username, name: info.name, email: info.email, avatar: info.avatar });
        if (validated.error) {
            return res.status(400).json(validated.error.details[0].message);
        }

        // check existed user and email
        const existedUser = await UserModel.findOne({ username: info.username });
        const existedEmail = await UserModel.findOne({ email: info.email });
        if (existedUser) {
            return res.status(400).json('This username is already in use');
        }
        if (existedEmail) {
            return res.status(400).json('This email is already in use');
        }

        // check if request body is null or not
        const updateInfo = {
            username: info.username !== undefined ? info.username : user!.username,
            name: info.name !== undefined ? info.name : user!.name,
            email: info.email !== undefined ? info.email : user!.email,
            avatar: info.avatar !== undefined ? info.avatar : user!.avatar,
        }

        const updatedUser = await UserModel.findOneAndUpdate({ username: username }, updateInfo, { new: true });
        if (!updatedUser) {
            return res.status(404).json('Something went wrong');
        }

        return res.status(200).json(updatedUser);
    } catch (err) {
        console.log(err);
    }
}

export async function changePassword(req: Request, res: Response): Promise<any> {
    const auth = req.user;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    try {
        const validated = passwordValidator.validate({ oldPassword: oldPassword, newPassword: newPassword, confirmPassword: confirmPassword });
        if (validated.error) {
            return res.status(400).json(validated.error.details[0].message);
        }

        const user = await UserModel.findOne({ username: auth.username });

        // checking password mismatch or not
        const isMisMatch: boolean = confirmPassword === newPassword;
        if (!isMisMatch) {
            return res.status(403).json("Password mismatch");
        }
        // if password match in database
        const isMatch: boolean = await bcrypt.compareSync(oldPassword, user!.password);
        if (!isMatch) {
            return res.status(400).json('Invalid password');
        }

        const passwordEncrypted: string = await passwordEncrypt(newPassword);
        const updateUserPassword = await UserModel.findOneAndUpdate({ username: user!.username }, { password: passwordEncrypted }, { new: true });

        return res.status(200).json("Password updated");
    } catch (err) {
        console.log(err);
    }
}