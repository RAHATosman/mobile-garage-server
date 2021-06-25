const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();

const port = process.env.PORT || 5000;

app.use(cors())

app.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mobile-garage.ebwes.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
    res.send('<h1>This is mobile garage server homepgae</h1>');
});

client.connect(err => {
    const products = client.db(process.env.DB_NAME).collection("products");
    const orders = client.db(process.env.DB_NAME).collection("orders");


    // Get all products
    app.get('/products', (req, res) => {

        products.find({})
            .toArray((error, documents) => {
                res.json(documents);
            });
    });

    // Add single product
    app.post('/addProduct', (req, res) => {

        const product = req.body;

        products.insertOne(product)
            .then(result => {
                res.send(result.insertedCount > 0);
            });
    });

    // Find and delete single product
    app.delete('/deleteProduct/:id', (req, res) => {

        const id = req.params.id;

        products.findOneAndDelete({ _id: ObjectId(id) })
            .then(result => {
                res.send(!!result.value);
            });
    });

    // Add single order
    app.post('/placeOrder', (req, res) => {

        const order = req.body;

        orders.insertOne(order)
            .then(result => {
                res.send(result.insertedCount > 0);
            });
    });

    // Get single product
    app.get('/product/:id', (req, res) => {

        const id = req.params.id;

        products.find({ _id: ObjectId(id) })
            .toArray((error, documents) => {
                res.json(documents[0]);
            });
    });


    // Get all orders filtered by email
    app.get('/orders', (req, res) => {

        const query = req.query;

        orders.find(query)
            .toArray((error, documents) => {
                res.json(documents);
            });
    });

    // Find and delete single order
    app.delete('/cancelOrder/:id', (req, res) => {
        
        const id = req.params.id;

        orders.findOneAndDelete({ _id: ObjectId(id) })
            .then(result => {
                res.send(!!result.value);
            });
    });

    // console.log('Database connected');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});