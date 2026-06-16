import Navbar from '@/components/shared/navbar/Navbar';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
     <Navbar />
      <main className="flex-1">{children}</main>
    </>
  );
}
