import { text } from "stream/consumers";
import styles from "./lesson.module.scss"


export interface LessonData {
    start: string;
    end: string;
    texts: string[];
    dayOfWeek: number;

    left?: string;
    width?: string;
    top?: string;
    height?: string;
    hue?: string;
}

function dateAsTime(date: Date): string {
    return date.getHours() + ":" + date.getMinutes();
}


export default function Lesson(
    props: LessonData
) {
    const cssProps = {
        // width: props.width + "%",
        // top: startHours * 100 / 24 + "%",
        top: props.top,
        height: props.height,
        left: props.left,
        width: props.width,
        "--lesson-hue": props.hue,
    };

    return (
        <div
            className={styles.lesson}
            style={cssProps}
        >
            <div className={styles.details}>
                { props.texts.length >= 1 ? <h4 className={styles.lessonTitle}>{ props.texts[0] }</h4> : null }
                { props.texts.length >= 2 ? <span className={styles.lessonRoom}>{ props.texts[1] }</span> : null }
                { props.texts.length >= 3 ? <span className={styles.lessonTeacher}>{ props.texts[2] }</span> : null }
            </div>
            <div className={styles.timeContainer}>
                <span className={[styles.time, styles.timeStart].join(" ")}>{props.start}</span>
                <span className={styles.timeDivider}></span>
                <span className={[styles.time, styles.timeEnd].join(" ")}>{props.end}</span>
            </div>
        </div>
    )
}