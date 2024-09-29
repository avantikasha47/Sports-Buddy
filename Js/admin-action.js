import { db } from './firebase_config.js';
import { collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// Function to check if the area already exists
async function areaExists(areaName) {
  const q = query(collection(db, "areas"), where("name", "==", areaName));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
}

// Function to check if the city already exists
async function cityExists(cityName) {
  const q = query(collection(db, "cities"), where("name", "==", cityName));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
}

// Function to check if the sports category already exists
async function sportsCategoryExists(categoryName) {
  const q = query(collection(db, "sportsCategories"), where("name", "==", categoryName));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
}

// Function to add a new area
async function addArea(areaName) {
  try {
    const exists = await areaExists(areaName);
    if (exists) {
      alert(`Area "${areaName}" already exists!`);
      return;
    }
    
    const docRef = await addDoc(collection(db, "areas"), { 
      name: areaName,
      uid: generateUniqueId()  // Generate a unique ID if needed
    });
    alert(`Area added with ID: ${docRef.id}`);
  } catch (e) {
    alert("Error adding area: " + e);
  }
}

// Function to add a new city
async function addCity(cityName) {
  try {
    const exists = await cityExists(cityName);
    if (exists) {
      alert(`City "${cityName}" already exists!`);
      return;
    }

    const docRef = await addDoc(collection(db, "cities"), { 
      name: cityName,
      uid: generateUniqueId()  // Generate a unique ID if needed
    });
    alert(`City added with ID: ${docRef.id}`);
  } catch (e) {
    alert("Error adding city: " + e);
  }
}

// Function to add a new sports category
async function addSportsCategory(categoryName) {
  try {
    const exists = await sportsCategoryExists(categoryName);
    if (exists) {
      alert(`Sports category "${categoryName}" already exists!`);
      return;
    }

    const docRef = await addDoc(collection(db, "sportsCategories"), { 
      name: categoryName,
      uid: generateUniqueId()  // Generate a unique ID if needed
    });
    alert(`Sports category added with ID: ${docRef.id}`);
  } catch (e) {
    alert("Error adding sports category: " + e);
  }
}

// Generate a unique ID (this can be adjusted to fit your needs)
function generateUniqueId() {
  return 'id_' + Math.random().toString(36).substr(2, 9);
}

// Event listeners for buttons
document.getElementById('addAreaBtn').addEventListener('click', () => {
  const areaName = prompt("Enter area name:");
  if (areaName) {
    addArea(areaName);
  }
});

document.getElementById('addCityBtn').addEventListener('click', () => {
  const cityName = prompt("Enter city name:");
  if (cityName) {
    addCity(cityName);
  }
});

document.getElementById('addSportsCategoryBtn').addEventListener('click', () => {
  const categoryName = prompt("Enter sports category name:");
  if (categoryName) {
    addSportsCategory(categoryName);
  }
});

// Event listener for the "View All" button
document.getElementById('viewAllBtn').addEventListener('click', () => {
    window.location.href = 'index.html'; // Navigate to index.html
});
