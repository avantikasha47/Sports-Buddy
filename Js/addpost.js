import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBiLJphZUsLBTFSdVDT_O2HPWbtxIGLGMU",
    authDomain: "sport-buddy-55258.firebaseapp.com",
    projectId: "sport-buddy-55258",
    storageBucket: "sport-buddy-55258.appspot.com",
    messagingSenderId: "597298467816",
    appId: "1:597298467816:web:d81ce91e86d59baed98a5d",
    measurementId: "G-NK2MGEC97V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(); // Initialize Firebase Auth

// Get elements
const postForm = document.getElementById('postForm');
const areaSelect = document.getElementById('area');
const sportCategorySelect = document.getElementById('sportCategory');
const citySelect = document.getElementById('city');

// Load dropdown options for Area, Sport Category, and City
async function loadDropdowns() {
    try {
        // Load Areas
        const areasSnapshot = await getDocs(collection(db, "areas"));
        areasSnapshot.forEach((doc) => {
            const option = document.createElement('option');
            option.value = doc.id; // Use the document ID
            option.textContent = doc.data().name; // Assuming areas collection has a name field
            areaSelect.appendChild(option);
        });

        // Load Sport Categories
        const categoriesSnapshot = await getDocs(collection(db, "sportsCategories"));
        if (categoriesSnapshot.empty) {
            console.warn("No sport categories found!");
        } else {
            categoriesSnapshot.forEach((doc) => {
                const option = document.createElement('option');
                option.value = doc.id; // Use the document ID
                option.textContent = doc.data().name; // Assuming sportCategories collection has a name field
                sportCategorySelect.appendChild(option);
            });
        }

        // Load Cities
        const citiesSnapshot = await getDocs(collection(db, "cities"));
        citiesSnapshot.forEach((doc) => {
            const option = document.createElement('option');
            option.value = doc.id; // Use the document ID
            option.textContent = doc.data().name; // Assuming cities collection has a name field
            citySelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading dropdowns: ", error);
    }
}

// Handle form submission
postForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const eventName = document.getElementById('eventName').value;

    // Get the current user
    const user = auth.currentUser;

    if (user) {
        // Retrieve selected area, city, and sport category names
        const selectedAreaName = areaSelect.options[areaSelect.selectedIndex].textContent;
        const selectedSportCategoryName = sportCategorySelect.options[sportCategorySelect.selectedIndex].textContent;
        const selectedCityName = citySelect.options[citySelect.selectedIndex].textContent;

        // Add post to Firestore
        await addDoc(collection(db, "posts"), {
            title: eventName,
            area: selectedAreaName, // Store the name of the area
            sportCategory: selectedSportCategoryName, // Store the name of the sport category
            city: selectedCityName, // Store the name of the city
            userId: user.uid,  // Store the user's ID
            username: user.displayName || 'Anonymous',  // Store the username or display name
            timestamp: new Date()
        });

        // Close the modal or redirect
        alert('Post added successfully!'); // You can change this to close the modal
        window.location.href = 'index.html';
    } else {
        alert('You must be logged in to post.');
    }
});

// Load dropdowns on page load
loadDropdowns();
