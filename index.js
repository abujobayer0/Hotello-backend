const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
//MIDDLE WIRE
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.DB_PASS}@cluster0.i5xrg34.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const newsCollection = client.db("hotello").collection("news");
    app.get("/news", async (req, res) => {
      console.log(req.query);
      const page = parseInt(req.query.page);
      const query = {};
      const cursor = newsCollection.find(query);
      let news;
      if (page) {
        news = await cursor
          .skip(page * 10)
          .limit(10)
          .toArray();
      } else {
        news = await cursor.toArray();
      }
      res.send(news);
    });

    app.get("/newscount", async (req, res) => {
      const count = await newsCollection.estimatedDocumentCount();
      res.send({ count });
    });
  } finally {
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Hotello is running");
});
app.listen(port, () => {
  console.log("Hotello is running on port ", port);
});
