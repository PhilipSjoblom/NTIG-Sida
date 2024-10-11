import { useEffect, useState } from "react";
import styles from "./school_food.module.scss";
import DOMPurify from "dompurify";

export default function SchoolFood() {
    const [food, setFood] = useState<string | null>(null);
    
    useEffect(() => {
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