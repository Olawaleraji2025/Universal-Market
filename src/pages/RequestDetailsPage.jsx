import React, { useState } from 'react';
import PageHeader from '../components/requests/PageHeader';
import { useParams, useNavigate } from 'react-router-dom';
import useUserRequests from '../Hooks/useUserRequests';
import { Clock, ClipboardList, MessageCircle, CheckCircle, ShoppingBag, ArrowLeft, Send } from 'lucide-react';
import { TbCurrencyNaira } from 'react-icons/tb';
import { buildWhatsAppUrl, WHATSAPP_NUMBER } from '../lib/whatsappConfig';
import SkeletonCard from '../components/ui/SkeletonLoader';
import Button from '../components/ui/button';

export default function RequestDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: requests = [], isLoading } = useUserRequests();
  const [imageError, setImageError] = useState(false);

  const item =
    requests.find((r) => String(r.id) === String(id)) ||
    (requests.length > 0 ? requests[0] : null);

  const isProductRequest =
    (item?.ReqType || item?.reqType || '')?.trim()?.toLowerCase() === 'product request' ||
    Boolean(item?.isProductRequest) ||
    (!item?.isCustom && Boolean(item?.ProductImage));

  const showProductImage = isProductRequest && Boolean(item?.ProductImage) && !imageError;

  const rawPrice = isProductRequest
    ? (item?.ItemPrice ?? item?.price ?? item?.ProductPrice ?? null)
    : (item?.ItemBudget ?? item?.budget ?? item?.budgetPrice ?? null);

  const priceLabel = isProductRequest ? 'Item Price' : 'Budget Price';

  const formatPrice = (val) => {
    if (val == null || val === '') return null;
    const cleanNum = typeof val === 'number' ? val : Number(String(val).replace(/[^0-9.-]+/g, ''));
    if (!Number.isNaN(cleanNum) && cleanNum > 0) {
      return cleanNum.toLocaleString();
    }
    return String(val);
  };

  const formattedPrice = formatPrice(rawPrice);

  const stages = [
    { key: 'Pending', icon: <Clock className="w-5 h-5" />, text: "We've received your request" },
    { key: 'Confirmed', icon: <ClipboardList className="w-5 h-5" />, text: "We'll confirm availability" },
    { key: 'In Conversation', icon: <MessageCircle className="w-5 h-5" />, text: "We're chatting on WhatsApp" },
    { key: 'Completed', icon: <CheckCircle className="w-5 h-5" />, text: "Request completed" },
  ];

  const currentStatus = item?.status || 'Pending';
  const currentIndex = Math.max(
    0,
    stages.findIndex((s) => s.key.toLowerCase() === currentStatus.toLowerCase())
  );

  const handleOpenWhatsApp = () => {
    const msg = `Hello Universal Market, I am following up on my request "${item?.title || 'Custom Request'}" at ₦${item?.price} .`;
    const url = buildWhatsAppUrl(WHATSAPP_NUMBER, msg);
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen max-w-[900px] mx-auto px-4 py-4 space-y-4">
        <PageHeader title="Request Details" onBack={() => navigate('/my-requests')} />
        <SkeletonCard variant="request-detail" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen max-w-[900px] mx-auto px-4 py-8">
        <PageHeader title="Request Details" onBack={() => navigate('/my-requests')} />
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-lg font-semibold text-gray-800">Request not found</p>
          <p className="mt-1 text-sm text-gray-500">The request you're looking for does not exist or has been removed.</p>
          <Button
            type="button"
            onClick={() => navigate('/my-requests')}
            className="mt-4 bg-[#064e3b] text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Requests
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-[900px] mx-auto px-4 pb-16">
      <PageHeader title="Request Details" onBack={() => navigate('/my-requests')} />

      <main className="py-4 space-y-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-emerald-50 border border-emerald-100/60 flex items-center justify-center shrink-0 overflow-hidden">
              {showProductImage ? (
                <img
                  src={item.ProductImage}
                  alt={item.title || 'Product'}
                  className="w-full h-full object-cover rounded-xl"
                  onError={() => setImageError(true)}
                />
              ) : (
                <ShoppingBag className="w-8 h-8 text-emerald-700" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-lg font-bold text-slate-900 truncate">{item.title}</div>
              <div className="text-sm text-gray-600 mt-1 line-clamp-2">{item.category}</div>
              <div className="flex items-center justify-between mt-3 gap-2 flex-wrap">
                <div className="text-xs text-gray-500">Requested on {item.date}</div>
                <div className="flex items-center gap-2">
                  {/* {formattedPrice && (
                    <div className="text-xs px-2 py-0.5 rounded-full font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/60 flex items-center">
                      <TbCurrencyNaira className="w-3.5 h-3.5 -mr-0.5" />
                      <span>{formattedPrice}</span>
                    </div>
                  )} */}
                  <div className="text-xs px-2.5 py-1 rounded-full font-medium text-emerald-800 bg-emerald-50 border border-emerald-200/50">
                    {item.status}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Price / Budget Box */}
        {/* <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <TbCurrencyNaira className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">
                {priceLabel}
              </div>
              <div className="text-lg font-bold text-slate-900 flex items-center mt-0.5">
                {formattedPrice ? (
                  <>
                    <TbCurrencyNaira className="w-5 h-5 text-emerald-700 -mr-0.5" />
                    <span>{formattedPrice}</span>
                  </>
                ) : (
                  <span className="text-sm font-normal text-gray-400">Not specified</span>
                )}
              </div>
            </div>
          </div>
          <div className="text-xs px-3 py-1 rounded-full font-medium bg-emerald-50 text-emerald-800 border border-emerald-100">
            {isProductRequest ? 'Product Request' : 'Custom Request'}
          </div>
        </div> */}

        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-xs">
          <div className="text-sm font-semibold text-slate-900 mb-3">Request Status</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stages.map((s, idx) => {
              const isPastOrCurrent = idx <= (currentIndex === -1 ? 0 : currentIndex);
              return (
                <div key={s.key} className="text-center p-2 rounded-xl bg-gray-50/50">
                  <div className="flex items-center justify-center mb-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isPastOrCurrent ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {s.icon}
                    </div>
                  </div>
                  <div
                    className={`text-xs font-medium ${
                      isPastOrCurrent ? 'text-slate-900' : 'text-gray-400'
                    }`}
                  >
                    {s.text}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {item.status === 'Pending' && (
          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4">
            <div className="text-sm font-semibold text-orange-800">Your request is pending confirmation.</div>
            <div className="text-sm text-orange-700 mt-1">We will check availability and get back to you soon on WhatsApp.</div>
          </div>
        )}

        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-xs">
          <div className="text-sm font-semibold text-slate-900 mb-3">Request Information</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <div className="text-xs text-gray-500">Requested on</div>
              <div className="font-medium mt-0.5">{item.date}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Category</div>
              <div className="font-medium mt-0.5">{item.category || 'General'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Request Type</div>
              <div className="font-medium mt-0.5">{isProductRequest ? 'Product Request' : 'Custom Request'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">{priceLabel}</div>
              <div className="font-semibold text-emerald-800 mt-0.5 flex items-center">
                {formattedPrice ? (
                  <>
                    <TbCurrencyNaira className="w-4 h-4 text-emerald-700 -mr-0.5" />
                    <span>{formattedPrice}</span>
                  </>
                ) : (
                  <span className="text-xs font-normal text-gray-400">Not specified</span>
                )}
              </div>
            </div>
            <div className="sm:col-span-2">
              <div className="text-xs text-gray-500">Item Specifications / Message</div>
              <div className="font-medium mt-0.5 bg-gray-50 p-3 rounded-xl border border-gray-100 text-gray-800">
                {item.specs || 'No extra specifications provided.'}
              </div>
            </div>
            {item.contact && (
              <div className="sm:col-span-2 flex items-center justify-between bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                <div>
                  <div className="text-xs text-gray-500">Contact Number</div>
                  <div className="text-sm font-medium text-emerald-800">{item.contact}</div>
                </div>
                <button
                  type="button"
                  onClick={handleOpenWhatsApp}
                  className="h-9 px-3 bg-[#25D366] text-white rounded-lg text-xs font-semibold hover:bg-[#1fb75d] transition"
                >
                  WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-xs">
          <div className="text-sm font-semibold text-slate-900 mb-1">Need Help?</div>
          <div className="text-sm text-gray-600 mb-3">Chat with us on WhatsApp for faster updates about your request.</div>
          <Button
            type="button"
            onClick={handleOpenWhatsApp}
            className="w-full h-11 bg-[#25D366] text-white hover:bg-[#1fb75d] flex items-center justify-center gap-2 font-medium"
          >
            <Send className="w-4 h-4" />
            Chat on WhatsApp
          </Button>
        </div>
      </main>
    </div>
  );
}

