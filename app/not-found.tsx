import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

const NotFound = () => (
  <main className="flex min-h-svh items-center justify-center p-6">
    <div className="max-w-md text-center">
      <p className="text-muted-foreground font-mono text-xs tracking-[0.18em] uppercase">
        Clario
      </p>
      <h1 className="font-heading mt-3 text-4xl">Page not found</h1>
      <p className="text-muted-foreground mt-3 text-sm">
        The workspace page you requested does not exist.
      </p>
      <Link className={`${buttonVariants()} mt-6`} href="/">
        Return to Clario
      </Link>
    </div>
  </main>
);

export default NotFound;
