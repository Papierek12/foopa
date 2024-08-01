//omagad itz documented a bit
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const dots = [];
const numDots = 100; // how much
const mouse = { x: null, y: null, radius: 100 };


const dotColor = 'white'; // dot color
const lineColor = 'rgba(255, 255, 255, 0.4)';// line color
const maxLineDistance = 150; // line distance
const minDotDistance = 100;  // minimum distance


for (let i = 0; i < numDots; i++) {
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    dots.push({ x, y, vx: 0, vy: 0 });
}


function drawDots() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let dot of dots) {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.fill();
    }
}


function moveDots() {
    for (let dot of dots) {
        let totalForceX = 0;
        let totalForceY = 0;


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


        if (mouse.x !== null && mouse.y !== null) {
            let dx = mouse.x - dot.x;
            let dy = mouse.y - dot.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius) {
                let acceleration = 1 - (distance / mouse.radius);
                totalForceX += dx * acceleration * -0.02; 
                totalForceY += dy * acceleration *- 0.02; 
            }
        }

        dot.vx += totalForceX;
        dot.vy += totalForceY;

        
        dot.vx *= 0.95;
        dot.vy *= 0.95;

        
        if (dot.x < 0) {
            dot.x = 0;
            dot.vx *= -1; 
        } else if (dot.x > canvas.width) {
            dot.x = canvas.width;
            dot.vx *= -1; 
        }

        if (dot.y < 0) {
            dot.y = 0;
            dot.vy *= -1; 
        } else if (dot.y > canvas.height) {
            dot.y = canvas.height;
            dot.vy *= -1; 
        }

        dot.x += dot.vx;
        dot.y += dot.vy;
    }
}


function drawLines() {
    for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
            let dx = dots[i].x - dots[j].x;
            let dy = dots[i].y - dots[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxLineDistance) { 
                ctx.beginPath();
                ctx.moveTo(dots[i].x, dots[i].y);
                ctx.lineTo(dots[j].x, dots[j].y);
                ctx.strokeStyle = lineColor; 
                ctx.stroke();
            }
        }
    }
}


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


function distanceBetween(dot1, dot2) {
    return Math.hypot(dot2.x - dot1.x, dot2.y - dot1.y);
}
