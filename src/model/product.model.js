const sql = require("./db.js");
const getCurrencyRate = require("../common/common");

// constructor
const Product = function (product) {
  this.name = product.name;
  this.price = product.price;
  this.description = product.description;
  this.view_count = product.view_count;
  this.deleted = product.deleted;
};

let currency_rate;

/**
 * Creates a new product
 * @param {Object} newProduct
 * @param {*} result
 */
Product.create = async (newProduct, result) => {
  sql.each(
    `SELECT COUNT(*) as count FROM products WHERE name = '${newProduct.name}'`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      console.log(res.count);
      if (res.count != 0) {
        result(null, { error: "Product already exists with the given name." });
        return;
      }
      sql.run(
        `INSERT INTO products (name, price, description) VALUES ('${newProduct.name}', ${newProduct.price}, '${newProduct.description}' )`,
        (err) => {
          if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
          }
          // console.log("created product: ", { id: res.insertId, ...newProduct });
          result(null, {
            created: true,
            name: newProduct.name,
            price: newProduct.price + " " + "USD",
            description: newProduct.description,
          });
        }
      );
    }
  );
};

/**
 * Get Single Product by ID
 * @param {number} id product's id
 * @param {string} currency
 * @param {*} result
 */
Product.findById = (id, currency, result) => {
  //if currency != USD, get currency rates.
  if (currency != "USD") {
    getCurrencyRate().then((res) => {
      currency_rate = res.quotes;
      getProductByID(id, currency, result);
    });
  } else {
    getProductByID(id, currency, result);
  }
};

getProductByID = (id, currency, result) => {
  sql.each(
    `SELECT * FROM products WHERE id = ${id} AND deleted=0`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      let price = res.price;
      sql.run(
        `UPDATE products SET view_count=(${
          parseInt(res.view_count) + 1
        }) WHERE id=${id}`,
        (err, res1) => {
          if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
          }
          switch (currency) {
            case "CAD":
              price = price * currency_rate.USDCAD;
              break;
            case "EUR":
              price = price * currency_rate.USDEUR;
              break;
            case "GBP":
              price = price * currency_rate.USDGBP;
              break;
            default:
              currency = "USD";
              break;
          }

          let response = {
            id: res.id,
            name: res.name,
            price: price + " " + currency,
            description: res.description,
            view_count: res.view_count + 1,
          };
          result(null, response);
        }
      );
    },
    (__, count) => {
      if (count === 0) {
        result(null, `No product found with corresponding ${id} in database`);
        return;
      }
    }
  );
};

/**
 * Get Products by view_count and currency
 * By default it returns first 5 products with view_count in descending order
 * @param {number} view_count incremented value every time product's detail is requested
 * @param {string} currency
 * @param {*} result
 */
Product.getAll = async (view_count, currency, result) => {
  if (currency != "USD") {
    await getCurrencyRate().then((res) => {
      currency_rate = res.quotes;
      getProducts(view_count, currency, result);
    });
  } else {
    getProducts(view_count, currency, result);
  }
};

getProducts = (view_count, currency, result) => {
  let v_count = 5;
  if (view_count != null) {
    v_count = view_count;
  }
  sql.all(
    `SELECT * FROM products WHERE deleted = 0 ORDER BY view_count DESC limit ${v_count} `,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      let rate = 1;
      switch (currency) {
        case "CAD":
          rate = currency_rate.USDCAD;
          break;
        case "EUR":
          rate = currency_rate.USDEUR;
          break;
        case "GBP":
          rate = currency_rate.USDGBP;
          break;
        default:
          currency = "USD";
          break;
      }

      let data = [];
      res.forEach((item) => {
        let tmp = {
          id: item.id,
          name: item.name,
          price: item.price * rate + " " + currency,
          description: item.description,
          view_count: item.view_count,
        };

        data.push(tmp);
      });

      result(null, data);
    }
  );
};

/**
 * Deletes a product from database by id
 * For future enhancements, column should capture deleted_at TIMESTAMP
 * @param {*} id auto incremented product's id
 * @param {*} result
 */
Product.remove = (id, result) => {
  sql.run(`UPDATE products SET deleted=1 WHERE id=${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("deleted Product with id: ", id);
    result(null, res);
  });
};

module.exports = Product;
