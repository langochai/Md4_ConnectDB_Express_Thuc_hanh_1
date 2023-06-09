const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');

const PORT = 8000;
const app = express();

const connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"123",
    database:"md4_connectDB_th_1",
    charset:"utf8_general_ci"
});
connection.connect(err=>{
    if(err) console.log(err.message)
    console.log(`connected to segs`)
})

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.set('view engine','ejs');
app.set('views','./views');

app.get('/books/create', (req, res) => {
    res.render('create')
})
app.post("/books/create", (req, res) => {

    // get data form
    const { name, price, status, author } = req.body;
    console.log(req.body)
    // insert to database
    const sqlInsert = "INSERT INTO books (name, price, status, author) VALUES ?";
    const value = [
        [name, +price, status, author]
    ];
    connection.query(sqlInsert, [value], function (err, result) {
        if (err) throw err;
        res.end("success");
    });
});
app.get("/books", (req, res) => {
    const sql = "SELECT * FROM books";
    connection.query(sql, function (err, result) {
        if (err) throw err;
        res.render("index", {books: result});
    });
})
app.get("/books/:id/delete", (req, res) => {
    const idBook = req.params.id;

    const sql = "DELETE FROM books WHERE id = " + idBook;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        res.redirect('/books')
    });
});
app.get("/books/:id/update", (req, res) => {
    const idBook = req.params.id;
    const sql = "SELECT * FROM books WHERE id = " + idBook;
    connection.query(sql, (err, results) => {
        if (err) throw err;
        res.render('update', {book: results[0]});
    });
});
app.post("/books/:id/update", (req, res) => {
    const idBook = req.params.id;
    const sql = `UPDATE books SET name = ?, price = ?, author = ?, status = ? WHERE id = ?`;
    const { name, price, status, author } = req.body;
    const value = [name, price, author, status, idBook];
    connection.query(sql, value, (err, results) => {
        if (err) throw err;
        res.redirect('/books');
    });
});
app.listen(PORT,()=>{
    console.log(`segs at port ${PORT}`)
});