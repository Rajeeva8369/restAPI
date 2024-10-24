const express = require('express');
const mysql = require('mysql');
const app = express();
const expressPort = 3000;
app.use(express.json());

// Connexion à la première base de données (restauAPI)
const db1 = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'restauAPI'
});

// Connexion à la seconde base de données (restauAPI2)
const db2 = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'restauAPI2'
});

// Connexion aux bases de données
db1.connect((err) => {
    if (err) {
        console.log('ERREUR DE CONNEXION À restauAPI:', err);
    } else { 
        console.log('BRAVO, VOUS ÊTES CONNECTÉ À restauAPI !');
    }
});

db2.connect((err) => {
    if (err) {
        console.log('ERREUR DE CONNEXION À restauAPI2:', err);
    } else { 
        console.log('BRAVO, VOUS ÊTES CONNECTÉ À restauAPI2 !');
    }
});

// Lancer le serveur sur le port 3000
app.listen(expressPort, () => {
    console.log('MON SERVEUR TOURNE SUR LE PORT :', expressPort);
});

// Route GET pour récupérer les items des deux bases de données
app.get('/items', (req, res) => {
    const sql = 'SELECT * FROM items;';
    db1.query(sql, (err, results1) => {
        if (err) {
            return res.status(500).json({ error: 'ERREUR DU SERVEUR restauAPI', details: err });
        }

        db2.query(sql, (err, results2) => {
            if (err) {
                return res.status(500).json({ error: 'ERREUR DU SERVEUR restauAPI2', details: err });
            }

            return res.status(200).json({
                restauAPI: results1,
                restauAPI2: results2
            });
        });
    });
});

// Route POST pour créer un item dans les deux bases de données
app.post('/createitems', (req, res) => {
    const { name, description, price } = req.body;
    const sql = `INSERT INTO items (name, description, price) VALUES (?, ?, ?)`;

    db1.query(sql, [name, description, price], (err, result1) => {
        if (err) {
            return res.status(500).json({ error: 'ERREUR LORS DE L\'INSERTION DANS restauAPI', details: err });
        }

        db2.query(sql, [name, description, price], (err, result2) => {
            if (err) {
                return res.status(500).json({ error: 'ERREUR LORS DE L\'INSERTION DANS restauAPI2', details: err });
            }

            return res.status(201).json({ message: 'ITEM AJOUTÉ DANS LES DEUX BASES AVEC SUCCÈS' });
        });
    });
});

// Route PUT pour mettre à jour un item dans les deux bases de données
app.put('/updateitems/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, price } = req.body;
    const sql = `UPDATE items SET name = ?, description = ?, price = ? WHERE id = ?`;

    db1.query(sql, [name, description, price, id], (err, result1) => {
        if (err) {
            return res.status(500).json({ error: 'ERREUR LORS DE LA MISE À JOUR DANS restauAPI', details: err });
        }

        db2.query(sql, [name, description, price, id], (err, result2) => {
            if (err) {
                return res.status(500).json({ error: 'ERREUR LORS DE LA MISE À JOUR DANS restauAPI2', details: err });
            }

            return res.status(200).json({ message: 'ITEM MIS À JOUR DANS LES DEUX BASES AVEC SUCCÈS' });
        });
    });
});

// Route DELETE pour supprimer un item dans les deux bases de données
app.delete('/deleteitems/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM items WHERE id = ?`;

    db1.query(sql, [id], (err, result1) => {
        if (err) {
            return res.status(500).json({ error: 'ERREUR LORS DE LA SUPPRESSION DANS restauAPI', details: err });
        }

        db2.query(sql, [id], (err, result2) => {
            if (err) {
                return res.status(500).json({ error: 'ERREUR LORS DE LA SUPPRESSION DANS restauAPI2', details: err });
            }

            return res.status(200).json({ message: 'ITEM SUPPRIMÉ DANS LES DEUX BASES AVEC SUCCÈS' });
        });
    });
});
