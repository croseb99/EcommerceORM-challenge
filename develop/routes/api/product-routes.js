const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// The `/api/products` endpoint

// GET all products with associated Category and Tags
router.get("/", (req, res) => {
  Product.findAll({
    include: [
      {
        model: Category, // Include associated Category model
        attributes: ["id", "name"], // Optional: specify which fields to return
      },
      {
        model: Tag, // Include associated Tag model
        through: { attributes: [] }, // Do not include the join table fields
        attributes: ["id", "name"], // Optional: specify which fields to return
      },
    ],
  })
    .then((products) => res.json(products))
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({ message: "An error occurred while retrieving products." });
    });
});

// GET a single product by its `id` with associated Category and Tags
router.get("/:id", (req, res) => {
  Product.findOne({
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: Category, // Include associated Category model
        attributes: ["id", "name"], // Optional: specify which fields to return
      },
      {
        model: Tag, // Include associated Tag model
        through: { attributes: [] }, // Do not include the join table fields
        attributes: ["id", "name"], // Optional: specify which fields to return
      },
    ],
  })
    .then((product) => {
      if (!product) {
        return res.status(404).json({ message: "Product not found." });
      }
      res.json(product);
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({ message: "An error occurred while retrieving the product." });
    });
});

// POST create a new product
router.post("/", (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // If there are product tags, create pairings in the ProductTag model
      if (req.body.tagIds && req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // If no product tags, just respond with the product
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.error(err);
      res
        .status(400)
        .json({ message: "An error occurred while creating the product." });
    });
});

// PUT update a product by its `id`
router.put("/:id", (req, res) => {
  // Update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        // Find existing tags for the product
        ProductTag.findAll({
          where: { product_id: req.params.id },
        }).then((productTags) => {
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });

          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);

          // Run both actions: remove outdated tags and add new ones
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      console.error(err);
      res
        .status(400)
        .json({ message: "An error occurred while updating the product." });
    });
});

// DELETE a product by its `id`
router.delete("/:id", (req, res) => {
  Product.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((deletedProduct) => {
      if (!deletedProduct) {
        return res.status(404).json({ message: "Product not found." });
      }
      res.json({ message: "Product deleted successfully." });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({ message: "An error occurred while deleting the product." });
    });
});

module.exports = router;
