import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "P14 Portal de Practică | Matching Studenți - Firme",
  description: "Platformă de practică universitară: matching Gale-Shapley, convenții PDF și pontaj ore.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
