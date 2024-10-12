import React from "react";
import FormCreateToken from "@/components/sections/form-create-token";
import RunningTokens from "@/components/sections/running-tokens";

const HomePage: React.FC = () => (
  <main className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
    <section className="space-y-12">
      <RunningTokens />
      <FormCreateToken />
    </section>
  </main>
);

export default HomePage;
