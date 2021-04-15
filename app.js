const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 5000;

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yorqu.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const adminCollection = client.db("extremeFitnessGym").collection("admin");

  const servicesCollection = client
    .db("extremeFitnessGym")
    .collection("services");

  const reviewsCollection = client
    .db("extremeFitnessGym")
    .collection("reviews");

  app.get("/services", (req, res) => {
    servicesCollection.find().toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/reviews", (req, res) => {
    reviewsCollection.find().toArray((err, documents) => {
      res.send(documents);
    });
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT || port, () => {
  console.log(`Node app started at port ${port}`);
});
