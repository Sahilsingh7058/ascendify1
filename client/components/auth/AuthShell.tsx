import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface AuthShellProps {
  title: string;
  children: React.ReactNode;
  footer: React.ReactNode;
  className?: string;
}

export default function AuthShell({
  title,
  children,
  footer,
  className,
}: AuthShellProps) {
  return (
    <div
      className={cn(
        "min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12",
        className,
      )}
    >
      <Card className="w-full max-w-md border-border/60 shadow-lg">
        <CardHeader className="space-y-4">
          <div className="mx-auto flex items-center gap-2 text-sky-500">
            <svg
              aria-hidden
              viewBox="0 0 48 24"
              className="h-6 w-10 fill-current"
            >
              <path
                d="M12 12c0-4 3-7 7-7 3 0 5 2 7 4s4 4 7 4 7-3 7-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M36 12c0 4-3 7-7 7-3 0-5-2-7-4s-4-4-7-4-7 3-7 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <CardTitle className="text-center text-2xl font-bold tracking-tight">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {children}
          <Separator />
          {footer}
        </CardContent>
      </Card>
    </div>
  );
}
