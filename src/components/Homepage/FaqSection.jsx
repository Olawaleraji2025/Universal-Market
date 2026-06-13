import { ChevronDown } from "lucide-react";
import { useState } from "react";

export const FAQItem = ({ question, answer, isOpen }) => {
  const [open, setOpen] = useState(Boolean(isOpen));

  const toggleOpen = () => setOpen((prev) => !prev);

  return (
    <div className="border border-gray-200 rounded-lg mb-4 bg-white">
      <button
        type="button"
        className="w-full flex items-center justify-between p-4 text-left font-medium text-gray-800"
        onClick={toggleOpen}
      >
        {question}
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="px-4 pb-4 text-sm text-gray-500 leading-relaxed">{answer}</div>
      )}
    </div>
  );
};

export const FaqSection = () => (
  <section className="px-6 py-20 max-w-3xl mx-auto">
    <h2 className="text-3xl font-bold text-[#01241a] text-center mb-12">Common Questions</h2>

    <FAQItem
      isOpen={true}
      question="Are the products brand new?"
      answer="We specialize in high-quality pre-owned (secondhand) electronics. Each item is thoroughly tested and graded (e.g., Like New, Very Good) so you know exactly what you're buying."
    />

    <FAQItem
      isOpen={false}
      question="Is there a warranty?"
      answer="Yes, we provide a limited warranty on all verified items."
    />

    <FAQItem
      isOpen={false}
      question="Can I pay on delivery?"
      answer="We offer various payment options including secure pickup and pay."
    />
  </section>
);



