import { useState } from "react";
import Button from "../ui/button";

export const CustomOrderCTA = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleRequest = () => {
    // Placeholder behavior (no backend yet)
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section className="px-6 pb-20">
      <div className="max-w-7xl mx-auto bg-[#01241a] rounded-3xl p-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Don't See What You Need?</h2>
          <p className="text-emerald-100/60">Tell us your spec, and we'll source it for you.</p>
          {submitted && (
            <p className="mt-3 text-sm text-emerald-100/80">Request received. We'll get back to you shortly.</p>
          )}
        </div>

        <Button
          type="button"
          className="bg-[#6ee7b7] text-[#01241a] px-10 py-4 rounded-full font-bold hover:bg-emerald-300 transition"
          onClick={handleRequest}
        >
          Request Custom Order
        </Button>
      </div>
    </section>
  );
};

