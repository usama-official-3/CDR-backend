const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: String,
  type: {
    type: String,
    enum: ["free", "premium"],
  },
  image: String,
  downloadLink: String,
  imageDetail: String,
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);