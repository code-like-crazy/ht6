"use client";

import { FAQ } from "./faq";
import { Footer } from "./footer";
import { Hero } from "./hero";
import { Navbar } from "./navbar";
import { WhatItIs } from "./what-it-is";
import { WhatMakesUsDifferent } from "./what-makes-us-different";

export function LandingPage() {
  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <WhatItIs />
        <WhatMakesUsDifferent />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
