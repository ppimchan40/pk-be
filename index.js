require("dotenv").config();
const config = require("./config");
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const secret = "Fullstack-Login-2022";
const { MongoClient } = require("mongodb");
const connectDB = require("./connection");

const uri = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());
connectDB();

app.get("/", (req, res) => {
  res.send("Hello! Express");
});

app.post("/register", jsonParser, async (req, res, next) => {
  const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

  const user = req.body;
  const client = new MongoClient(uri);
  await client.connect();
  await client.db("mydb").collection("users").insertOne({
    email: user.email,
    password: hashedPassword,
  });
  await client.close();
  res.status(200).send(user);

  // bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
  //   const user = req.body;
  //   const client = new MongoClient(uri);
  //   await client.connect();
  //   await client.db("mydb").collection("users").insertOne({
  //     email: user.email,
  //     password: hash,
  //   });
  //   await client.close();
  //   res.status(200).send(user);
  // });
  res.send("register");
});

app.post("/login", jsonParser, async (req, res, next) => {
  const user = req.body;
  const client = new MongoClient(uri);
  await client.connect();

  const userLogin = await client.db("mydb").collection("users").findOne({ email: user.email });
  const foundedUser = JSON.parse(JSON.stringify(userLogin));
  const isCorrect = await bcrypt.compare(user.password, foundedUser.password);
  console.log(isCorrect);
  if (!isCorrect) return res.json({ status: "error", message: "login failed" });

  const token = jwt.sign({ email: user.email }, secret);
  await client.close();
  return res.json({ status: "ok", message: "login success", token });
  // bcrypt.compare(user.password, userLogin.password, function (err, isLogin) {
  //   if (isLogin) {
  //     const token = jwt.sign({ email: user.email }, secret);
  //     return res.json({ status: "ok", message: "login success", token });
  //   } else {
  //     return res.json({ status: "error", message: "login failed" });
  //   }
  // });

  res.send("Login");
});

app.post("/authen", jsonParser, async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, secret);
    res.json({ status: "ok", decoded });
  } catch (err) {
    res.json({ status: "error", message: err.message });
  }
});

app.get("/activity", async (req, res) => {
  const client = new MongoClient(uri);
  await client.connect();
  const activities = await client.db("mydb").collection("activities").find({}).toArray();
  await client.close();
  res.status(200).send(activities);
});

//เพิ่มและอัพเดท
app.put("/activity/:id", async (req, res) => {
  const activity = req.body;
  const id = req.params.id;
  const client = new MongoClient(uri);
  await client.connect();
  await client
    .db("mydb")
    .collection("activities")
    .updateOne(
      { id: id },
      {
        $set: {
          id: id,
          user: activity.user,
          title: activity.title,
          type: activity.type,
          description: activity.description,
          date: activity.date,
          time: activity.time,
          numberset: parseInt(activity.numberset),
          calburned: parseInt(activity.calburned),
          duration: parseInt(activity.duration),
          heartrate: activity.heartrate,
        },
      },
      { upsert: true }
    );
  await client.close();
  res.status(200).send(activity);
});

app.delete("/activity/:id", async (req, res) => {
  const id = req.params.id;
  const client = new MongoClient(uri);
  try {
    await client.connect();
    await client.db("mydb").collection("activities").deleteOne({ id: id });
    await client.close();
    res.status(200).send("User with ID = " + id + " is deleted.");
  } catch (error) {
    console.log(error);
    res.status(500).send("Something is wrong");
  }
});

app.get("/activity/run", async (req, res) => {
  const client = new MongoClient(uri);
  await client.connect();
  const run = await client.db("mydb").collection("activities").find({ type: "run" }).toArray();
  await client.close();
  res.status(200).send(run);
});

app.get("/activity/walk", async (req, res) => {
  const client = new MongoClient(uri);
  await client.connect();
  const walk = await client.db("mydb").collection("activities").find({ type: "walk" }).toArray();
  await client.close();
  res.status(200).send(walk);
});

app.get("/activity/swimming", async (req, res) => {
  const client = new MongoClient(uri);
  await client.connect();
  const swimming = await client
    .db("mydb")
    .collection("activities")
    .find({ type: "swimming" })
    .toArray();
  await client.close();
  res.status(200).send(swimming);
});

app.get("/activity/bicycleride", async (req, res) => {
  const client = new MongoClient(uri);
  await client.connect();
  const bicycleride = await client
    .db("mydb")
    .collection("activities")
    .find({ type: "bicycleride" })
    .toArray();
  await client.close();
  res.status(200).send(bicycleride);
});

app.get("/activity/hiking", async (req, res) => {
  const client = new MongoClient(uri);
  await client.connect();
  const hiking = await client
    .db("mydb")
    .collection("activities")
    .find({ type: "hiking" })
    .toArray();
  await client.close();
  res.status(200).send(hiking);
});

app.put("/profile", async (req, res) => {
  const profile = req.body;
  const user = profile.nickname;
  // const id = req.params.id;
  const client = new MongoClient(uri);
  await client.connect();
  await client
    .db("mydb")
    .collection("profile")
    .updateOne(
      { nickname: user },
      {
        $set: {
          picUrl: profile.picUrl,
          name: profile.name,
          surname: profile.surname,
          nickname: profile.nickname,
          dateOfBirth: profile.dateOfBirth,
          weight: parseInt(profile.weight),
          height: parseInt(profile.height),
          sex: profile.sex,
        },
      },
      { upsert: true }
    );
  await client.close();
  res.status(200).send(profile);
});

app.listen(config.port, () => {
  console.log(`Server is listening on port! ${config.port}`);
});
