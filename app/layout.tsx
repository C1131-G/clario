import { Geist_Mono, DM_Sans, Noto_Serif } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const notoSerifHeading = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-heading",
});

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const getMetadataBase = () => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");
  } catch {
    return new URL("http://localhost:3000");
  }
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => (
  <html
    lang="en"
    suppressHydrationWarning
    className={cn(
      "antialiased",
      fontMono.variable,
      "font-sans",
      dmSans.variable,
      notoSerifHeading.variable
    )}
  >
    <body>
      <ThemeProvider>
        <TooltipProvider>
          {children}
          <Toaster position="bottom-right" theme="system" />
        </TooltipProvider>
      </ThemeProvider>
    </body>
  </html>
);

export const metadata = {
  description: "AI business intelligence for SAP Business One.",
  metadataBase: getMetadataBase(),
  title: "Clario — AI business intelligence for SAP Business One",
};

export default RootLayout;
