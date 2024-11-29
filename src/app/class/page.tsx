"use client";

import { redirect, useSearchParams } from "next/navigation";


export default function Page() {
    redirect(`/?${useSearchParams().toString()}`);
}
