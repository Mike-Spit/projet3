// Fonction pour gérer l'envoi du formulaire
document.getElementById("login-form").addEventListener("submit", (event) => {
  event.preventDefault(); // Empêcher le comportement par défaut du formulaire

  // Récupérer les valeurs des champs d'entrée
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // URL de l'API pour la connexion
  const urlLogin = "http://localhost:5678/api/users/login";

  // Effectuer une requête POST pour se connecter
  fetch(urlLogin, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email, password: password }),
  })
    .then((response) => {
      if (response.ok) {
        // Stocker le token d'authentification dans sessionStorage
        response.json().then((data) => {
          sessionStorage.setItem("token", data.token);
          sessionStorage.setItem("isLoggedIn", true);
          sessionStorage.setItem("email", email);

          // Masquer la partie "catégories" si elle existe
          const categoriesContainer = document.getElementById(
            "categories-container"
          );
          if (categoriesContainer) {
            categoriesContainer.style.display = "none";
          }

          // Changer le bouton "login" en "logout"
          const loginLink = document.getElementById("login-link");
          loginLink.textContent = "logout";
          loginLink.href = "/FrontEnd/logout.html";

          // Redirection vers la page d'accueil après une connexion réussie
          window.location.href = "/FrontEnd/index.html";
        });
      } else if (response.status === 404) {
        // Afficher un message d'erreur sur la page de login
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Identifiants incorrects";
        errorMessage.style.color = "red";
        const form = document.getElementById("login-form");
        form.insertBefore(errorMessage, form.children[0]);
      } else {
        // Gérer les autres erreurs de connexion
        console.error("Erreur lors de la connexion:", response.status);
      }
    })
    .catch((error) => {
      console.error("Erreur lors de la connexion:", error);
    });
});
