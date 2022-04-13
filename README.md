# Designing and working with Restful APIs

Tech stack - Node JS, Express, SQLite

This project covers development and tests for APIs -

1.  Creates a new product
2.  Get product by ID
3.  List most viewed products by count
4.  Delete a product

## Database Schema

```
Table products as U {
  id int [pk, increment] // auto-increment
  name text
  price double
  description text
  view_count int
  deleted tinyint
}
```

## Assumptions/Edge Cases

1. A product with the same name cannot be created.
2. By default, while creating the product price is considered to be in USD.
3. For the sake of simplicity, database row `Deleted` has been considered to be set to `1` if product is deleted.
4. API to get a single product will return error, if the product is deleted.

## Future Enhancements

1. `Deleted` column should store the timestamp when a product is deleted.
2. Products should be allowed to be deleted by name, as name is unique.

## Steps to run the project

1. Create a .env file, and specify API_KEY and port

```
API_KEY = "<ENTER THE API KEY HERE>"
port=3000
```

2. Then run the following commands

```bash
npm install
npm start
```

3. `products.db` auto generated sqlite database will be created automatically with test data
4. Import the `Products.postman_collection.json` to Postman to test the working APIs.

## Steps to run the test

1. Create .env.test and specify port

```
port=3002
```

2. Delete the auto generated `products.db` file
3. Execute the command to set the node environment `export NODE_ENV=test` (Note: this will work only for Mac and linux systems)
4. Then run the following command

```bash
npm test
```

5. Alternatively, if you're unable to set the node environment to run the tests, then delete the `products.db` database, stop and restart server, run `npm test` to run the test cases.
