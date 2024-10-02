'use client';

import React, { useCallback, useEffect, useState } from "react";
import styles from "./background.module.scss";


interface BubbleState {
    diameter: number;
    pos: { x: number, y: number };
    velocity: { x: number, y: number };
    interpolate: boolean;
}

function createNewBubble(): BubbleState {
    const diameter = Math.random() * 30 + 30;
    const yVelocity = Math.random() * 0.1 + 0.01;
    return {
        diameter: diameter,
        pos: {
            x: Math.random() * 0.9,
            y: -0.2,
        },
        velocity: { x: 0, y: yVelocity },
        interpolate: false,
    };
}


export default function Background({ bubbleCount = 30, speed = 1, tick_time = 2 }: { bubbleCount?: number, speed?: number, tick_time?: number }) {
    const [bubbles, setBubbles] = useState<BubbleState[]>([]);
    
    const frame = useCallback(() => {
        setBubbles(bubbles.map(bubble => {
            if ((bubble.pos.y + bubble.velocity.y * speed) > 1)
                return createNewBubble();

            const newBubble = { ...bubble, interpolate: true };

            newBubble.pos.x += newBubble.velocity.x * speed * tick_time;
            newBubble.pos.y += newBubble.velocity.y * speed * tick_time;

            newBubble.velocity.x += (Math.random() - 0.5) * 0.01 * speed * tick_time;
            newBubble.velocity.y += (Math.random() - 0.4) * 0.005 * speed * tick_time;

            if (newBubble.pos.x < 0) newBubble.velocity.x = Math.abs(newBubble.velocity.x);
            if (newBubble.pos.x > 1) newBubble.velocity.x = -Math.abs(newBubble.velocity.x);

            bubble.pos.x += (Math.random() - 0.5) * 0.01 * speed * tick_time;
            bubble.pos.y += 0.05 * speed * tick_time;
            return newBubble;
        }));
    }, [bubbles, speed, tick_time]);

    useEffect(() => {
        setBubbles(Array.from({ length: bubbleCount }, createNewBubble).map(bubble => {
            bubble.pos.y = -Math.random()*0.5 - 0.1;
            return bubble;
        }));
    }, [bubbleCount]);

    useEffect(() => {
        const interval = setInterval(frame, 1000 * tick_time);
        return () => clearInterval(interval);
    }, [bubbles, frame, speed, tick_time]);

    return (
        <div className={styles.background}>
            {bubbles.map((bubble, i) => {
                return (
                    <div key={i} className={styles.bubble} style={{
                        width: bubble.diameter,
                        height: bubble.diameter,
                        left: bubble.pos.x * 100 + "%",
                        bottom: bubble.pos.y * 100 + "%",

                        transitionProperty: bubble.interpolate ? "left, bottom" : "none",
                        transitionDuration: `${tick_time}s`,
                        transitionTimingFunction: "linear",
                    }} />
                );
            })}
        </div>
    );
};

