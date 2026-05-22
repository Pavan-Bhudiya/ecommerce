const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
    },
    status:{
      type:String,
      default:'Pending',
      enum:['Pending','Failed','Cancelled','Confirmed'],
    }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    total: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);
