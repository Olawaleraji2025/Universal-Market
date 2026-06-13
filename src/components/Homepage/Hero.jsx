import { motion} from "framer-motion";
import Button from "/src/components/ui/button.jsx";


export const Hero = () => (
  <motion.section className="px-6 py-12 md:py-20 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center"
  initial={{ opacity: 0 }} 
      animate={{ opacity: 1}}
      transition={{ 
    duration: 1,      // How many seconds the journey takes
    delay: 1,         // Wait for 1 second before starting
    type: "spring",   // Make it bounce like a spring
    stiffness: 100    // How "strong" the spring is
  }}
  
  >
    <div>
      <h1 className="text-xl md:text-5xl font-bold text-[#01241a] leading-tight mb-6">
        Buy Quality Pre-Owned Gadgets & Appliances You Can Trust
      </h1>
      <p className="text-gray-500 text-lg mb-8 max-w-md">
        Verified devices, tested appliances, and direct WhatsApp support for smooth transactions. No middlemen, no surprises.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button className="bg-[#01241a] text-white px-8 py-4 rounded-md font-semibold hover:bg-black transition" size="lg">
          Browse Products
        </Button>
        <Button className="bg-[#22c55e] text-white px-8 py-4 rounded-md font-semibold flex items-center justify-center gap-2 hover:bg-emerald-600 transition" size="lg" >
          {/* <MessageCircle size={20} /> */}
          Chat on WhatsApp
        </Button>
      </div>
    </div>
    
    <div className="relative">
      <div className="bg-[#ccfbf1] rounded-3xl p-4 overflow-hidden shadow-xl">
        <img 
          src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800" 
          alt="Gadgets montage" 
          className="rounded-2xl w-full h-100 object-cover"
        />
        <div className="absolute bottom-10 -left-6 bg-[#99f6e4] p-4 rounded-xl shadow-lg">
          <p className="text-2xl font-bold text-[#01241a]">₦150k+</p>
          <p className="text-xs text-emerald-800 font-medium">Items Sold Locally</p>
        </div>
      </div>
    </div>
  </motion.section>
);