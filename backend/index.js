const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://089797:Blex1905@cluster0.flvzdoz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("DB_Recipes").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

let db, recipesCollection;

client.connect(err => {
  if (err) throw err;
  db = client.db('DB_Recipes');
  recipesCollection = db.collection('Dinner_Recipes');
  console.log('Connected to MongoDB');
});

app.get('/recipes', async (req, res) => {
  async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      db = await client.db('DB_Recipes');
      recipesCollection = await db.collection('Dinner_Recipes');
      const recipes = await recipesCollection.find().toArray();
      res.json(recipes);
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
  run().catch(console.dir);
});

// POST endpoint voor het toevoegen van een nieuw recept
app.post('/recipes', async (req, res) => {
  const recipe = req.body; // Haal het recept op van de request body

  async function run() {
    try {
      await client.connect(); // Maak verbinding met MongoDB
      const db = await client.db('DB_Recipes'); // Selecteer de database 'DB_Recipes'
      const recipesCollection = await db.collection('Dinner_Recipes'); // Selecteer de collectie 'Dinner_Recipes'
      await recipesCollection.insertOne(recipe); // Voeg het nieuwe recept toe aan de collectie
      res.status(201).send(recipe); // Stuur het toegevoegde recept terug met status 201 (Created)
    } finally {
      await client.close(); // Sluit de MongoDB client verbinding
    }
  }
  run().catch(err => {
    res.status(500).send(err); // Vang eventuele fouten op en stuur een foutreactie met status 500 (Internal Server Error)
  });
});

const PORT = 5000; // Port waarop de server luistert
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // Start de server en log een bericht naar de console
});
