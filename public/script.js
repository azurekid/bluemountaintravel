// Blue Mountain Travel - Interactive Features

document.addEventListener('DOMContentLoaded', function() {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // Simulate form submission
            alert(`Thank you for subscribing! We'll send travel inspiration to ${email}`);
            this.reset();
        });
    }

    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.destination-card, .feature-card, .package-card, .testimonial-card'
    );
    
    animateElements.forEach(el => observer.observe(el));

    // Book Now button handlers
    const bookButtons = document.querySelectorAll('.btn-primary');
    bookButtons.forEach(button => {
        if (button.textContent.includes('Book Now')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                alert('Booking system will be available soon! Please call us at +31 20 123 4567 or email info@bluemountaintravel.com');
            });
        }
    });

    // Search form handler
    const searchButton = document.querySelector('.search-card button');
    if (searchButton) {
        searchButton.addEventListener('click', function(e) {
            e.preventDefault();
            const destination = document.querySelector('#destination').value;
            const checkin = document.querySelector('#checkin').value;
            const checkout = document.querySelector('#checkout').value;
            const travelers = document.querySelector('#travelers').value;
            
            if (!destination || !checkin || !checkout) {
                alert('Please fill in all search fields');
                return;
            }
            
            alert(`Searching for trips to ${destination} from ${checkin} to ${checkout} for ${travelers}`);
        });
    }

    // Load configuration and display connection status (for demo purposes)
    fetch('config.json')
        .then(response => response.json())
        .then(config => {
            console.log('Configuration loaded successfully');
            console.log('Database username:', config.database.username);
            console.log('Storage account:', config.storage.accountName);
            // In production, you would use this configuration for API calls
        })
        .catch(error => {
            console.error('Error loading configuration:', error);
        });
});

// Parallax effect on hero section
window.addEventListener('scroll', function() {
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        const scrolled = window.pageYOffset;
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add current date to set default check-in dates
const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowStr = tomorrow.toISOString().split('T')[0];

const checkinInput = document.querySelector('#checkin');
const checkoutInput = document.querySelector('#checkout');

if (checkinInput && checkoutInput) {
    checkinInput.setAttribute('min', today);
    checkoutInput.setAttribute('min', tomorrowStr);
}
