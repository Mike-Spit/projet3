// Chargement de la page login.html
document.addEventListener("DOMContentLoaded", () => {
  const formLogin = document.querySelector("#form-login");
  const email = document.querySelector("#email");
  const password = document.querySelector("#password");

  // Soumission du formulaire de connexion
  formLogin.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Utilisation de Trim() pour ne pas tenir compte des espaces avant et après les valeurs saisies
    // Utilisation de ToLowerCase() pour ne pas tenir compte des majuscules dans l'adresse mail
    const valueEmail = email.value.trim().toLowerCase();
    const valuePassword = password.value.trim();

    // Vérification des champs vides et affichage d'un message d'erreur
    if (valueEmail === "" || valuePassword === "") {
      email.value = "";
      password.value = "";
      console.log("Veuillez remplir tous les champs !");
    } else {
      try {
        const fetchUser = await fetch("http://localhost:5678/api/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: valueEmail, password: valuePassword }),
        });
        if (fetchUser.ok) {
          const user = await fetchUser.json();
          sessionStorage.setItem("token", user.token);
          alert("Connecté avec succès !");
          setTimeout(() => {
            window.location.href = "/FrontEnd/index.html";
          }, 3000);
        } else {
          email.value = "";
          password.value = "";
          alert("🔎 Adresse mail et/ou mot de passe incorrect !");
        }
      } catch (error) {
        alert(`Erreur : ${error}`);
      }
    }
  });
});
