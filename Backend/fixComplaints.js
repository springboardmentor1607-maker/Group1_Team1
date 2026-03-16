const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./backend.env" });

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  
  // Fix missing fields
  await mongoose.connection.collection("complaints").updateMany(
    {},
    {
      $set: {
        upvotes: 0,
        downvotes: 0,
        voters: [],
        comments: 0,
        commentsList: [],
      }
    }
  );

  // Fix invalid "completed" status → "resolved"
  const result = await mongoose.connection.collection("complaints").updateMany(
    { status: "completed" },
    { $set: { status: "resolved" } }
  );

  console.log("Fixed status on:", result.modifiedCount, "complaints");
  mongoose.disconnect();
});