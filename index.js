const express = require('express')
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000
const app = express()

// middleware
app.use(cors())
app.use(express.json())

//connect
const { MongoClient, ServerApiVersion } = require('mongodb')
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b4usj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
})
async function run() {
    try {
        await client.connect()
        const productCollection = client.db('emaJohn').collection('product')
        app.get('/products', async (req, res) => {
            console.log('query', req.query)
            const size = parseInt(req.query.size)
            const page = parseInt(req.query.page)
            const query = {}
            const cursor = productCollection.find(query)
            let products
            if (page || size) {
                products = await cursor
                    .skip(page * size)
                    .limit(size)
                    .toArray()
            } else {
                products = await cursor.toArray()
            }
            res.send(products)
        })
        app.get('/productCount', async (req, res) => {
            const count = await productCollection.estimatedDocumentCount()
            res.send({ count })
        })
    } finally {
        //
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('jhon is running')
})

app.listen(port, () => {
    console.log('jhon is running on port')
})
