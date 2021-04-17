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
const assert = require("assert");
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

  const trainersCollection = client
    .db("extremeFitnessGym")
    .collection("trainers");

  const ordersCollection = client.db("extremeFitnessGym").collection("orders");

  app.get("/orders", (req, res) => {
    ordersCollection.find().toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/services", (req, res) => {
    servicesCollection.find().toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.post("/addService", (req, res) => {
    const service = req.body;
    servicesCollection.insertOne(service).then((result) => {
      console.log(result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/services/:id", (req, res) => {
    var id = req.params.id;
    servicesCollection.find({ _id: ObjectId(id) }).toArray((err, result) => {
      res.send(result[0]);
      //console.log(result[0]);
    });
  });

  app.post("/services/addOrder", (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order).then((result) => {
      console.log(result);
      res.send(result);
    });
  });

  app.delete("/services/delete/:id", (req, res) => {
    servicesCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        console.log(result);
      });
  });

  app.get("/trainers", (req, res) => {
    trainersCollection.find().toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.post("/addTrainer", (req, res) => {
    const trainer = req.body;
    trainersCollection.insertOne(trainer).then((result) => {
      console.log(result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/trainers/:id", (req, res) => {
    var id = req.params.id;
    trainersCollection.find({ _id: ObjectId(id) }).toArray((err, result) => {
      res.send(result[0]);
      //console.log(result[0]);
    });
  });

  app.delete("/trainers/delete/:id", (req, res) => {
    trainersCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        console.log(result);
      });
  });

  app.get("/admin", (req, res) => {
    adminCollection.find().toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/admin/:id", (req, res) => {
    var id = req.params.id;
    adminCollection.find({ _id: ObjectId(id) }).toArray((err, result) => {
      res.send(result[0]);
      //console.log(result[0]);
    });
  });

  app.get("/reviews", (req, res) => {
    reviewsCollection.find().toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.post("/addReview", (req, res) => {
    const review = req.body;
    reviewsCollection.insertOne(review).then((result) => {
      console.log(result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT || port, () => {
  console.log(`Node app started at port ${port}`);
});
