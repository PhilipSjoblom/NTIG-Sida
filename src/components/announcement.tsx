import { useEffect, useState } from "react";
import styles from "./announcement.module.scss";
import DOMPurify from "dompurify";

export default function Announcement() {
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!process.env.NEXT_PUBLIC_ANNOUNCEMENT_MESSAGE_URL) return;
        fetch(process.env.NEXT_PUBLIC_ANNOUNCEMENT_MESSAGE_URL)
            .then(response => {
                if (!response.ok) throw new Error("Failed to fetch announcement message");
                return response.text();
            })
            .then(setMessage)
            .catch(() => setMessage(null));
    }, []);

    return !message ? null : (
        <div className={[styles.announcement, "glass"].join(" ")}>
            <div className="header">Meddelande</div>
            <div className={styles.announcementBody} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(message) }} />
        </div>
    )
}