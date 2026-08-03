import './index.css'
import './App.css'

import { Navbar } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { Routes, Route, useLocation } from 'react-router-dom'
import { HomePage } from './components/Homepage/LandingPage';
import ShopPage from './components/Shop/ShopPage';
import { ProductPage } from './components/ProductPage/ProductPage';
import { Toaster } from './components/ui/sonner';
// import PracticeApp from './components/ForPractice/PracticeApp';
// import { RetryDemo } from './components/Practice';
import ErrorModal from '../src/components/Layout/ErrorModal';

function ScrollToTop() {
  const { pathname } = useLocation();
  window.scrollTo(0, 0);
  return null;
}

const App = () => {
  {/* <Practice /> */}
  return (
    <>
    {/* <RetryDemo /> */}
      <Navbar />
      <div className="min-h-screen bg-[#f8fafc] font-sans text-gray-900">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductPage />} />

        </Routes>
      </div>
      <Footer />
      <Toaster richColors />
    </>
  );
};

export default App;
