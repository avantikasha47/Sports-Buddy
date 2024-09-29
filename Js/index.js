import { getAuth, onAuthStateChanged, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// Initialize Firebase Auth, Storage, and Firestore
const auth = getAuth();
const storage = getStorage();
const db = getFirestore();

// Listen for authentication state changes
onAuthStateChanged(auth, (user) => {
    const userPhoto = document.getElementById('userPhoto');
    const profilePhoto = document.getElementById('profilePhoto');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const registerBtn = document.getElementById('registerBtn');
    const fileInput = document.getElementById('fileInput');

    if (user) {
        const currentUserPhotoURL = user.photoURL || 'default-profile.png';
        userPhoto.src = currentUserPhotoURL;
        profilePhoto.style.display = 'block';
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
        logoutBtn.style.display = 'block';

        // Event listener for file input change
        fileInput.addEventListener('change', async (event) => {
            const file = event.target.files[0];
            if (file) {
                try {
                    const storageRef = ref(storage, `profilePhotos/${user.uid}/${file.name}`);
                    await uploadBytes(storageRef, file);
                    const photoURL = await getDownloadURL(storageRef);

                    // Update the user's profile photo URL
                    userPhoto.src = photoURL;
                    await updateProfile(auth.currentUser, { photoURL });
                } catch (error) {
                    console.error('Error uploading profile photo: ', error);
                }
            }
        });

    } else {
        // No user is signed in
        profilePhoto.style.display = 'none';
        loginBtn.style.display = 'block';
        registerBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
    }
});

// Logout button functionality
document.getElementById('logoutBtn').addEventListener('click', () => {
    signOut(auth).then(() => {
        console.log('User signed out.');
    }).catch((error) => {
        console.error('Error signing out: ', error);
    });
});

// Click handlers for login and register buttons
document.getElementById('registerBtn').addEventListener('click', () => {
    window.location.href = 'user-login.html';
});

// Event listener for the login button to show the dropdown
document.getElementById('loginBtn').addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default link behavior
    const dropdownContent = document.getElementById('dropdownContent');
    dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
});

// Event listeners for dropdown options
const dropdownOptions = document.querySelectorAll('.dropdown-option');
dropdownOptions.forEach(option => {
    option.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default link behavior
        const selectedRole = option.getAttribute('data-role');
        console.log(`Selected role: ${selectedRole}`);

        // Redirect based on the selected role
        if (selectedRole === 'admin') {
            window.location.href = 'admin-login.html';
        } else if (selectedRole === 'user') {
            window.location.href = 'user-login.html';
        }
    });
});

// Make the profile photo clickable to trigger the file input
document.getElementById('userPhoto').addEventListener('click', () => {
    document.getElementById('fileInput').click();
});

function animateCards() {
    const postCards = document.querySelectorAll('.post-card');
    const options = {
        root: null, // Use the viewport as the root
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the card is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible'); // Add visible class to animate
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, options);

    postCards.forEach(card => {
        observer.observe(card); // Observe each post card
    });
}

// Function to load posts and display them with a delete button
async function loadPosts() {
    const postsContainer = document.getElementById('postsContainer');
    try {
        postsContainer.innerHTML = ''; // Clear previous posts
        const querySnapshot = await getDocs(collection(db, "posts"));

        if (querySnapshot.empty) {
            postsContainer.innerHTML = "<p>No posts available.</p>";
            return;
        }

        // Create a map to store usernames based on user IDs
        const userNamesMap = new Map();

        // Fetch users' names
        const usersSnapshot = await getDocs(collection(db, "users"));
        usersSnapshot.forEach((doc) => {
            const userData = doc.data();
            if (userData.username) { // Ensure username exists
                userNamesMap.set(doc.id, userData.username);
            } else {
                console.warn(`Username missing for user ID: ${doc.id}`);
            }
        });

        // Now load the posts
        querySnapshot.forEach((doc) => {
            const post = doc.data();
            const postId = doc.id; // Get the ID of the post
            const postCard = document.createElement('div');
            postCard.className = 'post-card';
            postCard.innerHTML = `
                <h3>${post.title}</h3>
                <p>Area: ${post.area}</p>
                <p>City: ${post.city}</p>
                <p>Sport Category: ${post.sportCategory}</p>
                <p>Posted by: ${post.username|| 'Unknown User'}</p>
                <button class="delete-btn" data-id="${postId}">❌</button> <!-- Delete button -->
            `;

            // Append the post to the container
            postsContainer.appendChild(postCard);
        });
        animateCards();

        // Attach delete event listeners to all delete buttons
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                const postId = e.target.getAttribute('data-id');
                await deletePost(postId); // Call the delete function
            });
        });

    } catch (error) {
        console.error("Error loading posts: ", error);
        postsContainer.innerHTML = "<p>Failed to load posts. Please try again later.</p>";
    }
}

// Function to delete a post by ID
async function deletePost(postId) {
    try {
        // Delete the post from Firestore
        await deleteDoc(doc(db, "posts", postId));

        // Remove the post from the DOM
        const postCard = document.querySelector(`[data-id="${postId}"]`).parentElement;
        postCard.remove();

        console.log(`Post with ID ${postId} has been deleted.`);
    } catch (error) {
        console.error(`Error deleting post with ID ${postId}:`, error);
        alert("Failed to delete the post. Please try again.");
    }
}

// Call loadPosts on page load
loadPosts();
