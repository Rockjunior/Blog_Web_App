// Utility to get posts from localStorage
function getPosts() {
    const posts = localStorage.getItem('blogPosts');
    return posts ? JSON.parse(posts) : [];
}

// Utility to save posts to localStorage
function savePosts(posts) {
    localStorage.setItem('blogPosts', JSON.stringify(posts));
}

// Render posts to the DOM, with optional search
function renderPosts(searchTerm = '') {
    const postsContainer = document.getElementById('postsContainer');
    let posts = getPosts();
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        posts = posts.filter(post => post.title.toLowerCase().includes(term) || post.content.toLowerCase().includes(term));
    }
    postsContainer.innerHTML = '';
    if (posts.length === 0) {
        postsContainer.innerHTML = '<div class="empty-state">📝 No posts found. Try adding or searching for something!</div>';
        return;
    }
    posts.forEach((post, index) => {
        const postDiv = document.createElement('div');
        postDiv.className = 'post';
        postDiv.innerHTML = `
            <div class="post-title">${post.title}</div>
            <div class="post-content">${post.content}</div>
            <button class="delete-btn" data-index="${index}">Delete</button>
        `;
        postsContainer.appendChild(postDiv);
        // Animate post appearance
        setTimeout(() => postDiv.style.opacity = 1, 30);
    });
}

// Add new post with feedback
function addPost(title, content) {
    const posts = getPosts();
    posts.unshift({ title, content }); // Add to the top
    savePosts(posts);
    renderPosts(document.getElementById('searchInput').value);
    showFeedback('Post added!');
}

// Delete post by index with feedback
function deletePost(index) {
    const posts = getPosts();
    posts.splice(index, 1);
    savePosts(posts);
    renderPosts(document.getElementById('searchInput').value);
    showFeedback('Post deleted.');
}

// Show feedback message
function showFeedback(message) {
    let feedback = document.getElementById('feedbackMsg');
    if (!feedback) {
        feedback = document.createElement('div');
        feedback.id = 'feedbackMsg';
        feedback.style.position = 'fixed';
        feedback.style.top = '24px';
        feedback.style.left = '50%';
        feedback.style.transform = 'translateX(-50%)';
        feedback.style.background = '#fda085';
        feedback.style.color = '#fff';
        feedback.style.padding = '12px 28px';
        feedback.style.borderRadius = '8px';
        feedback.style.boxShadow = '0 2px 8px rgba(253,160,133,0.18)';
        feedback.style.fontWeight = 'bold';
        feedback.style.zIndex = 1000;
        feedback.style.opacity = 0;
        document.body.appendChild(feedback);
    }
    feedback.textContent = message;
    feedback.style.opacity = 1;
    setTimeout(() => { feedback.style.opacity = 0; }, 1200);
}

// Event listeners
window.addEventListener('DOMContentLoaded', () => {
    renderPosts();

    document.getElementById('postForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const title = document.getElementById('title').value.trim();
        const content = document.getElementById('content').value.trim();
        if (title && content) {
            addPost(title, content);
            this.reset();
        }
    });

    document.getElementById('postsContainer').addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-btn')) {
            const index = e.target.getAttribute('data-index');
            deletePost(index);
        }
    });

    // Search functionality
    document.getElementById('searchInput').addEventListener('input', function() {
        renderPosts(this.value);
    });

    const setupElem = document.getElementById('setup');
    const punchlineElem = document.getElementById('punchline');
    const newJokeBtn = document.getElementById('new-joke-btn');

    async function fetchJoke() {
        setupElem.textContent = 'Loading...';
        punchlineElem.textContent = '';
        try {
            const response = await fetch('https://official-joke-api.appspot.com/random_joke');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setupElem.textContent = data.setup;
            punchlineElem.textContent = data.punchline;
        } catch (error) {
            setupElem.textContent = 'Failed to fetch joke.';
            punchlineElem.textContent = '';
        }
    }

    newJokeBtn.addEventListener('click', fetchJoke);
    fetchJoke(); // Fetch a joke on page load
}); 