require('dotenv').config()
const mongoose = require("mongoose")

// Connect to MongoDB - database login is retrieved from environment variables - YOU SHOULD USE YOUR OWN ATLAS CLUSTER
CONNECTION_STRING = "mongodb+srv://<username>:<password>@cluster0.nm8oy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
MONGO_URL = CONNECTION_STRING.replace("<username>",process.env.MONGO_USERNAME).replace("<password>",process.env.MONGO_PASSWORD)

//esteblish the connection
mongoose.connect(MONGO_URL || "mongodb://localhost", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  dbName: "snack_in_a_van"
})

const db = mongoose.connection

//handle the error that is caused by the db connection
db.on("error", err => {
  console.error(err);
  process.exit(1)
})

//log the success message
db.once("open", async () => {
  console.log("Mongo connection started on " + db.host + ":" + db.port)
})

//import all models
require("./author")
require("./snack")
require("./vendor")
require("./order")