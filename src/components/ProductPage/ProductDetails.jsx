import { useMemo, useState } from "react";
import { Package } from "lucide-react";
import useShopProducts from "../../Hooks/useShopProducts";  
import { useSelector } from "react-redux";

import Button from "../ui/button";
import RequestModal from "./RequestModal";


export  const ProductDetails = (
  // title = "iPhone 13 Pro 256GB",
  // description =
  //   "A premium iPhone 13 Pro with excellent condition. Ideal for everyday performance and creative work.",
  // priceLabel = "₦485,000",
  // keySpecifications = [
  //   "Storage: 256GB",
  //   "Condition: Like New",
  //   "Battery: Excellent",
  //   "Color: Graphite",
  // ],
  // whatsappMessage =
  //   "Hi, I’m interested in this product. Please share more details and availability.",
  // images = {clickedProduct.ImageName},
  // requestWhatsAppNumber = "2348000000000",
) => {
const clickedProduct = useSelector((state) => state.productDetailsClicked?.clickedProduct);
console.log({clickedProduct})


  const [activeIndex, setActiveIndex] = useState(0);
  const [requestOpen, setRequestOpen] = useState(false);


  const activeImage = clickedProduct.imageUrl;
  const Specs = clickedProduct.ProductSpecification
;

  // const whatsappHref = useMemo(() => {
  //   const text = encodeURIComponent(whatsappMessage);
  //   // WA deep link: https://wa.me/<number>?text=<message>
  //   return `https://wa.me/${requestWhatsAppNumber}?text=${text}`;
  // }, [requestWhatsAppNumber, whatsappMessage]);

  return (
    <section className="px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Images */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="aspect-[4/3] w-full">
                <img
                  src={activeImage}
                  alt={clickedProduct.ProductName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={img + idx}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    className={
                      "shrink-0 rounded-xl overflow-hidden border transition " +
                      (isActive
                        ? "border-[#064e3b]"
                        : "border-gray-200 hover:border-gray-300")
                    }
                    aria-label={`Thumbnail ${idx + 1}`}
                  >
                    <img
                      src={img}
                      alt={`${title} thumbnail ${idx + 1}`}
                      className="w-20 h-16 object-cover"
                    />
                  </button>
                );
              })}
            </div> */}
          </div>

          {/* Info */}
          <div className="space-y-5">
            <div>
              <h1 className="text-3xl font-bold text-[#01241a]">{clickedProduct.ProductName}</h1>
              <p className="text-xl font-bold text-[#01241a] mt-2">
                #{clickedProduct.ProductPrice}
              </p>
            </div>

            {/* <p className="text-gray-600 leading-relaxed">{clickedProduct.ProductDescription}</p> */}

            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <h3 className="font-semibold text-[#01241a] mb-3">
                Key specifications
              </h3>
              <ul className="space-y-2 text-gray-700">
                {Specs.map((spec, idx) => (
                  <li key={spec + idx} className="flex items-start gap-2">
                    <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-[#064e3b]" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <Button
                asChild={false}
                className="w-full bg-[#064e3b] text-white py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-emerald-900 transition"
                onClick={() => setRequestOpen(true)}
              >
                <Package size={16} /> Request Item
              </Button>

              <RequestModal
                // open={requestOpen}
                // onClose={() => setRequestOpen(false)}
                // productTitle={title}
                // priceLabel={priceLabel}
                // whatsappMessage={whatsappMessage}
                // requestWhatsAppNumber={requestWhatsAppNumber}
              />


              <p className="text-center text-sm text-gray-600">
                Product negotiation continues on WhatsApp.
              </p>

              {/* Optional: if you want the button to open WhatsApp, we keep the href here for easy wiring */}
              <a
                className="hidden"
                // href={whatsappHref}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp link
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

