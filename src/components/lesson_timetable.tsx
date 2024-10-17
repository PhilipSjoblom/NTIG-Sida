'use client'

import styles from "./lesson_timetable.module.scss";
import { default as Lesson, LessonData } from "./lesson";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import router from "next/router";
import { getClasses } from "@/utils";

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

async function fetchLessons(classid: string): Promise<LessonData[] | null> {
    const url = `${process.env.NEXT_PUBLIC_PROXY_URL}/skola24?classId=${classid}`;
    const response = await fetch(url);

    if (!response.ok)
        return null;

    const rawData: RawLessonData[] = await response.json();

    return rawData.map((lesson) => ({
        start: lesson.timeStart.split(":").slice(0, 2).join(":"),
        end: lesson.timeEnd.split(":").slice(0, 2).join(":"),
        texts: lesson.texts ?? [],
        dayOfWeek: lesson.dayOfWeekNumber,
    }));
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

interface CachedLessonData {
    lessons: LessonData[];
    date: string;
}

export function TimetableItems({ startHour, weekday }: { startHour: number, weekday: number }) {
    if (typeof window === "undefined") return null;

    const cachedStr = localStorage.getItem("lessons");
    let cachedData: { [classid: string]: CachedLessonData } | null = cachedStr ? JSON.parse(cachedStr) : null;

    const [lessons, setLessons] = useState<LessonData[] | null>([]);
    const [todaysLessons, setTodaysLessons] = useState<LessonData[] | null>(null);
    const searchParams = useSearchParams();

    useEffect(() => {
        const classid = searchParams.get("class");
        if (!classid) return;

        if (cachedData && cachedData[classid] && cachedData[classid].date === new Date().toLocaleDateString("sv-SE")) {
            setLessons(cachedData[classid].lessons);
            return;
        }

        fetchLessons(classid).then(data => {
            if (!data) {
                setLessons(null);
                return;
            }
            data = data
                // .filter(lesson => lesson.dayOfWeek === new Date().getDay())
                .filter(lesson => lesson.texts.filter(Boolean).length > 0);
            // data = fixOverlaps(data);
            data.forEach(lesson => {
                const lessonStart = timeToHours(lesson.start);
                const lessonEnd = timeToHours(lesson.end);
                lesson.top = `calc(var(--top-bottom-timetable-padding) + var(--half-hour-height) * ${(lessonStart - startHour) * 2})`
                lesson.height = `calc(var(--half-hour-height) * ${(lessonEnd - lessonStart) * 2})`
                lesson.hue = hashString(lesson.texts.join("")) % 360 + "deg";
            });
            setLessons(data);
            if (!cachedData) cachedData = {};
            cachedData[classid] = { lessons: data, date: new Date().toLocaleDateString("sv-SE") };
            localStorage.setItem("lessons", JSON.stringify(cachedData));
        });
    }, [searchParams, startHour]);

    useEffect(() => {
        if (!lessons) return;
        setTodaysLessons(
            fixOverlaps(lessons
                .filter(lesson => lesson.dayOfWeek === weekday)));
    }, [lessons, weekday]);

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set(name, value)

            return params.toString()
        },
        [searchParams]
    )
    
    if (!searchParams.get("class")) 
        return (
            <div className={styles.classSelectContainer}>
                <select className={styles.classSelector} onChange={e => {
                    window.history.pushState({}, "", `?${createQueryString("class", e.target.value)}`);
                }} defaultValue="">
                    <option value="" disabled={true}>
                        Välj en klass
                    </option>
                    {getClasses(true).map((class_name, index) => (
                        <option key={index} value={class_name.toLowerCase()}>{class_name}</option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Eller skriv in manuellt"
                    autoFocus={true}
                    className={styles.manualInput}
                    onKeyDown={e => {
                        if (e.key === "Enter") {
                            router.push(`/class/?class=${e.currentTarget.value}`);
                        }
                    }}
                />
            </div>
        );
    if (todaysLessons == null) return <h3 className={styles.statusText}>Kunde inte ladda lektioner</h3>;
    if (!todaysLessons) return <h3 className={styles.statusText}>Laddar...</h3>;

    return (
        <>
            {todaysLessons.map((lesson, index) => (
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
    const [indicatorTopMult, setIndicatorTopMult] = useState<number | null>(null);
    const [selectedWeekday, setSelectedWeekday] = useState(new Date().getDay() - 1);

    const clockRef = useRef<HTMLDivElement>(null);
    const dateRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            // Set day to current weekday
            now.setDate(now.getDate() - (now.getDay() - selectedWeekday + 7) % 7 + 1);

            const total_hours = now.getHours() + now.getMinutes() / 60;
            if (total_hours < startHour || total_hours > endHour) {
                setIndicatorTopMult(null);
                return;
            }
            const mult = (total_hours - startHour) * 2;
            setIndicatorTopMult(mult);

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

        updateTime();
        const interval = setInterval(updateTime, 60 * 1000);
        return () => clearInterval(interval);
    }, [endHour, startHour, selectedWeekday]);

    return (
        <div className={[styles.timetable, "glass"].join(" ")}>
            <div className={[styles.header, "header"].join(" ")}>
                <span id="current-date" ref={dateRef}></span>
                <span id="current-time" ref={clockRef}></span>

                <select className={styles.daySelector} onChange={e => {
                    setSelectedWeekday(Number(e.target.value));
                }} value={selectedWeekday}>
                    {["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag"].map((day, index) => (
                        <option key={index} value={index}>{day}</option>
                    ))}
                </select>
                <svg className={styles.dropdownArrow} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M7 10l5 5 5-5z'></path></svg>
            </div>
            <div className={styles.body}>
                {indicatorTopMult === null ? null : (
                    <div
                        id="now-indicator"
                        className={styles.nowIndicator}
                        style={{
                            top: `calc(var(--top-bottom-timetable-padding) + var(--half-hour-height) * ${indicatorTopMult})`,
                        }}
                    />
                )}

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
                    <Suspense>
                        <TimetableItems
                            startHour={startHour}
                            weekday={selectedWeekday + 1} // 0-indexed
                        />
                    </Suspense>
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
        overlaps.set(lesson, lessons.filter(other => doOverlap(lesson, other)).length);
    });
    for (const [lesson, overlap_count] of Array.from(overlaps.entries())) {
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
