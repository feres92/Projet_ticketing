const express = require('express');
const mysql = require('mysql');
const path = require('path');
const cors = require('cors');
const app = express();

// Middleware pour analyser le JSON - body-parser est maintenant intégré à Express
app.use(express.json());

// Middleware pour les fichiers statiques - ajustez le chemin si nécessaire
app.use(express.static(path.join(__dirname, 'public')));

// Route par défaut qui redirige vers la page de connexion
app.get('/', (req, res) => {
    res.sendFile(__dirname, '/src/views/login.html'); // Assurez-vous que le chemin est correct
});

// Configuration de la connexion à la base de données MySQL
// Assurez-vous que ces informations correspondent à votre configuration MAMP
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'tickets',
    port: 8889  // Port par défaut pour MySQL
});

// Gestion des erreurs de connexion à la base de données
db.connect(err => {
    if (err) {
        console.error('Erreur de connexion à la base de données:', err);
        return;
    }
    console.log('Connecté à la base de données MySQL!');
});

// Middleware CORS pour permettre les requêtes cross-origin
// Ici, nous autorisons toutes les origines, mais vous pouvez restreindre à certaines si nécessaire
app.use(cors());

// Importation et utilisation des routeurs pour les tickets
const ticketsRouter = require('./routes/tickets');
// Ici, nous passons 'db' au routeur des tickets
app.use('/tickets', ticketsRouter(db));  

// Définition du port sur lequel le serveur doit écouter
// Le serveur écoute maintenant sur le port 3001 pour ne pas entrer en conflit avec d'autres services
const port = 3001;
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});

// Pour gérer les erreurs de route non trouvée (404)
app.use((req, res, next) => {
    res.status(404).send("Désolé, cette route n'existe pas !");
});

// Gestionnaire d'erreurs générales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Quelque chose s\'est mal passé !');
});
// Après toutes vos routes spécifiques
app.get('/', (req, res) => {
    res.redirect('/src/views/login.html');  // Assurez-vous que le chemin est correct
  });
  