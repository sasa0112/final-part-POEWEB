// main.js - Enhanced Form Functionality for Part 3
// Complete JavaScript for enquiry form validation and interactivity

document.addEventListener('DOMContentLoaded', function() {
    initializeEnquiryForm();
    initializeContactForm();
    setupGlobalInteractions();
});

// ENQUIRY FORM FUNCTIONALITY
function initializeEnquiryForm() {
    const enquiryForm = document.getElementById('enquiryForm');
    if (!enquiryForm) return;

    const enquiryValidator = new FormValidator('enquiryForm');
    enquiryValidator.init();
}

// CONTACT FORM FUNCTIONALITY (Simpler version)
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic validation for contact form
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const subject = document.getElementById('subject');
        const message = document.getElementById('message');
        
        let isValid = true;
        
        // Reset errors
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
        });
        document.querySelectorAll('.error').forEach(el => {
            el.classList.remove('error');
        });
        
        // Validate fields
        if (!name.value.trim()) {
            showFieldError(name, 'Name is required');
            isValid = false;
        }
        
        if (!email.value.trim() || !isValidEmail(email.value)) {
            showFieldError(email, 'Valid email is required');
            isValid = false;
        }
        
        if (!subject.value.trim()) {
            showFieldError(subject, 'Subject is required');
            isValid = false;
        }
        
        if (!message.value.trim()) {
            showFieldError(message, 'Message is required');
            isValid = false;
        }
        
        if (isValid) {
            // Simulate form submission
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        }
    });
}

// FORM VALIDATOR CLASS
class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.fields = {};
        this.responseTemplates = {
            'solar-services': {
                title: 'Solar Power Installation',
                response: 'Our solar experts will contact you within 24 hours to discuss your energy needs.',
                timeline: '1-2 business days',
                costs: 'Starting from R15,000',
                nextSteps: 'Site assessment and energy audit'
            },
            'water-systems': {
                title: 'Water Conservation Systems',
                response: 'We\'ll provide detailed information about rainwater harvesting systems.',
                timeline: '2-3 business days',
                costs: 'Systems from R8,000',
                nextSteps: 'Water usage analysis'
            },
            'volunteer': {
                title: 'Volunteer Program',
                response: 'Thank you for your interest! We\'ll send volunteer information.',
                timeline: '2-3 business days',
                costs: 'No cost involved',
                nextSteps: 'Application process'
            },
            'sponsor': {
                title: 'Sponsorship Opportunity',
                response: 'Our team will provide sponsorship packages.',
                timeline: '3-5 business days',
                costs: 'Various levels available',
                nextSteps: 'Partnership meeting'
            }
        };
    }

    init() {
        if (!this.form) return;

        this.setupFields();
        this.setupEventListeners();
        this.setupCharacterCounter();
        this.setupResponsePreview();
    }

    setupFields() {
        const requiredFields = this.form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            const fieldName = field.name;
            this.fields[fieldName] = {
                element: field,
                errorElement: document.getElementById(fieldName + 'Error'),
                valid: false
            };
        });
    }

    setupEventListeners() {
        // Real-time validation on blur
        Object.keys(this.fields).forEach(fieldName => {
            const field = this.fields[fieldName];
            
            field.element.addEventListener('blur', () => {
                this.validateField(fieldName);
                this.updateSubmitButton();
            });
            
            field.element.addEventListener('input', () => {
                this.clearFieldError(fieldName);
            });
        });

        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (this.validateForm()) {
                this.handleFormSubmission();
            } else {
                this.showFormError('Please fix the errors before submitting.');
            }
        });
    }

    setupCharacterCounter() {
        const messageField = document.getElementById('message');
        const charCount = document.getElementById('charCount');
        
        if (messageField && charCount) {
            messageField.addEventListener('input', () => {
                const length = messageField.value.length;
                charCount.textContent = length;
                
                // Update color based on length
                if (length > 1000) {
                    charCount.style.color = '#e74c3c';
                } else if (length > 800) {
                    charCount.style.color = '#f39c12';
                } else {
                    charCount.style.color = '#27ae60';
                }
            });
        }
    }

    setupResponsePreview() {
        const enquiryType = document.getElementById('enquiryType');
        if (!enquiryType) return;

        enquiryType.addEventListener('change', (e) => {
            this.updateResponsePreview(e.target.value);
        });
    }

    validateField(fieldName) {
        const field = this.fields[fieldName];
        const value = field.element.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'fullName':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters long';
                } else if (!/^[a-zA-Z\s\-']+$/.test(value)) {
                    isValid = false;
                    errorMessage = 'Name can only contain letters, spaces, hyphens, and apostrophes';
                }
                break;

            case 'email':
                if (!this.isValidEmail(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;

            case 'enquiryType':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Please select an enquiry type';
                }
                break;

            case 'message':
                if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Please provide more details (at least 10 characters)';
                } else if (value.length > 1000) {
                    isValid = false;
                    errorMessage = 'Message is too long (maximum 1000 characters)';
                }
                break;
        }

        field.valid = isValid;
        this.displayFieldError(field, errorMessage);
        return isValid;
    }

    validateForm() {
        let isFormValid = true;
        
        Object.keys(this.fields).forEach(fieldName => {
            const fieldValid = this.validateField(fieldName);
            if (!fieldValid) {
                isFormValid = false;
            }
        });
        
        return isFormValid;
    }

    displayFieldError(field, message) {
        if (field.errorElement) {
            if (message) {
                field.errorElement.textContent = message;
                field.errorElement.style.display = 'block';
                field.element.classList.add('error');
                field.element.classList.remove('success');
            } else {
                field.errorElement.textContent = '';
                field.errorElement.style.display = 'none';
                field.element.classList.remove('error');
                if (field.element.value.trim()) {
                    field.element.classList.add('success');
                }
            }
        }
    }

    clearFieldError(fieldName) {
        const field = this.fields[fieldName];
        if (field && field.errorElement) {
            field.errorElement.textContent = '';
            field.errorElement.style.display = 'none';
            field.element.classList.remove('error');
        }
    }

    updateSubmitButton() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        if (submitBtn) {
            const allValid = Object.values(this.fields).every(field => field.valid);
            submitBtn.disabled = !allValid;
        }
    }

    updateResponsePreview(enquiryType) {
        const responsePreview = document.getElementById('responsePreview');
        const previewDetails = document.getElementById('previewDetails');
        
        if (!responsePreview || !previewDetails) return;

        if (!enquiryType) {
            responsePreview.style.display = 'none';
            return;
        }

        const template = this.responseTemplates[enquiryType] || this.responseTemplates['solar-services'];
        
        previewDetails.innerHTML = `
            <div class="preview-detail"><strong>Service:</strong> ${template.title}</div>
            <div class="preview-detail"><strong>Response Time:</strong> ${template.timeline}</div>
            <div class="preview-detail"><strong>Estimated Costs:</strong> ${template.costs}</div>
            <div class="preview-detail"><strong>Next Steps:</strong> ${template.nextSteps}</div>
        `;
        
        responsePreview.style.display = 'block';
    }

    async handleFormSubmission() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        
        try {
            // Simulate API call
            await this.simulateSubmission();
            
            // Show success message
            this.showSuccessMessage();
            
            // Reset form
            this.form.reset();
            Object.keys(this.fields).forEach(fieldName => {
                this.fields[fieldName].valid = false;
                this.displayFieldError(this.fields[fieldName], '');
            });
            
            // Hide response preview
            const responsePreview = document.getElementById('responsePreview');
            if (responsePreview) {
                responsePreview.style.display = 'none';
            }
            
        } catch (error) {
            this.showFormError('Submission failed. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    simulateSubmission() {
        return new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });
    }

    showSuccessMessage() {
        const successSection = document.getElementById('successSection');
        const successDetails = document.getElementById('successDetails');
        
        if (successSection && successDetails) {
            const enquiryType = document.getElementById('enquiryType').value;
            const template = this.responseTemplates[enquiryType] || this.responseTemplates['solar-services'];
            
            successDetails.innerHTML = `
                <p><strong>${template.title}</strong></p>
                <p>${template.response}</p>
                <div class="success-timeline">
                    <p><strong>What happens next:</strong></p>
                    <ul>
                        <li>We'll contact you within ${template.timeline}</li>
                        <li>You'll receive detailed information and pricing</li>
                        <li>We'll schedule any necessary consultations</li>
                    </ul>
                </div>
            `;
            
            successSection.style.display = 'block';
            successSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            // Fallback alert
            alert('Thank you for your enquiry! We will contact you soon.');
        }
    }

    showFormError(message) {
        alert(message); // Simple alert for now
    }

    // Utility function
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// GLOBAL INTERACTIONS
function setupGlobalInteractions() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Mobile menu toggle (if needed)
    setupMobileMenu();
}

function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
}

// UTILITY FUNCTIONS
function showFieldError(field, message) {
    field.classList.add('error');
    
    // Find or create error element
    let errorElement = field.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('error-message')) {
        errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        field.parentNode.insertBefore(errorElement, field.nextSibling);
    }
    
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
