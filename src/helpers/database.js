const { MONGODB } = require("../config/index");
const mongoose = require("mongoose");

module.exports = (() => {
  mongoose.connect(MONGODB.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.on("open", () =>
    console.log("Connection to MongoDB", { service: "MongoDB" })
  );

  mongoose.connection.on("error", (error) =>
    console.error(`Connection failed: ${error}`, { service: "MongoDB" })
  );
})();
