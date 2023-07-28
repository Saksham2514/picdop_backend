const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(express.json({ limit: "100MB" }));
app.use(express.urlencoded({ extended: true }));


const corsOptions ={
  origin:'https://picdop-blush.vercel.app', 
  credentials:true,            //access-control-allow-credentials:true
  optionsSuccessStatus:200,
  methods: [
    'GET',
    'POST',
    'PUT',
    'DELETE',
  ],
  allowedHeaders: [
    'Content-Type',
  ],

}
app.use(cors(corsOptions));
app.options('*',cors())

const router = require("./router");

const PORT = process.env.PORT || 5000;
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


app.listen(PORT, async () => {
  console.log(`server up on port ${PORT}`);
});
