"use client";

import NtiBackground from './components/nti_background';
import OutgoingLink, { OutgoingLinkProps, SLRouteLink } from './components/outgoing_link';
import styles from './main_page.module.scss';
import LessonTimetable from "./components/lesson_timetable"
import "./main_page.scss";
import Announcement from './components/announcement';


export default function MainPage() {
    const links: OutgoingLinkProps[] = [
        {
            url: "https://sms.schoolsoft.se/nti/sso",
            icon_url: "/quick_links/schoolsoft.png",
            title: "Schoolsoft"
        },
        {
            url: "https://web.skola24.se/timetable/timetable-viewer/it-gymnasiet.skola24.se/NTI%20S%C3%B6dert%C3%B6rn",
            icon_url: "/quick_links/skola24.png",
            title: "Skola24"
        },
        {
            url: "https://skolmaten.se/nti-gymnasiet-sodertorn/",
            icon_url: "/quick_links/skolmaten.png",
            title: "Skolmaten"
        },
        {
            url: "https://outlook.com/ntig.se",
            icon_url: "/quick_links/outlook.png",
            title: "Outlook"
        },
        {
            url: "https://www.gymnasieguiden.se/reportage/tips-om-studieteknik",
            icon_url: "/quick_links/studieteknik.webp",
            title: "Studieteknik"
        },
        {
            url: "https://skrivguiden.se/",
            icon_url: "/quick_links/skrivguiden.webp",
            title: "Skrivguiden"
        },
        {
            url: "https://www.krisinformation.se/",
            icon_url: "/quick_links/icalendar.png",
            title: "ICalendar",
        },
        {
            url: "https://sl.se/?mode=travelPlanner",
            icon_url: "/quick_links/sl.png",
            title: "SL",
        }
    ];

    return (
        <>
            <NtiBackground />
            <div className={styles.columns}>
                <div className={[styles.column1, styles.column].join(" ")}>
                    <LessonTimetable startHour={8} endHour={17} />
                </div>
                <div className={[styles.column2, styles.column].join(" ")}>
                    <div className={styles.linksContainer}>
                        {links.map((link, index) => (
                            <OutgoingLink key={index} {...link} />
                        ))}
                        {/* <SLRouteLink url="https://sl.se/?mode=travelPlanner" title="SL" /> */}
                        {/* TODO: ICal */}
                    </div>
                    <Announcement />
                </div>
                <div className={[styles.column3, styles.column].join(" ")}>
                </div>
            </div>
        </>
    );
}
// c_ccb173b4b46532575a1a316f50fe4c947323594da40401a987d73b0c99f04ce2@group.calendar.google.com
