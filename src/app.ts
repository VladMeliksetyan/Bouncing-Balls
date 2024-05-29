const main = document.querySelector(".main") as HTMLElement;


let balls: BallData[] = [];

// Function to create and spawn a new ball
const spawnBall = (x: number, y: number): void => {
    const ball = document.createElement("div");
    ball.className = "ball";
    ball.style.left = `${x}px`;
    ball.style.top = `${y}px`;
    main.appendChild(ball);

    // Set initial random direction and velocity for the new ball
    let right = Math.random() >= 0.5;
    let velocityX = 7;
    let velocityY = 0;
    let isStopped = false;

    balls.push({ element: ball, right, velocityX, velocityY, isStopped });
};

main.addEventListener("click", (event: MouseEvent) => {
    const rect = main.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    spawnBall(x, y);
});

const gravity = 0.2;
const bounceFactor = 0.7; // Initial bounce factor
const minVelocity = 0.1; // Minimum velocity to stop the ball

const animate = (): void => {
    if (!main) return;

    let boardbounds = main.getBoundingClientRect();

    balls.forEach((ballData) => {
        const ball = ballData.element;
        let right = ballData.right;
        let velocityX = ballData.velocityX;
        let velocityY = ballData.velocityY;
        let isStopped = ballData.isStopped;

        if (isStopped) {
            ball.style.top = `${boardbounds.height - ball.getBoundingClientRect().height}px`;
            return; 
        }

        let ballbounds = ball.getBoundingClientRect();

        let balltop = parseInt(window.getComputedStyle(ball).getPropertyValue("top")!);
        let ballleft = parseInt(window.getComputedStyle(ball).getPropertyValue("left")!);

        // Apply gravity
        velocityY += gravity;

        // Move the ball
        ballleft += right ? velocityX : -velocityX;
        balltop += velocityY;

        // Handle bouncing
        if (balltop + ballbounds.height >= boardbounds.height) { // Bottom boundary
            balltop = boardbounds.height - ballbounds.height;
            velocityY = -velocityY * bounceFactor;
            velocityX *= bounceFactor;
            // Adjust the ball's position and stop bouncing if it's close to stopping
            if (Math.abs(velocityY) < minVelocity || Math.abs(velocityX) < minVelocity) {
                velocityY = 0;
                velocityX = 0;
                isStopped = true;
                
            }
        }
        if (balltop <= 0) { 
            balltop = 0;
            velocityY = -velocityY * bounceFactor;
            velocityX *= bounceFactor; 
        }
        if (ballleft + ballbounds.width >= boardbounds.width) { 
            ballleft = boardbounds.width - ballbounds.width;
            ballData.right = false;
            velocityX *= bounceFactor; 
        }
        if (ballleft <= 0) {
            ballleft = 0;
            ballData.right = true;
            velocityX *= bounceFactor; 
        }

        // Update ball position
        ball.style.left = ballleft + "px";
        ball.style.top = balltop + "px";

        ballData.velocityX = velocityX;
        ballData.velocityY = velocityY;
        ballData.isStopped = isStopped;
    });

    requestAnimationFrame(animate);
};

animate();
