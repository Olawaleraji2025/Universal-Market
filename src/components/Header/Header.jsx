
import { LuLogIn, LuUserPlus } from "react-icons/lu";
import Button from "/src/components/ui/button.jsx";
import { useNavigate } from 'react-router-dom'


export const Navbar = () => {

  const navigate = useNavigate();
  
  return(
    <>
    <nav className="flex items-center justify-between px-6 py-4 bg-white">
    <div className="flex items-center gap-2">
      
      <span className="font-bold text-xl text-[#01241a] cursor-pointer"
              onClick={() => navigate('/')}
      
      >Universal Market

      </span>
    </div>
    
    <div className="hidden md:flex items-center gap-8 font-medium text-gray-600">
      <a href="#" className="hover:text-emerald-600 "
      onClick={() => navigate('/shop')}
      >Shop</a>
      <a href="#" className="hover:text-emerald-600 transition">Contact</a>
      <a href="#" className="hover:text-emerald-600 transition">About</a>
    </div>

    <div className="flex items-center gap-4">
     
      <Button variant="default" size="sm">
        <LuLogIn className="mr-1" />
        Login
      </Button>
      <Button variant="secondary" size="sm">
        <LuUserPlus className="mr-1" />
        Sign up
      </Button>
    </div>
  </nav>
    </>
  )
  


};