import React, { use, useEffect, useRef, useState } from "react";
import styles from "./nti_background.module.scss";


interface BackgroundProps {
    diameter?: number;
    bubbleCount?: number;
}

interface BubbleState {
    diameter: number;
    x: number;
    y: number;
    velocity: { x: number, y: number };
}

const FPS = 30;


// A bunch of boubble divs that we move randomly
export default function NtiBackground({ diameter = 50, bubbleCount = 30 }: BackgroundProps): JSX.Element {
    const [bubbles, setBubbles] = useState<BubbleState[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
    })

    return (
        <div className={styles.ntiBackground} id="nti-background">
        </div>
    );
};


// const background = document.getElementById("nti-background");
// let frameTime = 1 / 30;

// const bubbles = Array.from({ length: bubbleCount }, spawnBubble);

// function spawnBubble() {
//     const bubble = document.createElement("div");
//     bubble.className = "bubble";
//     background.appendChild(bubble);
//     respawn(bubble);
//     bubble.dataset.y = (Math.random() * window.innerHeight).toString();
//     return bubble;
// }

// setInterval(tick, frameTime * 1000);
// tick()

// function moveOffset(bubble, x, y) {
//     const oldY = parseFloat(bubble.dataset.y) || 0;
//     const oldX = parseFloat(bubble.dataset.x) || 0;

//     let newY = oldY + y;
//     let newX = oldX + x;

//     const diameter = bubble.offsetWidth;
//     // Wrap around if entire element goes offscreen on x axis
//     if (newX < -diameter) {
//         newX = window.innerWidth + diameter/2;
//     } else if (newX > window.innerWidth + diameter) {
//         newX = -diameter;
//     }
//     bubble.style.bottom = `${newY}px`;
//     bubble.style.left = `${newX}px`;

//     bubble.dataset.y = newY;
//     bubble.dataset.x = newX;
// }


// function tick() {
//     // This probably has some horribly incorrect frameTime usages
//     for (let i = 0; i < bubbles.length; i++) {
//         const bubble = bubbles[i];

//         let velX = (parseFloat(bubble.dataset.velX) || 0) * frameTime;
//         let velY = (parseFloat(bubble.dataset.velY) || 0) * frameTime;

//         moveOffset(bubble, velX, velY);
//         if (parseFloat(bubble.dataset.y) > document.body.offsetHeight + bubble.offsetHeight) {
//             respawn(bubble);
//         }
//     }
// }

// function respawn(bubble: HTMLElement) {
//     bubble.style.transform = `scale(${Math.random() * 0.7 + 0.3}) rotate(${Math.random() * 360}deg)`;

//     bubble.dataset.y = (-bubble.offsetHeight).toString();
//     bubble.dataset.x = (Math.random() * window.innerWidth).toString();
//     moveOffset(bubble, 0, 0);

//     bubble.dataset.velX = ((Math.random() - 0.5) * 2 * 70).toString();
//     bubble.dataset.velY = (Math.random() * 50 + 20).toString();
// }

