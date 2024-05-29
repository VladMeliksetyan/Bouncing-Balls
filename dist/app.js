"use strict";
var main = document.querySelector(".main");
// Array to keep track of all balls and their properties
var balls = [];
// Function to create and spawn a new ball
var spawnBall = function (x, y) {
    var ball = document.createElement("div");
    ball.className = "ball";
    ball.style.left = "".concat(x, "px");
    ball.style.top = "".concat(y, "px");
    main.appendChild(ball);
    // Set initial random direction and velocity for the new ball
    var right = Math.random() >= 0.5;
    var velocityX = 7;
    var velocityY = 0;
    balls.push({ element: ball, right: right, velocityX: velocityX, velocityY: velocityY });
};
// Event listener to spawn a new ball on click
main.addEventListener("click", function (event) {
    var rect = main.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    spawnBall(x, y);
});
// Gravity and bounce parameters
var gravity = 0.2;
var bounceFactor = 0.7; // Initial bounce factor
var minVelocity = 0.1; // Minimum velocity to stop the ball
var dampeningFactor = 0.85; // Dampening factor for the bounce
// Animation loop using requestAnimationFrame
var animate = function () {
    if (!main)
        return;
    var boardbounds = main.getBoundingClientRect();
    balls.forEach(function (ballData, index) {
        var ball = ballData.element;
        var right = ballData.right;
        var velocityX = ballData.velocityX;
        var velocityY = ballData.velocityY;
        var ballbounds = ball.getBoundingClientRect();
        var balltop = parseInt(window.getComputedStyle(ball).getPropertyValue("top"));
        var ballleft = parseInt(window.getComputedStyle(ball).getPropertyValue("left"));
        // Apply gravity
        velocityY += gravity;
        // Move the ball
        ballleft += right ? velocityX : -velocityX;
        balltop += velocityY;
        // Check for boundary collisions and handle bouncing
        if (balltop + ballbounds.height >= boardbounds.height) { // Bottom boundary
            balltop = boardbounds.height - ballbounds.height;
            velocityY = -velocityY * bounceFactor;
            velocityX *= dampeningFactor; // Apply dampening to horizontal velocity
            // Adjust the ball's position and stop bouncing if it's close to stopping
            if (Math.abs(velocityY) < minVelocity && Math.abs(velocityX) < minVelocity) {
                velocityY = 0;
                velocityX = 0;
                bounceFactor = 0; // Set bounceFactor to 0 to stop further bouncing
            }
        }
        if (balltop <= 0) { // Top boundary
            balltop = 0;
            velocityY = -velocityY * bounceFactor;
            velocityX *= dampeningFactor; // Apply dampening to horizontal velocity
        }
        if (ballleft + ballbounds.width >= boardbounds.width) { // Right boundary
            ballleft = boardbounds.width - ballbounds.width;
            ballData.right = false;
            velocityX *= dampeningFactor; // Apply dampening to horizontal velocity
        }
        if (ballleft <= 0) { // Left boundary
            ballleft = 0;
            ballData.right = true;
            velocityX *= dampeningFactor; // Apply dampening to horizontal velocity
        }
        // Update ball position
        ball.style.left = ballleft + "px";
        ball.style.top = balltop + "px";
        // Update the ball's velocities in the array
        ballData.velocityX = velocityX;
        ballData.velocityY = velocityY;
        // Stop the ball if velocity is below minVelocity
        if (Math.abs(velocityX) < minVelocity && Math.abs(velocityY) < minVelocity) {
            ballData.velocityX = 0;
            ballData.velocityY = 0;
        }
    });
    requestAnimationFrame(animate);
};
// Start the animation loop
animate();
