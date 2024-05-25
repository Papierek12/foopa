//Documented For Fun
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const dots = [];
const numDots = 120;
const mouse = { x: null, y: null, radius: 100 };

// Customize colors and line length
const dotColor = 'white'; // Change this to any valid CSS color value
const lineColor = 'rgba(255, 255, 255, 0.4)'; // Change this to any valid CSS color value
const maxLineDistance = 150; // Increase this value to make lines longer
const minDotDistance = 100; // Minimum distance between dots

// Create dots
for (let i = 0; i < numDots; i++) {
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    dots.push({ x, y, vx: 0, vy: 0 });
}

// Draw dots
function drawDots() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let dot of dots) {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = dotColor; // Set dot color
        ctx.fill();
    }
}

// Move dots with acceleration and deceleration
function moveDots() {
    for (let dot of dots) {
        let totalForceX = 0;
        let totalForceY = 0;

        // Repulsion from other dots
        for (let otherDot of dots) {
            if (otherDot !== dot) {
                let dx = dot.x - otherDot.x;
                let dy = dot.y - otherDot.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < minDotDistance) {
                    let force = 1 - (distance / minDotDistance);
                    totalForceX += (dx / distance) * force;
                    totalForceY += (dy / distance) * force;
                }
            }
        }

        // Attraction to mouse
        if (mouse.x !== null && mouse.y !== null) {
            let dx = mouse.x - dot.x;
            let dy = mouse.y - dot.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius) {
                let acceleration = 1 - (distance / mouse.radius);
                totalForceX += dx * acceleration * -0.02; // Increase acceleration
                totalForceY += dy * acceleration *- 0.02; // Increase acceleration
            }
        }

        dot.vx += totalForceX;
        dot.vy += totalForceY;

        // Deceleration
        dot.vx *= 0.95;
        dot.vy *= 0.95;

        // Bounds checking
        if (dot.x < 0) {
            dot.x = 0;
            dot.vx *= -1; // Reverse velocity
        } else if (dot.x > canvas.width) {
            dot.x = canvas.width;
            dot.vx *= -1; // Reverse velocity
        }

        if (dot.y < 0) {
            dot.y = 0;
            dot.vy *= -1; // Reverse velocity
        } else if (dot.y > canvas.height) {
            dot.y = canvas.height;
            dot.vy *= -1; // Reverse velocity
        }

        dot.x += dot.vx;
        dot.y += dot.vy;
    }
}

// Draw lines between dots
function drawLines() {
    for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
            let dx = dots[i].x - dots[j].x;
            let dy = dots[i].y - dots[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxLineDistance) { // Increase this value to make lines longer
                ctx.beginPath();
                ctx.moveTo(dots[i].x, dots[i].y);
                ctx.lineTo(dots[j].x, dots[j].y);
                ctx.strokeStyle = lineColor; // Set line color
                ctx.stroke();
            }
        }
    }
}

// Update canvas
function animate() {
    requestAnimationFrame(animate);
    moveDots();
    drawDots();
    drawLines();
}

animate();

canvas.addEventListener('mousemove', function(event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

canvas.addEventListener('mouseout', function() {
    mouse.x = null;
    mouse.y = null;
});

window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    dots.length = 0;
    for (let i = 0; i < numDots; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        dots.push({ x, y, vx: 0, vy: 0 });
    }
});

// Calculate distance between two dots
function distanceBetween(dot1, dot2) {
    return Math.hypot(dot2.x - dot1.x, dot2.y - dot1.y);
}
