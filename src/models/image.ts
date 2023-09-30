import mongoose, { InferSchemaType, Schema } from 'mongoose';

const schema = new Schema({
    image: {type: String, default: "https://mymodernmet.com/wp/wp-content/uploads/2023/01/how-to-draw-a-duck-fb-thumbnail.jpg"}
}, { timestamps: true });

type Image = InferSchemaType<typeof schema>;

export const ImageModel = mongoose.model('Image', schema);