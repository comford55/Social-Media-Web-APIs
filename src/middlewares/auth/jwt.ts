import jwt from 'jsonwebtoken';

const secret: string = process.env.JWT_SECRET!;

export function createToken(username: string, email: string) {
    try {
        const token = jwt.sign({ username: username, email: email }, secret);
        return token;
    } catch (err) {
        console.log(err);
    }
};

export function verifyToken(token: string) {
    try {
        const decoded = jwt.verify(token, secret);
        return decoded;
    } catch (err) {
        console.log(err);
    }
}