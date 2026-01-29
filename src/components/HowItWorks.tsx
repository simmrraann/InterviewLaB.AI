import { MessageSquare, Brain, TrendingUp } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Receive a Problem",
    description: "The AI interviewer presents you with a technical problem, just like in a real coding interview.",
  },
  {
    number: "02",
    icon: Brain,
    title: "Speak Your Logic",
    description: "Explain your approach out loud. Walk through your thought process, not just the final answer.",
  },
  {
    number: "03",
    icon: TrendingUp,
    title: "Get Real Feedback",
    description: "Receive instant feedback on your communication clarity, problem-solving approach, and areas to improve.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="text-center mb-16">
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
          How Voice Interviews Work
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Practice articulating your thought process with real-time AI feedback.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((step) => (
          <div key={step.number} className="step-card">
            <div className="flex items-start gap-4">
              <span className="step-number">{step.number}</span>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <step.icon className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">{step.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
