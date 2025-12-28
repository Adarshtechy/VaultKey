// DOM Elements
const passwordResult = document.getElementById('PasswordResult');
const passwordLength = document.getElementById('Passwordlength');
const lengthValue = document.getElementById('lengthValue');
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const togglePassword = document.getElementById('togglePassword');
const themeToggle = document.getElementById('themeToggle');
const toast = document.getElementById('toast');

// Character sets
const characterSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateLengthValue();
    loadTheme();
    generatePassword();
    
    // Generate on slider change
    passwordLength.addEventListener('input', () => {
        updateLengthValue();
        generatePassword();
    });
    
    // Generate on checkbox change
    document.querySelectorAll('.checkbox input').forEach(checkbox => {
        checkbox.addEventListener('change', generatePassword);
    });
});

// Update length display
function updateLengthValue() {
    lengthValue.textContent = passwordLength.value;
}

// Generate password
function generatePassword() {
    const length = parseInt(passwordLength.value);
    const includeUppercase = document.getElementById('uppercase').checked;
    const includeLowercase = document.getElementById('lowercase').checked;
    const includeNumbers = document.getElementById('numbers').checked;
    const includeSymbols = document.getElementById('symbols').checked;

    // Build character pool
    let characterPool = '';
    let selectedSets = 0;

    if (includeUppercase) {
        characterPool += characterSets.uppercase;
        selectedSets++;
    }
    if (includeLowercase) {
        characterPool += characterSets.lowercase;
        selectedSets++;
    }
    if (includeNumbers) {
        characterPool += characterSets.numbers;
        selectedSets++;
    }
    if (includeSymbols) {
        characterPool += characterSets.symbols;
        selectedSets++;
    }

    // Check if at least one character set is selected
    if (selectedSets === 0) {
        passwordResult.value = 'Select at least one character type';
        return;
    }

    // Generate password
    let password = '';
    const poolLength = characterPool.length;
    
    // Ensure at least one character from each selected set
    const requiredChars = [];
    if (includeUppercase) requiredChars.push(getRandomChar(characterSets.uppercase));
    if (includeLowercase) requiredChars.push(getRandomChar(characterSets.lowercase));
    if (includeNumbers) requiredChars.push(getRandomChar(characterSets.numbers));
    if (includeSymbols) requiredChars.push(getRandomChar(characterSets.symbols));
    
    // Add required characters
    password = requiredChars.join('');
    
    // Fill remaining length with random characters
    for (let i = password.length; i < length; i++) {
        password += getRandomChar(characterPool);
    }
    
    // Shuffle the password
    password = shuffleString(password);
    
    passwordResult.value = password;
}

// Helper function to get random character
function getRandomChar(str) {
    return str[Math.floor(Math.random() * str.length)];
}

// Helper function to shuffle string
function shuffleString(str) {
    const array = str.split('');
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
}

// Copy to clipboard
copyBtn.addEventListener('click', async () => {
    const password = passwordResult.value;
    
    if (!password || password.includes('Select')) {
        showToast('Generate a password first!', 'error');
        return;
    }
    
    try {
        await navigator.clipboard.writeText(password);
        showToast('Password copied to clipboard!', 'success');
        
        // Visual feedback
        const originalIcon = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        copyBtn.style.background = '#10b981';
        copyBtn.style.borderColor = '#10b981';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalIcon;
            copyBtn.style.background = '';
            copyBtn.style.borderColor = '';
        }, 2000);
    } catch (err) {
        console.error('Failed to copy:', err);
        showToast('Failed to copy password', 'error');
    }
});

// Toggle password visibility
togglePassword.addEventListener('click', () => {
    const type = passwordResult.type === 'password' ? 'text' : 'password';
    passwordResult.type = type;
    
    const icon = togglePassword.querySelector('i');
    icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
    
    showToast(type === 'password' ? 'Password hidden' : 'Password visible');
});

// Generate button click
generateBtn.addEventListener('click', () => {
    generatePassword();
    showToast('New password generated!');
    
    // Visual feedback
    generateBtn.style.transform = 'scale(0.98)';
    setTimeout(() => {
        generateBtn.style.transform = '';
    }, 200);
});

// Theme handling
function loadTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeToggle.checked = currentTheme === 'dark';
}

themeToggle.addEventListener('change', function() {
    if (this.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
});

// Toast notification
function showToast(message, type = 'info') {
    toast.textContent = message;
    toast.className = 'toast';
    
    if (type === 'success') {
        toast.style.borderLeft = '4px solid #10b981';
    } else if (type === 'error') {
        toast.style.borderLeft = '4px solid #ef4444';
    } else {
        toast.style.borderLeft = '4px solid var(--primary-color)';
    }
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Space to generate new password
    if (e.code === 'Space' && document.activeElement !== passwordResult) {
        e.preventDefault();
        generatePassword();
    }
    
    // Enter to generate
    if (e.key === 'Enter' && document.activeElement !== passwordResult) {
        e.preventDefault();
        generatePassword();
    }
});