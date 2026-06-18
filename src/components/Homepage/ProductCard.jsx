import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setClickedProduct } from '../../features/shop/productDetailsClicked'
import useShopProducts from "../../Hooks/useShopProducts"; 
import { TbCurrencyNaira } from "react-icons/tb";
import { Package } from "lucide-react";
import Button from "/src/components/ui/button.jsx";



export const ProductCard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: products, isLoading, error } = useShopProducts();

  if (isLoading) return <p>Loading the shop...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (

   <section className="px-6 py-16 mx-auto">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-[#01241a]">Fresh Arrivals</h2>
          <p className="text-gray-500 mt-2">Handpicked items that just landed in our shop.</p>
    <div className="flex gap-4">
      {products.map((product, id) => (
        <div
          key={id}
          className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition flex flex-col w-3xs"
onClick={() => {
                dispatch(setClickedProduct(product));
                navigate('/product');
              }}
        >
          <div className="relative aspect-square">
            <img 
            src={product.imageUrl} 
            alt={product.ProductName}
              className="w-full h-full object-cover"
            />
            <span
              className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${product.ProductStatus === 'In Stock' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
            >
              {product.ProductStatus}
            </span>
          </div>
          <div className="p-4 flex flex-col grow">
            <h3 className="font-semibold text-gray-800 mb-1">{product.ProductName}</h3>
            <p className="text-xl font-bold text-[#01241a] mb-4 flex items-center">
              <TbCurrencyNaira />{product.ProductPrice}</p>
            <Button
              type="button"
              onClick={() => {
                dispatch(setClickedProduct(product));
                navigate('/product');
              }}
              className="mt-auto bg-[#064e3b] text-white w-full py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 hover:bg-emerald-900 transition cursor-pointer"
            >
              <Package size={16} /> View details
            </Button>

          </div>
        </div>
      ))}
    </div>
        </div>

      </section>
  )
};



