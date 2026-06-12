"use client";

/**
 * @license: MIT
 * @author: nuno fernandes
 * @Copyright (c) 2026 m-motors. All rights reserved.
 */

// ----- React/Next -----
import { JSX } from "react";
// ----- Icons -----
import { BadgeCheck, ShieldCheck, Wrench, ThumbsUp } from "lucide-react";

// ----- Benefits array -----
const benefits = [
  {
    icon: Wrench,
    title: "Véhicules reconditionnés et garantis",
    description:
      "Chaque véhicule passe par un contrôle technique rigoureux et bénéficie d'une garantie de 12 mois.",
  },
  {
    icon: ThumbsUp,
    title: "Satisfait ou remboursé",
    description:
      "Vous disposez de 15 jours pour tester votre véhicule. Si vous n'êtes pas convaincu, nous vous remboursons.",
  },
  {
    icon: ShieldCheck,
    title: "Contrôle technique offert à vie",
    description:
      "Nous prenons en charge le contrôle technique à chaque échéance, sans frais supplémentaires.",
  },
];

/**
 * Why Us Section Component
 * @description Why Us Section Component
 * @returns JSX.Element - Why Us Section Component
 */
export default function WhyUsSection(): JSX.Element {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <h2 className="text-4xl md:text-8xl font-bold tracking-tight text-gray-900">
            M-Motors
          </h2>
          <div className="mt-3 h-1 w-20 bg-blue-600 mx-auto rounded-full"></div>

          <p className="mt-4 text-gray-500 text-lg">
            Des engagements clairs pour vous accompagner dans votre projet
            automobile
          </p>
        </div>

        {/* Benefits grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-blue-100"
            >
              <div className="flex flex-col items-center text-center">
                {/* Benefit icon */}
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <benefit.icon className="h-8 w-8" strokeWidth={1.8} />
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {benefit.title}
                </h3>

                <p className="text-gray-500 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Additional confidence line */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm text-blue-700">
            <BadgeCheck className="h-4 w-4" />
            <span>Plus de 1 million de clients satisfaits</span>
          </div>
        </div>
      </div>
    </section>
  );
}
