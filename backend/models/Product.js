const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    stock:{
      type:Number,
      required:true,
      min:0,
    },
    isActive: {
      type: Boolean,
      default: true,
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
