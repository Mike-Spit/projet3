// Fonction async pour appeler les projets
async function fetchProjects() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des projets:", error);
  }
}

// Fonction asynchrone pour récupérer et afficher les projets
async function fetchAndDisplayProjects() {
  const projectContainer = document.querySelector("#portfolio .gallery");
  const projects = await fetchProjects();

  projects.forEach((project) => {
    const htmlProject = `
        <figure data-categoryId="${project.category.id}" class="fade-in">
          <img src="${project.imageUrl}" alt="${project.title}" />
          <figcaption>${project.title}</figcaption>
        </figure>`;
    projectContainer.insertAdjacentHTML("beforeend", htmlProject);
  });
}

// Fonction async pour appeler les projets
async function fetchCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories:", error);
  }
}

// Fonction asynchrone pour récupérer et afficher les catégories
async function fetchAndDisplayCategories() {
  const categories = await fetchCategories();
  createCategoryElements(categories);
}

// Optimisation de l'affichage par catégorie
function showImagesByCategory(categoryId) {
  const categoryIdStr = categoryId ? categoryId.toString() : null;
  const figures = document.querySelectorAll("#portfolio .gallery figure");

  figures.forEach((figure) => {
    // Si categoryIdStr est null (bouton "Tous" cliqué), on retire la classe "hidden" de tous les éléments
    // Sinon, on retire la classe "hidden" seulement si l'ID de catégorie correspond
    if (!categoryIdStr || figure.dataset.categoryid === categoryIdStr) {
      figure.classList.remove("hidden");
    } else {
      figure.classList.add("hidden");
    }
  });
}

function setActiveButton(button) {
  document
    .querySelectorAll("#categories-container .category")
    .forEach((btn) => {
      btn.classList.remove("active");
    });
  button.classList.add("active");
}

function createCategoryElements(categories) {
  const categoriesContainer = document.getElementById("categories-container");

  // Création et ajout du bouton "Tous" en premier
  const allBtn = document.createElement("button");
  allBtn.textContent = "Tous";
  allBtn.classList.add("category", "active");
  allBtn.addEventListener("click", () => {
    showImagesByCategory(null); // Aucun categoryId pour montrer tous les projets
    setActiveButton(allBtn);
  });
  categoriesContainer.appendChild(allBtn);

  // Génération des boutons de catégories
  categories.forEach((category) => {
    const categoryBtn = document.createElement("button");
    categoryBtn.textContent = category.name;
    categoryBtn.classList.add("category");
    categoryBtn.dataset.categoryid = category.id.toString(); // S'assurer que l'ID est une chaîne
    categoryBtn.addEventListener("click", () => {
      showImagesByCategory(category.id);
      setActiveButton(categoryBtn);
    });
    categoriesContainer.appendChild(categoryBtn);
  });
}

// Appel des fonctions au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  fetchAndDisplayProjects();
  fetchAndDisplayCategories();
});

const token = sessionStorage.getItem("token");

if (token) {
  const btnLogin = document.querySelector(".btn-login");
  btnLogin.innerText = "logout";
  btnLogin.style.fontWeight = "700";
  btnLogin.href = "/FrontEnd/index.html";
  console.log("Connexion réussie !");
  displayModeEdit();
  displayModalGallery();
  displayModalAdd();
  enabledOrDisabledSubmit();
  getNewImg();
  postNewWork();
  openAndCloseModal();
  btnLogin.addEventListener("click", () => {
    sessionStorage.removeItem("token");
  });
}

function displayModeEdit() {
  const header = document.querySelector("header");
  header.style.marginTop = "109px";
  const headerEdit = document.createElement("div");
  headerEdit.classList.add("header-edit");
  header.insertBefore(headerEdit, header.firstChild);
  const btnEdit = document.createElement("div");
  btnEdit.classList.add("btn-edit");
  btnEdit.innerHTML = `<i class="fa-regular fa-pen-to-square fa-xs"></i> <p>Mode édition</p>`;
  headerEdit.appendChild(btnEdit);
  document.getElementById("categories-container").style.display = "none";

  // Ajout d'un bouton pour ouvrir la modal
  const titlePortfolio = document.querySelector(".title-portfolio");
  const modify = document.createElement("a");
  modify.href = "#";
  modify.classList.add("modify");
  modify.innerHTML = `<i class="fa-solid fa-pen-to-square"><span>modifier</span></i>`;
  titlePortfolio.appendChild(modify);
}

function openAndCloseModal() {
  const modify = document.querySelector(".modify");
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modal-content");
  const btnAddImg = document.querySelector(".btn-add-img");
  const modalAdd = document.getElementById("modal-add");
  const returnModal = document.getElementById("return");
  const closeModals = document.querySelectorAll(".fa-xmark");

  modify.addEventListener("click", () => {
    modal.style.display = "flex";
    modalContent.style.display = "flex";
  });

  btnAddImg.addEventListener("click", () => {
    modalContent.style.display = "none";
    modalAdd.style.display = "flex";
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
      modalContent.style.display = "none";
      modalAdd.style.display = "none";
      resetInputAdd();
    }
  });

  returnModal.addEventListener("click", () => {
    modalAdd.style.display = "none";
    modalContent.style.display = "flex";
    resetInputAdd();
  });

  closeModals.forEach((closeModal) => {
    closeModal.addEventListener("click", () => {
      modal.style.display = "none";
      modalContent.style.display = "none";
      modalAdd.style.display = "none";
      resetInputAdd();
    });
  });
}

async function displayModalGallery() {
  const modalContent = document.getElementById("modal-content");
  const closeModalContent = document.createElement("i");
  closeModalContent.classList.add(
    "fa-solid",
    "fa-xmark",
    "close-modal-content"
  );
  const title = document.createElement("h3");
  title.innerText = "Galerie Photo";
  const divGallery = document.createElement("div");
  divGallery.classList.add("gallery-modal");
  const bottomLine = document.createElement("hr");
  const btnAddImg = document.createElement("button");
  btnAddImg.classList.add("btn-add-img");
  btnAddImg.innerText = "Ajouter une image";
  modalContent.appendChild(closeModalContent);
  modalContent.appendChild(title);
  modalContent.appendChild(divGallery);
  modalContent.appendChild(bottomLine);
  modalContent.appendChild(btnAddImg);

  const works = await fetchProjects();

  works.forEach((work) => {
    const worksId = work.id;
    const figure = document.createElement("figure");
    figure.classList.add(`figure-${worksId}`);
    const img = document.createElement("img");
    const elementTrash = document.createElement("i");
    elementTrash.classList.add("fa-solid", "fa-trash-can");
    img.src = work.imageUrl;
    divGallery.appendChild(figure);
    figure.appendChild(img);
    figure.appendChild(elementTrash);

    elementTrash.addEventListener("click", async (event) => {
      if (confirm("Voulez-vous vraiment supprimer cette image ?")) {
        try {
          const response = await fetch(
            `http://localhost:5678/api/works/${worksId}`,
            {
              method: "DELETE",
              headers: {
                accept: "*/*",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.ok) {
            figure.remove();
            alert("Image supprimée avec succès !");
          } else {
            alert("Erreur lors de la suppression de l'image.");
          }
        } catch (error) {
          alert("Erreur lors de la suppression de l'image: " + error.message);
        }
      }
    });
  });
}

async function displayModalAdd() {
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modal-content");
  modalContent.style.display = "none";
  const modalAdd = document.createElement("div");
  modalAdd.setAttribute("id", "modal-add");
  modalAdd.innerHTML = `
    <div class="return-and-exit">
        <i class="fa-solid fa-arrow-left" id="return"></i>
      <i class="fa-solid fa-xmark" id="close-modal-add"></i>
      </div>
    <form action="/upload" method="post" id="form-add">
       <h3 class="title-add">Ajout photo</h3>
       <label for="input-add" class="label-add">
         <img src="" alt="image upload" class="img-preview">
         <span class="icon-image"><i class="fa-solid fa-image"></i></span>
         <label for="input-add" class="label-input-add">+ Ajouter photo</label>
         <input type="file" name="add-image" id="input-add" />
         <span class="desc-add">jpeg, png : 4mo max</span>
       </label>
       <div class="div-input">
         <label for="input-title">Titre</label>
         <input type="text" id="input-title" placeholder="Entrer un titre...">
         <label for="select-category">Catégories</label>
         <select name="select-category" id="select-category">
           <option value="" disabled selected>Sélectionner la catégorie...</option>
         </select>
         <hr class="bar-separator">
        <input type="submit" value="Valider" id="input-submit">
      </div>
    </form>
  `;
  modal.appendChild(modalAdd);
  const selectCategory = document.getElementById("select-category");

  const categories = await fetchCategories();

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.innerText = category.name;
    selectCategory.appendChild(option);
  });
}

function enabledOrDisabledSubmit() {
  const inputAdd = document.getElementById("input-add");
  const inputTitle = document.getElementById("input-title");
  const selectCategory = document.getElementById("select-category");
  const inputSubmit = document.getElementById("input-submit");
  const updateStateBtnSubmit = () => {
    const file = inputAdd.files[0];
    if (
      !file ||
      inputAdd.value === "" ||
      inputTitle.value.trim() === "" ||
      selectCategory.value === ""
    ) {
      inputSubmit.disabled = true;
      inputSubmit.style.cursor = "not-allowed";
      inputSubmit.style.backgroundColor = "#d3d3d3";
    } else {
      inputSubmit.disabled = false;
      inputSubmit.style.cursor = "pointer";
      inputSubmit.style.backgroundColor = "#1d6154";
    }
  };
  inputAdd.addEventListener("input", updateStateBtnSubmit);
  inputTitle.addEventListener("input", updateStateBtnSubmit);
  selectCategory.addEventListener("change", updateStateBtnSubmit);
  updateStateBtnSubmit();
}

function getNewImg() {
  const inputAdd = document.getElementById("input-add");
  inputAdd.addEventListener("change", () => {
    const file = inputAdd.files[0];
    if (file.type === "image/jpeg" || file.type === "image/png") {
      if (file && file.size <= 4000000) {
        const fileReader = new FileReader();
        fileReader.onload = () => {
          const imgPreview = document.querySelector(".img-preview");
          const iconImage = document.querySelector(".icon-image");
          const labelInputAdd = document.querySelector(".label-input-add");
          const descAdd = document.querySelector(".desc-add");
          iconImage.style.display = "none";
          inputAdd.style.display = "none";
          labelInputAdd.style.display = "none";
          descAdd.style.display = "none";
          imgPreview.src = fileReader.result;
          imgPreview.style.display = "flex";
          descAdd.innerText = `Image validée : ${file.name}`;
        };
        fileReader.readAsDataURL(file);
      } else if (file) {
        alert("L'image devrait se mettre au régime... 🍔🥤");
        inputAdd.value = "";
      }
    } else {
      alert("Veuillez sélectionner une image de type jpeg ou png... 🤔");
      inputAdd.value = "";
    }
  });
}

function postNewWork() {
  const inputAdd = document.getElementById("input-add");
  const inputTitle = document.getElementById("input-title");
  const selectCategory = document.getElementById("select-category");
  const inputSubmit = document.getElementById("input-submit");
  inputSubmit.addEventListener("click", async (event) => {
    event.preventDefault();
    if (
      inputAdd.value === "" ||
      inputTitle.value.trim() === "" ||
      selectCategory.value === ""
    ) {
      alert("Je crois que vous avez oublié quelque chose... 🤔");
    } else {
      if (confirm("Voulez-vous vraiment ajouter ce projet ?")) {
        try {
          const formData = new FormData();
          formData.append("image", inputAdd.files[0]);
          formData.append("title", inputTitle.value);
          formData.append("category", selectCategory.value);
          const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            body: formData,
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            alert("Votre travail a bien été ajouté ! 🎉");
            const newWork = await response.json();
            resetInputAdd();
            addWorksGallery(newWork);
            addImgModalGallery(newWork);
          }
        } catch (error) {
          alert(
            `Une erreur s'est produite lors de l'ajout de votre travail : ${error} 😔`
          );
        }
      }
    }
  });
}

function resetInputAdd() {
  const imgPreview = document.querySelector(".img-preview");
  const iconImage = document.querySelector(".icon-image");
  const labelInputAdd = document.querySelector(".label-input-add");
  const descAdd = document.querySelector(".desc-add");
  const inputAdd = document.getElementById("input-add");
  const inputTitle = document.getElementById("input-title");
  const selectCategory = document.getElementById("select-category");
  const inputSubmit = document.getElementById("input-submit");
  imgPreview.style.display = "none";
  iconImage.style.display = "flex";
  labelInputAdd.style.display = "flex";
  descAdd.style.display = "flex";
  inputAdd.value = "";
  inputTitle.value = "";
  selectCategory.value = "";
  inputSubmit.disabled = true;
  inputSubmit.style.cursor = "not-allowed";
  inputSubmit.style.backgroundColor = "#d3d3d3";
}

function addWorksGallery(newWork) {
  const gallery = document.querySelector(".gallery");
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const figcaption = document.createElement("figcaption");
  figure.classList.add(`figure-${newWork.id}`);
  img.src = newWork.imageUrl;
  figcaption.innerText = newWork.title;
  gallery.appendChild(figure);
  figure.appendChild(img);
  figure.appendChild(figcaption);
}

function addImgModalGallery(newWork) {
  const divGallery = document.querySelector(".gallery-modal");
  const figureModal = document.createElement("figure");
  figureModal.classList.add(`figure-${newWork.id}`);
  const imgModal = document.createElement("img");
  const elementTrash = document.createElement("i");
  elementTrash.classList.add("fa-solid", "fa-trash-can");
  imgModal.src = newWork.imageUrl;
  elementTrash.addEventListener("click", async (event) => {
    event.preventDefault();
    if (confirm("Voulez-vous vraiment supprimer cette image ?")) {
      try {
        const fetchWorks = await fetch(
          `http://localhost:5678/api/works/${newWork.id}`,
          {
            method: "DELETE",
            headers: {
              accept: "*/*",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (fetchWorks.ok) {
          figureModal.remove();
          console.log("🗑️ Vous avez supprimé un travail !");
        } else {
          console.error(
            "Une erreur s'est produite lors de la suppression de l'image."
          );
        }
      } catch (error) {
        alert(
          `Une erreur s'est produite lors de la suppression de l'image : ${error} 😔`
        );
      }
    } else {
      console.log("L'utilisateur a choisi 'Non' ou a annulé");
    }
  });
  divGallery.appendChild(figureModal);
  figureModal.appendChild(imgModal);
  figureModal.appendChild(elementTrash);
}
