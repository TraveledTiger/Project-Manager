"use strict";

jQuery(document).ready(function () {
  // model interfaces
  const projectModel = document.getElementById("project-model");
  // const [projectModel] = jQuery("#project-model");
  // const projectModel = jQuery("#project-model")[0];
  console.log(projectModel);
  const editModel = document.querySelector(".edit-model");
  const deleteModel = document.querySelector(".delete-model");

  const textarea = document.querySelector("textarea");
  textarea.addEventListener("input", () => {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  });

  // buttons on projects elements
  const editBtn = document.querySelector(".edit-btn");
  const deleteBtn = document.querySelector(".delete-btn");
  const createBtn = document.getElementById("create-btn");
  const finishBtn = document.getElementById("finish-btn");
  const completeBtn = document.getElementById("complete-btn");
  const deleteConfirmBtn = document.getElementById("delete-confirm-btn");
  const deleteCancelBtn = document.getElementById("delete-cancel-btn");
  const cancelBtn = document.getElementById("cancel-btn");

  // create project model elements
  const projectName = document.getElementById("project-name");
  const projectDesc = document.getElementById("project-desc");
  const projectDeadline = document.getElementById("project-deadline");
  const projectContainer = document.getElementById("projects-container");

  // edit project model elements
  const editName = document.getElementById("edit-name");
  const editDesc = document.getElementById("edit-desc");
  const editDeadline = document.getElementById("edit-deadline");

  // Open the create project model
  createBtn.addEventListener("click", () => {
    projectModel.style.display = "block";
  });

  // Finish creating the project log
  finishBtn.addEventListener("click", () => {
    finishProjectLog();
  });

  // Cancel creating the project log
  cancelBtn.addEventListener("click", () => {
    projectModel.style.display = "none";
    projectDesc.value = "";
    projectName.value = "";
    projectDeadline.value = "";
  });

  // Array to hold all projects
  const projects = [];

  // Finish creating the project log
  function finishProjectLog() {
    if (
      projectName.value === "" ||
      projectDesc.value === "" ||
      projectDeadline.value === ""
    ) {
      alert("Please fill in all fields");
      return;
    }

    // create a new project and add it to the projects array
    const newProject = new Project(
      projectName.value,
      projectDesc.value,
      projectDeadline.value
    );

    const newProjectIndex = projects.push(newProject) - 1;

    createProjectCard(
      projectName.value,
      projectDesc.value,
      projectDeadline.value,
      newProjectIndex
    );

    console.log("Projects created:", projects);

    // close the project model
    projectModel.style.display = "none";
    projectDesc.value = "";
    projectName.value = "";
    projectDeadline.value = "";
  }

  // Create the project card and add it to the project container
  function createProjectCard(name, description, deadline, projectIndex) {
    const projectCard = document.createElement("div");
    projectCard.className = "project-card";
    projectCard.id = projectIndex;
    projectContainer.innerHTML += `
    <div class="project-card" id='${projectIndex}'>
      <h3>${name}</h3>
      <p>${description}</p>
      <p>Deadline: ${deadline}</p>
      <button class='edit-btn pos-layout'>Edit</button>
      <button class='delete-btn neg-layout'>Delete</button>
    </div>
  `;
  }

  // Complete the edit on project card functionality
  completeBtn.addEventListener("click", (e) => {
    const editCard = e.target.parentElement;
    const name = editName.value;
    const description = editDesc.value;
    const deadline = editDeadline.value;

    const projectId = editModel.id;

    projects[projectId].name = name;
    projects[projectId].description = description;
    projects[projectId].deadline = deadline;

    const projectCards = document.querySelectorAll(`.project-card`);

    const projectCard = projectCards[projectId];

    console.log(projectCards);

    projectCard.querySelector("h3").innerText = name;
    projectCard.querySelectorAll("p")[0].innerText = description;
    projectCard.querySelectorAll("p")[1].innerText = `Deadline: ${deadline}`;

    editModel.style.display = "none";
    editName.value = "";
    editDesc.value = "";
    editDeadline.value = "";
    console.log(editCard);
  });

  // Edit the project card functionality
  projectContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-btn")) {
      const projectCard = e.target.parentElement;
      console.log(projectCard);
      const name = projectCard.querySelector("h3").innerText;
      const description = projectCard.querySelectorAll("p")[0].innerText;
      const deadline = projectCard
        .querySelectorAll("p")[1]
        .innerText.replace("Deadline: ", "");

      editName.value = name;
      editDesc.value = description;
      editDeadline.value = deadline;
      editModel.style.display = "block";
      editModel.id = projectCard.id;
    } else if (e.target.classList.contains("delete-btn")) {
      const projectCard = e.target.parentElement;
      deleteModel.style.display = "block";
      deleteConfirmBtn.onclick = () => {
        projectContainer.removeChild(projectCard);
        projects.splice(projectCard.id, 1);
        deleteModel.style.display = "none";
      };
      deleteCancelBtn.onclick = () => {
        deleteModel.style.display = "none";
      };
    }
  });

  ///
  class Project {
    constructor(name, description, deadline) {
      this.name = name;
      this.description = description;
      this.deadline = deadline;
    }
  }
});
