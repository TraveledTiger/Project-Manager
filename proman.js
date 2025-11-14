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

  // Date restriction to not allow past dates or current date
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  projectDeadline.setAttribute("min", tomorrow);
  editDeadline.setAttribute("min", tomorrow);

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

    saveProjectsToLocalStorage();
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
      <p>${countdownToDeadline(deadline)}</p>
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

    // project is edited in the storage
    saveProjectsToLocalStorage();

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
      console.log(editModel.id);
    } else if (e.target.classList.contains("delete-btn")) {
      const projectCard = e.target.parentElement;
      deleteModel.style.display = "block";
      deleteConfirmBtn.onclick = () => {
        projectContainer.removeChild(projectCard);
        projects.splice(projectCard.id, 1);

        // project is deleted from the storage
        saveProjectsToLocalStorage();

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

  // Save Projects to Local Storage
  function saveProjectsToLocalStorage() {
    localStorage.setItem("projects", JSON.stringify(projects));
  }

  // Load Projects from Local Storage
  function loadProjectsFromLocalStorage() {
    const storedProjects = localStorage.getItem("projects");
    if (storedProjects) {
      const parsedProjects = JSON.parse(storedProjects);
      parsedProjects.forEach((project) => {
        const newProject = new Project(
          project.name,
          project.description,
          project.deadline
        );

        const newProjectIndex = projects.push(newProject) - 1;

        createProjectCard(
          project.name,
          project.description,
          project.deadline,
          newProjectIndex
        );
      });
    }
    console.log(projects);
  }

  // Load projects on page load
  loadProjectsFromLocalStorage();

  // Countdown to deadline function
  function countdownToDeadline(deadline) {
    const deadlineDate = new Date(deadline);

    const currentDate = new Date();

    const diffMs = deadlineDate - currentDate;

    // Calculate days, hours, minutes, seconds
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);

    if (
      diffDays === 0 &&
      diffHours === 0 &&
      (diffMinutes === 0) & (diffSeconds === 0)
    ) {
      return "Deadline Has Passed";
    } else {
      return `${diffDays} days, ${diffHours} hours, ${diffMinutes} minutes  remaining`;
    }
  }
});
