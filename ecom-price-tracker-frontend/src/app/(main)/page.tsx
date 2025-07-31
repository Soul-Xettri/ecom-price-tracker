import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bot, Shield, Zap, Star, TrendingDown } from "lucide-react";
import { CarouselWrapper } from "@/components/containers/CarouselWrapper/index.client";
import { CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Hero from "@/components/custom-ui/hero/index.client";
import CtaOverview from "@/components/custom-ui/cta-overview";

const FeaturesSection = [
  {
    title: "Multi-Platform Tracking",
    description: "Track products across multiple platforms seamlessly.",
    icon: TrendingDown,
  },
  {
    title: "Discord Notifications",
    description:
      "Get instant alerts in your Discord server when prices drop below your target",
    icon: Bot,
  },
  {
    title: "Daily Auto Check",
    description:
      "Automated price monitoring every hour to ensure you never miss a price drop",
    icon: Zap,
  },
  {
    title: "Secure & Reliable",
    description:
      "Your data is encrypted and secure. 99.9% uptime guarantee for continuous monitoring",
    icon: Shield,
  },
];

const Testimonials = [
  {
    name: "Alex Chen",
    role: "Tech Enthusiast",
    feedback:
      "Saved me $200 on a laptop! The Discord notifications are instant and super convenient.",
    rating: 5,
  },
  {
    name: "Sarah Johnson",
    role: "Gamer",
    feedback:
      "Perfect for tracking gaming gear prices. Never miss a Steam sale or hardware discount again!",
    rating: 5,
  },
  {
    name: "Mike Rodriguez",
    role: "Deal Hunter",
    feedback:
      "The interface is so clean and easy to use. Set up tracking for 20+ products in minutes!",
    rating: 5,
  },
  {
    name: "Emily Davis",
    role: "Budget Shopper",
    feedback:
      "I love the daily updates! Helps me stick to my budget while still getting the best deals.",
    rating: 5,
  },
  {
    name: "John Smith",
    role: "Frequent Buyer",
    feedback:
      "This bot is a game changer! I’ve saved hundreds on electronics and home goods.",
    rating: 5,
  },
  {
    name: "Lisa Wong",
    role: "Fashionista",
    feedback:
      "Tracking fashion items has never been easier. I get notified the moment my favorite brands go on sale!",
    rating: 5,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <section className="py-20 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose PriceTracker?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Powerful features designed to help you save money and never miss a
              deal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {FeaturesSection.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-to-br from-cyan-50 to-indigo-50 dark:from-cyan-950 dark:to-indigo-950 cursor-grab"
              >
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Loved by Thousands of Users
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              See what our community has to say
            </p>
          </div>

          <CarouselWrapper>
            <CarouselContent>
              {Testimonials.map((testimonial, index) => (
                <CarouselItem
                  key={index}
                  className="basis-[80%] h-auto md:basis-1/2 lg:basis-1/3"
                >
                  <Card
                    key={index}
                    className="hover:shadow-lg transition-shadow cursor-grab"
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-center mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-5 h-5 text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        "{testimonial.feedback}"
                      </p>
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                          {testimonial.name.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <p className="font-semibold">{testimonial.name}</p>
                          <p className="text-sm text-gray-500">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </CarouselWrapper>
        </div>
      </section>

      {/* CTA Section */}
      <CtaOverview />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">PriceTracker</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-indigo-400 transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-indigo-400 transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-indigo-400 transition-colors">
                Support
              </a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 PriceTracker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
