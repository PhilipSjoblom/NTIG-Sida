"use client";

import Background from '../../components/background';
import OutgoingLink, { OutgoingLinkProps, SLRouteLink } from '../../components/outgoing_link';
import styles from './page.module.scss';
import LessonTimetable from "../../components/lesson_timetable"
import "./page.scss";
import Announcement from '../../components/announcement';
import SchoolFood from '../../components/school_food';
import ExamCalendar from '../../components/exam_calendar';
import { notFound, useSearchParams } from 'next/navigation'
import { Suspense } from 'react';


function MainPage() {
    const searchParams = useSearchParams();
    const classId = searchParams.get("class");
    if (!classId) {
        return notFound();
    }

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
            url: "https://sl.se/?mode=travelPlanner",
            icon_url: "/quick_links/sl.png",
            title: "SL",
        }
    ];

    return (
        <>
            <Background />
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
                    <SchoolFood />
                    <ExamCalendar />
                </div>
            </div>
        </>
    );
}

export default function Page() {
    return (
        <Suspense>
            <MainPage />
        </Suspense>
    )
}
