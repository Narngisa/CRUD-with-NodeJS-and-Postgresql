// npm install dotenv

require('dotenv').config()

// npm install express nodemon cors body-parser

const bodyParser = require("body-parser");
const express = require('express');
const cors = require('cors')
const app = express();
const PORT = process.env.PORT;

// npm install pg

const { Client } = require('pg');

// Connecting to postgresql

const client = new Client({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT_DB,
});
client.connect();

// Use body-parser and cors

app.use(bodyParser.json());
app.use(cors())

// Localhost to PORT

app.listen(PORT, () => 
    console.log(`Application is connecting to http://localhost:${PORT}`)
)

// Frist page to test code!!!

app.get('/', (req, res) => {
    return res.send('Api is running !!!')
})

// Get all data from postgresql

app.get('/apis', (req, res) => {
    client.query('SELECT * FROM public.product', 
        function(error, results, fields) {
            if (error) throw error;
            res.send(results.rows);
        }
    );
})

// Get data from postgresql with id's data

app.get('/apis/:id', (req, res) => {
    client.query(`SELECT * FROM public.product where id=${req.params.id}`, 
        function(error, results, fields) {
            if (error) throw error;
            res.send(results.rows);
            
    })
})

// Post data into postgresql

app.post('/apis', (req, res) => {
    const products = req.body;
    const insertQuery = `insert into product(firstname, lastname, comments, star_rating) 
                        values('${products.firstname}', '${products.lastname}', '${products.comments}', '${products.star_rating}')`

    client.query(insertQuery, function(error, results, fields) {
        if (error) throw error;
        res.send('Insertion was successful');
    })
})

// Update data with id's data

app.put('/apis/:id', (req, res) => {
    const products = req.body;
    const updateQuery = `update product
                        set firstname = '${products.firstname}', 
                        lastname = '${products.lastname}', 
                        comments = '${products.comments}', 
                        star_rating = '${products.star_rating}'
                        where id = ${products.id}`

    client.query(updateQuery, function(error, results, fields) {
        if (error) throw error;
        res.send('Update was successful');
    })
})

// Delete data in postgresql

app.delete('/apis/:id', (req, res) => {
    const insertQuery = `delete from product where id=${req.params.id}`

    client.query(insertQuery, function(error, results, fields) {
        if (error) throw error;
        res.send('Delete was successful')
    })
})
