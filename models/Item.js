const mongoose = require("mongoose");
const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  newPrice: {
    type: Number,
    required: true,
  },
  oldPrice: {
    type: Number,
  },
  description: {
    type: String,
    required: true,
  },
  image1: {
    type: String,
  },
  image2: {
    type: String,
  },
  image3: {
    type: String,
  },
  seasonal: {
    type: Boolean,
    default: false,
  },
  new: {
    type: Boolean,
    default: false,
  },
});

const Item = mongoose.model("Item", ItemSchema);

module.exports = Item;
