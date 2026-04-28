"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldAlert } from "lucide-react"

export function Pricing() {
  const tiers = [
    {
      name: "Free",
      price: "€0",
      description: "Basic sound therapy and tracking to start your journey.",
      features: "Standard sounds · Basic tracking",
      buttonText: "Start for free",
      buttonVariant: "outline" as const,
      highlighted: false,
    },
    {
      name: "Pro",
      price: "€12.99",
      period: "/mo",
      description: "The complete clinical programme. Billed at €89.99 yearly.",
      features: "Personalised notch therapy · AI Coach · CBT Modules · Sleep protocols",
      buttonText: "Start 7-day free trial",
      buttonVariant: "default" as const,
      highlighted: true,
      badge: "MOST POPULAR",
    },
    {
      name: "Lifetime",
      price: "€249",
      description: "One-time payment. Forever access to all current and future clinical features.",
      features: "Everything in Pro · Priority support · Family sharing",
      buttonText: "Get Lifetime",
      buttonVariant: "outline" as const,
      highlighted: false,
    },
  ]

  return (
    <section className="py-24 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-24"
        >
          <h2 className="font-serif text-3xl md:text-5xl font-medium tracking-tight mb-6">
            Invest in your silence.
          </h2>
          <p className="text-lg text-muted-foreground">
            Less than the cost of one clinical audiology visit. Cancel anytime.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
          {tiers.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative ${tier.highlighted ? 'z-10' : ''}`}
            >
              {tier.highlighted && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <span className="bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {tier.badge}
                  </span>
                </div>
              )}
              <Card className={`h-full flex flex-col ${tier.highlighted ? 'border-primary shadow-lg scale-105 bg-background relative' : 'border-border/50 bg-background/50 hover:bg-background transition-colors'}`}>
                <CardHeader className="text-center pb-8 pt-8">
                  <CardTitle className="text-2xl mb-2">{tier.name}</CardTitle>
                  <div className="flex items-baseline justify-center gap-1 mb-4">
                    <span className="text-5xl font-serif font-medium">{tier.price}</span>
                    {tier.period && <span className="text-muted-foreground">{tier.period}</span>}
                  </div>
                  <CardDescription className="text-base h-12">
                    {tier.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow text-center pb-8">
                  <p className="text-sm font-medium text-foreground bg-muted/50 py-3 px-4 rounded-lg inline-block text-balance">
                    {tier.features}
                  </p>
                </CardContent>
                <CardFooter className="pt-0 pb-8">
                  <Button variant={tier.buttonVariant} className="w-full" size="lg">
                    {tier.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 flex items-center justify-center text-sm text-muted-foreground gap-2"
        >
          <ShieldAlert className="h-4 w-4" />
          <span>30-day money-back guarantee. If your THI score doesn&apos;t drop, we refund you.</span>
        </motion.div>
      </div>
    </section>
  )
}
