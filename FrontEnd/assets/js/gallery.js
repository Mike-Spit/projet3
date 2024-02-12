const url = "http://localhost:5678/api/works";

fetch(url, { method: "GET" })
  .then((response) => response.json())
  .then((response) => {
    let projectContainer = document.querySelector("#portfolio .gallery");

    for (const project of response) {
      let htmlProject = ` 
          <figure>
            <img src="${project.imageUrl}" alt="${project.title}" />
            <figcaption>${project.title}</figcaption>
          </figure> `;
      projectContainer.insertAdjacentHTML("beforeend", htmlProject);
    }
  });
