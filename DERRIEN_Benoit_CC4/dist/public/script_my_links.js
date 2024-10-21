"use strict";

// Assurez-vous d'utiliser le bon protocole (http) et le bon domaine pour API_URL
const API_URL = "http://localhost:3000/"; // Ajout du protocole

fetch(`http://localhost:3000/api/my_links`) // Utilisation de API_URL pour l'URL de la requête
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur réseau');
        }
        return response.json();
    })
    .then(data => {
        const linksTableBody = document.getElementById('links-table'); // Utilisez l'ID de tbody
        const noLinksMessage = document.getElementById('no-links-message');

        if (data.status === "SUCCESS" && data.links.length > 0) {
            noLinksMessage.style.display = 'none'; // Cache le message "Aucun lien"
            linksTableBody.innerHTML = ''; // Réinitialise le contenu avant d'ajouter les liens

            data.links.forEach(link => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${link.id}</td>
                    <td>${link.original_url}</td>
                    <td>${link.short_url}</td>
                    <td>
                        <button class="button is-small" onclick="copyToClipboard('${link.short_url}')">Copier</button>
                        <button class="button is-small is-danger" onclick="deleteLink(${link.id})">Supprimer</button>
                    </td>
                `;
                linksTableBody.appendChild(row);
            });
            
            
        } else {
            noLinksMessage.style.display = 'block'; // Affiche le message "Aucun lien"
            linksTableBody.innerHTML = ''; // Vide le tableau
        }
    })
    .catch(error => {
        Swal.fire('Erreur', 'Erreur lors de la récupération des liens: ' + error.message, 'error');
    });

// Fonction pour copier le lien réduit
function copyToClipboard(text) {
    navigator.clipboard.writeText(API_URL + text).then(() => {
        Swal.fire('Copié avec succès!', 'Lien copié dans le presse-papiers!', 'success');
    });
}

// Fonction pour supprimer un lien
function deleteLink(linkId) {
    fetch(`http://localhost:3000/api/link/${linkId}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            if (data.status === "SUCCESS") {
                // Afficher une alerte avec un bouton "OK"
                Swal.fire({
                    title: 'Succès',
                    text: data.message,
                    icon: 'success',
                    confirmButtonText: 'OK'
                });

                // Recharger la page après 2 secondes
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        })
        .catch(error => {
            Swal.fire('Erreur', 'Erreur lors de la suppression du lien: ' + error.message, 'error');
        });
}



