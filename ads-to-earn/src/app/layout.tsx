

export const metadata = {
  title: "Ads-to-Earn",
  description: "Gagne des points en regardant des pubs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-gray-900 text-white">
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
