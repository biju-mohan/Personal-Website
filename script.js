// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeNavigation();
    initializeFormValidation();
    initializeScrollEffects();
});

// Navigation Functionality
function initializeNavigation() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    mobileMenu.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update active navigation link based on scroll position
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Form Validation
function initializeFormValidation() {
    const form = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    // Real-time validation
    nameInput.addEventListener('blur', () => validateName());
    emailInput.addEventListener('blur', () => validateEmail());
    subjectInput.addEventListener('blur', () => validateSubject());
    messageInput.addEventListener('blur', () => validateMessage());

    // Remove error styling on input
    [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });

    // Form submission
    form.addEventListener('submit', handleFormSubmit);
}

function validateName() {
    const nameInput = document.getElementById('name');
    const nameError = document.getElementById('name-error');
    const name = nameInput.value.trim();

    if (name.length < 2) {
        showFieldError(nameInput, nameError, 'Name must be at least 2 characters long');
        return false;
    }

    if (!/^[a-zA-Z\s]+$/.test(name)) {
        showFieldError(nameInput, nameError, 'Name should only contain letters and spaces');
        return false;
    }

    clearFieldError(nameInput);
    return true;
}

function validateEmail() {
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    const email = emailInput.value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
        showFieldError(emailInput, emailError, 'Email is required');
        return false;
    }

    if (!emailRegex.test(email)) {
        showFieldError(emailInput, emailError, 'Please enter a valid email address');
        return false;
    }

    clearFieldError(emailInput);
    return true;
}

function validateSubject() {
    const subjectInput = document.getElementById('subject');
    const subjectError = document.getElementById('subject-error');
    const subject = subjectInput.value.trim();

    if (subject.length < 3) {
        showFieldError(subjectInput, subjectError, 'Subject must be at least 3 characters long');
        return false;
    }

    clearFieldError(subjectInput);
    return true;
}

function validateMessage() {
    const messageInput = document.getElementById('message');
    const messageError = document.getElementById('message-error');
    const message = messageInput.value.trim();

    if (message.length < 10) {
        showFieldError(messageInput, messageError, 'Message must be at least 10 characters long');
        return false;
    }

    clearFieldError(messageInput);
    return true;
}

function showFieldError(input, errorElement, message) {
    input.parentElement.classList.add('error');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function clearFieldError(input) {
    input.parentElement.classList.remove('error');
    const errorElement = input.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

function handleFormSubmit(e) {
    e.preventDefault();

    // Validate all fields
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isSubjectValid = validateSubject();
    const isMessageValid = validateMessage();

    if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
        // Show success message
        showSuccessMessage();
        
        // Reset form
        e.target.reset();
        
        // Log form data (for development purposes)
        const formData = new FormData(e.target);
        console.log('Form submitted with data:', Object.fromEntries(formData));
    } else {
        // Scroll to first error
        const firstError = document.querySelector('.form-group.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

function showSuccessMessage() {
    const form = document.getElementById('contact-form');
    const successMessage = document.getElementById('form-success');

    // Hide form and show success message
    form.style.display = 'none';
    successMessage.style.display = 'block';

    // Reset after 5 seconds
    setTimeout(() => {
        form.style.display = 'block';
        successMessage.style.display = 'none';
    }, 5000);
}

// Scroll Effects
function initializeScrollEffects() {
    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.experience-card, .education-card, .contact-form');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add smooth hover effects to buttons
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Close mobile menu with Escape key
    if (e.key === 'Escape') {
        const mobileMenu = document.getElementById('mobile-menu');
        const navMenu = document.getElementById('nav-menu');
        
        if (navMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

// Handle form accessibility
document.addEventListener('DOMContentLoaded', function() {
    const formInputs = document.querySelectorAll('input, textarea');
    
    formInputs.forEach(input => {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && this.tagName !== 'TEXTAREA') {
                e.preventDefault();
                const form = this.closest('form');
                const inputs = Array.from(form.querySelectorAll('input, textarea'));
                const currentIndex = inputs.indexOf(this);
                const nextInput = inputs[currentIndex + 1];
                
                if (nextInput) {
                    nextInput.focus();
                } else {
                    form.querySelector('button[type="submit"]').focus();
                }
            }
        });
    });
});

// Performance optimization: Lazy load non-critical animations
window.addEventListener('load', function() {
    // Add any additional animations or effects after page load
    console.log('Personal website loaded successfully!');
});
