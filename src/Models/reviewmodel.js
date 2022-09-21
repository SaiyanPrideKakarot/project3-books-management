const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const reviewSchema =  mongoose.Schema({
    bookId: {
        type: ObjectId,
        required: 'Book id is required',
        ref: 'Book',
        trim: true
    },
    reviewedBy: {
        type: String,
        default: 'Guest',
        required: true
        // value: reviewer's name
    },
    reviewedAt: {
        type: Date,
        required: true
    },
    rating: {
        type: Number,
        minimum: 1,
        maximum: 5,
        required: 'Rating is required'
    },
    review: { type: String },
    isDeleted: {
        type: Boolean,
        default: false
    },

}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);