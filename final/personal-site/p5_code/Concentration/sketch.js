let activities = [
    { name: "class📖", color: [135, 206, 235], icon: "📖" },
    { name: "rest🏋️", color: [210, 105, 30], icon: "🏋️" },
    { name: "class📖", color: [210, 105, 30], icon: "📖" },
    { name: "food🍴", color: [255, 165, 0], icon: "🍴" },
    { name: "rest🏋️", color: [255, 215, 0], icon: "🏋️" },
    { name: "food🍽️", color: [34, 139, 34], icon: "🍽️" },
    { name: "rest🛋️", color: [106, 90, 205], icon: "🛋️" },
    { name: "study📖", color: [70, 130, 180], icon: "📖" },
    { name: "rest🏋️", color: [255, 127, 80], icon: "🏋️" },
    { name: "rest🛋️", color: [72, 61, 139], icon: "🛋️" },
    { name: "food☕", color: [147, 112, 219], icon: "☕" },
    { name: "class📖", color: [25, 25, 112], icon: "📖" }
];

let activityIndex = 0;
let waveTimer = 0; // Timer for water ripple

function setup() {
    createCanvas(600, 600);
    angleMode(DEGREES);
    noStroke();
}

function draw() {
    background(30);

    // Get the current time
    let h = hour();
    let m = minute();
    let s = second();

    // Determine if it's day or night
    let isDay = (h >= 7 && h < 22); // Day from 7 AM to 10 PM

    // If it's night (10 PM to 7 AM), activity is "fall asleep"
    if (h >= 22 || h < 7) {
        activityIndex = activities.length - 1;  // Fall asleep
    } else {
        activityIndex = h % activities.length; // Regular activity cycle
    }

    let currentActivity = activities[activityIndex];

    // Drawing dynamic backgrounds with ripple
    drawBackgroundWithRipple(currentActivity.color, h, m, s);

    // Draw the tree growth
    drawTree(h, m, s);

    // Draw the clock ring
    drawClockRing(s, m, h);

    // Show current activity and time
    displayCurrentActivity(currentActivity.name, h, m, s, isDay);
}

// Draw the background color with ripple effect
function drawBackgroundWithRipple(colorArray, h, m, s) {
    let [r, g, b] = colorArray;

    // Base gradient
    for (let i = 0; i < width; i++) {
        let c = lerpColor(color(30), color(r, g, b), i / width);
        stroke(c);
        line(i, 0, i, height);
    }

    // Water ripple every hour
    if (m === 0 && s === 0) waveTimer = 255; // Trigger ripple at the start of each hour
    if (waveTimer > 0) {
        waveTimer -= 5; // Fade out ripple effect
        drawRippleEffect(waveTimer, r, g, b);
    }
}

// Draw ripple effect
function drawRippleEffect(alpha, r, g, b) {
    push();
    noFill();
    stroke(r, g, b, alpha);
    translate(width / 2, height / 2);
    for (let i = 0; i < 10; i++) {
        ellipse(0, 0, 50 + i * 30); // Concentric ripples
    }
    pop();
}

// Draw the clock ring
function drawClockRing(seconds, minutes, hours) {
    push();
    translate(width / 2, height / 2);

    // Second ring
    let secAngle = map(seconds, 0, 60, 0, 360);
    fill(255, 100, 150, 150);
    arc(0, 0, 400, 400, -90, secAngle - 90, PIE);

    // Minute ring
    let minAngle = map(minutes, 0, 60, 0, 360);
    fill(100, 150, 255, 150);
    arc(0, 0, 300, 300, -90, minAngle - 90, PIE);

    // Hour ring
    let hourAngle = map(hours % 12, 0, 12, 0, 360);
    fill(150, 255, 100, 150);
    arc(0, 0, 200, 200, -90, hourAngle - 90, PIE);

    pop();
}

// Show current activity and time
function displayCurrentActivity(activity, h, m, s, isDay) {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(24);
    text(`Current Activity: ${activity}`, width / 2, height - 50);

    textSize(18);

    // Display time in 24-hour format or AM/PM
    let timeDisplay = nf(h, 2) + ':' + nf(m, 2) + ':' + nf(s, 2);
    text(timeDisplay, width / 2, height - 20);

    // Display day or night
    textSize(16);
    let dayNightText = isDay ? "It's day time ☀️" : "It's night time 🌙";
    text(dayNightText, width / 2, height - 80);
}

// Add tree growth animation
function drawTree(h, m, s) {
    let dayProgress = ((h % 24) + m / 60 + s / 3600) / 24; // Calculate day progress (0-1)
    let maxHeight = 300; // Maximum tree height
    let treeHeight = dayProgress * maxHeight;

    // Draw trunk
    fill(139, 69, 19); // Brown
    rect(width / 2 - 15, height - 50 - treeHeight, 30, treeHeight);

    // Draw leaves
    fill(34, 139, 34); // Green
    let leafSize = map(treeHeight, 0, maxHeight, 50, 150);
    ellipse(width / 2, height - 50 - treeHeight, leafSize);
}