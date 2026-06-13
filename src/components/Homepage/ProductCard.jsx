import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/supabaseClient';
import { useNavigate } from 'react-router-dom'


import { Package } from "lucide-react";
import Button from "/src/components/ui/button.jsx";

 const fetchProducts = async () => {
  // 1. Get all text data from the 'products' table
  const { data: products, error } = await supabase
    .from('ProductInformation')
    .select('*'); // '*' means "Get every column"

    if (error) throw error;
    
    // 2. For each product, create the Public URL for its image
    // We use .map() to go through the list and add the URL to each item
    const productsWithImages = products.map((product) => {
      const { data } = supabase.storage
      .from('Items images')
      .getPublicUrl(product.ImageName);
      
    // We return the product info PLUS the new image URL
    return {
      ...product,
      imageUrl: data.publicUrl,
    };
  });
  
  
  console.log({productsWithImages })
  return productsWithImages;
};


export const ProductCard = () => {
  const navigate = useNavigate();

  const { data: products, isLoading, error } = useQuery({

    queryKey: ['products'],
    queryFn: fetchProducts
  });

  if (isLoading) return <p>Loading the shop...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (

   <section className="px-6 py-16 mx-auto">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-[#01241a]">Fresh Arrivals</h2>
          <p className="text-gray-500 mt-2">Handpicked items that just landed in our shop.</p>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product, id) => (
        <div
          key={id}
          className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition flex flex-col h-full"
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
            <p className="text-xl font-bold text-[#01241a] mb-4">₦{product.ProductPrice}</p>
            <Button
              type="button"
              onClick={() => navigate('/shop/products')}
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



