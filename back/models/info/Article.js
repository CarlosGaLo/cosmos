const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: false
    },
    ttrpg: {
        type: String,
        required: false
    },
    text: {
        type: String,
        required: false
    },
    lastModification: {
        type: Date,
        default: Date.now
    },
    lastUserModifier: {
        type: String,
        required: false
    },
    securityVersión: {
        type: String,
        required: false
    },
    imageURL: {
        type: String,
        required: false
    },
    resume: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Article', articleSchema);