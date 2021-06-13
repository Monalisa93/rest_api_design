module.exports = (app) => {
  const Product = require("../controllers/product.controller.js");

  // Get the most viewed roducts
  app.get("/getProducts", Product.findAll);

  // Get a Product by Product ID
  app.post("/getProductById", Product.findById);

  // Create New Product
  app.post("/createProduct", Product.create);

  // Delete Product
  app.delete("/deleteProduct", Product.delete);
};
