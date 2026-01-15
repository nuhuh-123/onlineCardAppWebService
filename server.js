const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();
const port = 3000;
 
//database config info
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0,
};
 
const app = express();
app.use(express.json());
 
//start the server
app.listen(port, () => {console.log(`Server running on port`, port)});
 
//routes
 
//get all menu items
app.get('/allmenu', async (req, res) => {
    try {
        let connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM defaultdb.cafemenu');
        res.json(rows);
    } catch(err) {
        console.log(err);
        res.status(500).json({message: 'Server error for allmenu'})
    }
})
 
//add a menu item
app.post('/addmenuItem', async (req, res) => {
    const { name, price, category, image } = req.body;
    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('INSERT INTO cafemenu (name, price, category, image) VALUES (?, ?, ?, ?)', [name, price, category, image]);
        res.status(201).json({message: 'Menu Item '+name+' added Successfully'});
    }
    catch(err) {
        console.log(err);
        res.status(500).json({message: 'Server error - could not add Menu Item '+ name})
    }
});
 
//delete a menu item
app.delete('/deletemenuItem/:id', async (req, res) => {
    const menuItemId = req.params.id;
    try {
        let connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('DELETE FROM cafemenu WHERE id = ?', [menuItemId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({message: 'Menu Item not found'});
        }
        res.json({message: 'Menu Item deleted successfully'});
    } catch(err) {
        console.log(err);
        res.status(500).json({message: 'Server error - could not delete Menu Item'})
    }
});
 
//update a menu item
app.put('/updatemenuItem/:id', async (req, res) => {
    const menuItemId = req.params.id;
    const { name, price, category, image } = req.body;
    try {
        let connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'UPDATE cafemenu SET name = ?, price = ?, category = ?, image = ? WHERE id = ?',
            [name, price, category, image, menuItemId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({message: 'Menu Item not found'});
        }
        res.json({message: 'Menu Item updated successfully'});
    }
    catch(err) {
        console.log(err);
        res.status(500).json({message: 'Server error - could not update Menu Item'})
    }
});
 
 