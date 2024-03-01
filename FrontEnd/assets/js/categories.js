// URL de l'API pour récupérer les catégories
const urlCategories = "http://localhost:5678/api/categories";

// Fonction pour récupérer les catégories depuis le backend
fetch(urlCategories, { method: "GET" })
  .then((response) => response.json())
  .then((response) => {
    // Appeler une fonction pour créer les éléments HTML pour chaque catégorie
    createCategoryElements(response);
  })
  .catch((error) =>
    console.error("Erreur lors de la récupération des catégories:", error)
  );

// Fonction pour créer les éléments HTML pour chaque catégorie et les ajouter à la page
function createCategoryElements(categories) {
  const categoriesContainer = document.getElementById("categories-container");

  // Créer un bouton "Tous" pour afficher toutes les images
  const allBtn = document.createElement("button");
  allBtn.classList.add("category", "active"); // Ajout de la classe active
  allBtn.textContent = "Tous";
  allBtn.addEventListener("click", () => {
    showAllImages();
    setActiveButton(allBtn);
  });
  categoriesContainer.appendChild(allBtn);

  // Parcourir chaque catégorie
  categories.forEach((category) => {
    // Créer un élément <button> pour la catégorie
    const categoryBtn = document.createElement("button");
    categoryBtn.classList.add("category");
    categoryBtn.textContent = category.name;
    // Ajouter l'ID de la catégorie comme attribut de données
    categoryBtn.dataset.categoryId = category.id;
    // Ajouter un écouteur d'événements pour le clic sur le bouton de catégorie
    categoryBtn.addEventListener("click", () => {
      // Récupérer l'ID de la catégorie sélectionnée
      const categoryId = category.id;

      // Cacher toutes les images
      hideAllImages(categoryId);

      // Afficher les images correspondant à la catégorie sélectionnée
      showImagesByCategory(categoryId);
      setActiveButton(categoryBtn);
    });

    // Ajouter le bouton de la catégorie au conteneur des catégories sur la page
    categoriesContainer.appendChild(categoryBtn);
  });
}

// Fonction pour définir le bouton actif
function setActiveButton(button) {
  // Récupérer tous les boutons de catégorie
  const categoryButtons = document.querySelectorAll(
    "#categories-container button"
  );
  // Supprimer la classe "active" de tous les boutons
  categoryButtons.forEach((btn) => {
    btn.classList.remove("active");
  });
  // Ajouter la classe "active" au bouton cliqué
  button.classList.add("active");
}

// Fonction pour afficher toutes les images
function showAllImages() {
  const allFigures = document.querySelectorAll(`figure.hidden`);
  allFigures.forEach((figure) => {
    figure.classList.remove("hidden");
    figure.classList.add("fade-in");
  });
}

// Fonction pour afficher les images correspondant à une catégorie spécifique avec une animation d'apparition
function showImagesByCategory(categoryId) {
  const allFigures = document.querySelectorAll(
    `figure[data-categoryId="${categoryId}"].hidden`
  );

  // Afficher les images correspondant à la catégorie sélectionnée avec une animation d'apparition
  allFigures.forEach((figure) => {
    figure.classList.remove("hidden");
    figure.classList.add("fade-in");
  });
}

// Fonction pour masquer toutes les images avec une animation de disparition, sauf celles de la catégorie spécifique
function hideAllImages(categoryId) {
  const allFigures = document.querySelectorAll(
    `#portfolio .gallery figure:not([data-categoryId="${categoryId}"])`
  );
  allFigures.forEach((figure) => {
    figure.classList.remove("fade-in");
    figure.classList.add("fade-out");
    setTimeout(() => {
      figure.classList.add("hidden");
    }, 500); // Correspond à la durée de l'animation fade-out
  });
}
