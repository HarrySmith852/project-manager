"use client"

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-[#F7F8F9] px-4 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-[radial-gradient(ellipse_at_bottom_left,_#DEEBFF_0%,_transparent_55%),radial-gradient(ellipse_at_bottom_right,_#FFEBE6_0%,_transparent_55%)]"
      />
      <div className="relative z-10 w-full">{children}</div>
      <p className="relative z-10 mt-8 text-center text-xs text-muted-foreground">
        Privacy Policy · User Notice
      </p>
    </div>
  )
}
