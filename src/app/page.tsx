'use client'

import { getClasses } from '@/utils';
import styles from './page.module.scss';
import Background from '@/components/background';
import { useRouter } from 'next/navigation';

export default function Page() {
    const router = useRouter();

    return (
        <>
            <Background />
            <div className={styles.container}>
                <select className={styles.classSelector} onChange={e => {
                    if (e.target.value === "") return;
                    router.push(`/class/?class=${e.target.value}`);
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
        </>
    )
}