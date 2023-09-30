import mongoose, { InferSchemaType, Schema } from 'mongoose';

const schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    followerId: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

type UserFollower = InferSchemaType<typeof schema>;

export const UserFollowerModel = mongoose.model('UserFollower', schema);