const mongoose = require("mongoose");
const { Schema } = mongoose;

//Create Schema
const AddressSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "users",
  },
  location: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "locations",
  },
  label: {
    type: String,
    required: false,
  },
});

module.exports = Address = mongoose.model("addresses", AddressSchema);
