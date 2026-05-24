import Footer from "@/components/shared/footer/Footer";
import Navbar from "@/components/shared/navbar/Navbar";

export default function Home() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>
        <p>This is the home page of my Next.js application.</p>
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}
