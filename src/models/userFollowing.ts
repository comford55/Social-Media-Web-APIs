import mongoose, { InferSchemaType, Schema } from 'mongoose';

const schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    followingId: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

type UserFollowing = InferSchemaType<typeof schema>;

export const UserFollowingModel = mongoose.model('UserFollowing', schema);