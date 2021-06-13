const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;
let should = chai.should();
const { app } = require("../server");

describe("POST /createProduct", function () {
  it("should create a new product in database and return the product details", (done) => {
    request(app)
      .post("/createProduct")
      .send({
        name: "Product 10",
        price: 150.02,
        description: "This is new product 10",
      })
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res, body) => {
        if (err) return done(err);
        expect(res.status).to.eq(200);
        expect(res).to.have.property("body");
        expect(res.body).to.have.property("created");
        expect(res.body).to.have.property("name");
        expect(res.body).to.have.property("price");
        expect(res.body).to.have.property("description");
        done();
      });
  });

  it("should not create a product with same name", (done) => {
    request(app)
      .post("/createProduct")
      .send({
        name: "Product 1",
        price: 150,
        description: "This is new product1",
      })
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res, body) => {
        if (err) return done(err);
        expect(res.status).to.eq(200);
        expect(res).to.have.property("body");
        expect(res.body).to.have.property("error");
        done();
      });
  });
});

describe("POST /getProductById - with only ID", function () {
  it("should return product detail with USD currency.", (done) => {
    request(app)
      .post("/getProductById")
      .send({
        id: 1,
      })
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res, body) => {
        if (err) return done(err);
        expect(res.status).to.eq(200);
        expect(res).to.have.property("body");
        expect(res.body).to.have.property("id");
        expect(res.body).to.have.property("name");
        expect(res.body).to.have.property("price");
        expect(res.body).to.have.property("description");
        expect(res.body).to.have.property("view_count");
        done();
      });
  });
});

describe("GET /getProducts - without parameter", function () {
  it("should return 0 ~ 5 products detail with USD currency", (done) => {
    request(app)
      .get("/getProducts")
      .send({
        view_count: 5,
      })
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res, body) => {
        if (err) return done(err);
        expect(res.status).to.eq(200);
        expect(res).to.have.property("body");
        done();
      });
  });
});

describe("GET /getProducts - with parameter count:1", function () {
  it("Should return 1 product detail with USD currency.", (done) => {
    request(app)
      .get("/getProducts")
      .send({
        count: 1,
      })
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res, body) => {
        if (err) return done(err);
        expect(res.status).to.eq(200);
        expect(res).to.have.property("body");
        done();
      });
  });
});

describe("GET /getProducts - with parameter count:5 and currency: GBP", function () {
  it("Should return 0~5 products detail with GBP currency.", (done) => {
    request(app)
      .get("/getProducts")
      .send({
        count: 5,
        currency: "GBP",
      })
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res, body) => {
        if (err) return done(err);
        expect(res.status).to.eq(200);
        expect(res).to.have.property("body");
        done();
      });
  });
});

describe("DELETE /deleteProduct", function () {
  it('Should return message "Product was deleted successfully!".', (done) => {
    request(app)
      .delete("/deleteProduct")
      .send({
        id: 1,
      })
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res, body) => {
        if (err) return done(err);
        expect(res.status).to.eq(200);
        expect(res).to.have.property("body");
        expect(res.body).to.have.property("message");
        done();
      });
  });
});
