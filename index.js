require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const contactRoutes = require("./routes/contactRoutes");
const sequelize = require("./config/database");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use("/api", contactRoutes);
app.use(cors());

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    await sequelize.authenticate();
    console.log(
      "Connection to the database has been established successfully."
    );
    await sequelize.sync({ alter: true });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
