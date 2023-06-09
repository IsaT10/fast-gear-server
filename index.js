const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

require("dotenv").config();

//middle wares
app.use(cors());
app.use(express.json());

//fastGearDb  gear00992211

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kfd97zi.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const servicesCollections = client.db("fastGear").collection("services");
    const reviewsCollections = client.db("fastGear").collection("reviews");

    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = servicesCollections.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    app.get("/services/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await servicesCollections.findOne(query);
      res.send(result);
    });

    app.post("/reviews", async (req, res) => {
      const review = req.body;
      // console.log(review);
      const result = await reviewsCollections.insertOne(review);
      res.send(result);
    });

    //reviews

    app.get("/reviews", async (req, res) => {
      console.log(req.query);
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
        const cursor = reviewsCollections.find(query);
        const reviews = await cursor.toArray();
        res.send(reviews);
      } else {
        query = {
          reviewId: req.query.reviewId,
        };
        const cursor = reviewsCollections.find(query);
        const reviews = await cursor.toArray();
        res.send(reviews);
      }
    });

    //delete review

    app.delete("/reviews/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await reviewsCollections.deleteOne(query);
      res.send(result);
    });

    //update

    app.patch("/reviews/:id", async (req, res) => {
      const { id } = req.params;
      const { rating, message } = req.body;
      console.log(rating, message);
      const query = { _id: new ObjectId(id) };
      const updatedoc = {
        $set: {
          reviewMsg: message,
          rating: rating,
        },
      };
      const result = await reviewsCollections.updateOne(query, updatedoc);
      res.send(result);
    });

    app.get("/reviews/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await reviewsCollections.findOne(query);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send({ message: "server is running" });
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
