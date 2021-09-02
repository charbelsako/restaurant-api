const mongoose = require("mongoose");
const { Schema } = mongoose;

//Create Schema
const BranchSchema = new Schema({
  location: {
    type: Schema.Types.ObjectId,
    ref: "locations",
    required: true,
  },
  label: {
    type: String,
    required: false,
  },
});

module.exports = Branch = mongoose.model("branches", BranchSchema);
