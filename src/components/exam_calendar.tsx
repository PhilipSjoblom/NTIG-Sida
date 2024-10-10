'use client'

import { useCallback, useEffect, useState } from 'react'
import styles from './exam_calendar.module.scss'
import { getClasses } from '@/utils';
import { useSearchParams } from 'next/navigation';

interface Exam {
    start: Date;
    end: Date;
    hasTime: boolean;
    title: string;
    teacher_mail?: string;
}

interface GCalEvent {
    start: { dateTime?: string, date?: string };
    end: { dateTime?: string, date?: string };
    summary: string;
    creator?: { email?: string };
}

function lerp(start: number, end: number, t: number): number {
    return start + t * (end - start);
}


function generateExamStyles(daysUntil: number): React.CSSProperties {
    return {
        "--exam-base-colour-h": String(Math.round(lerp(0, 90, daysUntil / 30))),
        "--exam-base-colour-s": `${Math.round(lerp(70, 40, (daysUntil - 10) / 30))}%`,
    } as React.CSSProperties;
}

function getExamDate(exam: Exam): string {
    const daysUntil = (exam.start.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    if (daysUntil < 0) {
        return "Idag";
    } else if (daysUntil < 1) {
        return "Imorgon";
    } else if (daysUntil < 2) {
        return "I övermorgon";
    } else if (daysUntil < 7) {
        return `På ${exam.start.toLocaleDateString('sv-se', { weekday: 'long' })}`;
    } else {
        return exam.start.toLocaleDateString('sv-se', { weekday: 'long' });
    }
}


function ExamCard({ exam }: { exam: Exam }) {
    return (
        <div
            className={styles.examCard}
            style={{ ...generateExamStyles((exam.start.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) }}
        >
            <div className={styles.examInfo}>
                <h3>{exam.title}</h3>
            </div>
            <div className={styles.examTime}>
                <span className={styles.examDate}>{getExamDate(exam)}</span>
                {true ? <>
                    <span className={styles.examStart}>{exam.start.toLocaleTimeString('sv-se', { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className={styles.examSep}></span>
                    <span className={styles.examEnd}>{exam.end.toLocaleTimeString('sv-se', { hour: '2-digit', minute: '2-digit' })}</span>
                </> : null}
            </div>

            {exam.teacher_mail ? <a href={`mailto:${exam.teacher_mail}`} className={styles.teacherContact}>
                {exam.teacher_mail.split("@")[0].split(".").map(name => name.charAt(0).toUpperCase() + name.slice(1)).join(" ")}
            </a> : null}
        </div>
    )
}


export default function ExamCalendar() {
    const [exams, setExams] = useState<Exam[]>([]);
    const searchParams = useSearchParams();
    const [selectedClass, setSelectedClass] = useState<string | null>(searchParams.get("exam") ?? searchParams.get("class") ?? null);

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set(name, value)

            return params.toString()
        },
        [searchParams]
    )

    useEffect(() => {
        if (!process.env.NEXT_PUBLIC_EXAM_GCAL_URL) return;
        fetch(
            process.env.NEXT_PUBLIC_EXAM_GCAL_URL,
            { headers: { "Accept": "application/json" } }
        )
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setExams(
                    data.items
                        .map((cEvent: GCalEvent) => ({
                            start: parseTime(cEvent.start),
                            end: parseTime(cEvent.end),
                            hasTime: cEvent.start.dateTime !== undefined,
                            title: cEvent.summary,
                            teacher_mail: cEvent.creator?.email,
                        } as Exam))
                        .filter((exam: Exam) => exam.start.getTime() > Date.now())
                        .sort((a: Exam, b: Exam) => a.start.getTime() - b.start.getTime())
                );
            });
    }, []);

    const selected = (exam: Exam) => !selectedClass || exam.title.toLowerCase().includes(selectedClass.toLowerCase());

    return (
        <div className={[styles.examCalendar, "glass"].join(" ")}>
            <div className={[styles.header, "header"].join(" ")}>
                <span>Prov ({exams.filter(selected).length})</span>

                <select className={styles.classSelector} onChange={e => {
                    setSelectedClass(e.target.value);
                    window.history.pushState({}, "", `?${createQueryString("exam", e.target.value)}`);
                }} defaultValue={selectedClass ?? ""}>
                    <option value="" disabled={true}>
                        Välj en klass
                    </option>
                    {getClasses(true).map((class_name, index) => (
                        <option key={index} value={class_name.toLowerCase()}>{class_name}</option>
                    ))}
                </select>
                <svg className={styles.dropdownArrow} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M7 10l5 5 5-5z'></path></svg>
            </div>
            <div className={styles.body}>
                {exams
                    .filter(selected)
                    .map((exam, index) => (
                        <ExamCard key={index} exam={exam} />
                    ))}
            </div>
        </div>
    )
}

function parseTime(time: { dateTime?: string, date?: string }): Date {
    if (time.dateTime) {
        return new Date(time.dateTime);
    } else if (time.date) {
        return new Date(time.date);
    } else {
        throw new Error("Invalid time format");
    }
}

