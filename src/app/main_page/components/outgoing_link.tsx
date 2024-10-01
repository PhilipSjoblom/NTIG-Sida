import styles from "./outgoing_link.module.scss"

export interface OutgoingLinkProps {
    url: string;
    title: string;
    icon_url: string;
    id?: string;
    children?: React.ReactNode;
};

export default function OutgoingLink(props: OutgoingLinkProps): JSX.Element {
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

// <a class="outgoing-link" style="--icon: url('{{ icon_url }}');" href="{{ url }}" title="{{ title }}" {%
//     if id %}id="{{ id }}"{% endif %}>
// {% block inside %}{% endblock %}
// </a>