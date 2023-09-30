import mongoose, { InferSchemaType, Schema } from 'mongoose';

const schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    title: String,
    content: { type: String, required: true },
    imageId: { type: Schema.Types.ObjectId, ref: 'Image' }
}, { timestamps: true });

type Post = InferSchemaType<typeof schema>;

export const PostModel = mongoose.model('Post', schema);