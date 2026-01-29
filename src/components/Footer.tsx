const Footer = () => {
  return (
    <footer className="py-12 border-t border-border">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xs">N</span>
          </div>
          <span className="text-sm text-muted-foreground">
            InterviewLaB.AI Voice Interview Platform
          </span>
        </div>
        
        <div className="flex items-center gap-6">
          <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Privacy
          </a>
          <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Terms
          </a>
          <span className="text-xs text-muted-foreground">
            © 2026 InterviewLaB.AI
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
