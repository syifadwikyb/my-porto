import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Experience from '@/components/Experience'; // <--- Import ini
import Projects from '@/components/Projects';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <Hero />
      <Experience /> {/* <--- Pasang di sini */}
      <Projects />
      <Footer />
    </main>
  );
}