const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS || 5000;
const dbUri = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.l80pesm.mongodb.net/?retryWrites=true&w=majority`;
const dbClient = new MongoClient(dbUri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Server
const run = async () => {
	try {
		const db = dbClient.db('emaJohn');
		const productsCollection = db.collection('products');

		// Products API
		app.get('/products', async (req, res) => {
			const productsLength = await productsCollection.estimatedDocumentCount();

			const page = parseInt(req.query.page) || 0;
			const size = parseInt(req.query.size) || productsLength;

			const query = {};
			const cursor = productsCollection.find(query);
			const products = await cursor.skip(page * size).limit(size).toArray();

			res.send({ products, productsLength });
		});
		app.get('/products/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const product = await productsCollection.findOne(query);

			res.send(product);
		});

		app.post('/productsByIds', async (req, res) => {
			const ids = req.body;
			const objectIds = ids?.map(id => ObjectId(id));
			const query = { _id: { $in: objectIds } };
			const cursor = productsCollection.find(query);
			const products = await cursor.toArray();

			res.send(products);
		})
	} finally {

	}

}
run().catch(err => console.error(err));

// API
app.get('/', (req, res) => {
	res.send('Ema John Simple Server Running!');
});

// Listener
app.listen(port, () => {
	console.log(`Ema John Simple Server running at ${port}`);
});
