import './index.css'
import './App.css'

import { Navbar } from './components/Header/Header';
import { Footer } from './components/Homepage/Footer';
import { Routes, Route, useLocation } from 'react-router-dom'
import { HomePage } from './components/Homepage/LandingPage';
import ShopPage from './components/Shop/ShopPage';
import { ProductPage } from './components/ProductPage/ProductPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  window.scrollTo(0, 0);
  return null;
}

const App = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#f8fafc] font-sans text-gray-900">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product" element={<ProductPage />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;








        {/* Existing homepage sections were commented out; Supabase fetch is shown here */}
        {/* <SupabaseTasks /> */}

    
    // <ShopHero />
    //   <ShopProductList />

    {/* <ProductDetails /> */}
    
    // Admin Dashboard and Products page are still in development, so they are commented out for now.
    {/* <Dashboard /> */}
      {/* <Products /> */}
 

    //  <ProductImage />


    // import SupabaseTasks from './components/supabase.jsx';
// import { ProductImage } from './components/ProductImages.jsx';