const router = require("express").Router();
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint

// GET all categories with their associated products
router.get("/", (req, res) => {
  Category.findAll({
    include: {
      model: Product, // Include the associated Product model
      attributes: ["id", "name", "price", "stock"], // Optional: specify which attributes to return
    },
  })
    .then((categories) => res.json(categories))
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({ message: "An error occurred while retrieving categories." });
    });
});

// GET a single category by its `id` value, including associated products
router.get("/:id", (req, res) => {
  Category.findOne({
    where: {
      id: req.params.id,
    },
    include: {
      model: Product, // Include the associated Product model
      attributes: ["id", "name", "price", "stock"], // Optional: specify which attributes to return
    },
  })
    .then((category) => {
      if (!category) {
        return res.status(404).json({ message: "Category not found." });
      }
      res.json(category);
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({ message: "An error occurred while retrieving the category." });
    });
});

// POST a new category
router.post("/", (req, res) => {
  Category.create({
    name: req.body.name, // Assuming `name` is the only required field
  })
    .then((newCategory) => res.status(201).json(newCategory))
    .catch((err) => {
      console.error(err);
      res
        .status(400)
        .json({ message: "An error occurred while creating the category." });
    });
});

// PUT update a category by its `id` value
router.put("/:id", (req, res) => {
  Category.update(
    {
      name: req.body.name, // Assuming `name` is the only field to update
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((updatedCategory) => {
      if (!updatedCategory[0]) {
        return res.status(404).json({ message: "Category not found." });
      }
      res.json({ message: "Category updated successfully." });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(400)
        .json({ message: "An error occurred while updating the category." });
    });
});

// DELETE a category by its `id` value
router.delete("/:id", (req, res) => {
  Category.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((deletedCategory) => {
      if (!deletedCategory) {
        return res.status(404).json({ message: "Category not found." });
      }
      res.json({ message: "Category deleted successfully." });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({ message: "An error occurred while deleting the category." });
    });
});

module.exports = router;
