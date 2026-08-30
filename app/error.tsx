"use client";

import { Button } from "@/components/ui/button";

const ErrorPage = ({ reset }: { reset: () => void }) => (
  <main className="flex min-h-svh items-center justify-center p-6">
    <div className="max-w-md text-center">
      <p className="text-muted-foreground font-mono text-xs tracking-[0.18em] uppercase">
        Clario
      </p>
      <h1 className="font-heading mt-3 text-4xl">Something went wrong</h1>
      <p className="text-muted-foreground mt-3 text-sm">
        The workspace could not be loaded. Try again.
      </p>
      <Button className="mt-6" onClick={reset} type="button">
        Try again
      </Button>
    </div>
  </main>
);

export default ErrorPage;
