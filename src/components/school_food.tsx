'use client';

import { useEffect, useState } from "react";
import styles from "./school_food.module.scss";
import DOMPurify from "dompurify";

export default function SchoolFood() {
    let cached = localStorage.getItem("food");
    let cachedDate = localStorage.getItem("foodDate");
    if (cachedDate !== new Date().toLocaleDateString("sv-SE")) 
        cached = null;

    const [food, setFood] = useState<string | null>(cached);
    
    useEffect(() => {
        if (cached) return;

        if (!process.env.NEXT_PUBLIC_PROXY_URL) return;
        const url = `${process.env.NEXT_PUBLIC_PROXY_URL}/food`;
        fetch(url).then((response) => {
            if (!response.ok) {
                console.error("Failed to fetch food data");
                return;
            }
            response.text().then((text) => {
                const parsed = new DOMParser().parseFromString(text, "text/xml");
                let description = parsed.querySelector("item description")?.textContent;
                if (description)
                    description = DOMPurify.sanitize(description);

                setFood(description ?? "Failed to fetch food data");
                if (description){
                    localStorage.setItem("food", description);
                    localStorage.setItem("foodDate", new Date().toLocaleDateString("sv-SE"));
                }
            })
        });
    }, [])

    if (new Date().getDay() > 5) 
        return null;
    
    return (
        <div className={[styles.schoolFood, "glass"].join(" ")}>
            <div className="header">Dagens mat</div>
            <div className={styles.foodBody} dangerouslySetInnerHTML={{ __html: food ?? "Laddar..." }}>
            </div>
        </div>
    )
}