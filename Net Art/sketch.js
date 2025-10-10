let bgcounter = 0;
let counter = 0;
let dots = [];
let dragging = false;

let imgs = [];
let photoParticles = [];
let lastPhotoFrame = 0;

function preload() {
    imgs = [
        loadImage('images copy/1.png', () => { }, onImgError),
        loadImage('images copy/2.png', () => { }, onImgError),
        loadImage('images copy/3.png', () => { }, onImgError)
    ];
}

function onImgError(err) {
    console.warn('Image load failed:', err);
    imgs = imgs.filter(Boolean);
}

function setup() {
    const holder = document.getElementById('sketch-holder');
    const cnv = createCanvas(windowWidth, windowHeight);
    if (holder) cnv.parent('sketch-holder');

    noStroke();
    background(0);
    frameRate(10);
}

function draw() {
    fill(0, 40);
    rect(0, 0, width, height);

    fill(random(100, 255), random(100, 255), random(255), 60);
    rect(0, counter, width, 20);
    fill(random(100, 255), random(100, 255), random(255), 60);
    rect(counter, 0, 20, height);

    counter += 40;
    if (counter > width) counter = 0;


    if (frameCount % 3 === 0) {
        dots.push({ x: random(width), y: random(height), size: random(5, 20) });
    }

    for (let dot of dots) {
        fill(255, 200);
        ellipse(dot.x, dot.y, dot.size);
        dot.y -= 1;
    }
    dots = dots.filter(dot => dot.y > 0);


    for (let p of photoParticles) {
        push();
        imageMode(CENTER);
        tint(255, p.alpha);
        image(p.img, p.x, p.y, p.size, p.size);
        pop();

        p.y -= p.vy;
        p.x += p.vx;
        p.alpha -= p.fade;
    }
    photoParticles = photoParticles.filter(p => p.alpha > 0);


    if (dragging) {
        dots.push({ x: mouseX, y: mouseY, size: random(10, 25) });

        const SPAWN_EVERY = 6;
        if (frameCount - lastPhotoFrame >= SPAWN_EVERY) {
            spawnPhotoAt(mouseX, mouseY);
            lastPhotoFrame = frameCount;
        }
    }


    if (imgs.length === 0) {
        fill(255);
        textSize(14);
        text('No images loaded. Check /images/ paths or run on a local server.', 12, height - 16);
    }
}

function mousePressed() {
    dragging = true;

    spawnPhotoAt(mouseX, mouseY);
}

function mouseReleased() {
    dragging = false;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    background(0);
}

function spawnPhotoAt(x, y) {
    if (imgs.length === 0) return;
    const chosen = random(imgs);
    photoParticles.push({
        x,
        y,
        size: random(60, 120),
        img: chosen,
        alpha: 255,
        vx: random(-0.6, 0.6),
        vy: random(0.8, 1.4),
        fade: random(2, 4)
    });
}
