import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function Feature() {
  return (
    <div className="w-full py-20 lg:py-40 bg-background">
      <div className="container mx-auto">
        <div className="flex gap-4 py-20 lg:py-40 flex-col items-start">
          <div>
            <Badge>Features</Badge>
          </div>
          <div className="flex gap-2 flex-col">
            <h2 className="text-3xl md:text-5xl tracking-tighter lg:max-w-xl font-regular">
              Empowering Communication with AnguliLekha
            </h2>
            <p className="text-lg max-w-xl lg:max-w-xl leading-relaxed tracking-tight text-muted-foreground">
              Experience the future of inclusive communication using AI-powered
              Indian Sign Language recognition.
            </p>
          </div>
          <div className="flex gap-10 pt-12 flex-col w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              <FeatureItem
                title="Real-Time Recognition"
                desc="Instantly convert sign gestures into readable text or speech."
              />
              <FeatureItem
                title="Bi-Directional Communication"
                desc="Supports interaction between deaf and hearing individuals."
              />
              <FeatureItem
                title="User-Friendly Interface"
                desc="Simple and intuitive design for all age groups."
              />
              <FeatureItem
                title="Multilingual Support"
                desc="Supports English, Hindi, and regional Indian languages."
              />
              <FeatureItem
                title="Cross-Platform"
                desc="Available across web and mobile devices."
              />
              <FeatureItem
                title="AI-Powered Learning"
                desc="Improves over time using machine learning models."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex flex-row gap-6 items-start">
      <Check className="w-4 h-4 mt-2 text-primary" />
      <div className="flex flex-col gap-1">
        <p className="font-medium">{title}</p>
        <p className="text-muted-foreground text-sm">{desc}</p>
      </div>
    </div>
  );
}

export { Feature };
