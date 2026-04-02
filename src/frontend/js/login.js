/**
 * ZonaUTP Login System
 * Archivo: login.js
 * Funcionalidad: Solo diseño y validaciones frontend básicas
 */

// ===== CONFIGURACIÓN BÁSICA =====
const CONFIG = {
    UTP_EMAIL_DOMAIN: '@utp.ac.pa',
    MIN_PASSWORD_LENGTH: 6
};

// ===== ELEMENTOS DEL DOM =====
class LoginElements {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.passwordToggle = document.getElementById('passwordToggle');
        this.toggleIcon = document.getElementById('toggleIcon');
        this.loginButton = document.getElementById('loginButton');
        this.forgotPasswordLink = document.getElementById('forgotPassword');
        this.rememberCheckbox = document.getElementById('remember');
        this.generalError = document.getElementById('generalError');
        
        // Elementos de error específicos
        this.emailError = document.getElementById('email-error');
        this.passwordError = document.getElementById('password-error');
        
        // Elementos del botón
        this.buttonText = this.loginButton.querySelector('.button-text');
        this.buttonIcon = this.loginButton.querySelector('.button-icon');
        this.loadingSpinner = this.loginButton.querySelector('.loading-spinner');
    }
}

// ===== CLASE PRINCIPAL DEL LOGIN =====
class ZonaUTPLogin {
    constructor() {
        this.elements = new LoginElements();
        this.isLoading = false;
        this.init();
    }
    
    // Inicializar la aplicación
    init() {
        this.bindEvents();
        this.loadRememberedUser();
    // ...existing code...
    }
    
    // ===== EVENT LISTENERS =====
    bindEvents() {
        // Formulario principal
        this.elements.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Validación en tiempo real
        this.elements.emailInput.addEventListener('input', () => this.validateEmail());
        this.elements.emailInput.addEventListener('blur', () => this.validateEmail(true));
        this.elements.passwordInput.addEventListener('input', () => this.validatePassword());
        this.elements.passwordInput.addEventListener('blur', () => this.validatePassword(true));
        
        // Toggle de contraseña
        this.elements.passwordToggle.addEventListener('click', () => this.togglePassword());
        
        // Forgot password
        this.elements.forgotPasswordLink.addEventListener('click', (e) => this.handleForgotPassword(e));
        
        // Prevenir envío con Enter en campos específicos
        this.elements.emailInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.elements.passwordInput.focus();
            }
        });
    }
    
    // ===== VALIDACIONES =====
    validateEmail(showError = false) {
        const email = this.elements.emailInput.value.trim();
        const errors = [];
        
        // Validar campo requerido
        if (!email) {
            errors.push('El correo electrónico es requerido');
        } else {
            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                errors.push('Ingresa un correo electrónico válido');
            } else if (!email.endsWith(CONFIG.UTP_EMAIL_DOMAIN)) {
                errors.push('Debes usar tu correo institucional @utp.ac.pa');
            }
        }
        
        this.showFieldError('email', errors, showError);
        return errors.length === 0;
    }
    
    validatePassword(showError = false) {
        const password = this.elements.passwordInput.value;
        const errors = [];
        
        // Validar campo requerido
        if (!password) {
            errors.push('La contraseña es requerida');
        } else if (password.length < CONFIG.MIN_PASSWORD_LENGTH) {
            errors.push(`La contraseña debe tener al menos ${CONFIG.MIN_PASSWORD_LENGTH} caracteres`);
        }
        
        this.showFieldError('password', errors, showError);
        return errors.length === 0;
    }
    
    validateForm() {
        const isEmailValid = this.validateEmail(true);
        const isPasswordValid = this.validatePassword(true);
        
        return isEmailValid && isPasswordValid;
    }
    
    // ===== MANEJO DE ERRORES =====
    showFieldError(fieldName, errors, show = true) {
        const errorElement = this.elements[`${fieldName}Error`];
        const inputElement = this.elements[`${fieldName}Input`];
        
        if (errors.length > 0 && show) {
            errorElement.textContent = errors[0];
            errorElement.classList.add('show');
            inputElement.classList.add('error');
            inputElement.setAttribute('aria-invalid', 'true');
        } else {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
            inputElement.classList.remove('error');
            inputElement.removeAttribute('aria-invalid');
        }
    }
    
    showGeneralError(message, type = 'error') {
        this.elements.generalError.textContent = message;
        this.elements.generalError.className = `general-error ${type}`;
        this.elements.generalError.style.display = 'flex';
        
        // Auto-ocultar después de 5 segundos
        setTimeout(() => {
            this.hideGeneralError();
        }, 5000);
    }
    
    hideGeneralError() {
        this.elements.generalError.style.display = 'none';
    }
    
    // ===== FUNCIONALIDAD DE TOGGLE PASSWORD =====
    togglePassword() {
        const isPassword = this.elements.passwordInput.type === 'password';
        
        this.elements.passwordInput.type = isPassword ? 'text' : 'password';
        this.elements.toggleIcon.className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
        this.elements.passwordToggle.setAttribute('aria-label', 
            isPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
        );
    }
    
    // ===== MANEJO DEL FORMULARIO (SOLO FRONTEND) =====
    handleSubmit(e) {
        e.preventDefault();
        
        if (this.isLoading) return;
        
        this.hideGeneralError();
        
        // Validar formulario
        if (!this.validateForm()) {
            this.showGeneralError('Por favor corrige los errores antes de continuar');
            return;
        }
        
        // Simular login (solo frontend)
        this.simulateLogin();
    }
    
    simulateLogin() {
        this.setLoadingState(true);
        
        // Simular proceso de login
        setTimeout(() => {
            this.setLoadingState(false);
            this.showGeneralError('¡Formulario válido! Backend aún no implementado', 'success');
            
            // Guardar email recordado si está marcado
            if (this.elements.rememberCheckbox.checked) {
                localStorage.setItem('remembered_email', this.elements.emailInput.value);
            } else {
                localStorage.removeItem('remembered_email');
            }
        }, 2000);
    }
    
    // ===== ESTADOS DE LOADING =====
    setLoadingState(loading) {
        this.isLoading = loading;
        
        if (loading) {
            this.elements.loginButton.disabled = true;
            this.elements.buttonText.style.display = 'none';
            this.elements.buttonIcon.style.display = 'none';
            this.elements.loadingSpinner.style.display = 'block';
            this.elements.loginButton.style.cursor = 'wait';
        } else {
            this.elements.loginButton.disabled = false;
            this.elements.buttonText.style.display = 'block';
            this.elements.buttonIcon.style.display = 'block';
            this.elements.loadingSpinner.style.display = 'none';
            this.elements.loginButton.style.cursor = 'pointer';
        }
    }
    
    // ===== FORGOT PASSWORD (SOLO FRONTEND) =====
    handleForgotPassword(e) {
        e.preventDefault();
        
        const email = this.elements.emailInput.value.trim();
        
        if (email && email.endsWith(CONFIG.UTP_EMAIL_DOMAIN)) {
            this.showGeneralError('Función de recuperación será implementada con el backend', 'info');
        } else {
            this.showGeneralError('Ingresa un correo institucional @utp.ac.pa válido');
        }
    }
    
    // ===== FUNCIONALIDADES ADICIONALES =====
    loadRememberedUser() {
        const rememberedEmail = localStorage.getItem('remembered_email');
        if (rememberedEmail) {
            this.elements.emailInput.value = rememberedEmail;
            this.elements.rememberCheckbox.checked = true;
            this.elements.passwordInput.focus();
        }
    }
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar sistema de login (solo frontend)
    window.zonautpLogin = new ZonaUTPLogin();
    
    // ...existing code...
});
