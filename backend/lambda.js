// AWS Lambda entry points. API function wraps the Express app.
// Scheduled function is invoked by EventBridge once per day.
require("dotenv").config();
const serverless = require("serverless-http");
const mongoose = require("mongoose");
const app = require("./serverlessApp");
const { runExpiryCheck } = require("./src/routes/alerts");

let connectionPromise;
async function connectMongo() {
  if (!connectionPromise) connectionPromise = mongoose.connect(process.env.MONGODB_URI);
  await connectionPromise;
}

exports.api = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  await connectMongo();
  return serverless(app)(event, context);
};

exports.expiry = async () => {
  await connectMongo();
  const result = await runExpiryCheck();
  return { statusCode: 200, body: JSON.stringify(result) };
};
