const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

require("dotenv").config();


const app = express();
app.use(express.json({ limit: "100MB" }));
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: ["https://picdop-blush.vercel.app", "http://localhost:3000"],
  credentials: true, //access-control-allow-credentials:true
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

const router = require("./router");

const PORT = process.env.PORT || 5400;

app.use(router);

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(PORT, "0.0.0.0", async () => {
  console.log(`server up on port ${PORT}`);
});
