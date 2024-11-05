const { Schema, model } = require('mongoose');

const blogschema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    coverimageurl: {
        type: String
    },
    createdby: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
}, { timestamps: true });

const Blog = model('blog', blogschema);

module.exports = Blog;
