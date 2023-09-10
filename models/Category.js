const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    parent: {
      type: String,
      required: false,
      default: null,
    },
    children: [String],
    attributes: [
      {
        name: {
          type: String,
          required: true,
        },
        required: {
          type: Boolean,
          required: true,
        },
        type: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    collection: 'categories',
  }
);

const categoryModel = model('Category', categorySchema);

// await categoryModel.createCollection();

module.exports = categoryModel;

// Compare this snippet from controllers/categoryController.js:
