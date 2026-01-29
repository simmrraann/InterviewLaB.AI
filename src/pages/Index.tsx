import Header from "@/components/Header";
import VoiceAgent from "@/components/VoiceAgent";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 pt-32 pb-16">
        {/* Hero Section */}
        <section className="text-center mb-16 md:mb-24">
          <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              Practice Technical Interviews
              <span className="block text-gradient-accent mt-2">
                With Your Voice
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Speak your logic, not just answers. Train your communication skills 
              with an AI interviewer that listens and evaluates in real-time.
            </p>
          </div>
        </section>

        {/* Voice Agent Section */}
        <section id="practice" className="max-w-2xl mx-auto mb-20">
          <VoiceAgent />
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="max-w-4xl mx-auto">
          <HowItWorks />
        </section>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
};

export default Index;
