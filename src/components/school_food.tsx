import { useEffect, useState } from "react";
import styles from "./school_food.module.scss";

export default function SchoolFood() {
    const [food, setFood] = useState<string | null>(null);
    
    useEffect(() => {
        // TODO: Proxy through cloudflare worker... or just request API access
        fetch("https://skolmaten.se/nti-gymnasiet-sodertorn/rss/days/")
            .then(response => response.text())
            .then(text => {
                const parser = new DOMParser();
                const xml = parser.parseFromString(text, "text/xml");
                console.log(xml);
                // const items = xml.getElementById

            })
            .catch(() => setFood(null))
    }, [])

    return (
        <div className={styles.schoolFood}>
            <div className="header">Dagens mat</div>
            <div className={styles.foodBody}>
                WIP
            </div>
        </div>
    )
}