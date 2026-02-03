// ================================================
// VALENTINE TIMELINE - COMPLETE JAVASCRIPT
// Interactions: AOS, Time Counter, Petals, Valentine Question
// ================================================

// ========== UTILITY FUNCTIONS ==========
function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function createPetal() {
    const petal = document.createElement('div');
    petal.classList.add('petal');
    
    // Random positioning
    petal.style.left = getRandomNumber(0, 100) + '%';
    petal.style.animationDuration = getRandomNumber(8, 15) + 's';
    petal.style.animationDelay = getRandomNumber(0, 5) + 's';
    
    // Random size
    const size = getRandomNumber(15, 30);
    petal.style.width = size + 'px';
    petal.style.height = size + 'px';
    
    return petal;
}

// ========== FLOATING PETALS BACKGROUND ==========
function initPetals() {
    const container = document.getElementById('petalsContainer');
    const petalCount = 25;
    
    for (let i = 0; i < petalCount; i++) {
        container.appendChild(createPetal());
    }
}

// ========== TIME COUNTER (Oct 3, 2023 → Now) ==========
function updateTimeCounter() {
    const startDate = new Date('2023-10-03T00:00:00');
    const now = new Date();
    
    // Calculate differences
    const diffTime = Math.abs(now - startDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = diffDays % 30;
    
    // Animate numbers
    animateValue('years', 0, years, 2000);
    animateValue('months', 0, months, 2000);
    animateValue('days', 0, days, 2000);
}

function animateValue(id, start, end, duration) {
    const element = document.getElementById(id);
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// ========== SCROLL ANIMATIONS (AOS) ==========
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);
    
    // Observe all timeline moments
    document.querySelectorAll('.timeline-moment').forEach(moment => {
        observer.observe(moment);
    });
}

// ========== VALENTINE QUESTION INTERACTIONS ==========
let noClickCount = 0;
let currentPhase = 'initial'; // initial → running → dissolving → cracking → letter

const btnYes = document.getElementById('btnYes');
const btnNo = document.getElementById('btnNo');
const loveLetter = document.getElementById('loveLetter');
const acceptanceScreen = document.getElementById('acceptanceScreen');
const buttonContainer = document.querySelector('.button-container');

// Phase 1: "No" button runs away on hover/click
function initNoButtonRunning() {
    // Set initial position
    const containerRect = buttonContainer.getBoundingClientRect();
    btnNo.style.position = 'absolute';
    btnNo.style.left = '60%';
    btnNo.style.top = '50%';
    btnNo.style.transform = 'translate(-50%, -50%)';
    
    btnNo.addEventListener('mouseenter', makeNoButtonRun);
    btnNo.addEventListener('touchstart', makeNoButtonRun);
    btnNo.addEventListener('click', handleNoClick);
}

function makeNoButtonRun(e) {
    if (currentPhase !== 'initial') return;
    e.preventDefault();
    
    const container = buttonContainer.getBoundingClientRect();
    
    // Random position within safe bounds
    const angle = getRandomNumber(0, Math.PI * 2);
    const radius = getRandomNumber(100, 200);
    
    let randomX = Math.cos(angle) * radius;
    let randomY = Math.sin(angle) * radius;
    
    // Calculate new position relative to container center
    const newLeft = container.width / 2 + randomX;
    const newTop = container.height / 2 + randomY;
    
    // Apply new position
    btnNo.style.transition = 'all 0.3s ease-out';
    btnNo.style.left = newLeft + 'px';
    btnNo.style.top = newTop + 'px';
    btnNo.style.transform = 'translate(-50%, -50%)';
}

function handleNoClick(e) {
    e.preventDefault();
    noClickCount++;
    
    if (noClickCount === 1) {
        // First click: continue running
        makeNoButtonRun();
    } else if (noClickCount === 2) {
        // Second click: start dissolving into petals
        currentPhase = 'dissolving';
        startPetalDissolve();
    }
}

// Phase 2: "No" button dissolves into petals
function startPetalDissolve() {
    btnNo.classList.add('dissolving');
    
    // Create petal burst
    const buttonRect = btnNo.getBoundingClientRect();
    const centerX = buttonRect.left + buttonRect.width / 2;
    const centerY = buttonRect.top + buttonRect.height / 2;
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createPetalBurst(centerX, centerY);
        }, i * 50);
    }
    
    setTimeout(() => {
        btnNo.style.display = 'none';
        currentPhase = 'cracking';
        startCrackingPhase();
    }, 1500);
}

function createPetalBurst(x, y) {
    const petal = document.createElement('div');
    petal.classList.add('petal-burst');
    
    const angle = getRandomNumber(0, Math.PI * 2);
    const distance = getRandomNumber(100, 300);
    
    const burstX = Math.cos(angle) * distance;
    const burstY = Math.sin(angle) * distance;
    
    petal.style.setProperty('--burst-x', burstX + 'px');
    petal.style.setProperty('--burst-y', burstY + 'px');
    petal.style.left = x + 'px';
    petal.style.top = y + 'px';
    
    document.body.appendChild(petal);
    
    setTimeout(() => {
        petal.remove();
    }, 1500);
}

// Phase 3: Screen cracks and reveals love letter
function startCrackingPhase() {
    // Create cracking effect overlay
    const crackOverlay = document.createElement('div');
    crackOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 999;
        background: radial-gradient(circle, transparent 30%, rgba(255, 255, 255, 0.1) 100%);
        opacity: 0;
        transition: opacity 0.5s ease;
    `;
    document.body.appendChild(crackOverlay);
    
    setTimeout(() => {
        crackOverlay.style.opacity = '1';
    }, 100);
    
    // Show love letter after crack
    setTimeout(() => {
        loveLetter.classList.remove('hidden');
        setTimeout(() => {
            loveLetter.classList.add('show');
        }, 50);
        
        crackOverlay.style.opacity = '0';
        setTimeout(() => {
            crackOverlay.remove();
            currentPhase = 'letter';
        }, 500);
    }, 1000);
}

// Phase 4: "Yes" button - Final acceptance
btnYes.addEventListener('click', () => {
    // Hide everything, show celebration
    document.querySelector('.question-container').style.transition = 'all 0.8s ease';
    document.querySelector('.question-container').style.opacity = '0';
    document.querySelector('.question-container').style.transform = 'scale(0.8)';
    
    if (loveLetter.classList.contains('show')) {
        loveLetter.style.transition = 'all 0.8s ease';
        loveLetter.style.opacity = '0';
        loveLetter.style.transform = 'translate(-50%, -50%) scale(0.8)';
    }
    
    setTimeout(() => {
        acceptanceScreen.classList.remove('hidden');
        setTimeout(() => {
            acceptanceScreen.classList.add('show');
            createHeartExplosion();
        }, 50);
    }, 800);
});

function createHeartExplosion() {
    const hearts = ['❤️', '💕', '💖', '💗', '💘', '💝'];
    
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.cssText = `
                position: fixed;
                font-size: ${getRandomNumber(2, 5)}rem;
                left: ${getRandomNumber(10, 90)}%;
                top: ${getRandomNumber(10, 90)}%;
                animation: heartFloat ${getRandomNumber(2, 4)}s ease-out forwards;
                pointer-events: none;
                z-index: 1001;
            `;
            
            document.body.appendChild(heart);
            
            setTimeout(() => {
                heart.remove();
            }, 4000);
        }, i * 100);
    }
}

// Create heart float animation dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes heartFloat {
        0% {
            transform: translateY(0) scale(0);
            opacity: 0;
        }
        50% {
            opacity: 1;
        }
        100% {
            transform: translateY(-200px) scale(1.5);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========== SMOOTH SCROLL ==========
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

// ========== INITIALIZE EVERYTHING ==========
function init() {
    // Start floating petals
    initPetals();
    
    // Start growing tulips
    initGrowingTulips();
    
    // Start time counter
    updateTimeCounter();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize Valentine question interactions
    initNoButtonRunning();
    
    // Initialize music player
    initMusicPlayer();
    
    // Initialize interactive buttons
    initInteractiveButtons();
    
    // Log ready
    console.log('💕 Valentine Timeline initialized');
}

// ========== MUSIC PLAYER ==========
function initMusicPlayer() {
    const musicToggle = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');
    const volumeSlider = document.getElementById('volumeSlider');
    const playIcon = document.querySelector('.play-icon');
    const pauseIcon = document.querySelector('.pause-icon');
    
    let isPlaying = false;
    
    // Set initial volume
    bgMusic.volume = volumeSlider.value / 100;
    
    // Toggle play/pause
    musicToggle.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
        } else {
            bgMusic.play().catch(err => {
                console.log('Music autoplay blocked. User interaction required.');
            });
            playIcon.classList.add('hidden');
            pauseIcon.classList.remove('hidden');
        }
        isPlaying = !isPlaying;
    });
    
    // Volume control
    volumeSlider.addEventListener('input', (e) => {
        const volume = e.target.value;
        bgMusic.volume = volume / 100;
        
        // Update slider background
        const percentage = volume;
        e.target.style.background = `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${percentage}%, #ddd ${percentage}%, #ddd 100%)`;
    });
    
    // Auto-start music after first user interaction (optional)
    document.body.addEventListener('click', () => {
        if (!isPlaying) {
            bgMusic.play().catch(() => {});
            playIcon.classList.add('hidden');
            pauseIcon.classList.remove('hidden');
            isPlaying = true;
        }
    }, { once: true });
}

// ========== INTERACTIVE BUTTONS ==========
function initInteractiveButtons() {
    const tulipBtn = document.getElementById('tulipBtn');
    const heartBtn = document.getElementById('heartBtn');
    const sparkleBtn = document.getElementById('sparkleBtn');
    const messageBtn = document.getElementById('messageBtn');
    
    // Tulip Bouquet Button
    tulipBtn.addEventListener('click', showBouquet);
    
    // Heart Button
    heartBtn.addEventListener('click', () => createFlyingElements('💕', 15));
    
    // Sparkle Button
    sparkleBtn.addEventListener('click', () => createFlyingElements('✨', 20));
    
    // Message Button
    messageBtn.addEventListener('click', showRandomMessage);
}

// Show Bouquet Popup
function showBouquet() {
    const bouquetPopup = document.getElementById('bouquetPopup');
    const bouquetClose = document.getElementById('bouquetClose');
    
    bouquetPopup.classList.remove('hidden');
    setTimeout(() => {
        bouquetPopup.classList.add('show');
    }, 10);
    
    // Create flying tulips
    createFlyingElements('🌷', 12);
    
    // Close button
    bouquetClose.addEventListener('click', () => {
        bouquetPopup.classList.remove('show');
        setTimeout(() => {
            bouquetPopup.classList.add('hidden');
        }, 300);
    }, { once: true });
    
    // Close on background click
    bouquetPopup.addEventListener('click', (e) => {
        if (e.target === bouquetPopup) {
            bouquetPopup.classList.remove('show');
            setTimeout(() => {
                bouquetPopup.classList.add('hidden');
            }, 300);
        }
    });
}

// Show Random Love Message
function showRandomMessage() {
    const messages = [
        "You are my sunshine on cloudy days ☀️",
        "Every moment with you is a treasure 💎",
        "You make my heart skip a beat every time I see you 💓",
        "I fall in love with you more each day 🌹",
        "You're the best thing that ever happened to me ✨",
        "My love for you grows stronger with every passing second 💕",
        "You complete me in ways I never knew I needed 🌈",
        "Thank you for being my forever person 💍",
        "With you, I've found my happily ever after 👑",
        "You are my today and all of my tomorrows 🌅",
        "Loving you is the easiest thing I've ever done 💝",
        "You're not just my love, you're my best friend 🤝",
        "Every love song reminds me of you 🎵",
        "You're the reason I believe in love 💖",
        "I choose you, today and every day 🗓️"
    ];
    
    const messagePopup = document.getElementById('messagePopup');
    const messageText = document.getElementById('messageText');
    const messageClose = document.getElementById('messageClose');
    
    // Pick random message
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    messageText.textContent = randomMessage;
    
    messagePopup.classList.remove('hidden');
    setTimeout(() => {
        messagePopup.classList.add('show');
    }, 10);
    
    // Create flying hearts
    createFlyingElements('💌', 8);
    
    // Close button
    messageClose.addEventListener('click', () => {
        messagePopup.classList.remove('show');
        setTimeout(() => {
            messagePopup.classList.add('hidden');
        }, 300);
    }, { once: true });
    
    // Close on background click
    messagePopup.addEventListener('click', (e) => {
        if (e.target === messagePopup) {
            messagePopup.classList.remove('show');
            setTimeout(() => {
                messagePopup.classList.add('hidden');
            }, 300);
        }
    });
}

// Create Flying Elements (Hearts, Sparkles, Tulips)
function createFlyingElements(emoji, count) {
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const element = document.createElement('div');
            element.classList.add('flying-element');
            element.textContent = emoji;
            
            // Random starting position
            const startX = getRandomNumber(10, window.innerWidth - 50);
            const startY = window.innerHeight - 50;
            
            element.style.left = startX + 'px';
            element.style.top = startY + 'px';
            
            document.body.appendChild(element);
            
            // Remove after animation
            setTimeout(() => {
                element.remove();
            }, 3000);
        }, i * 100);
    }
}

// ========== GROWING TULIPS ON SCROLL ==========
function initGrowingTulips() {
    const leftGarden = document.getElementById('leftGarden');
    const rightGarden = document.getElementById('rightGarden');
    
    // Tulip colors
    const colors = ['#ff69b4', '#ff1493', '#f4c2d4', '#e8a0b5', '#ffd6e5'];
    
    // Create tulips at specific scroll positions
    const tulipPositions = [
        { top: '10%', side: 'left', delay: 0 },
        { top: '15%', side: 'right', delay: 200 },
        { top: '20%', side: 'left', delay: 400 },
        { top: '25%', side: 'right', delay: 600 },
        { top: '30%', side: 'left', delay: 800 },
        { top: '35%', side: 'right', delay: 1000 },
        { top: '40%', side: 'left', delay: 1200 },
        { top: '45%', side: 'right', delay: 1400 },
        { top: '50%', side: 'left', delay: 1600 },
        { top: '55%', side: 'right', delay: 1800 },
        { top: '60%', side: 'left', delay: 2000 },
        { top: '65%', side: 'right', delay: 2200 },
        { top: '70%', side: 'left', delay: 2400 },
        { top: '75%', side: 'right', delay: 2600 },
        { top: '80%', side: 'left', delay: 2800 },
        { top: '85%', side: 'right', delay: 3000 },
        { top: '90%', side: 'left', delay: 3200 },
        { top: '95%', side: 'right', delay: 3400 },
    ];
    
    tulipPositions.forEach(pos => {
        const tulip = createTulip(colors[Math.floor(Math.random() * colors.length)]);
        tulip.style.top = pos.top;
        
        const garden = pos.side === 'left' ? leftGarden : rightGarden;
        garden.appendChild(tulip);
        
        // Add slight horizontal variation
        if (pos.side === 'left') {
            tulip.style.left = getRandomNumber(10, 40) + 'px';
        } else {
            tulip.style.right = getRandomNumber(10, 40) + 'px';
        }
    });
    
    // Grow tulips on scroll
    let lastScrollY = 0;
    let tulipsGrown = 0;
    const allTulips = document.querySelectorAll('.tulip');
    
    function growTulipsOnScroll() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollPercentage = (scrollY / (documentHeight - windowHeight)) * 100;
        
        // Grow tulips progressively as user scrolls
        const tulipsToGrow = Math.floor((scrollPercentage / 100) * allTulips.length);
        
        if (tulipsToGrow > tulipsGrown) {
            for (let i = tulipsGrown; i < tulipsToGrow && i < allTulips.length; i++) {
                setTimeout(() => {
                    allTulips[i].classList.add('grown');
                }, (i - tulipsGrown) * 100);
            }
            tulipsGrown = tulipsToGrow;
        }
        
        lastScrollY = scrollY;
    }
    
    window.addEventListener('scroll', growTulipsOnScroll);
    
    // Grow first few tulips on load
    setTimeout(() => {
        for (let i = 0; i < Math.min(3, allTulips.length); i++) {
            setTimeout(() => {
                allTulips[i].classList.add('grown');
            }, i * 200);
        }
        tulipsGrown = 3;
    }, 1000);
}

function createTulip(color) {
    const tulip = document.createElement('div');
    tulip.classList.add('tulip');
    
    tulip.innerHTML = `
        <svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg">
            <!-- Stem -->
            <path d="M 50 150 Q 48 120 50 90" stroke="#4a7c59" stroke-width="3" fill="none"/>
            <!-- Leaf -->
            <path d="M 50 110 Q 30 115 25 105 Q 30 100 50 108" fill="#6b9b7f" opacity="0.8"/>
            <!-- Tulip petals -->
            <ellipse cx="50" cy="35" rx="18" ry="30" fill="${color}" opacity="0.9"/>
            <ellipse cx="38" cy="40" rx="15" ry="28" fill="${color}" opacity="0.8"/>
            <ellipse cx="62" cy="40" rx="15" ry="28" fill="${color}" opacity="0.8"/>
            <ellipse cx="50" cy="45" rx="12" ry="25" fill="${color}" opacity="0.95"/>
            <!-- Highlight -->
            <ellipse cx="48" cy="30" rx="6" ry="12" fill="white" opacity="0.3"/>
        </svg>
    `;
    
    return tulip;
}

// Run on DOM load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Update time counter every hour
setInterval(updateTimeCounter, 3600000);