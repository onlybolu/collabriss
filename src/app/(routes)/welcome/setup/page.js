"use client";

import { Suspense } from "react";
import SetupPageClient from "@/app/(routes)/welcome/setup/SetupPageClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading setup...</div>}>
      <SetupPageClient />
    </Suspense>
  );
}
