import styles from "./lesson_timetable.module.scss";
import { default as Lesson, LessonData } from "./lesson";
import { useEffect, useRef, useState } from "react";

function getWeek(date: Date): number {
    const firstJan = new Date(date.getFullYear(), 0, 1);
    return Math.ceil(((date.getTime() - firstJan.getTime()) / 86400000 + firstJan.getDay() + 1) / 7);
}

interface RawLessonData {
    timeStart: string;
    timeEnd: string;
    texts: string[] | null;
    dayOfWeekNumber: number;
}

async function fetchLessons(classid: string): Promise<LessonData[]> {
    const url = `https://skola24proxy.philip-sjoblom.workers.dev/?classId=${classid}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Failed to fetch lessons");
    }
    const rawData: RawLessonData[] = await response.json();

    return rawData.map((lesson) => ({
        start: lesson.timeStart.split(":").slice(0, 2).join(":"),
        end: lesson.timeEnd.split(":").slice(0, 2).join(":"),
        texts: lesson.texts ?? [],
        dayOfWeek: lesson.dayOfWeekNumber,
    }));
}


function TimeHeader() {
    const clockRef = useRef<HTMLDivElement>(null);
    const dateRef = useRef<HTMLDivElement>(null);

    const updateTime = () => {
        const now = new Date();
        if (clockRef.current) {
            clockRef.current.textContent = now.toLocaleTimeString('sv-se', { hour: '2-digit', minute: '2-digit' })
        }
        if (dateRef.current) {
            const weekNum = getWeek(now);
            let weekday = now.toLocaleDateString('sv-se', { weekday: 'long' });
            weekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);

            dateRef.current.textContent = `${weekday} v${weekNum} ${now.getFullYear()} `;
        }
    };

    useEffect(() => {
        updateTime();
        const interval = setInterval(updateTime, 5 * 1000);
        return () => clearInterval(interval);
    }, []);

    return <>
        <span id="current-date" ref={dateRef}></span>
        <span id="current-time" ref={clockRef}></span>
    </>
}

function hashString(str: string): number {  
    let hash = 0;  
    for (let i = 0; i < str.length; i++) {  
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
    }  
    return hash;  
}

export function TimetableItems({ startHour }: { startHour: number }) {
    const [lessons, setLessons] = useState<LessonData[]>([]);

    useEffect(() => {
        fetchLessons("te22e").then(data => {
            data = data.filter(lesson => lesson.dayOfWeek === new Date().getDay());
            data = fixOverlaps(data);
            data.forEach(lesson => {
                const lessonStart = timeToHours(lesson.start);
                const lessonEnd = timeToHours(lesson.end);
                lesson.top = `calc(var(--top-bottom-timetable-padding) + var(--half-hour-height) * ${(lessonStart - startHour) * 2})`
                lesson.height = `calc(var(--half-hour-height) * ${(lessonEnd - lessonStart) * 2})`
                lesson.hue = hashString(lesson.texts.join("")) % 360 + "deg";
            });
            setLessons(data);
        });
    }, []);
    if (!lessons) return <div>Loading...</div>;

    return (
        <>
            {lessons.map((lesson, index) => (
                <Lesson key={index} {...lesson} />
            ))}
        </>
    )
}

interface LessonTimeTableProps {
    startHour: number;
    endHour: number;
}

export default function LessonTimetable({ startHour, endHour }: LessonTimeTableProps) {
    const nowIndicatorRef = useRef<HTMLDivElement>(null);

    const updateTime = () => {
        const now = new Date();
        if (nowIndicatorRef.current) {
            const total_hours = now.getHours() + now.getMinutes() / 60;
            const mult = (total_hours - startHour) * 2;
            nowIndicatorRef.current.style.top = `calc(var(--top-bottom-timetable-padding) + var(--half-hour-height) * ${mult})`;
        }
    };

    useEffect(() => {
        updateTime();
        const interval = setInterval(updateTime, 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={[styles.timetable, "glass"].join(" ")}>
            <div className={[styles.header, "header"].join(" ")}>
                <TimeHeader />
            </div>
            <div className={styles.body}>
                <div id="now-indicator" className={styles.nowIndicator} ref={nowIndicatorRef}></div>
                <div className={styles.timeColumn}>
                    {Array.from({ length: (endHour - startHour) * 2 + 1 }, (_, i) => {
                        const hour = Math.floor(i / 2) + startHour;
                        const minute = i % 2 === 0 ? "00" : "30";
                        return (
                            <div className={styles.timeEntry} key={i}>
                                <span className={i % 2 === 0 ? styles.halfHour : undefined}>{`${hour}:${minute}`}</span>
                            </div>
                        );
                    })}
                </div>
                <div className={styles.lessonColumn}>
                    <TimetableItems startHour={startHour} />
                </div>
            </div>
        </div>
    )
}


function doOverlap(a: LessonData, b: LessonData): boolean {
    if (a === b) return true;
    return (
        timeToHours(a.start) < timeToHours(b.end)
        && timeToHours(a.end) > timeToHours(b.start)
    );
}
function timeToHours(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);
    return hours + minutes / 60;
}
function fixOverlaps(lessons: LessonData[]): LessonData[] {
    // Sort by overlap count
    lessons = lessons.sort(
        (a, b) => {
            const overlaps_a = lessons.filter(lesson => doOverlap(a, lesson)).length;
            const overlaps_b = lessons.filter(lesson => doOverlap(b, lesson)).length;
            return overlaps_b - overlaps_a;
        }
    );

    const overlaps = new Map<LessonData, number>();
    lessons.forEach(lesson => {
        let to_update: LessonData[] = [];
        lessons.forEach(other => {
            if (doOverlap(lesson, other))
                to_update.push(other);
        });
        overlaps.set(lesson, to_update.length);
        for (let other of to_update) {
            overlaps.set(other, to_update.length);
        }
    });
    for (let [lesson, overlap_count] of Array.from(overlaps.entries())) {
        lesson.width = 100 / overlap_count + "%";
    }

    let times: number[] = [];
    lessons
        .sort((a, b) => timeToHours(a.start) - timeToHours(b.start))
        .forEach(lesson => {
            times = times.filter(time => time > timeToHours(lesson.start));
            lesson.left = 100 / (overlaps.get(lesson) ?? 1) * times.length + "%";
            times.push(timeToHours(lesson.end));
        });

    return lessons;
}

