let socket;

function setup() {
    createCanvas(600, 400);
    background(0);

    socket = io.connect('http://localhost:3000');

    // 
    socket.on('mouse', (data) => {
        fill(255);
        noStroke();
        ellipse(data.x, data.y, 10, 10);
    });
}

function mouseDragged() {
    fill(255);
    noStroke();
    ellipse(mouseX, mouseY, 10, 10);

    // 
    const data = {
        x: mouseX,
        y: mouseY
    };

    socket.emit('mouse', data);
}
