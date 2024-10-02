export function getClasses(all?: boolean): string[] {
    const classes: string[] = [];
    const today = new Date();
    let year = (today.getFullYear() - 1) % 100;
    if (today.getMonth() + 1 > 6) {
        year += 1;
    }

    for (let offset = 0; offset < 3; offset++) {
        ["TE", "EE", "ES"].forEach(prefix => {
            classes.push(`${prefix}${year - offset}`);
        });
    }

    if (!all) {
        const removeIndex = classes.indexOf(`TE${year - 2}`);
        if (removeIndex !== -1) {
            classes.splice(removeIndex, 1);
        }
    }

    classes.push(
        `TE${year-2}S`,
        `TE${year-2}E`,
        `TE4_${year}`,
        `IMY${year}`
    );

    return classes.sort();
}
