document.addEventListener('DOMContentLoaded', function() {
  
  // Gestion de la soumission du formulaire de connexion
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
      loginForm.addEventListener('submit', function(event) {
          event.preventDefault();  // Empêcher la soumission standard du formulaire

          // Collecter les données du formulaire
          const formData = new FormData(loginForm);
          fetch('/login', {
              method: 'POST',
              body: formData  // Envoyer les données du formulaire comme corps de la requête POST
          })
          .then(response => response.json())  // Convertir la réponse en JSON
          .then(data => {
              if (data.success) {
                  window.location.href = '/welcome.html'; // Rediriger vers la page d'accueil en cas de succès
              } else {
                  alert(data.message);  // Afficher un message d'erreur en cas d'échec
              }
          })
          .catch(error => console.error('Erreur:', error));
      });
  }
  const ticketListTable = document.getElementById('ticketListTable');
  const modal = document.getElementById('myModal');
  const closeBtn = document.getElementsByClassName('close')[0];

  const accueilLink = document.getElementById('accueilLink');
  const creerTicketLink = document.getElementById('creerTicketLink');
  const ticketsEnCoursLink = document.getElementById('ticketsEnCoursLink');
  const voirTicketsLink = document.getElementById('voirTicketsLink');

  // Load active tickets on initial load
  displayTickets(1, 'En attente,En cours');

  accueilLink.addEventListener('click', function() {
    showSection('homeSection');
    displayTickets(1, 'En attente,En cours'); // Load only active tickets
  });

  creerTicketLink.addEventListener('click', function() {
    showSection('ticketFormContainer');
    resetTicketForm();
  });

  ticketsEnCoursLink.addEventListener('click', function() {
    showSection('ticketListTable');
    displayTickets(1, 'En attente,En cours'); // Load tickets with "En attente" and "En cours" status
  });

  voirTicketsLink.addEventListener('click', function() {
    showSection('ticketListTable');
    displayTickets(1, ''); // Load all tickets regardless of status
  });

  const ticketForm = document.getElementById('ticketForm');
  ticketForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const clientName = document.getElementById('clientName').value;
    const ticketReason = document.getElementById('ticketReason').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const ticketDate = document.getElementById('ticketDate').value;
    const ticketStatus = document.getElementById('ticketStatus').value;

    const formData = {
      clientName: clientName,
      ticketReason: ticketReason,
      email: email,
      phone: phone,
      ticketDate: ticketDate,
      ticketStatus: ticketStatus
    };

    fetch('http://localhost:3001/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur lors de la création du ticket');
      }
      return response.json();
    })
    .then(data => {
      alert('Ticket créé avec succès');
      resetTicketForm();
      displayTickets(1, 'En attente,En cours'); // Refresh to show active tickets after adding a new one
    })
    .catch(error => {
      console.error('Erreur:', error);
      alert('Une erreur est survenue lors de la création du ticket. Veuillez réessayer.');
    });
  });

  function showSection(sectionId) {
    document.getElementById('homeSection').style.display = 'none';
    document.getElementById('ticketFormContainer').style.display = 'none';
    document.getElementById('ticketListTable').style.display = 'none';
    document.getElementById(sectionId).style.display = 'block';
  }

  function resetTicketForm() {
    document.getElementById('ticketForm').reset();
  }

  closeBtn.onclick = function() {
    modal.style.display = 'none';
  };

  window.onclick = function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };

  function displayTickets(page, statusFilter) {
    let url = `http://localhost:3001/tickets?page=${page}&limit=30`;
    if (statusFilter) {
      url += `&status=${encodeURIComponent(statusFilter)}`;
    }
    url += '&orderBy=ticket_date DESC';
    fetch(url)
    .then(response => response.json())
    .then(data => {
        updateTicketTable(data.tickets);
        updatePagination(data.totalPages, page, statusFilter);
    })
    .catch(error => {
        console.error("Erreur lors du chargement des tickets:", error);
        alert('Erreur lors du chargement des tickets. Veuillez vérifier la console pour plus de détails.');
    });
  }

  function updateTicketTable(tickets) {
    const tbody = document.querySelector('#ticketTable tbody');
    tbody.innerHTML = '';
    if (tickets && tickets.length > 0) {
        tickets.forEach(ticket => {
            let row = tbody.insertRow();
            ['client_name', 'ticket_reason', 'email', 'phone', 'ticket_date', 'ticket_status'].forEach(key => {
                let cell = row.insertCell();
                cell.textContent = ticket[key] || ''; // Handles cases where property might be undefined
            });
        });
    } else {
        let row = tbody.insertRow();
        let cell = row.insertCell();
        cell.colSpan = 6; // Ensure this matches the number of columns in your table
        cell.textContent = "Aucun ticket à afficher.";
    }
  }

  function updatePagination(totalPages, currentPage, statusFilter) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
      let btn = document.createElement('button');
      btn.textContent = i;
      btn.addEventListener('click', () => displayTickets(i, statusFilter));
      if (i === currentPage) {
        btn.disabled = true;
      }
      pagination.appendChild(btn);
    }
  }
});
