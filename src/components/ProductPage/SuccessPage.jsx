
import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom'
import { clearClickedProduct } from "../../features/shop/productDetailsClicked";
import { resetFlow } from "../../features/shop/FlowContext";
import { resetForm } from "../../features/shop/formValidation";

export function SuccessPage() {

  const clickedProduct = useSelector(
    (state) => state.productDetailsClicked?.clickedProduct
  );


  const guestFormState = useSelector((state) => state.guestForm.formData);

  const requestDate = new Date().toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const requestId = new Date().getTime();


  const navigate = useNavigate();
const dispatch = useDispatch()
  // reset local UI state and navigate back to shop
  const handleContinueShopping = () => {
    dispatch(clearClickedProduct())
    dispatch(resetFlow("chooser"));
    dispatch(resetForm());
    navigate("/shop");
  }
  
 if (!clickedProduct) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Request Submitted Successfully</h2>
          <p className="mt-2 text-sm text-gray-600">We couldn’t load the product details. Please return to the shop.</p>
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => {
              dispatch(clearClickedProduct());
              dispatch(resetFlow("chooser"));
              dispatch(resetForm());
              navigate("/shop");
            }}
            className="px-6 py-3.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
          >
            Back to shop
          </button>
        </div>
      </div>
    );
  }

  return (

    <div className="space-y-6">
      {/* Success Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.6, delay: 0.1 }}
        className="flex justify-center"
      >
        <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center">
          <motion.svg
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-10 h-10 text-teal-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </motion.svg>
        </div>
      </motion.div>

      {/* Success Message */}
      <div className="text-center">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-2xl font-bold text-gray-900"
        >
          Request Submitted Successfully
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-2 text-sm text-gray-600"
        >
          We've received your request and will continue the conversation on WhatsApp shortly.
        </motion.p>
      </div>

      {/* Request Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4"
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-xl overflow-hidden">
            <img
              src={clickedProduct.imageUrl}
              alt={clickedProduct.ProductName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 mb-1">
              {clickedProduct.ProductName}
            </h3>
            <p className="text-sm text-gray-600">
              Request Date: {requestDate}
            </p>
            <div className="mt-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">
                Status: {clickedProduct.ProductStatus}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600 space-y-1">
            <p><span className="font-medium text-gray-900">Request ID:</span> UM-{requestId}</p>
            <p><span className="font-medium text-gray-900">Contact:</span> {guestFormState.contact}</p>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="space-y-3"
      >
        <motion.button
        //   onClick={handleWhatsApp}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full px-6 py-3.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-600/30 flex items-center justify-center gap-2"
        >
          <FaWhatsapp className="w-5 h-5" aria-hidden />
          Open WhatsApp
        </motion.button>

        <motion.button
          onClick={handleContinueShopping}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full px-6 py-3.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
        >
          Continue Shopping
        </motion.button>


        {/* <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full px-6 py-3.5 bg-white text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors"
        >
          View Request History
        </motion.button> */}
      </motion.div>
    </div>
  );
}