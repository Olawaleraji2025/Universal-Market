
import { Smartphone, Laptop, Tv, Refrigerator, Gamepad2 } from "lucide-react";
import { GiWashingMachine } from "react-icons/gi";

const theIcons = [{ name: "Phones", icon: Smartphone },
  { name: "Laptops", icon: Laptop },
  { name: "TVs", icon: Tv },
  { name: "Refrigerators", icon: Refrigerator },
  { name: "Gaming Consoles", icon: Gamepad2 },
  { name: "Appliances", icon: GiWashingMachine }
];

export const CategoryCard = () => (
  
 <section>
  <div className='flex justify-between items-center mx-11'>
      <h2 className='text-2xl font-bold'>Popular Categories</h2>
      <span className="cursor-pointer text-emerald-900 underline">View all</span>
      </div>
  <div className=" border-gray-100 rounded-xl p-8 flex items-center justify-center gap-4">
    
    
    <div className="flex justify-center p-4 rounded-lg gap-10">
      {theIcons.map((item, index) => (
        <div key={index} className="w-40 flex flex-col items-center gap-2 shadow-sm p-4 rounded-lg bg-gray-200 cursor-pointer hover:transition border hover:border-emerald-400 hover:text-emerald-600  hover:scale-110">
        <item.icon key={index} className="w-6 h-6 cursor-pointer" />
    <p className="text-xs font-medium uppercase tracking-wider">{item.name}</p>
        </div>
      ))}
    </div>
  </div>

</section>
  

);


