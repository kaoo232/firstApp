import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
    databaseURL: "https://candycard-ec536-default-rtdb.europe-west1.firebasedatabase.app/"
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-List"); // Changed id to match the one used in HTML
const overlayEl = document.getElementById("overlay");
const closeOverlayBtn = document.getElementById("close-overlay");

overlayEl.style.display = 'flex';

closeOverlayBtn.addEventListener('click', function() {
    overlayEl.style.display = 'none';
});
addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value;

    if (inputValue.trim() !== "") {
        push(shoppingListInDB, inputValue);
        clearInputFieldEl();
    }
});

onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val());
        clearShoppingListEl();
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i];
            let currentItemID = currentItem[0];
            let currentItemValue = currentItem[1];
            appendItemToShoppingListEl(currentItem);
        }
    } else {
        shoppingListEl.innerHTML = "No items here ... yet";
    }
});

function clearShoppingListEl() {
    shoppingListEl.innerHTML = "";
}

function clearInputFieldEl() {
    inputFieldEl.value = "";
}

function appendItemToShoppingListEl(inputValue) {

    if (!Array.isArray(inputValue) || inputValue.length < 2) {
        console.error("Invalid input value:", inputValue);
        return;
    }

    let itemID = inputValue[0];
    let itemValue = inputValue[1];
    if (!shoppingListEl) {
        console.error("shoppingListEl is not defined");
        return;
    }

    let newEl = document.createElement("li");
    newEl.textContent = itemValue;
    newEl.addEventListener("click", function() {

        if (!database || !ref || !remove) {
            console.error("database or ref is not defined");
            return;
        }


        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
        remove(exactLocationOfItemInDB);
        then(() => {
                console.log("Item removed successfully");
            })
            .catch((error) => {

                console.error("Error removing item:", error);
            });

    });

    shoppingListEl.appendChild(newEl);

}