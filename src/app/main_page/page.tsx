"use client";

import NtiBackground from './components/nti_background';
import { OutgoingLinkProps } from './components/outgoing_link';
import styles from './main_page.module.scss';
import LessonTimetable from "./components/lesson_timetable"
import "./main_page.scss";


{/* <Calendar {...{
    startHour: 8,
    endHour: 20,
    lessons: [
      {
        start: new Date(),
        end: new Date(),
        texts: ["Test One", "Test Two", "Test Three"],
      },
    ],
  }} /> */}

export default function MainPage() {
    const links: OutgoingLinkProps[] = [
    ];

    return (
        <>
            <NtiBackground />
            <div className={styles.columns}>
                <div className={[styles.column1, styles.column].join(" ")}>
                    <LessonTimetable startHour={8} endHour={17} />
                </div>
                <div className={[styles.column2, styles.column].join(" ")}>

                </div>
                <div className={[styles.column3, styles.column].join(" ")}>

                </div>
            </div>
            {/* <script src="/js/lesson_timeline.js" /> */}
        </>
    );
}
