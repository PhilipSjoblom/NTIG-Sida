"use client";

export default function SourceMessage() {
    if (typeof window === "undefined") return null;
    console.log("%cInfo", "font-size: 4em");
    console.log(
        "Letar du efter kod? Kompilerad och miniferad kod är svår att läsa, så du vill nog kolla in källkoden istället.\n"
        +  "Lös det följande för att hitta länken:\n"  // Or google my name and find the github... it isn't private
        + "^ BgAdFx1ORkgJHR0PGxZHBAEZRjcGHQUOHicDCAwYBgpBOj0uKVk6DgoV" // Base64 encoded result of XORing the link with "ntig"
    )
    return null;
}