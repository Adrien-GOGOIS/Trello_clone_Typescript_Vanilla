const itemsContainer = document.querySelectorAll(".items-container") as NodeListOf<HTMLDivElement>;

let actualContainer: HTMLDivElement;
let actualButton: HTMLButtonElement;
let actualListUL: HTMLUListElement;
let actualForm: HTMLFormElement;
let actualTextInput: HTMLInputElement;
let actualValidation: HTMLSpanElement;

function addContainerListeners(currentContainer: HTMLDivElement) {
   const currentContainerDeletionButton = currentContainer.querySelector(".delete-container-btn") as HTMLButtonElement;
   const currentAddItemButton = currentContainer.querySelector(".add-item-btn") as HTMLButtonElement;
   const currentCloseFormButton = currentContainer.querySelector(".close-form-btn") as HTMLButtonElement;
   const currentForm = currentContainer.querySelector("form") as HTMLFormElement;

   deleteBtnListener(currentContainerDeletionButton);
   addItemBtnListener(currentAddItemButton);
   closeFormListener(currentCloseFormButton);
   addItemFormListener(currentForm);
   addDragDropListener(currentContainer);
}

itemsContainer.forEach((container: HTMLDivElement) => {
   addContainerListeners(container);
});

// DELETE CONTAINER

function deleteBtnListener(button: HTMLButtonElement) {
   button.addEventListener("click", handleContainerDeletion);
}

function handleContainerDeletion(event: MouseEvent) {
   const button = event.target as HTMLButtonElement;
   const buttonsArray = [...document.querySelectorAll(".delete-container-btn")] as HTMLButtonElement[];
   const containers = [...document.querySelectorAll(".items-container")] as HTMLButtonElement[];
   containers[buttonsArray.indexOf(button)].remove();
}

// ADD ITEM BUTTON

function addItemBtnListener(button: HTMLButtonElement) {
   button.addEventListener("click", handleAddItem);
}

function handleAddItem(event: MouseEvent) {
   const button = event.target as HTMLButtonElement;

   // Ferme les autres form si un autre container déjà ouvert
   if (actualContainer) {
      toggleForm(actualButton, actualForm, false);
   }

   setContainerItems(button);
   toggleForm(actualButton, actualForm, true);
}

function setContainerItems(button: HTMLButtonElement) {
   actualButton = button;
   actualContainer = button.parentElement as HTMLDivElement;
   actualListUL = actualContainer.querySelector("ul") as HTMLUListElement;
   actualForm = actualContainer.querySelector("form") as HTMLFormElement;
   actualTextInput = actualContainer.querySelector("input") as HTMLInputElement;
   actualValidation = actualContainer.querySelector(".validation-msg") as HTMLSpanElement;
}

function toggleForm(button: HTMLButtonElement, form: HTMLFormElement, action: Boolean) {
   if (!action) {
      form.style.display = "none";
      button.style.display = "block";
   } else {
      form.style.display = "block";
      button.style.display = "none";
   }
}

// CLOSE FORM

function closeFormListener(button: HTMLButtonElement) {
   button.addEventListener("click", () => toggleForm(actualButton, actualForm, false));
}

// ADD ITEM FORM

function addItemFormListener(form: HTMLFormElement) {
   form.addEventListener("submit", createNewItem);
}

function createNewItem(event: Event) {
   event.preventDefault();

   // Validation
   if (actualTextInput.value.length === 0) {
      actualValidation.textContent = "Must be at least one character long!";
      return;
   } else {
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
   const item = actualListUL.lastElementChild as HTMLLIElement;
   const listButton = item.querySelector("button") as HTMLButtonElement;
   handleItemDeletion(listButton);
   addDragDropListener(item);
   actualTextInput.value = "";
}

function handleItemDeletion(button: HTMLButtonElement) {
   button.addEventListener("click", () => {
      const elementToRemove = button.parentElement as HTMLElement;
      elementToRemove.remove();
   });
}

const addContainerBtn = document.querySelector(".add-container-btn") as HTMLButtonElement;
const addContainerForm = document.querySelector(".add-new-container form") as HTMLFormElement;
const addContainerFormInput = document.querySelector(".add-new-container input") as HTMLInputElement;
const validationNewContainer = document.querySelector(".add-new-container .validation-msg") as HTMLSpanElement;
const addContainerCloseBtn = document.querySelector(".close-add-list") as HTMLButtonElement;
const addNewContainer = document.querySelector(".add-new-container") as HTMLDivElement;
const containersList = document.querySelector(".main-content") as HTMLDivElement;

// Ouvrir container
addContainerBtn.addEventListener("click", () => {
   toggleForm(addContainerBtn, addContainerForm, true);
});

// fermer container
addContainerCloseBtn.addEventListener("click", () => {
   toggleForm(addContainerBtn, addContainerForm, false);
});

addContainerForm.addEventListener("submit", createNewContainer);

function createNewContainer(event: Event) {
   event.preventDefault();

   // Validation
   if (addContainerFormInput.value.length === 0) {
      validationNewContainer.textContent = "Must be at least one character long!";
      return;
   } else {
      validationNewContainer.textContent = "";
   }

   const itemsContainer = document.querySelector(".items-container") as HTMLDivElement;
   const newContainer = itemsContainer.cloneNode() as HTMLDivElement;
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

function addDragDropListener(element: HTMLElement) {
   element.addEventListener("dragstart", handleDragStart);
   element.addEventListener("dragover", handleDragOver);
   element.addEventListener("drop", handleDrop);
   element.addEventListener("dragend", handleDragEnd);
}

let dragSrcEl: HTMLElement;
function handleDragStart(this: HTMLElement, e: DragEvent) {
   e.stopPropagation();

   if (actualContainer) toggleForm(actualButton, actualForm, false);
   dragSrcEl = this;
   e.dataTransfer?.setData("text/html", this.innerHTML);
}
function handleDragOver(e: DragEvent) {
   e.preventDefault();
}
function handleDrop(this: HTMLElement, e: DragEvent) {
   e.stopPropagation();
   const receptionEl = this;

   if (dragSrcEl.nodeName === "LI" && receptionEl.classList.contains("items-container")) {
      (receptionEl.querySelector("ul") as HTMLUListElement).appendChild(dragSrcEl);
      addDragDropListener(dragSrcEl);
      handleItemDeletion(dragSrcEl.querySelector("button") as HTMLButtonElement);
   }

   if (dragSrcEl !== this && this.classList[0] === dragSrcEl.classList[0]) {
      dragSrcEl.innerHTML = this.innerHTML;
      this.innerHTML = e.dataTransfer?.getData("text/html") as string;
      if (this.classList.contains("items-container")) {
         addContainerListeners(this as HTMLDivElement);

         this.querySelectorAll("li").forEach((li: HTMLLIElement) => {
            handleItemDeletion(li.querySelector("button") as HTMLButtonElement);
            addDragDropListener(li);
         });
      } else {
         addDragDropListener(this);
         handleItemDeletion(this.querySelector("button") as HTMLButtonElement);
      }
   }
}

function handleDragEnd(this: HTMLElement, e: DragEvent) {
   e.stopPropagation();
   if (this.classList.contains("items-container")) {
      addContainerListeners(this as HTMLDivElement);
      if (this.querySelectorAll("li")) {
         this.querySelectorAll("li").forEach((li: HTMLLIElement) => {
            handleItemDeletion(li.querySelector("button") as HTMLButtonElement);
            addDragDropListener(li);
         });
      }
   } else {
      addDragDropListener(this);
   }
}
