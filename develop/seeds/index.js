const seedCategories = require("./category-seeds");
const seedProducts = require("./product-seeds");
const seedTags = require("./tag-seeds");
const seedProductTags = require("./product-tag-seeds");

const sequelize = require("../config/connection");

const seedAll = async () => {
  try {
    // Sync the database and drop existing tables if necessary
    await sequelize.sync({ force: true });
    console.log("\n----- DATABASE SYNCED -----\n");

    // Seed categories
    await seedCategories();
    console.log("\n----- CATEGORIES SEEDED -----\n");

    // Seed products
    await seedProducts();
    console.log("\n----- PRODUCTS SEEDED -----\n");

    // Seed tags
    await seedTags();
    console.log("\n----- TAGS SEEDED -----\n");

    // Seed product tags
    await seedProductTags();
    console.log("\n----- PRODUCT TAGS SEEDED -----\n");

    // Exit the process once all seeds are complete
    process.exit(0);
  } catch (err) {
    console.error("Error seeding database:", err);
    process.exit(1);
  }
};

seedAll();
