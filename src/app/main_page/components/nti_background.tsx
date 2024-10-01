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


export default function NtiBackground({ diameter = 50, bubbleCount = 30 }: BackgroundProps): JSX.Element {
    // TODO
    return (
        <div className={styles.background} id="nti-background">
        </div>
    );
};
