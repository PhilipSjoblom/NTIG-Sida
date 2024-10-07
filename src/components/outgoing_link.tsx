import { useEffect, useState } from "react";
import styles from "./outgoing_link.module.scss"

export interface OutgoingLinkProps {
    url: string;
    title: string;
    icon_url?: string;
    id?: string;
    children?: React.ReactNode;
};

export default function OutgoingLink(props: OutgoingLinkProps) {
    return (
        <a
            className={styles.outgoingLink}
            style={{ "--icon": `url('${props.icon_url}')` } as React.CSSProperties}
            href={props.url}
            title={props.title}
            id={props.id}
        >
            {props.children}
        </a>
    )
}

export function SLRouteLink(props: OutgoingLinkProps) {
    const [location, setLocation] = useState<GeolocationPosition | null>(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((location) => {
            setLocation(location);
        });
    }, []);

    return <OutgoingLink 
        {...props} 
        url={location ? get_sl_url(location).toString() : props.url} 
        icon_url={props.icon_url ?? (location ? "/quick_links/sl live.png" : "/quick_links/sl.png")}
    />
}


        // {url:url_for('ical', class_name=class_name),
        //         icon_url: "/quick_links/icalendar.png",
        //         title:"Kalender (iCalendar)" },
        // {url:"https://sl.se/?mode=travelPlanner",
        //         icon_url: "/quick_links/sl.png",
        //         title:"SL" },
        //     {% include "sl_route.jinja2" },{% endwith }


function get_sl_url(location: GeolocationPosition): URL {
    const url = new URL("https://sl.se/?mode=travelPlanner");
    if (!process.env.NEXT_PUBLIC_SCHOOL_STATION_ID) return url;

    url.searchParams.append('origName', 'Använd min plats');
    url.searchParams.append('origLat', location.coords.latitude.toString());
    url.searchParams.append('origLon', location.coords.longitude.toString());

    url.searchParams.append('destName', 'Huddinge sjukhus (Huddinge)');
    url.searchParams.append('destPlaceId', process.env.NEXT_PUBLIC_SCHOOL_STATION_ID);
    // Bitmask?
    url.searchParams.append('transportTypes', '239');

    return url;
}
