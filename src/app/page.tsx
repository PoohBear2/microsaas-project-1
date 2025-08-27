import { Uploader } from '@/components/Uploader';

export default function Home() {
  return (
    <main className="flex min-h-screen bg-black text-white">
      {/* Left Side - File Uploader */}
      {/* <Uploader /> */}
      
      {/* Right Side - Content */}
      <div className="flex flex-1 items-center justify-center px-16">
        <div className="text-center">
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-widest leading-tight mb-8">
            Custom Extract <span className="text-cyan-400">Data&nbsp;</span> 
            Smarter. Faster.
          </h1>
          
          <a
            href="/product"
            className="inline-block px-10 py-5 rounded-2xl text-2xl font-bold bg-cyan-400 text-black
                       transition-all duration-300 hover:bg-cyan-300 hover:shadow-[0_0_25px_5px_rgba(34,211,238,0.7)]"
          >
            Go to Product →
          </a>
        </div>
      </div>
    </main>
  );
}