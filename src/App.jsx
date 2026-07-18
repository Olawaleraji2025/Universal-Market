import './index.css'
import './App.css'

import { Navbar } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { Routes, Route, useLocation } from 'react-router-dom'
import { HomePage } from './components/Homepage/LandingPage';
import ShopPage from './components/Shop/ShopPage';
import { ProductPage } from './components/ProductPage/ProductPage';
// import PracticeApp from './components/ForPractice/PracticeApp';


function ScrollToTop() {
  const { pathname } = useLocation();
  window.scrollTo(0, 0);
  return null;
}

const App = () => {
  {/* <Practice /> */}
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#f8fafc] font-sans text-gray-900">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          {/* <Route path="/practice/*" element={<PracticeApp />} /> */}

        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
