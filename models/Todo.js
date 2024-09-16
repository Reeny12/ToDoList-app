const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
  todo: {
    type: String,
    required: true,
  },
  completed: { type: Boolean, default: false },
});

module.exports = new mongoose.model("Todo", TodoSchema);