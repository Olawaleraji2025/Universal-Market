import Button from "/src/components/ui/button.jsx";
import WhatsAppButton from "/src/components/ui/WhatsAppButton.jsx";
import { useNavigate } from 'react-router-dom'

// Hero is rendered inside AnimatedSection which provides entrance animation
export const Hero = () => {
    const navigate = useNavigate();

  return (<>
  <section className="px-6 py-12 md:py-20 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
    <div>
      <h1 className="text-[31px] text-xl md:text-5xl font-bold text-[#01241a] leading-tight mb-6">
        Buy Quality Pre-Owned Gadgets & Appliances You Can Trust
      </h1>
      <p className="text-[14px] text-gray-500 md:text-lg mb-8 max-w-md">
        Verified devices, tested appliances, and direct WhatsApp support for smooth transactions. No middlemen, no surprises.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button className="bg-[#01241a] text-white px-8 py-4 rounded-md font-semibold hover:bg-black transition" size="lg"
        onClick={() => navigate('/shop')}
        >
          Browse Products
        </Button>
        <WhatsAppButton className="bg-[#22c55e] text-white px-8 py-4 rounded-md font-semibold hover:bg-emerald-600 transition" size="lg" />
      </div>
    </div>
    
    <div className="hidden md:relative md:flex">
      <div className="">
        <img 
          src="./src/assets/images/Hero-image.webp" 
          alt="Gadgets montage" 
          className="rounded-2xl w-full h-100 object-cover"
        />
        {/* <div className="absolute bottom-10 -left-6 bg-[#99f6e4] p-4 rounded-xl shadow-lg">
          <p className="text-2xl font-bold text-[#01241a]">₦150k+</p>
          <p className="text-xs text-emerald-800 font-medium">Items Sold Locally</p>
        </div> */}
      </div>
    </div>
  </section>
  </>
)};