const express = require("express");
const routes = require("./develop/routes");
const sequelize = require("./develop/config/connection"); // Import the Sequelize connection

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

// Sync sequelize models to the database, then turn on the server
sequelize
  .sync({ force: false }) // `force: false` ensures that it doesn't drop the tables each time the server restarts
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}!`);
    });
  })
  .catch((err) => {
    console.error("Error syncing the database:", err);
  });
