const mongoose = require("mongoose");

const resumeSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },
    role: String,

    pendingFields: [String],
    currentField: String,

    collectedData: {
      type: Object,
      default: {},
    },

    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "ResumeSession",
  resumeSessionSchema
);
