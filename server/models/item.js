const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 1024,
    required: true
  },
  app: {
    type: String,
    maxlength: 1024,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  sellPrice: {
    type: Number,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  minimumTotalValue: {
    type: Number,
    required: true
  }
});

const Item = mongoose.model('Item', itemSchema);

exports.itemSchema = itemSchema;
exports.Item = Item;