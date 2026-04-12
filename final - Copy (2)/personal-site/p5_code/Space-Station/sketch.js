let bgcounter = 0;
let counter = 0;
let dots = [];
let dragging = false;

function setup() {
    createCanvas(400, 400);
    background(255);
    frameRate(10);
}

function draw() {

    fill(random(255), random(255), random(255), 120);
    noStroke();
    rect(0, counter, width - random(50), 10);

    fill(random(255), random(255), random(255), 120);
    rect(counter, 0, 10, height - random(50));


    if (counter > 200) {
        background(bgcounter);
        bgcounter += 3;
        counter = 0;
    } else {
        counter += 20;
    }


    if (frameCount % 2 === 0) {
        let dotSize = random(5, 15);
        dots.push({ x: random(width), y: random(height), size: dotSize });
    }


    for (let dot of dots) {
        fill(0, 100);
        ellipse(dot.x, dot.y, dot.size);
    }


    for (let dot of dots) {
        dot.y -= 1;
    }


    dots = dots.filter(dot => dot.y > 0);


    if (dragging) {
        let dotSize = random(5, 15);
        dots.push({ x: mouseX, y: mouseY, size: dotSize });
    }
}

function mousePressed() {
    dragging = true;
}

function mouseReleased() {
    dragging = false;
}