const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

// GET all tags with associated products
router.get("/", (req, res) => {
  Tag.findAll({
    include: [
      {
        model: Product, // Include associated Product model
        through: { attributes: [] }, // Exclude join table fields
        attributes: ["id", "name", "price", "stock"], // Optional: specify which attributes to return
      },
    ],
  })
    .then((tags) => res.json(tags))
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({ message: "An error occurred while retrieving tags." });
    });
});

// GET a single tag by its `id` with associated products
router.get("/:id", (req, res) => {
  Tag.findOne({
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: Product, // Include associated Product model
        through: { attributes: [] }, // Exclude join table fields
        attributes: ["id", "name", "price", "stock"], // Optional: specify which attributes to return
      },
    ],
  })
    .then((tag) => {
      if (!tag) {
        return res.status(404).json({ message: "Tag not found." });
      }
      res.json(tag);
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({ message: "An error occurred while retrieving the tag." });
    });
});

// POST create a new tag
router.post("/", (req, res) => {
  Tag.create({
    name: req.body.name, // Assuming name is the only field for a tag
  })
    .then((newTag) => res.status(201).json(newTag))
    .catch((err) => {
      console.error(err);
      res
        .status(400)
        .json({ message: "An error occurred while creating the tag." });
    });
});

// PUT update a tag's name by its `id` value
router.put("/:id", (req, res) => {
  Tag.update(
    {
      name: req.body.name, // Assuming name is the field to update
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((updatedTag) => {
      if (!updatedTag[0]) {
        return res.status(404).json({ message: "Tag not found." });
      }
      res.json({ message: "Tag updated successfully." });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(400)
        .json({ message: "An error occurred while updating the tag." });
    });
});

// DELETE a tag by its `id`
router.delete("/:id", (req, res) => {
  Tag.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((deletedTag) => {
      if (!deletedTag) {
        return res.status(404).json({ message: "Tag not found." });
      }
      res.json({ message: "Tag deleted successfully." });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({ message: "An error occurred while deleting the tag." });
    });
});

module.exports = router;
