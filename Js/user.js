import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, collection, getDocs, query, where, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// Initialize Firebase Auth and Firestore
const auth = getAuth();
const db = getFirestore();

// Function to load user posts with optional search term
async function loadUserPosts(searchTerm = '') {
    const postsContainer = document.getElementById('postsContainer');
    const user = auth.currentUser;

    if (user) {
        const postsQuery = query(collection(db, "posts"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(postsQuery);

        postsContainer.innerHTML = ''; // Clear previous posts

        if (querySnapshot.empty) {
            postsContainer.innerHTML = "<p>No posts available.</p>";
            return;
        }

        const searchTerms = searchTerm.toLowerCase().split(' '); // Handle multiple search terms

        // Loop through the fetched posts
        querySnapshot.forEach((doc) => {
            const post = doc.data(); // Get post data
            const postTitle = post.title.toLowerCase();

            // Filter posts by checking if all search terms are present in the title
            const matchesSearch = searchTerms.every(term => postTitle.includes(term));
            
            if (matchesSearch || searchTerm === '') {
                const postCard = document.createElement('div');
                postCard.className = 'post-card';
                postCard.innerHTML = `
                    <div class="post-header">
                        <h3>${post.title}</h3>
                        <button class="delete-btn" data-id="${doc.id}">✖</button> <!-- Cross button to delete -->
                    </div>
                    <p>Area: ${post.area}</p>
                    <p>City: ${post.city}</p>
                    <p>Sport Category: ${post.sportCategory}</p>
                `;

                postsContainer.appendChild(postCard);
            }
        });

        // Attach event listener to all delete buttons
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const postId = e.target.getAttribute('data-id');
                await deleteDoc(doc(db, "posts", postId));
                loadUserPosts(searchTerm); // Reload posts after deletion
            });
        });
    } else {
        postsContainer.innerHTML = "<p>Please log in to see your posts.</p>";
    }
}

// Event listener for search functionality
document.getElementById('searchInput')?.addEventListener('input', (e) => {
    const searchTerm = e.target.value.trim();
    loadUserPosts(searchTerm); // Reload posts based on search input
});

// Check for authentication state and load user posts
onAuthStateChanged(auth, (user) => {
    if (user) {
        loadUserPosts(); // Load posts if user is logged in
    } else {
        document.getElementById('postsContainer').innerHTML = "<p>Please log in to see your posts.</p>";
    }
});
