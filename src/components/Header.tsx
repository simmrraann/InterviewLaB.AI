import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo - Clicking it takes you Home */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center shadow-[0_0_15px_rgba(45,212,191,0.3)]">
            <span className="text-white font-bold text-sm">I</span>
          </div>
          <span className="font-bold text-foreground tracking-tight text-xl">
            InterviewLaB<span className="text-teal-400">.AI</span>
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
            How it Works
          </a>
          
          {/* ✅ New "My Journey" link to see History */}
          <button 
            onClick={() => navigate('/history')}
            className="text-sm text-muted-foreground hover:text-teal-400 transition-colors font-medium"
          >
            My Journey
          </button>

          <a href="#practice" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
            Practice
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;