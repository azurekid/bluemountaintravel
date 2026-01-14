// Shared auth button functionality
// - Shows "Sign In" only on My Bookings page
// - Shows "Logout" on all pages when user is logged in

document.addEventListener('DOMContentLoaded', function () {
    updateAuthButton();
});

function isBookingsPage() {
    const path = (window.location.pathname || '').toLowerCase();
    return path.endsWith('/bookings.html') || path.endsWith('bookings.html');
}

function getNavAuthLinks() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return [];

    const links = [
        ...navbar.querySelectorAll('a.btn-login'),
        ...navbar.querySelectorAll('a[href="login.html"]')
    ];

    // Deduplicate while preserving order
    const seen = new Set();
    return links.filter((el) => {
        if (seen.has(el)) return false;
        seen.add(el);
        return true;
    });
}

function setHidden(el, hidden) {
    if (!el) return;
    el.style.display = hidden ? 'none' : '';
    el.setAttribute('aria-hidden', hidden ? 'true' : 'false');
}

function updateAuthButton() {
    const authLinks = getNavAuthLinks();
    if (authLinks.length === 0) return;

    const currentUser = localStorage.getItem('currentUser');
    const loggedIn = !!currentUser;
    const onBookings = isBookingsPage();

    if (!loggedIn) {
        // Requirement: only show Sign In via My Bookings page
        authLinks.forEach((link) => {
            if (onBookings) {
                setHidden(link, false);
                link.textContent = 'Sign In';
                link.href = 'login.html';
                link.onclick = null;
            } else {
                setHidden(link, true);
            }
        });
        return;
    }

    // Logged in: show Logout everywhere
    authLinks.forEach((link) => {
        setHidden(link, false);
        link.textContent = 'Logout';
        link.href = '#';
        link.onclick = function (e) {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            localStorage.removeItem('sessionToken');
            localStorage.removeItem('loginTimestamp');
            console.log('User logged out');
            window.location.href = 'index.html';
        };
    });
}
