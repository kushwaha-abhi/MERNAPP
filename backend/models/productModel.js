const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter product name'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please enter description']
    },
    price: {
        type: Number,
        required: [true, 'Please enter price of product'],
        maxLength: [8, 'Price cannot exceed eight figures']
    },
    rating: {
        type: Number,
        default: 0
    },
    image: [
        {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            }
        }
    ],
    category: {
        type: String,
        required: [true, 'Please enter product category'],
    },
    stock: {
        type: Number,
        required: [true, 'Please enter product count'],
        maxLength: [4, 'Stock cannot exceed four figures'],
        default: 1
    },
    numofReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comments: {
                type: String,
                required: true
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const dataModel = mongoose.model("Product", productSchema);

module.exports = dataModel;
