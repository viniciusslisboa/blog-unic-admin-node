const mongoose = require('../db')

const Schema = mongoose.Schema


const Category = new Schema({
    name: {
        type: String,
        uppercase: true,
        required: true
    },
    slug: {
        type: String,
        lowercase: true,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const Categorys = mongoose.model("category", Category)

module.exports = Categorys