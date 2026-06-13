import { MdOutlineWorkspacePremium, MdOutlineVerified } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";

export const Cards = () => (
  
    <section className="bg-[#01241a] text-white py-20 px-6">
             <div className="text-center mb-6">
                <h2 className="text-3xl font-bold">Why you should Trusts Us</h2>
                <p className="text-emerald-100/60">We've built our reputation on honesty and quality.</p>
              </div>
    <div className="grid md:grid-cols-3 mb-8 gap-8 text-center">
      <div className="market-info-card">
        <div className="bg-[#60e9c2] p-4 rounded-xl">
        <MdOutlineWorkspacePremium className="trust-icons"/>
        </div>
        <p>Premium Quality</p>
        <span>100% inspected and certified hardware with our signature guarantee.</span>
      </div>

      <div className="market-info-card">
        <div className="bg-[#60e9c2] p-4 rounded-xl">
          
        <MdOutlineVerified className="trust-icons" />
        </div>
        <p>Verified Sellers</p>
        <span>We only partner with trusted, vetted vendors in the Ibadan community.</span>
      </div>

      <div className="market-info-card">
        <div className="bg-[#60e9c2] p-4 rounded-xl">
        <TbTruckDelivery className="trust-icons"/>
        </div>
        <p > Delivery and Pickup</p>
        <span>Seamless doorstep collection and delivery across all of Ibadan.</span>
      </div>
    </div>
          </section>
    );
