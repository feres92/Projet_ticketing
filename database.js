const mysql = require('mysql');

// Configuration de la connexion à la base de données
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'tickets',
  port: 3000  // Assurez-vous que ce port est correct et correspond à celui de votre serveur MySQL.
});

// Connexion à la base de données
connection.connect((err) => {
  if (err) {
    console.error('Erreur lors de la connexion à la base de données :', err);
    return;
  }
  console.log('Connecté à la base de données MySQL !');
});

// Fonction pour insérer un nouveau ticket dans la base de données
function insertTicket(clientName, ticketReason, email, phone, ticketDate, ticketStatus) {
  const sql = `INSERT INTO tickets (client_name, ticket_reason, email, phone, ticket_date, ticket_status) VALUES (?, ?, ?, ?, ?, ?)`;
  const values = [clientName, ticketReason, email, phone, ticketDate, ticketStatus];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'insertion du ticket :', err);
    } else {
      console.log('Ticket inséré avec succès !');
    }
  });
}

// Fonction pour récupérer tous les tickets triés par date décroissante
function getTickets(callback) {
  const sql = `SELECT * FROM tickets ORDER BY created_at DESC`; // Assurez-vous que c'est bien 'created_at' qui est utilisé
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des tickets :', err);
      callback(err, null);
    } else {
      console.log('Tickets récupérés avec succès !', results);
      callback(null, results);
    }
  });
}


// Exporter les fonctions pour qu'elles puissent être utilisées dans d'autres fichiers
module.exports = {
  insertTicket,
  getTickets
};
