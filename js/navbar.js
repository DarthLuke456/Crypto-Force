// Constants
const NAVBAR_CONTAINER = 'navbar-container';
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000;

// Function to determine the correct path for the navbar
function getNavbarPath() {
    const path = window.location.pathname;
    console.log('Current path:', path);

    // Handle root path specially
    if (path === '/' || path === '/index.html') {
        return '/components/navbar.html';
    }

    // For other paths, calculate relative path
    const pathSegments = path.split('/').filter(segment => segment.length > 0);
    const levelsDeep = pathSegments.length;
    const relativePath = '../'.repeat(Math.max(0, levelsDeep)) + 'components/navbar.html';

    console.log('Calculated navbar path:', relativePath);
    return relativePath;
}

// Function to fix navigation links
function fixNavigationLinks(container) {
    console.log('Fixing navigation links');
    const links = container.getElementsByTagName('a');
    const currentPath = window.location.pathname;

    for (let link of links) {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http')) {
            // Ensure href starts with forward slash
            link.href = href.startsWith('/') ? href : '/' + href;
            console.log('Fixed link:', link.href);
        }
    }
}

// Function to setup the navbar toggle
function setupNavbarToggle(navbarContainer) {
    console.log('Setting up navbar toggle');

    let toggleButton = document.getElementById('navbar-toggle');
    if (!toggleButton) {
        toggleButton = createToggleButton(navbarContainer);
    }

    const navbar = document.getElementById('navbar');
    const navbarLinks = document.querySelector('.navbar-links');
    const navbarRight = document.querySelector('.navbar-right');

    if (!navbar || !navbarLinks || !navbarRight) {
        console.error('Required navbar elements not found');
        return;
    }

    // Initially hide the navbar
    navbar.classList.remove('active');

    // Setup toggle functionality
    toggleButton.addEventListener('click', () => {
        navbar.classList.toggle('active');
        navbarLinks.classList.toggle('active');
        navbarRight.classList.toggle('active');
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navbar.classList.remove('active');
            navbarLinks.classList.remove('active');
            navbarRight.classList.remove('active');
        }
    });
}

// Helper function to create the toggle button
function createToggleButton(navbarContainer) {
    const button = document.createElement('button');
    button.id = 'navbar-toggle';
    button.className = 'navbar-toggle';
    button.innerHTML = '<i class="fas fa-bars"></i>';
    navbarContainer.appendChild(button);
    return button;
}

// Function to load navbar with retry mechanism
async function loadNavbarWithRetry(attempts = RETRY_ATTEMPTS) {
    const navbarContainer = document.getElementById(NAVBAR_CONTAINER);
    if (!navbarContainer) {
        throw new Error('Navbar container not found');
    }

    const navbarPath = getNavbarPath();
    console.log('Loading navbar from:', navbarPath);

    for (let i = 0; i < attempts; i++) {
        try {
            const response = await fetch(navbarPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const html = await response.text();
            navbarContainer.innerHTML = html;

            fixNavigationLinks(navbarContainer);
            setupNavbarToggle(navbarContainer);
            return;
        } catch (error) {
            console.error(`Attempt ${i + 1} failed:`, error);

            if (i === attempts - 1) {
                navbarContainer.innerHTML = `
                    <div class="error" style="padding: 20px; background: #ff5a66; color: white; text-align: center;">
                        Error loading navbar. Please refresh the page.
                    </div>`;
                throw error;
            }

            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        }
    }
}

// Initialize navbar
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing navbar...');
    loadNavbarWithRetry().catch(error => {
        console.error('Navbar initialization failed:', error);
    });
});