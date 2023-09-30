import mongoose, { InferSchemaType, Schema } from 'mongoose';

const schema = new Schema({
    postId: { type: Schema.Types.ObjectId, ref: 'Post' },
    userLikeId: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

type UserLikePost = InferSchemaType<typeof schema>;

export const UserLikePostModel = mongoose.model('UserLikePost', schema);