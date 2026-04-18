// No "use client" needed — this is a Server Component.
// Only the Sidebar itself is a Client Component (it uses usePathname).

import { Sidebar } from "@/components/shared/Sidebar";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LayoutProps {
  children: React.ReactNode;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      {/*
        A single <Sidebar /> handles both breakpoints internally:
        - lg+  → renders the fixed left <aside>   (hidden lg:flex)
        - <lg  → renders the fixed bottom <nav>   (lg:hidden fixed bottom-0)
        No extra wrapper needed — Sidebar manages its own visibility.
      */}
      <Sidebar role="admin" />

      {/* ── Scrollable main content ── */}
      {/* pb-20 clears the mobile bottom nav bar; resets to pb-10 on desktop */}
      <main className="flex-1 lg:ms-72 overflow-y-auto min-h-0">
        <div className="">{children}</div>
      </main>
    </div>
  );
}
