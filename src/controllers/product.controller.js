const Product = require("../model/product.model.js");
// Create and Save a new Product
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Product
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    view_count: 0,
    deleted: 0
  });

  // Save Product in the database
  Product.create(product, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the product."
      });
    else res.send(data);
  });
};

// Find a single Product with a ProductId
exports.findById = (req, res) => {
  Product.findById(req.body.id, req.body.currency, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Products."
      });
    else res.send(data);
  });
};

// Retrieve all Products from the database.
exports.findAll = (req, res) => {
    Product.getAll(req.body.count, req.body.currency, (err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving Products."
          });
        else res.send(data);
      });
};

// Delete a Product with the specified ProductId in the request
exports.delete = (req, res) => {
    Product.remove(req.body.id, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Product with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Could not delete Product with id " + req.params.id
            });
          }
        } else res.send({ message: `Product was deleted successfully!` });
      });
};
