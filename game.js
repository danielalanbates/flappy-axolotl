const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// SNES-style underwater music
class UnderwaterMusic {
    constructor() {
        this.isPlaying = false;
        this.currentNoteIndex = 0;
        this.tempo = 320; // ms per note
        this.melody = [
            // New underwater melody - mysterious and flowing
            // Intro phrase
            {freq: 392.00, duration: 0.4}, // G4
            {freq: 493.88, duration: 0.4}, // B4
            {freq: 587.33, duration: 0.4}, // D5
            {freq: 659.25, duration: 0.6}, // E5
            {freq: 587.33, duration: 0.3}, // D5
            {freq: 493.88, duration: 0.5}, // B4
            {freq: 0, duration: 0.3}, // Rest

            // Rising melody
            {freq: 523.25, duration: 0.4}, // C5
            {freq: 587.33, duration: 0.4}, // D5
            {freq: 659.25, duration: 0.4}, // E5
            {freq: 698.46, duration: 0.4}, // F5
            {freq: 783.99, duration: 0.8}, // G5 (hold)
            {freq: 0, duration: 0.3}, // Rest

            // Descending cascade
            {freq: 880.00, duration: 0.3}, // A5
            {freq: 783.99, duration: 0.3}, // G5
            {freq: 659.25, duration: 0.3}, // E5
            {freq: 587.33, duration: 0.3}, // D5
            {freq: 523.25, duration: 0.4}, // C5
            {freq: 493.88, duration: 0.4}, // B4
            {freq: 392.00, duration: 0.6}, // G4
            {freq: 0, duration: 0.3}, // Rest

            // Mysterious middle section
            {freq: 440.00, duration: 0.5}, // A4
            {freq: 523.25, duration: 0.3}, // C5
            {freq: 659.25, duration: 0.5}, // E5
            {freq: 587.33, duration: 0.3}, // D5
            {freq: 523.25, duration: 0.4}, // C5
            {freq: 440.00, duration: 0.8}, // A4
            {freq: 0, duration: 0.3}, // Rest

            // Flowing phrase
            {freq: 493.88, duration: 0.3}, // B4
            {freq: 587.33, duration: 0.3}, // D5
            {freq: 659.25, duration: 0.3}, // E5
            {freq: 698.46, duration: 0.4}, // F5
            {freq: 783.99, duration: 0.4}, // G5
            {freq: 880.00, duration: 0.6}, // A5
            {freq: 0, duration: 0.3}, // Rest

            // Gentle waves
            {freq: 987.77, duration: 0.4}, // B5
            {freq: 880.00, duration: 0.3}, // A5
            {freq: 783.99, duration: 0.4}, // G5
            {freq: 698.46, duration: 0.3}, // F5
            {freq: 659.25, duration: 0.5}, // E5
            {freq: 587.33, duration: 0.5}, // D5
            {freq: 0, duration: 0.3}, // Rest

            // Build up
            {freq: 523.25, duration: 0.3}, // C5
            {freq: 587.33, duration: 0.3}, // D5
            {freq: 659.25, duration: 0.3}, // E5
            {freq: 783.99, duration: 0.4}, // G5
            {freq: 880.00, duration: 0.4}, // A5
            {freq: 987.77, duration: 0.6}, // B5
            {freq: 0, duration: 0.3}, // Rest

            // Resolution
            {freq: 1046.50, duration: 0.4}, // C6 (high)
            {freq: 987.77, duration: 0.3}, // B5
            {freq: 880.00, duration: 0.4}, // A5
            {freq: 783.99, duration: 0.4}, // G5
            {freq: 659.25, duration: 0.5}, // E5
            {freq: 523.25, duration: 1.0}, // C5 (long ending)
            {freq: 0, duration: 0.5}, // Rest before loop
        ];
        this.intervalId = null;
    }

    playNote(freq, duration) {
        if (freq === 0) return; // Rest (silence)

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = 'triangle'; // Softer sound
        oscillator.frequency.value = freq;

        gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    }

    start() {
        if (this.isPlaying) return;
        this.isPlaying = true;

        this.intervalId = setInterval(() => {
            const note = this.melody[this.currentNoteIndex];
            this.playNote(note.freq, note.duration);
            this.currentNoteIndex = (this.currentNoteIndex + 1) % this.melody.length;
        }, this.tempo);
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isPlaying = false;
        this.currentNoteIndex = 0;
    }
}

const music = new UnderwaterMusic();

// Particle system for bubbles
class Bubble {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 50;
        this.radius = Math.random() * 3 + 1;
        this.speed = Math.random() * 1.5 + 0.5;
        this.wobble = Math.random() * Math.PI * 2;
    }

    update() {
        this.y -= this.speed;
        this.wobble += 0.05;
        if (this.y + this.radius < 0) {
            this.y = canvas.height + this.radius;
            this.x = Math.random() * canvas.width;
        }
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x + Math.sin(this.wobble) * 2, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.restore();
    }
}

// Background decorations
class BackgroundElement {
    constructor(type, layer) {
        this.type = type;
        this.layer = layer; // 0 = far, 1 = mid, 2 = close
        this.speed = [0.3, 0.6, 1][layer];
        this.x = canvas.width + Math.random() * 200;
        this.y = Math.random() * (canvas.height - 100) + 20;
        this.size = [0.6, 0.8, 1][layer];
    }

    update() {
        this.x -= this.speed;
        if (this.x < -100) {
            // Reset to right side at same Y position for smoother parallax
            this.x = canvas.width + 100;
            // Only slightly vary the Y position to maintain consistent flow
            this.y = this.y + (Math.random() - 0.5) * 30;
            // Keep Y within bounds
            if (this.y < 20) this.y = 20;
            if (this.y > canvas.height - 80) this.y = canvas.height - 80;
        }
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = [0.4, 0.6, 0.8][this.layer];

        if (this.type === 'fish') {
            this.drawFish();
        } else if (this.type === 'jellyfish') {
            this.drawJellyfish();
        } else if (this.type === 'seaweed') {
            this.drawSeaweed();
        }

        ctx.globalAlpha = 1;
        ctx.restore();
    }

    drawFish() {
        const size = 15 * this.size;
        ctx.fillStyle = ['#ff9e4a', '#4a9eff', '#ffcc00'][Math.floor(this.y / 100) % 3]; // Changed pink to gold
        // Body
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, size, size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        // Tail
        ctx.beginPath();
        ctx.moveTo(this.x - size, this.y);
        ctx.lineTo(this.x - size * 1.5, this.y - size * 0.5);
        ctx.lineTo(this.x - size * 1.5, this.y + size * 0.5);
        ctx.fill();
        // Eye
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x + size * 0.4, this.y - size * 0.2, size * 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.x + size * 0.5, this.y - size * 0.2, size * 0.1, 0, Math.PI * 2);
        ctx.fill();
    }

    drawJellyfish() {
        const size = 20 * this.size;
        const wobble = Math.sin(Date.now() / 500 + this.y) * 3;
        // Bell
        ctx.fillStyle = '#9d4aff'; // Changed to purple instead of pink
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, size * 0.8, size, 0, 0, Math.PI * 2);
        ctx.fill();
        // Tentacles
        ctx.strokeStyle = '#9d4aff';
        ctx.lineWidth = 2 * this.size;
        for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(this.x - size * 0.4 + i * size * 0.3, this.y + size);
            ctx.lineTo(this.x - size * 0.4 + i * size * 0.3 + wobble, this.y + size * 2);
            ctx.stroke();
        }
    }

    drawSeaweed() {
        const height = 60 * this.size;
        const wobble = Math.sin(Date.now() / 2000 + this.x) * 2; // Much slower and less wiggly
        ctx.strokeStyle = '#2d8659';
        ctx.lineWidth = 4 * this.size;
        ctx.beginPath();
        ctx.moveTo(this.x, canvas.height - 50);
        ctx.quadraticCurveTo(
            this.x + wobble, canvas.height - 50 - height / 2,
            this.x + wobble * 0.5, canvas.height - 50 - height
        );
        ctx.stroke();
    }
}

class Bird {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.velocity = 0;
        this.width = 50;
        this.height = 30;
        this.color = '#ffb5d8'; // Pink axolotl
        this.animFrame = 0;
        this.animSpeed = 0;
    }

    update() {
        this.velocity += gravity;
        this.y += this.velocity;
        this.animSpeed += 0.15;
    }

    draw() {
        ctx.save();

        // Calculate scale factors based on current size vs original size
        const scaleX = this.width / 50;
        const scaleY = this.height / 30;

        // Animate bobbing
        const bob = Math.sin(this.animSpeed) * 2;

        // Main body (horizontal) - scaled
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(this.x + 15 * scaleX, this.y + 15 * scaleY + bob, 20 * scaleX, 12 * scaleY, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head - scaled
        ctx.beginPath();
        ctx.ellipse(this.x + 35 * scaleX, this.y + 15 * scaleY + bob, 15 * scaleX, 13 * scaleY, 0, 0, Math.PI * 2);
        ctx.fill();

        // Tail - scaled
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + 15 * scaleY + bob);
        ctx.lineTo(this.x - 8 * scaleX, this.y + 8 * scaleY + bob);
        ctx.lineTo(this.x - 8 * scaleX, this.y + 22 * scaleY + bob);
        ctx.closePath();
        ctx.fill();

        // Gills (external gills - positioned like ears, angled backwards) - scaled
        ctx.strokeStyle = '#ff6b9d';
        ctx.lineWidth = 2 * Math.min(scaleX, scaleY);
        const gillWave = Math.sin(this.animSpeed * 2) * 1;

        // Top gills (3 feathery branches angled backwards) - scaled
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(this.x + 32 * scaleX, this.y + 10 * scaleY + bob);
            ctx.lineTo(this.x + (28 - i * 2) * scaleX, this.y + (7 + i * 2) * scaleY + bob + gillWave);
            ctx.stroke();
        }

        // Eye - scaled
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.x + 40 * scaleX, this.y + 12 * scaleY + bob, 3 * Math.min(scaleX, scaleY), 0, Math.PI * 2);
        ctx.fill();

        // Eye highlight - scaled
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x + 41 * scaleX, this.y + 11 * scaleY + bob, 1.5 * Math.min(scaleX, scaleY), 0, Math.PI * 2);
        ctx.fill();

        // Legs (cute little ones) - scaled
        ctx.fillStyle = this.color;
        const legWobble = Math.sin(this.animSpeed * 2) * 2;
        // Front leg
        ctx.fillRect(this.x + 25 * scaleX, this.y + 25 * scaleY + bob + legWobble, 4 * scaleX, 6 * scaleY);
        // Back leg
        ctx.fillRect(this.x + 10 * scaleX, this.y + 25 * scaleY + bob - legWobble, 4 * scaleX, 6 * scaleY);

        // Smile - scaled
        ctx.strokeStyle = '#ff6b9d';
        ctx.lineWidth = 1.5 * Math.min(scaleX, scaleY);
        ctx.beginPath();
        ctx.arc(this.x + 42 * scaleX, this.y + 16 * scaleY + bob, 4 * Math.min(scaleX, scaleY), 0.2, Math.PI * 0.6);
        ctx.stroke();

        ctx.restore();
    }

    flap() {
        playSound(800, 0.1);
        this.velocity = jump;
    }

    isColliding(pipe) {
        // Use actual bird size for collision, accounting for power-up size changes
        return this.x + 5 < pipe.x + pipe.width && this.x + this.width - 5 > pipe.x &&
               (this.y + 5 < pipe.top || this.y + this.height - 5 > canvas.height - pipe.bottom);
    }

    isOutOfBounds() {
        return this.y > canvas.height - 70 || this.y < 0;
    }
}

class Pipe {
    constructor(x, difficulty = 0) {
        this.x = x;
        this.width = 60;

        // Start with bigger gaps (200), more aggressively decrease to 130 as difficulty increases
        const gap = Math.max(130, 200 - difficulty * 7);
        this.top = Math.random() * (canvas.height - gap - 100) + 50;
        this.bottom = canvas.height - this.top - gap - 50;
        this.speed = 2;
    }

    update() {
        this.x -= this.speed;
    }

    draw() {
        const time = Date.now() / 1000;

        // === TOP SEAWEED ===
        ctx.save();

        // Draw multiple seaweed strands for fullness
        for (let i = 0; i < 4; i++) {
            const xOffset = (this.width / 5) * i + 5;
            const wobble = Math.sin(time * 0.8 + i) * 1.5; // Much slower and gentler

            // Main seaweed color
            ctx.fillStyle = i % 2 === 0 ? '#2d8659' : '#3a9e6a';
            ctx.strokeStyle = i % 2 === 0 ? '#2d8659' : '#3a9e6a';
            ctx.lineWidth = 8;

            // Draw gently curved seaweed strand from top down
            ctx.beginPath();
            ctx.moveTo(this.x + xOffset, 0);

            for (let y = 0; y <= this.top; y += 15) {
                const wavyX = this.x + xOffset + Math.sin((y / 50) + time * 0.8) * wobble;
                ctx.lineTo(wavyX, y);
            }
            ctx.stroke();

            // Add leaves
            ctx.fillStyle = '#4ec47e';
            for (let y = 10; y < this.top; y += 20) {
                const leafX = this.x + xOffset + Math.sin((y / 50) + time * 0.8) * wobble;
                // Left leaf
                ctx.beginPath();
                ctx.ellipse(leafX - 6, y, 5, 8, -0.5, 0, Math.PI * 2);
                ctx.fill();
                // Right leaf
                ctx.beginPath();
                ctx.ellipse(leafX + 6, y + 5, 5, 8, 0.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // === BOTTOM SEAWEED ===
        const bottomStart = canvas.height - this.bottom;

        for (let i = 0; i < 4; i++) {
            const xOffset = (this.width / 5) * i + 5;
            const wobble = Math.sin(time * 0.8 + i + Math.PI) * 1.5; // Much slower and gentler

            // Main seaweed color
            ctx.fillStyle = i % 2 === 0 ? '#2d8659' : '#3a9e6a';
            ctx.strokeStyle = i % 2 === 0 ? '#2d8659' : '#3a9e6a';
            ctx.lineWidth = 8;

            // Draw gently curved seaweed strand from bottom up
            ctx.beginPath();
            ctx.moveTo(this.x + xOffset, canvas.height - 50);

            for (let y = canvas.height - 50; y >= bottomStart; y -= 15) {
                const wavyX = this.x + xOffset + Math.sin(((canvas.height - y) / 50) + time * 0.8) * wobble;
                ctx.lineTo(wavyX, y);
            }
            ctx.stroke();

            // Add leaves
            ctx.fillStyle = '#4ec47e';
            for (let y = canvas.height - 60; y > bottomStart; y -= 20) {
                const leafX = this.x + xOffset + Math.sin(((canvas.height - y) / 50) + time * 0.8) * wobble;
                // Left leaf
                ctx.beginPath();
                ctx.ellipse(leafX - 6, y, 5, 8, -0.5, 0, Math.PI * 2);
                ctx.fill();
                // Right leaf
                ctx.beginPath();
                ctx.ellipse(leafX + 6, y - 5, 5, 8, 0.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        ctx.restore();
    }

    isOffScreen() {
        return this.x + this.width < 0;
    }
}

class PowerUp {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type; // 'shield', 'slow', 'small', 'star'
        this.width = 30;
        this.height = 30;
        this.speed = 2;
        this.collected = false;
        this.sparkle = 0;
        this.rotation = 0;
    }

    update() {
        this.x -= this.speed;
        this.sparkle += 0.1;
        this.rotation += 0.05;
    }

    draw() {
        ctx.save();

        // Sparkle effect
        ctx.globalAlpha = 0.5 + Math.sin(this.sparkle) * 0.3;
        ctx.fillStyle = '#ffff99';
        ctx.beginPath();
        ctx.arc(this.x + 15, this.y + 15, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        // Power-up icon
        if (this.type === 'worm') {
            // Pink worm (wiggly)
            const wormWiggle = Math.sin(this.sparkle * 2) * 2;
            ctx.fillStyle = '#ff69b4';
            ctx.strokeStyle = '#ff1493';
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';

            // Draw wiggly worm body
            ctx.beginPath();
            ctx.moveTo(this.x + 10, this.y + 8);
            ctx.quadraticCurveTo(this.x + 12 + wormWiggle, this.y + 12, this.x + 15, this.y + 15);
            ctx.quadraticCurveTo(this.x + 18 - wormWiggle, this.y + 18, this.x + 20, this.y + 22);
            ctx.stroke();

            // Worm segments
            for (let i = 0; i < 3; i++) {
                ctx.fillStyle = i % 2 === 0 ? '#ff69b4' : '#ff1493';
                ctx.beginPath();
                ctx.arc(this.x + 10 + i * 5, this.y + 8 + i * 4.5, 3, 0, Math.PI * 2);
                ctx.fill();
            }

            // Worm eyes
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(this.x + 9, this.y + 7, 1, 0, Math.PI * 2);
            ctx.arc(this.x + 11, this.y + 7, 1, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.type === 'slow') {
            // Clock icon
            ctx.fillStyle = '#ff9e4a';
            ctx.beginPath();
            ctx.arc(this.x + 15, this.y + 15, 12, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#cf7e2a';
            ctx.lineWidth = 2;
            ctx.stroke();
            // Clock hands
            ctx.strokeStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(this.x + 15, this.y + 15);
            ctx.lineTo(this.x + 15, this.y + 8);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(this.x + 15, this.y + 15);
            ctx.lineTo(this.x + 20, this.y + 15);
            ctx.stroke();
        } else if (this.type === 'small') {
            // Shrink icon
            ctx.fillStyle = '#ff4aff';
            ctx.fillRect(this.x + 8, this.y + 8, 14, 14);
            ctx.strokeStyle = '#cf2acf';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x + 8, this.y + 8, 14, 14);
            // Arrows pointing inward
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(this.x + 10, this.y + 15);
            ctx.lineTo(this.x + 14, this.y + 12);
            ctx.lineTo(this.x + 14, this.y + 18);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(this.x + 20, this.y + 15);
            ctx.lineTo(this.x + 16, this.y + 12);
            ctx.lineTo(this.x + 16, this.y + 18);
            ctx.fill();
        } else if (this.type === 'star') {
            // Star icon with rotation
            ctx.save();
            ctx.translate(this.x + 15, this.y + 15);
            ctx.rotate(this.rotation);

            // Draw 5-pointed star
            ctx.fillStyle = '#ffff00';
            ctx.strokeStyle = '#ffa500';
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let i = 0; i < 10; i++) {
                const angle = (i * Math.PI) / 5 - Math.PI / 2;
                const radius = i % 2 === 0 ? 12 : 5;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Sparkles around star
            ctx.fillStyle = '#ffffff';
            for (let i = 0; i < 8; i++) {
                const sparkleAngle = (i * Math.PI / 4) + this.sparkle;
                const sparkleRadius = 16 + Math.sin(this.sparkle * 2 + i) * 2;
                const sx = Math.cos(sparkleAngle) * sparkleRadius;
                const sy = Math.sin(sparkleAngle) * sparkleRadius;
                ctx.beginPath();
                ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        }

        ctx.restore();
    }

    isOffScreen() {
        return this.x + this.width < 0;
    }

    collidesWith(bird) {
        return this.x < bird.x + bird.width &&
               this.x + this.width > bird.x &&
               this.y < bird.y + bird.height &&
               this.y + this.height > bird.y;
    }
}

class GoldenHeart {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 35;
        this.height = 35;
        this.speed = 2;
        this.collected = false;
        this.sparkle = 0;
        this.float = 0;
    }

    update() {
        this.x -= this.speed;
        this.sparkle += 0.15;
        this.float += 0.08;
    }

    draw() {
        ctx.save();

        // Golden glow effect
        const glowSize = 25 + Math.sin(this.sparkle) * 5;
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(this.x + 17.5, this.y + 17.5 + Math.sin(this.float) * 3, glowSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        // Draw golden heart shape
        const centerX = this.x + 17.5;
        const centerY = this.y + 17.5 + Math.sin(this.float) * 3;
        const size = 12;

        ctx.fillStyle = '#ffd700'; // Gold color
        ctx.beginPath();
        ctx.moveTo(centerX, centerY + size / 4);

        // Left curve
        ctx.bezierCurveTo(
            centerX, centerY - size / 4,
            centerX - size, centerY - size / 4,
            centerX - size, centerY + size / 4
        );
        ctx.bezierCurveTo(
            centerX - size, centerY + size / 1.5,
            centerX, centerY + size * 1.3,
            centerX, centerY + size * 1.5
        );

        // Right curve
        ctx.bezierCurveTo(
            centerX, centerY + size * 1.3,
            centerX + size, centerY + size / 1.5,
            centerX + size, centerY + size / 4
        );
        ctx.bezierCurveTo(
            centerX + size, centerY - size / 4,
            centerX, centerY - size / 4,
            centerX, centerY + size / 4
        );
        ctx.fill();

        // Shine effect on heart
        ctx.fillStyle = '#ffed4e';
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.arc(centerX - 4, centerY - 2, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        // Sparkles around the heart
        ctx.fillStyle = '#fff';
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI / 3) + this.sparkle;
            const radius = 20 + Math.sin(this.sparkle * 2 + i) * 3;
            const sx = centerX + Math.cos(angle) * radius;
            const sy = centerY + Math.sin(angle) * radius;
            const sparkleSize = 1 + Math.sin(this.sparkle + i) * 0.5;
            ctx.beginPath();
            ctx.arc(sx, sy, sparkleSize, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    isOffScreen() {
        return this.x + this.width < 0;
    }

    collidesWith(bird) {
        return this.x < bird.x + bird.width &&
               this.x + this.width > bird.x &&
               this.y < bird.y + bird.height &&
               this.y + this.height > bird.y;
    }
}

class Mermaid {
    constructor(powerUpType) {
        this.x = canvas.width + 50;
        this.y = 100 + Math.random() * 300;
        this.speed = 3;
        this.width = 50;
        this.height = 70;
        this.animFrame = 0;
        this.hasDroppedPowerUp = false;
        this.powerUpType = powerUpType;

        // Set hair color based on power-up type
        if (powerUpType === 'worm') {
            this.hairColor = '#ff69b4'; // Pink for worm (health)
        } else if (powerUpType === 'slow') {
            this.hairColor = '#ff9e4a'; // Orange for slow
        } else if (powerUpType === 'small') {
            this.hairColor = '#ff4aff'; // Magenta for small
        } else if (powerUpType === 'star') {
            this.hairColor = '#ffff00'; // Yellow for star
        } else {
            this.hairColor = '#ff4040'; // Red (default)
        }
    }

    update() {
        this.x -= this.speed;
        this.animFrame += 0.12;
    }

    draw() {
        ctx.save();

        const swimWave = Math.sin(this.animFrame) * 3;
        const tailWave = Math.sin(this.animFrame * 1.5) * 8;

        // Tail fin - large and expressive like Ariel
        ctx.fillStyle = '#2eb82e'; // Bright green like Ariel's tail
        ctx.beginPath();
        // Upper fin
        ctx.moveTo(this.x - 15, this.y + 45 + tailWave);
        ctx.quadraticCurveTo(this.x - 25, this.y + 40 + tailWave, this.x - 28, this.y + 35 + tailWave);
        ctx.quadraticCurveTo(this.x - 25, this.y + 43 + tailWave, this.x - 18, this.y + 48 + tailWave);
        ctx.fill();

        // Lower fin
        ctx.beginPath();
        ctx.moveTo(this.x - 15, this.y + 45 + tailWave);
        ctx.quadraticCurveTo(this.x - 25, this.y + 50 + tailWave, this.x - 28, this.y + 55 + tailWave);
        ctx.quadraticCurveTo(this.x - 25, this.y + 47 + tailWave, this.x - 18, this.y + 48 + tailWave);
        ctx.fill();

        // Tail body
        ctx.fillStyle = '#4ed44e'; // Lighter green
        ctx.beginPath();
        ctx.ellipse(this.x, this.y + 40 + tailWave * 0.3, 10, 16, 0.3, 0, Math.PI * 2);
        ctx.fill();

        // Scales on tail
        ctx.fillStyle = '#2eb82e';
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(this.x - 5 + i * 3, this.y + 35 + i * 5 + tailWave * 0.3, 3, 0, Math.PI * 2);
            ctx.fill();
        }

        // Skin/body (draw first, before shells)
        ctx.fillStyle = '#ffd4a3';
        // Torso
        ctx.fillRect(this.x + 8, this.y + 20, 14, 18);

        // Head
        ctx.beginPath();
        ctx.arc(this.x + 15, this.y + 12, 10, 0, Math.PI * 2);
        ctx.fill();

        // Neck
        ctx.fillRect(this.x + 12, this.y + 18, 6, 4);

        // Purple seashell bra (more prominent)
        ctx.fillStyle = '#b86ed4';
        // Left shell
        ctx.beginPath();
        ctx.arc(this.x + 11, this.y + 26, 5, 0, Math.PI * 2);
        ctx.fill();
        // Right shell
        ctx.beginPath();
        ctx.arc(this.x + 19, this.y + 26, 5, 0, Math.PI * 2);
        ctx.fill();

        // Shell highlights
        ctx.fillStyle = '#d89ef4';
        ctx.beginPath();
        ctx.arc(this.x + 10, this.y + 25, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 18, this.y + 25, 2, 0, Math.PI * 2);
        ctx.fill();

        // Shell outlines (make them look like shells)
        ctx.strokeStyle = '#8a4eb4';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x + 11, this.y + 26, 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.x + 19, this.y + 26, 5, 0, Math.PI * 2);
        ctx.stroke();

        // Shell ridges
        ctx.strokeStyle = '#8a4eb4';
        ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
            // Left shell
            ctx.beginPath();
            ctx.moveTo(this.x + 11, this.y + 23);
            ctx.lineTo(this.x + 11, this.y + 29);
            ctx.stroke();
            // Right shell
            ctx.beginPath();
            ctx.moveTo(this.x + 19, this.y + 23);
            ctx.lineTo(this.x + 19, this.y + 29);
            ctx.stroke();
        }

        // Eyes - big and expressive (draw BEFORE hair)
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x + 12, this.y + 11, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 18, this.y + 11, 3, 0, Math.PI * 2);
        ctx.fill();

        // Blue eyes (Ariel's blue eyes)
        ctx.fillStyle = '#4a9eff';
        ctx.beginPath();
        ctx.arc(this.x + 12, this.y + 11, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 18, this.y + 11, 2, 0, Math.PI * 2);
        ctx.fill();

        // Pupils
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.x + 12, this.y + 11, 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 18, this.y + 11, 1, 0, Math.PI * 2);
        ctx.fill();

        // Eyebrows (match hair color but darker)
        ctx.strokeStyle = this.hairColor;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.moveTo(this.x + 9, this.y + 8);
        ctx.quadraticCurveTo(this.x + 11, this.y + 7, this.x + 13, this.y + 8);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.x + 17, this.y + 8);
        ctx.quadraticCurveTo(this.x + 19, this.y + 7, this.x + 21, this.y + 8);
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Eyelashes
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
            // Left eye lashes
            ctx.beginPath();
            ctx.moveTo(this.x + 11 + i, this.y + 9);
            ctx.lineTo(this.x + 10 + i, this.y + 7);
            ctx.stroke();
            // Right eye lashes
            ctx.beginPath();
            ctx.moveTo(this.x + 17 + i, this.y + 9);
            ctx.lineTo(this.x + 16 + i, this.y + 7);
            ctx.stroke();
        }

        // Nose
        ctx.fillStyle = '#ffb080';
        ctx.beginPath();
        ctx.arc(this.x + 15, this.y + 13, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Lips (more detailed)
        ctx.fillStyle = '#ff4a6a';
        ctx.beginPath();
        ctx.ellipse(this.x + 15, this.y + 16.5, 3, 1.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Smile line
        ctx.strokeStyle = '#cc2040';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.x + 15, this.y + 16, 3, 0.1, Math.PI - 0.1);
        ctx.stroke();

        // Long flowing hair - color matches power-up type!
        ctx.fillStyle = this.hairColor;
        // Hair volume on sides and top
        ctx.beginPath();
        ctx.arc(this.x + 7, this.y + 10, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 15, this.y + 6, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 23, this.y + 10, 6, 0, Math.PI * 2);
        ctx.fill();

        // Flowing hair strands behind
        for (let i = 0; i < 3; i++) {
            const hairFlow = Math.sin(this.animFrame + i * 0.5) * 4;
            ctx.strokeStyle = this.hairColor;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(this.x + 6 + i * 5, this.y + 16);
            ctx.quadraticCurveTo(
                this.x + 3 + i * 5 + hairFlow,
                this.y + 26,
                this.x + 1 + i * 4 + hairFlow * 1.5,
                this.y + 35
            );
            ctx.stroke();
        }

        // Arms
        ctx.strokeStyle = '#ffd4a3';
        ctx.lineWidth = 5;
        const armWave = Math.sin(this.animFrame * 2) * 3;
        ctx.beginPath();
        ctx.moveTo(this.x + 8, this.y + 24);
        ctx.lineTo(this.x + 3, this.y + 30 + armWave);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.x + 22, this.y + 24);
        ctx.lineTo(this.x + 27, this.y + 30 - armWave);
        ctx.stroke();

        ctx.restore();
    }

    isOffScreen() {
        return this.x + this.width < -50;
    }

    shouldDropPowerUp(playerX) {
        // Drop power-up much further ahead so player has to chase it
        return !this.hasDroppedPowerUp && (this.x - playerX) < 250 && (this.x - playerX) > 180;
    }
}

class ScubaDiverBoss {
    constructor() {
        this.x = canvas.width + 100; // Start from right side
        this.y = 100 + Math.random() * 200;
        this.width = 100;
        this.height = 120;
        this.health = 5;
        this.maxHealth = 5;
        this.state = 'entering'; // 'entering', 'attacking', 'retreating'
        this.netAttacks = [];
        this.attackTimer = 0;
        this.animFrame = 0;
        this.bubbleTimer = 0;
    }

    update(game) {
        this.animFrame += 0.05;
        this.attackTimer++;
        this.bubbleTimer++;

        if (this.state === 'entering') {
            this.x -= 3; // Move from right to left
            if (this.x <= canvas.width - 150) {
                this.state = 'attacking';
            }
        } else if (this.state === 'attacking') {
            // Hover in place with slight movement
            this.y += Math.sin(this.animFrame) * 1;

            // Throw nets
            if (this.attackTimer % 120 === 0) {
                this.throwNet();
            }

            // Update net attacks
            this.netAttacks = this.netAttacks.filter(net => !net.isOffScreen());
            this.netAttacks.forEach(net => net.update());

            // Check if defeated
            if (this.health <= 0) {
                this.state = 'retreating';
                this.justDefeated = true; // Flag for golden heart spawn
            }
        } else if (this.state === 'retreating') {
            this.y -= 3;
            if (this.y < -200) {
                return true; // Boss defeated
            }
        }

        return false;
    }

    throwNet() {
        // Place net at a random vertical position
        const netY = 100 + Math.random() * 300;
        this.netAttacks.push(new Net(this.x - 50, netY));
        playSound(300, 0.2);
    }

    draw() {
        ctx.save();

        const bob = Math.sin(this.animFrame * 2) * 3;
        const flipperKick = Math.sin(this.animFrame * 4) * 5;

        // Bubbles from regulator
        if (this.bubbleTimer % 20 === 0) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.arc(this.x + 40 + Math.random() * 10, this.y + 25 + bob - i * 8, 2 + Math.random() * 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Air tanks (double tanks)
        ctx.fillStyle = '#888888';
        ctx.fillRect(this.x + 30, this.y + 35 + bob, 12, 35);
        ctx.fillRect(this.x + 45, this.y + 35 + bob, 12, 35);

        // Tank straps
        ctx.fillStyle = '#555555';
        ctx.fillRect(this.x + 28, this.y + 45 + bob, 32, 4);
        ctx.fillRect(this.x + 28, this.y + 60 + bob, 32, 4);

        // Tank valve tops
        ctx.fillStyle = '#666666';
        ctx.fillRect(this.x + 32, this.y + 32 + bob, 8, 5);
        ctx.fillRect(this.x + 47, this.y + 32 + bob, 8, 5);

        // Body (wetsuit) - more detailed
        ctx.fillStyle = '#1a1a1a';
        // Torso
        ctx.fillRect(this.x + 25, this.y + 35 + bob, 35, 40);

        // Wetsuit stripes
        ctx.fillStyle = '#ff6600';
        ctx.fillRect(this.x + 27, this.y + 40 + bob, 3, 30);
        ctx.fillRect(this.x + 55, this.y + 40 + bob, 3, 30);

        // Belt with weights
        ctx.fillStyle = '#444444';
        ctx.fillRect(this.x + 25, this.y + 65 + bob, 35, 5);
        ctx.fillStyle = '#666666';
        for (let i = 0; i < 4; i++) {
            ctx.fillRect(this.x + 28 + i * 8, this.y + 66 + bob, 5, 4);
        }

        // Legs
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(this.x + 30, this.y + 75 + bob, 10, 20);
        ctx.fillRect(this.x + 45, this.y + 75 + bob, 10, 20);

        // Head
        ctx.fillStyle = '#ffd4a3';
        ctx.beginPath();
        ctx.arc(this.x + 42, this.y + 25 + bob, 15, 0, Math.PI * 2);
        ctx.fill();

        // Diving mask - more detailed
        ctx.fillStyle = '#2a5fcf';
        ctx.beginPath();
        ctx.ellipse(this.x + 42, this.y + 25 + bob, 18, 12, 0, 0, Math.PI * 2);
        ctx.fill();

        // Mask glass
        ctx.fillStyle = 'rgba(74, 158, 255, 0.7)';
        ctx.beginPath();
        ctx.ellipse(this.x + 42, this.y + 25 + bob, 15, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        // Mask frame
        ctx.strokeStyle = '#1a3a8f';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(this.x + 42, this.y + 25 + bob, 18, 12, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Mask strap
        ctx.strokeStyle = '#1a3a8f';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(this.x + 28, this.y + 25 + bob);
        ctx.lineTo(this.x + 30, this.y + 20 + bob);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.x + 56, this.y + 25 + bob);
        ctx.lineTo(this.x + 54, this.y + 20 + bob);
        ctx.stroke();

        // Regulator (breathing apparatus)
        ctx.fillStyle = '#ffcc00';
        ctx.beginPath();
        ctx.arc(this.x + 42, this.y + 32 + bob, 5, 0, Math.PI * 2);
        ctx.fill();

        // Regulator hose
        ctx.strokeStyle = '#ffcc00';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(this.x + 42, this.y + 37 + bob);
        ctx.quadraticCurveTo(this.x + 35, this.y + 45 + bob, this.x + 35, this.y + 50 + bob);
        ctx.stroke();

        // Arms with gloves
        const armSwing = Math.sin(this.animFrame * 3) * 8;
        ctx.fillStyle = '#1a1a1a';
        ctx.lineWidth = 12;
        // Left arm
        ctx.beginPath();
        ctx.moveTo(this.x + 25, this.y + 40 + bob);
        ctx.lineTo(this.x + 15, this.y + 50 + bob + armSwing);
        ctx.stroke();
        // Right arm (holding net launcher)
        ctx.beginPath();
        ctx.moveTo(this.x + 60, this.y + 40 + bob);
        ctx.lineTo(this.x + 70, this.y + 50 + bob - armSwing);
        ctx.stroke();

        // Gloves
        ctx.fillStyle = '#ffcc00';
        ctx.beginPath();
        ctx.arc(this.x + 15, this.y + 50 + bob + armSwing, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 70, this.y + 50 + bob - armSwing, 6, 0, Math.PI * 2);
        ctx.fill();

        // Net launcher in hand
        ctx.fillStyle = '#444444';
        ctx.fillRect(this.x + 68, this.y + 48 + bob - armSwing, 8, 15);
        ctx.fillStyle = '#666666';
        ctx.fillRect(this.x + 70, this.y + 46 + bob - armSwing, 4, 4);

        // Flippers with detail
        ctx.fillStyle = '#ff9e4a';
        // Left flipper
        ctx.beginPath();
        ctx.ellipse(this.x + 35, this.y + 100 + bob + flipperKick, 10, 15, 0.3, 0, Math.PI * 2);
        ctx.fill();
        // Right flipper
        ctx.beginPath();
        ctx.ellipse(this.x + 50, this.y + 100 + bob - flipperKick, 10, 15, -0.3, 0, Math.PI * 2);
        ctx.fill();

        // Flipper straps
        ctx.strokeStyle = '#cc7e3a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x + 35, this.y + 95 + bob);
        ctx.lineTo(this.x + 35, this.y + 92 + bob);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.x + 50, this.y + 95 + bob);
        ctx.lineTo(this.x + 50, this.y + 92 + bob);
        ctx.stroke();

        // Health bar
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(this.x, this.y - 20, this.width, 12);
        ctx.fillStyle = '#ff4a4a';
        ctx.fillRect(this.x + 2, this.y - 18, (this.width - 4) * (this.health / this.maxHealth), 8);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y - 20, this.width, 12);

        // Health text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${this.health}/${this.maxHealth}`, this.x + this.width/2, this.y - 11);
        ctx.textAlign = 'start';

        ctx.restore();

        // Draw nets
        this.netAttacks.forEach(net => net.draw());
    }

    takeDamage() {
        this.health--;
        playSound(150, 0.3);
    }
}

class DolphinBoss {
    constructor() {
        this.x = canvas.width + 100; // Start from right side
        this.y = 100 + Math.random() * 200;
        this.width = 100;
        this.height = 80;
        this.health = 5;
        this.maxHealth = 5;
        this.state = 'entering'; // 'entering', 'attacking', 'retreating'
        this.whirlpoolAttacks = [];
        this.attackTimer = 0;
        this.animFrame = 0;
    }

    update(game) {
        this.animFrame += 0.08;
        this.attackTimer++;

        if (this.state === 'entering') {
            this.x -= 3; // Move from right to left
            if (this.x <= canvas.width - 150) {
                this.state = 'attacking';
            }
        } else if (this.state === 'attacking') {
            // Hover in place with dolphin-like movement
            this.y += Math.sin(this.animFrame) * 2;

            // Drop whirlpools
            if (this.attackTimer % 120 === 0) {
                this.dropWhirlpool();
            }

            // Update whirlpool attacks
            this.whirlpoolAttacks = this.whirlpoolAttacks.filter(whirlpool => !whirlpool.isOffScreen());
            this.whirlpoolAttacks.forEach(whirlpool => whirlpool.update());

            // Check if defeated
            if (this.health <= 0) {
                this.state = 'retreating';
                this.justDefeated = true; // Flag for golden heart spawn
            }
        } else if (this.state === 'retreating') {
            this.y -= 3;
            if (this.y < -200) {
                return true; // Boss defeated
            }
        }

        return false;
    }

    dropWhirlpool() {
        // Place whirlpool at a random vertical position
        const whirlpoolY = 100 + Math.random() * 300;
        this.whirlpoolAttacks.push(new Whirlpool(this.x - 50, whirlpoolY));
        playSound(400, 0.2);
    }

    draw() {
        ctx.save();

        const bob = Math.sin(this.animFrame * 2) * 4;
        const tailSwim = Math.sin(this.animFrame * 3) * 8;

        // Horizontal dolphin (facing left, head on left side) - thinner profile, longer body
        ctx.fillStyle = '#7fa8c9';

        // Main body (horizontal ellipse - thinner and longer)
        ctx.beginPath();
        ctx.ellipse(this.x + 50, this.y + 40 + bob, 45, 16, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head/melon (rounded forehead - narrower)
        ctx.beginPath();
        ctx.ellipse(this.x + 85, this.y + 40 + bob, 18, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        // Blowhole (on top of head)
        ctx.fillStyle = '#5a7f9a';
        ctx.beginPath();
        ctx.ellipse(this.x + 78, this.y + 28 + bob, 3, 2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Long rostrum (beak/nose) - extended forward
        ctx.fillStyle = '#6a8fb0';
        ctx.beginPath();
        ctx.moveTo(this.x + 95, this.y + 36 + bob);
        ctx.lineTo(this.x + 123, this.y + 37 + bob);
        ctx.lineTo(this.x + 123, this.y + 43 + bob);
        ctx.lineTo(this.x + 95, this.y + 44 + bob);
        ctx.closePath();
        ctx.fill();

        // Mouth line (shows the long mouth)
        ctx.strokeStyle = '#5a7f9a';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(this.x + 123, this.y + 40 + bob);
        ctx.lineTo(this.x + 100, this.y + 43 + bob);
        ctx.stroke();

        // Belly (lighter underside - thinner and longer)
        ctx.fillStyle = '#b3d1e6';
        ctx.beginPath();
        ctx.ellipse(this.x + 50, this.y + 44 + bob, 40, 12, 0, 0, Math.PI * 2);
        ctx.fill();

        // Dorsal fin (on top/back)
        ctx.fillStyle = '#6a8fb0';
        ctx.beginPath();
        ctx.moveTo(this.x + 45, this.y + 20 + bob);
        ctx.quadraticCurveTo(this.x + 42, this.y + 10 + bob, this.x + 50, this.y + 15 + bob);
        ctx.lineTo(this.x + 52, this.y + 22 + bob);
        ctx.closePath();
        ctx.fill();

        // Pectoral fin (on top side)
        ctx.fillStyle = '#7fa8c9';
        // Top fin
        ctx.beginPath();
        ctx.ellipse(this.x + 63, this.y + 28 + bob, 8, 18, -0.5, 0, Math.PI * 2);
        ctx.fill();

        // Tail stock (peduncle - narrow part before tail) - thinner
        ctx.fillStyle = '#7fa8c9';
        ctx.beginPath();
        ctx.ellipse(this.x + 20, this.y + 40 + bob, 10, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Tail flukes (vertical, at back)
        ctx.fillStyle = '#6a8fb0';
        ctx.beginPath();
        // Top fluke
        ctx.moveTo(this.x + 18, this.y + 40 + bob + tailSwim);
        ctx.quadraticCurveTo(this.x + 10, this.y + 30 + bob + tailSwim, this.x + 5, this.y + 25 + bob + tailSwim);
        ctx.quadraticCurveTo(this.x + 12, this.y + 32 + bob + tailSwim, this.x + 16, this.y + 38 + bob + tailSwim);
        ctx.fill();
        // Bottom fluke
        ctx.beginPath();
        ctx.moveTo(this.x + 18, this.y + 40 + bob + tailSwim);
        ctx.quadraticCurveTo(this.x + 10, this.y + 50 + bob + tailSwim, this.x + 5, this.y + 55 + bob + tailSwim);
        ctx.quadraticCurveTo(this.x + 12, this.y + 48 + bob + tailSwim, this.x + 16, this.y + 42 + bob + tailSwim);
        ctx.fill();

        // Eye
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.x + 88, this.y + 35 + bob, 4, 0, Math.PI * 2);
        ctx.fill();

        // Eye highlight
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x + 89, this.y + 34 + bob, 2, 0, Math.PI * 2);
        ctx.fill();

        // Smile (curved line near beak)
        ctx.strokeStyle = '#5a7f9a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x + 95, this.y + 43 + bob, 6, 0.2, Math.PI - 0.2);
        ctx.stroke();

        // Health bar
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(this.x, this.y - 20, this.width, 12);
        ctx.fillStyle = '#4aff4a';
        ctx.fillRect(this.x + 2, this.y - 18, (this.width - 4) * (this.health / this.maxHealth), 8);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y - 20, this.width, 12);

        // Health text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${this.health}/${this.maxHealth}`, this.x + this.width/2, this.y - 11);
        ctx.textAlign = 'start';

        ctx.restore();

        // Draw whirlpools
        this.whirlpoolAttacks.forEach(whirlpool => whirlpool.draw());
    }

    takeDamage() {
        this.health--;
        playSound(150, 0.3);
    }
}

class Net {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.speed = 1.5; // Nets slowly move towards axolotl
        this.rotation = 0;
        this.deployTime = Date.now();
        this.deployed = false;
        this.deploySpeed = 5; // Speed during deployment animation
    }

    update() {
        // Deploy animation - net expands into place
        if (!this.deployed) {
            const elapsed = (Date.now() - this.deployTime) / 1000;
            if (elapsed < 0.3) {
                // Quick deployment animation
                this.rotation += 0.3;
            } else {
                this.deployed = true;
                this.rotation = 0;
            }
        }
        // Once deployed, net slowly moves left towards the axolotl
        this.x -= this.speed;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);

        if (!this.deployed) {
            ctx.rotate(this.rotation);
        }

        // Net with better visibility
        ctx.strokeStyle = '#d4a574';
        ctx.lineWidth = 3;
        const gridSize = 12;

        // Draw net grid
        for (let i = -this.width/2; i <= this.width/2; i += gridSize) {
            ctx.beginPath();
            ctx.moveTo(i, -this.height/2);
            ctx.lineTo(i, this.height/2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(-this.width/2, i);
            ctx.lineTo(this.width/2, i);
            ctx.stroke();
        }

        // Net border for emphasis
        ctx.strokeStyle = '#8b6f47';
        ctx.lineWidth = 4;
        ctx.strokeRect(-this.width/2, -this.height/2, this.width, this.height);

        // Add weights at corners
        ctx.fillStyle = '#666666';
        const cornerSize = 6;
        ctx.fillRect(-this.width/2 - cornerSize/2, -this.height/2 - cornerSize/2, cornerSize, cornerSize);
        ctx.fillRect(this.width/2 - cornerSize/2, -this.height/2 - cornerSize/2, cornerSize, cornerSize);
        ctx.fillRect(-this.width/2 - cornerSize/2, this.height/2 - cornerSize/2, cornerSize, cornerSize);
        ctx.fillRect(this.width/2 - cornerSize/2, this.height/2 - cornerSize/2, cornerSize, cornerSize);

        ctx.restore();
    }

    isOffScreen() {
        // Nets never go off screen since they stay in place
        // Remove them after 10 seconds
        return (Date.now() - this.deployTime) > 10000;
    }

    collidesWith(bird) {
        return this.x - this.width/2 < bird.x + bird.width &&
               this.x + this.width/2 > bird.x &&
               this.y - this.height/2 < bird.y + bird.height &&
               this.y + this.height/2 > bird.y;
    }
}

class Whirlpool {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.speed = 1.5; // Whirlpools slowly move towards axolotl
        this.rotation = 0;
        this.deployTime = Date.now();
        this.deployed = false;
        this.spinSpeed = 0.15;
    }

    update() {
        // Deploy animation - whirlpool expands into place
        if (!this.deployed) {
            const elapsed = (Date.now() - this.deployTime) / 1000;
            if (elapsed < 0.3) {
                // Quick deployment animation
                this.rotation += 0.5;
            } else {
                this.deployed = true;
            }
        }
        // Continuous spinning
        this.rotation += this.spinSpeed;
        // Once deployed, whirlpool slowly moves left towards the axolotl
        this.x -= this.speed;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        const radius = this.width / 2;

        // Draw spiraling whirlpool
        const spirals = 3;
        const segments = 20;

        for (let spiral = 0; spiral < spirals; spiral++) {
            ctx.strokeStyle = spiral % 2 === 0 ? '#4a9eff' : '#2a7fb5';
            ctx.lineWidth = 4;
            ctx.beginPath();

            for (let i = 0; i <= segments; i++) {
                const angle = (i / segments) * Math.PI * 2;
                const spiralRadius = radius * (1 - i / segments) * (spiral + 1) / spirals;
                const x = Math.cos(angle + spiral * Math.PI * 2 / spirals) * spiralRadius;
                const y = Math.sin(angle + spiral * Math.PI * 2 / spirals) * spiralRadius;

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
        }

        // Center dot
        ctx.fillStyle = '#1a4d73';
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();

        // Outer ring
        ctx.strokeStyle = '#4a9eff';
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;

        ctx.restore();
    }

    isOffScreen() {
        // Remove after 10 seconds
        return (Date.now() - this.deployTime) > 10000;
    }

    collidesWith(bird) {
        return this.x - this.width/2 < bird.x + bird.width &&
               this.x + this.width/2 > bird.x &&
               this.y - this.height/2 < bird.y + bird.height &&
               this.y + this.height/2 > bird.y;
    }
}

class Game {
    constructor() {
        this.bird = new Bird(50, 300);
        this.pipes = [];
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('flappyAxolotlHighScore')) || 0;
        this.highScores = this.loadHighScores();
        this.state = 'start'; // 'start', 'playing', 'gameover', 'enterInitials'
        this.initials = ['A', 'A', 'A'];
        this.initialIndex = 0;
        this.pipeSpawnDistance = 250;

        // Background elements
        this.bubbles = [];
        for (let i = 0; i < 30; i++) {
            this.bubbles.push(new Bubble());
        }

        this.backgroundElements = [];
        const types = ['fish', 'jellyfish', 'seaweed'];
        for (let layer = 0; layer < 3; layer++) {
            for (let i = 0; i < 5; i++) {
                const type = types[Math.floor(Math.random() * types.length)];
                this.backgroundElements.push(new BackgroundElement(type, layer));
            }
        }

        // Power-up system
        this.powerUps = [];
        this.activePowerUp = null;
        this.powerUpTimer = 0;
        this.mermaid = null;
        this.mermaidTimer = Math.random() * 500 + 300; // Random spawn
        this.goldenHeart = null; // Golden heart from boss defeats

        // Boss system
        this.boss = null;
        this.bossActive = false;
        this.bossDefeated = false;
        this.bossCount = 0;
        this.persistentNets = []; // Nets that stay after boss leaves
        this.persistentWhirlpools = []; // Whirlpools that stay after boss leaves

        // Power-up effects
        this.hasStar = false;
        this.pipeSpeed = 2.2; // Start faster - less boring
        this.basePipeSpeed = 2.2;
        this.originalBirdSize = {width: 50, height: 30};
        this.originalBirdColor = '#ffb5d8';
        this.difficulty = 0; // Tracks difficulty level

        // Ground scrolling
        this.groundOffset = 0;

        // Heart system
        this.hearts = 3;
        this.maxHearts = 3;
        this.invulnerable = false;
        this.invulnerableTimer = 0;
    }

    update() {
        // Always update bubbles and background elements for ambiance
        this.bubbles.forEach(bubble => bubble.update());
        this.backgroundElements.forEach(element => element.update());

        // Scroll ground continuously (matches seaweed/pipe speed)
        if (this.state === 'playing') {
            this.groundOffset += this.pipeSpeed;
        }

        if (this.state !== 'playing') return;

        this.bird.update();

        // Update invulnerability timer
        if (this.invulnerable) {
            this.invulnerableTimer--;
            if (this.invulnerableTimer <= 0) {
                this.invulnerable = false;
            }
        }

        // Boss level trigger (every 20 points)
        if (this.score > 0 && this.score % 20 === 0 && !this.bossActive && !this.bossDefeated) {
            this.bossActive = true;
            // Alternate between diver and dolphin bosses
            if (this.bossCount % 2 === 0) {
                this.boss = new ScubaDiverBoss();
            } else {
                this.boss = new DolphinBoss();
            }
        }

        // Update boss
        if (this.bossActive && this.boss) {
            const bossDefeated = this.boss.update(this);

            // Spawn golden heart when boss is first defeated (before retreating)
            if (this.boss && this.boss.justDefeated && !this.goldenHeart) {
                const bossX = this.boss.x;
                const bossY = this.boss.y + this.boss.height / 2;
                this.goldenHeart = new GoldenHeart(bossX, bossY);
                this.boss.justDefeated = false; // Reset flag
            }

            // Check collisions for both boss types
            if (this.boss instanceof ScubaDiverBoss) {
                // Check net collisions
                this.boss.netAttacks.forEach(net => {
                    if (net.collidesWith(this.bird)) {
                        if (this.hasStar) {
                            // Star power destroys nets!
                            this.boss.netAttacks = this.boss.netAttacks.filter(n => n !== net);
                            playSound(800, 0.1);
                        } else {
                            this.boss.netAttacks = this.boss.netAttacks.filter(n => n !== net);
                            this.takeDamage();
                        }
                    }
                });
            } else if (this.boss instanceof DolphinBoss) {
                // Check whirlpool collisions
                this.boss.whirlpoolAttacks.forEach(whirlpool => {
                    if (whirlpool.collidesWith(this.bird)) {
                        if (this.hasStar) {
                            // Star power destroys whirlpools!
                            this.boss.whirlpoolAttacks = this.boss.whirlpoolAttacks.filter(w => w !== whirlpool);
                            playSound(800, 0.1);
                        } else {
                            this.boss.whirlpoolAttacks = this.boss.whirlpoolAttacks.filter(w => w !== whirlpool);
                            this.takeDamage();
                        }
                    }
                });
            }

            if (bossDefeated) {
                // Don't transfer boss attacks - let them disappear with the boss
                this.bossActive = false;
                this.bossDefeated = true;
                this.bossCount++; // Increment for next boss type
                this.boss = null;
                this.score += 5; // Bonus points
                playSound(1000, 0.5);
            }
        }

        // Update persistent nets (from defeated bosses)
        this.persistentNets = this.persistentNets.filter(net => !net.isOffScreen());
        this.persistentNets.forEach(net => {
            net.update();
            if (net.collidesWith(this.bird)) {
                if (this.hasStar) {
                    // Star power destroys nets!
                    this.persistentNets = this.persistentNets.filter(n => n !== net);
                    playSound(800, 0.1);
                } else {
                    this.persistentNets = this.persistentNets.filter(n => n !== net);
                    this.takeDamage();
                }
            }
        });

        // Update persistent whirlpools (from defeated bosses)
        this.persistentWhirlpools = this.persistentWhirlpools.filter(whirlpool => !whirlpool.isOffScreen());
        this.persistentWhirlpools.forEach(whirlpool => {
            whirlpool.update();
            if (whirlpool.collidesWith(this.bird)) {
                if (this.hasStar) {
                    // Star power destroys whirlpools!
                    this.persistentWhirlpools = this.persistentWhirlpools.filter(w => w !== whirlpool);
                    playSound(800, 0.1);
                } else {
                    this.persistentWhirlpools = this.persistentWhirlpools.filter(w => w !== whirlpool);
                    this.takeDamage();
                }
            }
        });

        // Update mermaid
        this.mermaidTimer--;
        if (this.mermaidTimer <= 0 && !this.mermaid && !this.bossActive) {
            const types = ['worm', 'slow', 'small', 'star']; // Replaced 'shield' with 'worm'
            const powerUpType = types[Math.floor(Math.random() * types.length)];
            this.mermaid = new Mermaid(powerUpType);
            this.mermaidTimer = Math.random() * 800 + 500;
        }

        if (this.mermaid) {
            this.mermaid.update();

            // Drop power-up when close to player
            if (this.mermaid.shouldDropPowerUp(this.bird.x)) {
                this.powerUps.push(new PowerUp(this.mermaid.x, this.mermaid.y + 30, this.mermaid.powerUpType));
                this.mermaid.hasDroppedPowerUp = true;
                playSound(700, 0.2);
            }

            if (this.mermaid.isOffScreen()) {
                this.mermaid = null;
            }
        }

        // Update power-ups
        this.powerUps = this.powerUps.filter(powerUp => !powerUp.isOffScreen());
        this.powerUps.forEach(powerUp => {
            powerUp.update();
            if (powerUp.collidesWith(this.bird) && !powerUp.collected) {
                this.activatePowerUp(powerUp.type);
                powerUp.collected = true;
                playSound(900, 0.3);
            }
        });
        this.powerUps = this.powerUps.filter(powerUp => !powerUp.collected);

        // Power-up timer
        if (this.activePowerUp) {
            this.powerUpTimer--;
            if (this.powerUpTimer <= 0) {
                this.deactivatePowerUp();
            }
        }

        // Update golden heart
        if (this.goldenHeart) {
            this.goldenHeart.update();

            // Check collision with player
            if (this.goldenHeart.collidesWith(this.bird)) {
                // Increase max health and heal fully
                this.maxHearts++;
                this.hearts = this.maxHearts;
                this.goldenHeart = null;
                playSound(1200, 0.4); // Special golden heart sound
            }

            // Remove if off screen
            if (this.goldenHeart && this.goldenHeart.isOffScreen()) {
                this.goldenHeart = null;
            }
        }

        // Reset boss defeated flag after passing the score threshold
        if (this.score % 20 !== 0) {
            this.bossDefeated = false;
        }

        if (this.bird.isOutOfBounds()) {
            if (this.hasStar) {
                // Star power bounces you back!
                this.bird.y = Math.max(10, Math.min(canvas.height - 70, this.bird.y));
                this.bird.velocity = 0;
                playSound(800, 0.1);
            } else {
                this.bird.y = Math.max(10, Math.min(canvas.height - 70, this.bird.y));
                this.bird.velocity = 0;
                this.takeDamage();
                if (this.state === 'gameover') return;
            }
        }

        this.pipes.forEach(pipe => {
            pipe.speed = this.pipeSpeed;
            pipe.update();
            if (this.bird.isColliding(pipe)) {
                if (this.hasStar) {
                    // Star power passes through pipes!
                    playSound(800, 0.1);
                } else {
                    this.takeDamage();
                    if (this.state === 'gameover') return;
                }
            }
            if (pipe.isOffScreen()) {
                this.pipes.shift();
                this.score++;

                // More aggressively increase difficulty every 2 points
                if (this.score % 2 === 0 && this.score > 0) {
                    this.difficulty = Math.min(12, this.difficulty + 1);
                    this.basePipeSpeed = Math.min(3.5, 2.2 + this.difficulty * 0.12); // Adjusted from 1.8 base
                    if (!this.activePowerUp || (this.activePowerUp !== 'slow' && this.activePowerUp !== 'star')) {
                        this.pipeSpeed = this.basePipeSpeed;
                    }
                }

                // Damage boss when passing pipes during boss fight
                if (this.bossActive && this.boss) {
                    this.boss.takeDamage();
                }
            }
        });

        if (this.pipes.length === 0 || this.pipes[this.pipes.length - 1].x < canvas.width - this.pipeSpawnDistance) {
            this.pipes.push(new Pipe(canvas.width, this.difficulty));
        }
    }

    takeDamage() {
        if (this.invulnerable || this.hasStar) return;

        this.hearts--;
        playSound(200, 0.3);

        if (this.hearts <= 0) {
            this.state = 'gameover';
            music.stop();
        } else {
            // Brief invulnerability after hit (2 seconds)
            this.invulnerable = true;
            this.invulnerableTimer = 120; // 2 seconds at 60fps
        }
    }

    activatePowerUp(type) {
        this.activePowerUp = type;
        this.powerUpTimer = type === 'star' ? 180 : 300; // 3 seconds for star, 5 for others

        if (type === 'worm') {
            this.hearts = this.maxHearts; // Restore all hearts
            playSound(900, 0.3); // Healing sound
            this.activePowerUp = null; // Worm is instant effect, not timed
            this.powerUpTimer = 0;
        } else if (type === 'slow') {
            this.pipeSpeed = this.basePipeSpeed * 0.5; // Half speed
        } else if (type === 'small') {
            this.bird.width = 25;
            this.bird.height = 15;
        } else if (type === 'star') {
            this.hasStar = true;
            this.bird.color = '#ffff00'; // Yellow!
            this.pipeSpeed = this.basePipeSpeed * 1.5; // Speed boost!
            playSound(1200, 0.5); // Special star sound
        }
    }

    deactivatePowerUp() {
        if (this.activePowerUp === 'slow') {
            this.pipeSpeed = this.basePipeSpeed; // Restore to current base speed
        } else if (this.activePowerUp === 'small') {
            this.bird.width = this.originalBirdSize.width;
            this.bird.height = this.originalBirdSize.height;
        } else if (this.activePowerUp === 'star') {
            this.hasStar = false;
            this.bird.color = this.originalBirdColor;
            this.pipeSpeed = this.basePipeSpeed;
        }
        this.activePowerUp = null;
        this.powerUpTimer = 0;
    }

    draw() {
        // Underwater gradient background (SNES style)
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#1e5f8c');
        gradient.addColorStop(0.5, '#2a7fb5');
        gradient.addColorStop(1, '#1a4d73');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw background elements by layer (parallax effect)
        for (let layer = 0; layer < 3; layer++) {
            this.backgroundElements
                .filter(el => el.layer === layer)
                .forEach(element => element.draw());
        }

        // Draw bubbles
        this.bubbles.forEach(bubble => bubble.draw());

        // Ocean floor with seamless scrolling texture
        ctx.fillStyle = '#8b6f47';
        ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

        // Add seamless scrolling sand texture (wraps at 20px intervals)
        ctx.fillStyle = '#a38b5f';
        const sandOffset = this.groundOffset % 20;
        for (let i = -sandOffset; i < canvas.width + 20; i += 20) {
            ctx.fillRect(i, canvas.height - 48, 10, 3);
            ctx.fillRect(i + 5, canvas.height - 40, 8, 3);
        }

        // Seamless scrolling rocks on ocean floor (wraps at 80px intervals)
        ctx.fillStyle = '#6b5937';
        const rockOffset = this.groundOffset % 80;
        for (let i = -rockOffset; i < canvas.width + 80; i += 80) {
            ctx.beginPath();
            ctx.ellipse(i + 20, canvas.height - 45, 15, 8, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        this.pipes.forEach(pipe => pipe.draw());

        // Draw power-ups
        this.powerUps.forEach(powerUp => powerUp.draw());

        // Draw golden heart
        if (this.goldenHeart) {
            this.goldenHeart.draw();
        }

        // Draw mermaid
        if (this.mermaid) {
            this.mermaid.draw();
        }

        // Draw boss
        if (this.bossActive && this.boss) {
            this.boss.draw();
        }

        // Draw persistent nets
        this.persistentNets.forEach(net => net.draw());

        // Draw persistent whirlpools
        this.persistentWhirlpools.forEach(whirlpool => whirlpool.draw());

        // Draw bird with star power effect
        if (this.hasStar) {
            ctx.save();
            // Rainbow trail effect
            const time = Date.now() / 100;
            for (let i = 0; i < 3; i++) {
                ctx.globalAlpha = 0.4 - i * 0.1;
                const hue = (time + i * 40) % 360;
                ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
                ctx.beginPath();
                ctx.arc(this.bird.x + this.bird.width/2 - i * 8,
                       this.bird.y + this.bird.height/2,
                       Math.max(this.bird.width, this.bird.height)/2 + 5, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
            ctx.restore();

            // Sparkles around bird
            ctx.save();
            ctx.fillStyle = '#ffffff';
            for (let i = 0; i < 5; i++) {
                const angle = (Date.now() / 200 + i * Math.PI * 2 / 5);
                const radius = 30;
                const sx = this.bird.x + this.bird.width/2 + Math.cos(angle) * radius;
                const sy = this.bird.y + this.bird.height/2 + Math.sin(angle) * radius;
                ctx.beginPath();
                ctx.arc(sx, sy, 2, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }

        // Invulnerability flash effect
        if (this.invulnerable && Math.floor(this.invulnerableTimer / 10) % 2 === 0) {
            ctx.save();
            ctx.globalAlpha = 0.5;
            this.bird.draw();
            ctx.restore();
        } else {
            this.bird.draw();
        }

        // UI with SNES-style text
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.font = 'bold 24px monospace';
        ctx.strokeText('Score: ' + this.score, 10, 30);
        ctx.fillText('Score: ' + this.score, 10, 30);
        ctx.font = 'bold 16px monospace';
        ctx.strokeText('High: ' + this.highScore, 10, 55);
        ctx.fillText('High: ' + this.highScore, 10, 55);

        // Draw hearts
        const heartSize = 20;
        const heartSpacing = 25;
        const heartY = 80;
        for (let i = 0; i < this.maxHearts; i++) {
            const heartX = 10 + i * heartSpacing;

            if (i < this.hearts) {
                // Filled heart
                ctx.fillStyle = '#ff4a6a';
                ctx.strokeStyle = '#cc2040';
            } else {
                // Empty heart
                ctx.fillStyle = 'rgba(255, 74, 106, 0.3)';
                ctx.strokeStyle = 'rgba(204, 32, 64, 0.5)';
            }

            ctx.lineWidth = 2;
            ctx.beginPath();
            // Draw heart shape
            const x = heartX + heartSize / 2;
            const y = heartY;
            ctx.moveTo(x, y + heartSize / 4);
            ctx.bezierCurveTo(x, y, x - heartSize / 2, y, x - heartSize / 2, y + heartSize / 4);
            ctx.bezierCurveTo(x - heartSize / 2, y + heartSize / 2, x, y + heartSize * 0.75, x, y + heartSize);
            ctx.bezierCurveTo(x, y + heartSize * 0.75, x + heartSize / 2, y + heartSize / 2, x + heartSize / 2, y + heartSize / 4);
            ctx.bezierCurveTo(x + heartSize / 2, y, x, y, x, y + heartSize / 4);
            ctx.fill();
            ctx.stroke();
        }

        // Power-up indicator
        if (this.activePowerUp) {
            ctx.font = 'bold 14px monospace';
            const powerUpText = this.activePowerUp.toUpperCase();
            const timeLeft = Math.ceil(this.powerUpTimer / 60);
            ctx.strokeText(`${powerUpText}: ${timeLeft}s`, 10, 80);
            ctx.fillText(`${powerUpText}: ${timeLeft}s`, 10, 80);
        }

        // Boss warning
        if (this.bossActive && this.boss && this.boss.state === 'entering') {
            ctx.fillStyle = 'rgba(255, 74, 74, 0.8)';
            ctx.font = 'bold 48px monospace';
            ctx.textAlign = 'center';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 5;
            ctx.strokeText('BOSS FIGHT!', canvas.width / 2, canvas.height / 2);
            ctx.fillText('BOSS FIGHT!', canvas.width / 2, canvas.height / 2);
            ctx.textAlign = 'start';
        }

        if (this.state === 'start') {
            this.drawOverlay('Flappy Axolotl', 'Click to Start');
        } else if (this.state === 'gameover') {
            if (this.score > this.highScore) {
                this.highScore = this.score;
                localStorage.setItem('flappyAxolotlHighScore', this.highScore);
            }
            this.drawOverlay('Game Over', `Score: ${this.score}\nHigh Score: ${this.highScore}\nClick to Restart`);
        } else if (this.state === 'enterInitials') {
            this.drawInitialEntry();
        } else if (this.state === 'showScoreboard') {
            this.drawScoreboard();
        }
    }

    drawOverlay(title, message) {
        // SNES-style bordered dialog box
        ctx.fillStyle = 'rgba(10,30,60,0.85)';
        ctx.fillRect(50, canvas.height / 2 - 100, canvas.width - 100, 180);

        // Border
        ctx.strokeStyle = '#4a9eff';
        ctx.lineWidth = 4;
        ctx.strokeRect(50, canvas.height / 2 - 100, canvas.width - 100, 180);

        // Inner border
        ctx.strokeStyle = '#2a5fcf';
        ctx.lineWidth = 2;
        ctx.strokeRect(54, canvas.height / 2 - 96, canvas.width - 108, 172);

        // Title with outline
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 4;
        ctx.font = 'bold 36px monospace';
        ctx.textAlign = 'center';
        ctx.strokeText(title, canvas.width / 2, canvas.height / 2 - 50);
        ctx.fillText(title, canvas.width / 2, canvas.height / 2 - 50);

        // Message
        ctx.font = 'bold 20px monospace';
        const lines = message.split('\n');
        lines.forEach((line, index) => {
            ctx.strokeText(line, canvas.width / 2, canvas.height / 2 - 10 + index * 30);
            ctx.fillText(line, canvas.width / 2, canvas.height / 2 - 10 + index * 30);
        });
        ctx.textAlign = 'start';
    }

    drawInitialEntry() {
        // Dialog box
        ctx.fillStyle = 'rgba(10,30,60,0.9)';
        ctx.fillRect(150, canvas.height / 2 - 120, canvas.width - 300, 240);

        // Border
        ctx.strokeStyle = '#ffcc00';
        ctx.lineWidth = 4;
        ctx.strokeRect(150, canvas.height / 2 - 120, canvas.width - 300, 240);

        // Title
        ctx.fillStyle = '#ffcc00';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.font = 'bold 32px monospace';
        ctx.textAlign = 'center';
        ctx.strokeText('HIGH SCORE!', canvas.width / 2, canvas.height / 2 - 80);
        ctx.fillText('HIGH SCORE!', canvas.width / 2, canvas.height / 2 - 80);

        // Score display
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px monospace';
        ctx.strokeText(`Score: ${this.score}`, canvas.width / 2, canvas.height / 2 - 40);
        ctx.fillText(`Score: ${this.score}`, canvas.width / 2, canvas.height / 2 - 40);

        // Instructions
        ctx.font = 'bold 16px monospace';
        ctx.strokeText('Enter Your Initials', canvas.width / 2, canvas.height / 2 - 10);
        ctx.fillText('Enter Your Initials', canvas.width / 2, canvas.height / 2 - 10);

        // Initial boxes
        const boxWidth = 50;
        const boxHeight = 60;
        const spacing = 20;
        const startX = canvas.width / 2 - (3 * boxWidth + 2 * spacing) / 2;
        const startY = canvas.height / 2 + 20;

        for (let i = 0; i < 3; i++) {
            const x = startX + i * (boxWidth + spacing);

            // Box background
            if (i === this.initialIndex) {
                ctx.fillStyle = '#4a9eff';
            } else {
                ctx.fillStyle = 'rgba(74, 158, 255, 0.3)';
            }
            ctx.fillRect(x, startY, boxWidth, boxHeight);

            // Box border
            ctx.strokeStyle = i === this.initialIndex ? '#ffcc00' : '#4a9eff';
            ctx.lineWidth = 3;
            ctx.strokeRect(x, startY, boxWidth, boxHeight);

            // Letter
            ctx.fillStyle = 'white';
            ctx.font = 'bold 36px monospace';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.strokeText(this.initials[i], x + boxWidth / 2, startY + boxHeight / 2 + 12);
            ctx.fillText(this.initials[i], x + boxWidth / 2, startY + boxHeight / 2 + 12);
        }

        // Controls hint
        ctx.fillStyle = 'white';
        ctx.font = 'bold 14px monospace';
        ctx.strokeText('UP/DOWN: Change Letter', canvas.width / 2, canvas.height / 2 + 110);
        ctx.fillText('UP/DOWN: Change Letter', canvas.width / 2, canvas.height / 2 + 110);
        ctx.strokeText('LEFT/RIGHT: Move Position', canvas.width / 2, canvas.height / 2 + 130);
        ctx.fillText('LEFT/RIGHT: Move Position', canvas.width / 2, canvas.height / 2 + 130);
        ctx.strokeText('ENTER: Confirm', canvas.width / 2, canvas.height / 2 + 150);
        ctx.fillText('ENTER: Confirm', canvas.width / 2, canvas.height / 2 + 150);

        ctx.textAlign = 'start';
    }

    drawScoreboard() {
        // Large dialog box
        ctx.fillStyle = 'rgba(10,30,60,0.9)';
        ctx.fillRect(100, 50, canvas.width - 200, canvas.height - 100);

        // Border
        ctx.strokeStyle = '#ffcc00';
        ctx.lineWidth = 4;
        ctx.strokeRect(100, 50, canvas.width - 200, canvas.height - 100);

        // Title
        ctx.fillStyle = '#ffcc00';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.font = 'bold 40px monospace';
        ctx.textAlign = 'center';
        ctx.strokeText('HIGH SCORES', canvas.width / 2, 110);
        ctx.fillText('HIGH SCORES', canvas.width / 2, 110);

        // Table headers
        ctx.fillStyle = 'white';
        ctx.font = 'bold 20px monospace';
        ctx.textAlign = 'left';
        ctx.strokeText('RANK', 150, 160);
        ctx.fillText('RANK', 150, 160);
        ctx.strokeText('NAME', 300, 160);
        ctx.fillText('NAME', 300, 160);
        ctx.textAlign = 'right';
        ctx.strokeText('SCORE', canvas.width - 150, 160);
        ctx.fillText('SCORE', canvas.width - 150, 160);

        // Scores
        ctx.font = 'bold 24px monospace';
        this.highScores.forEach((entry, index) => {
            const y = 200 + index * 35;

            // Highlight new score
            if (entry.score === this.score && entry.initials === this.initials.join('')) {
                ctx.fillStyle = '#ffcc00';
            } else {
                ctx.fillStyle = 'white';
            }

            // Rank
            ctx.textAlign = 'left';
            ctx.strokeText(`${index + 1}.`, 150, y);
            ctx.fillText(`${index + 1}.`, 150, y);

            // Initials
            ctx.strokeText(entry.initials, 300, y);
            ctx.fillText(entry.initials, 300, y);

            // Score
            ctx.textAlign = 'right';
            ctx.strokeText(entry.score.toString(), canvas.width - 150, y);
            ctx.fillText(entry.score.toString(), canvas.width - 150, y);
        });

        // Footer
        ctx.fillStyle = 'white';
        ctx.font = 'bold 18px monospace';
        ctx.textAlign = 'center';
        ctx.strokeText('Click to Continue', canvas.width / 2, canvas.height - 80);
        ctx.fillText('Click to Continue', canvas.width / 2, canvas.height - 80);

        ctx.textAlign = 'start';
    }

    handleClick() {
        if (this.state === 'start') {
            // Resume audio context on first interaction (required by browsers)
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
            this.state = 'playing';
            music.start(); // Start the music!
        } else if (this.state === 'gameover') {
            // Check if this is a high score
            if (this.isHighScore(this.score)) {
                this.state = 'enterInitials';
                this.initials = ['A', 'A', 'A'];
                this.initialIndex = 0;
            } else {
                this.reset();
                music.start(); // Restart music
            }
        } else if (this.state === 'showScoreboard') {
            this.reset();
            music.start(); // Restart music
        } else if (this.state === 'playing') {
            this.bird.flap();
        }
    }

    handleKeyDown(e) {
        if (this.state === 'enterInitials') {
            if (e.code === 'ArrowUp') {
                e.preventDefault();
                // Cycle letter up (A-Z, 0-9)
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                const currentIndex = chars.indexOf(this.initials[this.initialIndex]);
                const nextIndex = (currentIndex + 1) % chars.length;
                this.initials[this.initialIndex] = chars[nextIndex];
            } else if (e.code === 'ArrowDown') {
                e.preventDefault();
                // Cycle letter down
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                const currentIndex = chars.indexOf(this.initials[this.initialIndex]);
                const nextIndex = (currentIndex - 1 + chars.length) % chars.length;
                this.initials[this.initialIndex] = chars[nextIndex];
            } else if (e.code === 'ArrowLeft') {
                e.preventDefault();
                this.initialIndex = Math.max(0, this.initialIndex - 1);
            } else if (e.code === 'ArrowRight') {
                e.preventDefault();
                this.initialIndex = Math.min(2, this.initialIndex + 1);
            } else if (e.code === 'Enter') {
                e.preventDefault();
                // Save high score and show scoreboard
                this.addHighScore(this.score, this.initials);
                this.state = 'showScoreboard';
            }
        } else if (this.state === 'showScoreboard') {
            // Any key press from scoreboard continues
            e.preventDefault();
            this.reset();
            music.start();
        } else if (e.code === 'Space') {
            e.preventDefault();
            this.handleClick();
        }
    }

    reset() {
        this.bird = new Bird(50, 300);
        this.pipes = [];
        this.score = 0;
        this.state = 'playing';
        this.pipeSpawnDistance = 250;

        // Reset power-up system
        this.powerUps = [];
        this.activePowerUp = null;
        this.powerUpTimer = 0;
        this.mermaid = null;
        this.mermaidTimer = Math.random() * 500 + 300;
        this.goldenHeart = null;

        // Reset boss system
        this.boss = null;
        this.bossActive = false;
        this.bossDefeated = false;
        this.bossCount = 0;
        this.persistentNets = [];
        this.persistentWhirlpools = [];

        // Reset power-up effects
        this.hasStar = false;
        this.pipeSpeed = 2.2;
        this.basePipeSpeed = 2.2;
        this.bird.width = this.originalBirdSize.width;
        this.bird.height = this.originalBirdSize.height;
        this.bird.color = this.originalBirdColor;
        this.difficulty = 0;

        // Reset ground scrolling
        this.groundOffset = 0;

        // Reset heart system
        this.hearts = 3;
        this.maxHearts = 3;
        this.invulnerable = false;
        this.invulnerableTimer = 0;
    }

    loadHighScores() {
        const stored = localStorage.getItem('flappyAxolotlHighScores');
        if (stored) {
            return JSON.parse(stored);
        }
        return [];
    }

    saveHighScores() {
        localStorage.setItem('flappyAxolotlHighScores', JSON.stringify(this.highScores));
    }

    isHighScore(score) {
        // High score if top 10 or empty list
        if (this.highScores.length < 10) return true;
        return score > this.highScores[this.highScores.length - 1].score;
    }

    addHighScore(score, initials) {
        this.highScores.push({
            score: score,
            initials: initials.join('')
        });
        // Sort by score descending
        this.highScores.sort((a, b) => b.score - a.score);
        // Keep only top 10
        this.highScores = this.highScores.slice(0, 10);
        this.saveHighScores();
    }
}

const gravity = 0.38; // Reduced for slower, more underwater-like falling
const jump = -8; // Smaller jumps for more controlled movement

function playSound(frequency, duration) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = frequency;
    oscillator.type = 'square';
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

const game = new Game();

function gameLoop() {
    game.update();
    game.draw();
    requestAnimationFrame(gameLoop);
}

canvas.addEventListener('click', () => game.handleClick());

// Add keyboard support
document.addEventListener('keydown', (e) => {
    game.handleKeyDown(e);
});

// Register service worker for PWA
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('Service Worker registered'))
        .catch(err => console.log('Service Worker registration failed', err));
}

gameLoop();
