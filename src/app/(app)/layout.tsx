import { SidebarNav } from "~/components/SidebarNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen min-w-screen flex-col bg-gray-100 dark:bg-gray-950">
      <div className="flex min-h-screen w-screen flex-grow flex-row">
        <SidebarNav />
        <main className="container mx-auto flex-grow p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
