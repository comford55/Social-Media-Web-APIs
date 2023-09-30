import mongoose, { InferSchemaType, Schema } from 'mongoose';

const schema = new Schema({
    username: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: Schema.Types.ObjectId, ref: 'Image' }
}, { timestamps: true });

type User = InferSchemaType<typeof schema>;

export const UserModel = mongoose.model('User', schema);

