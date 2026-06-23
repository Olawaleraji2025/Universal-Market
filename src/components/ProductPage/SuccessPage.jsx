
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom'
import { clearClickedProduct } from "../../features/shop/productDetailsClicked";
import { resetFlow } from "../../features/shop/FlowContext";
import { resetForm } from "../../features/shop/formValidation";

 const requestDate = new Date().toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const requestId = new Date().getTime()
console.log(requestId)


export function SuccessPage() {
const clickedProduct = useSelector(
    (state) => state.productDetailsClicked?.clickedProduct
  );

   const guestFormState = useSelector((state) => state.guestForm.formData);

  const navigate = useNavigate();
const dispatch = useDispatch()
  // reset local UI state and navigate back to shop
  const handleContinueShopping = () => {
    dispatch(clearClickedProduct())
    dispatch(resetFlow("chooser"));
    dispatch(resetForm());
    navigate("/shop");
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
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
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