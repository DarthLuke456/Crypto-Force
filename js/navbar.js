// Constants for paths and selectors
const REPO_NAME = '/Crypto-Force'; // Make sure this matches your repo name
const NAVBAR_CONTAINER = 'navbar-container';
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000;

// Function to determine the correct path for the navbar
function getNavbarPath() {
    const path = window.location.pathname;
    console.log('Current path:', path);

    // Clean any duplicate repository names
    const cleanPath = path.replace(`${REPO_NAME}${REPO_NAME}`, REPO_NAME);

    // Return appropriate navbar path based on the URL
    if (cleanPath.includes('/components/')) {
        return '../components/navbar.html';
    }
    return 'components/navbar.html';
}

// Function to fix the links in the navbar
function fixNavigationLinks(container) {
    const links = container.getElementsByTagName('a');
    for (let link of links) {
        let href = link.getAttribute('href');
        if (href) {
            // Remove any duplicate repository names
            href = href.replace(`${REPO_NAME}${REPO_NAME}`, REPO_NAME);

            // Ensure the path is relative to the project root
            if (!href.startsWith('/') && !href.startsWith(REPO_NAME)) {
                href = `${REPO_NAME}${href}`;
            }
            link.href = href;
        }
    }
}

// Function to setup the navbar toggle button for mobile view
function setupNavbarToggle(navbarContainer) {
    let toggleButton = document.getElementById('navbar-toggle');
    if (!toggleButton) {
        toggleButton = document.createElement('button');
        toggleButton.id = 'navbar-toggle';
        toggleButton.className = 'navbar-toggle';
        toggleButton.innerHTML = '<i class="fas fa-bars"></i>';
        navbarContainer.appendChild(toggleButton);
    }

    const navbar = document.getElementById('navbar');
    const navbarLinks = document.getElementById('navbar-links');

    if (navbar && navbarLinks) {
        // Show navbar initially
        navbar.classList.add('active');

        // Toggle navbar on button click
        toggleButton.addEventListener('click', () => {
            navbar.classList.toggle('active');
            if (window.innerWidth <= 768) {
                navbarLinks.classList.toggle('active');
            }
        });

        // Handle responsive behavior
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                navbarLinks.classList.remove('active');
                navbar.classList.add('active');
            }
        });
    }
}

// Function to load navbar with retry mechanism
async function loadNavbarWithRetry(attempts = RETRY_ATTEMPTS) {
    const navbarPath = getNavbarPath();
    console.log('Attempting to load navbar from:', navbarPath);

    for (let i = 0; i < attempts; i++) {
        try {
            const response = await fetch(navbarPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.text();
            
            const navbarContainer = document.getElementById(NAVBAR_CONTAINER);
            if (!navbarContainer) {
                throw new Error('Navbar container not found');
            }

            navbarContainer.innerHTML = data;
            fixNavigationLinks(navbarContainer);
            setupNavbarToggle(navbarContainer);
            return;
        } catch (error) {
            console.error(`Attempt ${i + 1} failed:`, error);
            if (i === attempts - 1) {
                document.getElementById(NAVBAR_CONTAINER).innerHTML = `
                    <div class="error" style="padding: 20px; background: #ff5a66; color: white; text-align: center;">
                        Error loading navbar. Please refresh the page. 
                        Details: ${error.message}
                    </div>`;
            } else {
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            }
        }
    }
}

// Event listener for DOMContentLoaded to initialize navbar
document.addEventListener('DOMContentLoaded', () => {
    loadNavbarWithRetry().catch(error => {
        console.error('Fatal navbar error:', error);
    });
});