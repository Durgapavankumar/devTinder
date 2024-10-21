const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "rejected", "accepted"],
        message: `{VALUE} is an incorrect status type`,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Create an index on fromUserId and toUserId for faster lookups
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

// Pre-save hook to prevent sending a connection request to yourself
connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    return next(new Error("Cannot send connection request to yourself!"));
  }
  next();
});

// Define and export the ConnectionRequest model
const ConnectionRequestModel = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
