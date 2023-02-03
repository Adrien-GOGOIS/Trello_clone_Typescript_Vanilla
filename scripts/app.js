"use strict";
const itemsContainer = document.querySelectorAll(".items-container");
let actualContainer;
let actualButton;
let actualListUL;
let actualForm;
let actualTextInput;
let actualValidation;
function addContainerListeners(currentContainer) {
    const currentContainerDeletionButton = currentContainer.querySelector(".delete-container-btn");
    const currentAddItemButton = currentContainer.querySelector(".add-item-btn");
    const currentCloseFormButton = currentContainer.querySelector(".close-form-btn");
    const currentForm = currentContainer.querySelector("form");
    deleteBtnListener(currentContainerDeletionButton);
    addItemBtnListener(currentAddItemButton);
    closeFormListener(currentCloseFormButton);
    addItemFormListener(currentForm);
    addDragDropListener(currentContainer);
}
itemsContainer.forEach((container) => {
    addContainerListeners(container);
});
// DELETE CONTAINER
function deleteBtnListener(button) {
    button.addEventListener("click", handleContainerDeletion);
}
function handleContainerDeletion(event) {
    const button = event.target;
    const buttonsArray = [...document.querySelectorAll(".delete-container-btn")];
    const containers = [...document.querySelectorAll(".items-container")];
    containers[buttonsArray.indexOf(button)].remove();
}
// ADD ITEM BUTTON
function addItemBtnListener(button) {
    button.addEventListener("click", handleAddItem);
}
function handleAddItem(event) {
    const button = event.target;
    // Ferme les autres form si un autre container déjà ouvert
    if (actualContainer) {
        toggleForm(actualButton, actualForm, false);
    }
    setContainerItems(button);
    toggleForm(actualButton, actualForm, true);
}
function setContainerItems(button) {
    actualButton = button;
    actualContainer = button.parentElement;
    actualListUL = actualContainer.querySelector("ul");
    actualForm = actualContainer.querySelector("form");
    actualTextInput = actualContainer.querySelector("input");
    actualValidation = actualContainer.querySelector(".validation-msg");
}
function toggleForm(button, form, action) {
    if (!action) {
        form.style.display = "none";
        button.style.display = "block";
    }
    else {
        form.style.display = "block";
        button.style.display = "none";
    }
}
// CLOSE FORM
function closeFormListener(button) {
    button.addEventListener("click", () => toggleForm(actualButton, actualForm, false));
}
// ADD ITEM FORM
function addItemFormListener(form) {
    form.addEventListener("submit", createNewItem);
}
function createNewItem(event) {
    event.preventDefault();
    // Validation
    if (actualTextInput.value.length === 0) {
        actualValidation.textContent = "Must be at least one character long!";
        return;
    }
    else {
        actualValidation.textContent = "";
    }
    // Creation d'un item dans la liste
    const userInput = actualTextInput.value;
    const li = `
    <li class="item" draggable="true">
    <p>${userInput}</p>
    <button>X</button>
    </li>
  `;
    actualListUL.insertAdjacentHTML("beforeend", li);
    const item = actualListUL.lastElementChild;
    const listButton = item.querySelector("button");
    handleItemDeletion(listButton);
    addDragDropListener(item);
    actualTextInput.value = "";
}
function handleItemDeletion(button) {
    button.addEventListener("click", () => {
        const elementToRemove = button.parentElement;
        elementToRemove.remove();
    });
}
const addContainerBtn = document.querySelector(".add-container-btn");
const addContainerForm = document.querySelector(".add-new-container form");
const addContainerFormInput = document.querySelector(".add-new-container input");
const validationNewContainer = document.querySelector(".add-new-container .validation-msg");
const addContainerCloseBtn = document.querySelector(".close-add-list");
const addNewContainer = document.querySelector(".add-new-container");
const containersList = document.querySelector(".main-content");
// Ouvrir container
addContainerBtn.addEventListener("click", () => {
    toggleForm(addContainerBtn, addContainerForm, true);
});
// fermer container
addContainerCloseBtn.addEventListener("click", () => {
    toggleForm(addContainerBtn, addContainerForm, false);
});
addContainerForm.addEventListener("submit", createNewContainer);
function createNewContainer(event) {
    event.preventDefault();
    // Validation
    if (addContainerFormInput.value.length === 0) {
        validationNewContainer.textContent = "Must be at least one character long!";
        return;
    }
    else {
        validationNewContainer.textContent = "";
    }
    const itemsContainer = document.querySelector(".items-container");
    const newContainer = itemsContainer.cloneNode();
    const newContainerContent = `
      <div class="top-container">
            <h2>${addContainerFormInput.value}</h2>
            <button class="delete-container-btn">X</button>
      </div>
      <ul></ul>
      <button class="add-item-btn">Add an item</button>
      <form autocomplete="off">
            <div class="top-form-container">
               <label for="item">Add a new item</label>
               <button type="button" class="close-form-btn">X</button>
            </div>
            <input type="text" id="item" />
            <span class="validation-msg"></span>
            <button type="submit">Submit</button>
      </form>
   `;
    newContainer.innerHTML = newContainerContent;
    containersList.insertBefore(newContainer, addNewContainer);
    addContainerFormInput.value = "";
    addContainerListeners(newContainer);
}
// DRAG AND DROP
function addDragDropListener(element) {
    element.addEventListener("dragstart", handleDragStart);
    element.addEventListener("dragover", handleDragOver);
    element.addEventListener("drop", handleDrop);
    element.addEventListener("dragend", handleDragEnd);
}
let dragSrcEl;
function handleDragStart(e) {
    var _a;
    e.stopPropagation();
    if (actualContainer)
        toggleForm(actualButton, actualForm, false);
    dragSrcEl = this;
    (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.setData("text/html", this.innerHTML);
}
function handleDragOver(e) {
    e.preventDefault();
}
function handleDrop(e) {
    var _a;
    e.stopPropagation();
    const receptionEl = this;
    if (dragSrcEl.nodeName === "LI" && receptionEl.classList.contains("items-container")) {
        receptionEl.querySelector("ul").appendChild(dragSrcEl);
        addDragDropListener(dragSrcEl);
        handleItemDeletion(dragSrcEl.querySelector("button"));
    }
    if (dragSrcEl !== this && this.classList[0] === dragSrcEl.classList[0]) {
        dragSrcEl.innerHTML = this.innerHTML;
        this.innerHTML = (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.getData("text/html");
        if (this.classList.contains("items-container")) {
            addContainerListeners(this);
            this.querySelectorAll("li").forEach((li) => {
                handleItemDeletion(li.querySelector("button"));
                addDragDropListener(li);
            });
        }
        else {
            addDragDropListener(this);
            handleItemDeletion(this.querySelector("button"));
        }
    }
}
function handleDragEnd(e) {
    e.stopPropagation();
    if (this.classList.contains("items-container")) {
        addContainerListeners(this);
        if (this.querySelectorAll("li")) {
            this.querySelectorAll("li").forEach((li) => {
                handleItemDeletion(li.querySelector("button"));
                addDragDropListener(li);
            });
        }
    }
    else {
        addDragDropListener(this);
    }
}
