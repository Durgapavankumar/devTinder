const mongoose = require("mongoose");

// mongoose.connect(
//   "mongodb+srv://pailladurgapavankumar123:FwMTC52bvn6Qu3fU@cluster0.houcb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
// );

const mongooseDb = async () => {
  await mongoose.connect(
    "mongodb+srv://pailladurgapavankumar123:FwMTC52bvn6Qu3fU@cluster0.houcb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  );
};