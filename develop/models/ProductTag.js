const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class ProductTag extends Model {}

ProductTag.init(
  {
    // Define columns
    product_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "product", // References the Product model
        key: "id", // References the 'id' column in Product
      },
      allowNull: false,
    },
    tag_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "tag", // References the Tag model
        key: "id", // References the 'id' column in Tag
      },
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "product_tag",
  }
);

module.exports = ProductTag;
