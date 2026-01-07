// Shared auth button functionality
// Updates Sign In button to Logout when user is logged in

document.addEventListener('DOMContentLoaded', function() {
    updateAuthButton();
});

function updateAuthButton() {
    const authBtn = document.querySelector('.btn-login');
    const currentUser = localStorage.getItem('currentUser');
    
    if (currentUser && authBtn) {
        authBtn.textContent = 'Logout';
        authBtn.href = '#';
        authBtn.onclick = function(e) {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            localStorage.removeItem('sessionToken');
            localStorage.removeItem('loginTimestamp');
            console.log('User logged out');
            window.location.href = 'index.html';
        };
    }
}
