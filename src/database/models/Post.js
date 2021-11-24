const mongoose = require('../db')
const Schema = mongoose.Schema

const Post = new Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        lowercase: true,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
         type: mongoose.Types.ObjectId, 
         ref: "category"
    }, 
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const Posts = mongoose.model("posts", Post)

module.exports = Posts