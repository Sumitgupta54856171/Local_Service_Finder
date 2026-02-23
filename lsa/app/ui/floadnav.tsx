import { Star, Navigation, CornerUpRight, Home, Map as MapIcon, User, Settings } from 'lucide-react';
import Link from 'next/link';


const FloatNav = ()=>{
    return (<>
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-sans relative">
      
      {/* Floated Glass Navbar */}
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-[#161f28]/60 backdrop-blur-xl border border-white/10 shadow-2xl rounded-full px-6 py-3 flex items-center gap-6">
        <button className="text-white bg-[#1a73e8] p-2 rounded-full shadow-lg shadow-blue-500/30 transition-all hover:scale-105" title="Home">
          <Link href="/"><Home className="w-[40px] h-[18px]" /></Link>
        </button>
        <button className="text-[#8ba0b2] hover:bg-blue-500 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all" title="Map">
          <Link href="/public/near/service"><MapIcon className="w-[18px] h-[18px]" /></Link>
        </button>
        <button className="text-[#8ba0b2] hover:text-white hover:bg-white/10 p-2 rounded-full transition-all" title="Profile">
          <User className="w-[18px] h-[18px]" />
        </button>
        <button className="text-[#8ba0b2] hover:text-white hover:bg-white/10 p-2 rounded-full transition-all" title="Settings">
          <Settings className="w-[18px] h-[18px]" />
        </button>
      </nav>

      
    </div>
    </>)
}

export default FloatNav;