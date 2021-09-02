const mongoose = require("mongoose");
const { Schema } = mongoose;

//Create Schema
const OrderSchema = new Schema({
  branch: {
    type: Schema.Types.ObjectId,
    ref: "branches",
  },
  items: {
    type: [Schema.Types.ObjectId],
    ref: "items",
    required: true,
  },
  address: {
    type: Schema.Types.ObjectId,
    ref: "addresses",
    required: true,
  },
  status: {
    type: String,
    default: "pending",
    required: false,
  },
});

module.exports = Order = mongoose.model("orders", OrderSchema);
