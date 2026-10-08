import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  MessageSquare,
  User,
  Phone,
  FileText,
  AlertCircle,
  Package,
  Clock,
  Save,
  CheckCircle,
} from 'lucide-react';
import { useAdminRequest } from '../hooks/useAdminRequest';
import { useUpdateRequest } from '../hooks/useUpdateRequest';
import StatusBadge from '../components/StatusBadge';
import RequestStatusSelect from '../components/RequestStatusSelect';
import WhatsAppButton from '../components/WhatsAppButton';
import ConfirmDialog from '../components/ConfirmDialog';
import { formatNaira, formatDisplayDateTime } from '../lib/requestStatus';

export default function RequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Queries & Mutations
  const { data: request, isLoading, isError, error, refetch } = useAdminRequest(id);
  const updateMutation = useUpdateRequest();

  // Local state
  const [adminNotes, setAdminNotes] = useState('');
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Sync admin notes when request data loads
  useEffect(() => {
    if (request) {
      setAdminNotes(request.admin_notes || '');
    }
  }, [request]);

  const hasNotesChanged = request && (adminNotes.trim() !== (request.admin_notes || '').trim());

  // Handlers
  const handleSaveNotes = () => {
    if (!request || !hasNotesChanged || updateMutation.isPending) return;

    updateMutation.mutate({
      id: request.id,
      admin_notes: adminNotes.trim(),
      isNoteSave: true,
    });
  };

  const handleUpdateStatus = (newStatus) => {
    if (!request || updateMutation.isPending) return;

    updateMutation.mutate({
      id: request.id,
      status: newStatus,
    });
  };

  const handleConfirmCancel = () => {
    if (!request || updateMutation.isPending) return;

    updateMutation.mutate(
      {
        id: request.id,
        status: 'Cancelled',
      },
      {
        onSettled: () => {
          setIsCancelDialogOpen(false);
        },
      }
    );
  };

  // -------------------------------------------------------------
  // LOADING SKELETON STATE
  // -------------------------------------------------------------
  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-10 max-w-6xl mx-auto space-y-6">
        <div className="h-6 w-32 bg-slate-200 rounded animate-pulse" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-48 bg-slate-100 rounded animate-pulse" />
          </div>
          <div className="h-7 w-24 bg-slate-200 rounded-full animate-pulse" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
          <div className="lg:col-span-7 space-y-6">
            <div className="h-48 bg-white border border-[#e2e8f0] rounded-[14px] p-6 animate-pulse" />
            <div className="h-32 bg-white border border-[#e2e8f0] rounded-[14px] p-6 animate-pulse" />
          </div>
          <div className="lg:col-span-5 space-y-6">
            <div className="h-48 bg-white border border-[#e2e8f0] rounded-[14px] p-6 animate-pulse" />
            <div className="h-32 bg-white border border-[#e2e8f0] rounded-[14px] p-6 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // ERROR STATE
  // -------------------------------------------------------------
  if (isError) {
    return (
      <div className="p-4 sm:p-6 lg:p-10 max-w-2xl mx-auto">
        <div className="bg-white border border-rose-200 rounded-[14px] p-8 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-[#01241a]">Failed to load request</h2>
          <p className="mt-1 text-sm text-[#475569]">
            {error?.message || 'We could not fetch this request. Please check your connection and try again.'}
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => refetch()}
              className="min-h-[44px] px-4 py-2.5 rounded-[10px] bg-[#064e3b] text-white text-sm font-semibold hover:bg-emerald-900 transition"
            >
              Retry
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="min-h-[44px] px-4 py-2.5 rounded-[10px] border border-[#e2e8f0] bg-white text-sm font-semibold text-[#01241a] hover:bg-slate-50 transition"
            >
              Back to requests
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // NOT FOUND STATE
  // -------------------------------------------------------------
  if (!request) {
    return (
      <div className="p-4 sm:p-6 lg:p-10 max-w-2xl mx-auto">
        <div className="bg-white border border-[#e2e8f0] rounded-[14px] p-8 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-[#01241a]">This request no longer exists.</h2>
          <p className="mt-1 text-sm text-[#475569]">
            The requested item may have been deleted or the link is invalid.
          </p>
          <div className="mt-5">
            <button
              type="button"
              onClick={() => navigate('/admin/requests')}
              className="min-h-[44px] px-5 py-2.5 rounded-[10px] bg-[#064e3b] text-white text-sm font-semibold hover:bg-emerald-900 transition inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to requests</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Formatting helpers
  const shortId = (String(request.id).replace(/[^a-zA-Z0-9]/g, '').slice(0, 4) || 'REQ1').toUpperCase();
  const formattedDateTime = formatDisplayDateTime(request.created_at);

  const rawAmount = request.isProduct ? request.ItemPrice : request.ItemBudget;
  const formattedAmount = formatNaira(rawAmount);

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-6xl mx-auto space-y-6 pb-24 md:pb-12">
      {/* --------------------------------------------------------- */}
      {/* HEADER                                                    */}
      {/* --------------------------------------------------------- */}
      <div>
        {/* Back Link */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#047857] hover:text-[#064e3b] transition mb-3 focus:outline-none focus:ring-2 focus:ring-[#047857] rounded-md px-1 -ml-1 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to requests</span>
        </button>

        {/* Item Title, Status Badge & Timestamp */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-[28px] font-bold text-[#01241a] tracking-tight leading-tight break-words">
              {request.ItemName}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#475569]">
              Request #{shortId} · {formattedDateTime}
            </p>
          </div>

          <div className="shrink-0 self-start sm:self-center">
            <StatusBadge status={request.status} size="lg" />
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------- */}
      {/* RESPONSIVE LAYOUT                                         */}
      {/* Laptop: 60/40 two-column grid                             */}
      {/* Mobile: 1-column in order: Item, Customer, Status, Notes  */}
      {/* --------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ======================================================== */}
        {/* LEFT COLUMN (60% on laptop)                              */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 space-y-6">
          {/* ITEM CARD */}
          <div className="bg-white border border-[#e2e8f0] rounded-[14px] p-5 sm:p-6 shadow-xs">
            <h2 className="text-sm font-bold text-[#475569] uppercase tracking-wider mb-4">
              Item Details
            </h2>

            <div className="flex flex-col sm:flex-row gap-5">
              {/* Product Photo / Neutral Category Tile */}
              <div className="w-full sm:w-[160px] h-[160px] shrink-0 rounded-[10px] border border-[#e2e8f0] bg-slate-50 overflow-hidden flex items-center justify-center text-center p-3">
                {request.isProduct && request.ItemImage && !imageError ? (
                  <img
                    src={request.ItemImage}
                    alt={request.ItemName}
                    className="w-full h-full object-cover rounded-[8px]"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-[#475569]">
                    <Package className="w-8 h-8 text-slate-400 mb-1" />
                    <span className="text-xs font-semibold text-[#01241a] line-clamp-2">
                      {request.ItemCategory || 'General Item'}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5">
                      {request.isProduct ? 'Product photo' : 'Custom Request'}
                    </span>
                  </div>
                )}
              </div>

              {/* Rows: Type, Category, Price / Budget, View product link */}
              <div className="flex-1 space-y-3">
                <div>
                  <span className="text-xs text-[#475569] block">Type</span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold mt-0.5 ${
                      request.isProduct
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-purple-50 text-purple-800 border border-purple-200'
                    }`}
                  >
                    {request.ReqType || (request.isProduct ? 'Product Request' : 'Custom Request')}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-[#475569] block">Category</span>
                  <span className="text-sm font-semibold text-[#01241a]">
                    {request.ItemCategory || 'Electronics & Appliances'}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-[#475569] block">
                    {request.isProduct ? 'Price' : 'Budget'}
                  </span>
                  <span className="text-base font-bold text-[#01241a]">
                    {formattedAmount ? (
                      request.isProduct ? formattedAmount : `${formattedAmount}`
                    ) : (
                      request.isProduct ? 'Price on request' : 'No budget specified'
                    )}
                  </span>
                </div>

                {request.isProduct && (
                  <div className="pt-1">
                    <Link
                      to={`/product/${request.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#047857] hover:text-[#064e3b] transition focus:outline-none focus:ring-2 focus:ring-[#047857] rounded"
                    >
                      <span>View product</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CUSTOMER MESSAGE CARD */}
          <div className="bg-white border border-[#e2e8f0] rounded-[14px] p-5 sm:p-6 shadow-xs">
            <h2 className="text-sm font-bold text-[#475569] uppercase tracking-wider mb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-800" />
              <span>Customer Message</span>
            </h2>

            {request.ItemDetails && request.ItemDetails.trim() ? (
              <p className="text-sm text-[#01241a] leading-relaxed whitespace-pre-line bg-[#f8fafc] p-4 rounded-[10px] border border-[#e2e8f0]">
                {request.ItemDetails.trim()}
              </p>
            ) : (
              <p className="text-sm text-[#475569] italic bg-[#f8fafc] p-4 rounded-[10px] border border-[#e2e8f0]">
                No message left.
              </p>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN (40% on laptop)                             */}
        {/* 1. Customer Card with WhatsApp Button                    */}
        {/* 2. Status Card with select + update                      */}
        {/* 3. Admin Notes Card with save note                       */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 space-y-6">
          {/* CUSTOMER CARD */}
          <div className="bg-white border border-[#e2e8f0] rounded-[14px] p-5 sm:p-6 shadow-xs">
            <h2 className="text-sm font-bold text-[#475569] uppercase tracking-wider mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-800" />
              <span>Customer Information</span>
            </h2>

            <div className="space-y-3 mb-5">
              <div>
                <span className="text-xs text-[#475569] block">Name</span>
                <span className="text-base font-bold text-[#01241a]">
                  {request.userName}
                </span>
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-[#475569]">
                  {request.isRegisteredUser ? 'Registered user' : 'Guest'}
                </span>
              </div>

              <div>
                <span className="text-xs text-[#475569] block">Phone Number</span>
                <span className="text-sm font-medium text-[#01241a] flex items-center gap-1.5 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-[#475569]" />
                  <span>{request.UserPhoneNumber || 'No phone number given'}</span>
                </span>
              </div>
            </div>

            {/* Main Action: Chat on WhatsApp Button */}
            <WhatsAppButton
              phone={request.UserPhoneNumber}
              status={request.status}
              customerName={request.userName}
              itemName={request.ItemName}
            />
          </div>

          {/* STATUS CARD */}
          <div className="bg-white border border-[#e2e8f0] rounded-[14px] p-5 sm:p-6 shadow-xs">
            <h2 className="text-sm font-bold text-[#475569] uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-800" />
              <span>Update Request Status</span>
            </h2>

            <RequestStatusSelect
              currentStatus={request.status}
              onUpdateStatus={handleUpdateStatus}
              onRequestCancel={() => setIsCancelDialogOpen(true)}
              isUpdating={updateMutation.isPending}
            />
          </div>

          {/* ADMIN NOTES CARD (Private) */}
          {/* <div className="bg-white border border-[#e2e8f0] rounded-[14px] p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-3">
              <label
                htmlFor="admin-private-notes"
                className="text-sm font-bold text-[#475569] uppercase tracking-wider flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-emerald-800" />
                <span>Admin notes (private)</span>
              </label>
              <span className="text-[11px] text-[#475569] bg-slate-100 px-2 py-0.5 rounded">
                Never shown to customer
              </span>
            </div>

            <textarea
              id="admin-private-notes"
              rows={4}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Record internal customer discussions, agreed price, delivery instructions, or supplier updates..."
              className="w-full p-3 bg-white border border-[#e2e8f0] rounded-[10px] text-sm text-[#01241a] placeholder-[#94a3b8] transition focus:outline-none focus:ring-2 focus:ring-[#047857] focus:ring-offset-2 focus:border-[#047857]"
            />

            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={handleSaveNotes}
                disabled={!hasNotesChanged || updateMutation.isPending}
                className="min-h-[44px] px-5 py-2 rounded-[10px] bg-[#064e3b] text-white font-semibold text-sm transition shadow-xs flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#047857] focus:ring-offset-2 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed hover:bg-emerald-900 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{updateMutation.isPending ? 'Saving...' : 'Save note'}</span>
              </button>
            </div>
          </div> */}
        </div>
      </div>

      {/* --------------------------------------------------------- */}
      {/* MOBILE STICKY WHATSAPP ACTION BAR                         */}
      {/* Keeps primary WhatsApp action easily accessible on mobile */}
      {/* --------------------------------------------------------- */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[#e2e8f0] p-3 z-30 shadow-lg">
        <WhatsAppButton
          phone={request.UserPhoneNumber}
          status={request.status}
          customerName={request.userName}
          itemName={request.ItemName}
        />
      </div>

      {/* --------------------------------------------------------- */}
      {/* CANCEL CONFIRMATION DIALOG                                */}
      {/* --------------------------------------------------------- */}
      <ConfirmDialog
        isOpen={isCancelDialogOpen}
        title="Cancel this request?"
        description="The customer will see it as cancelled."
        confirmText="Yes, cancel"
        cancelText="Keep request"
        onConfirm={handleConfirmCancel}
        onCancel={() => setIsCancelDialogOpen(false)}
        isLoading={updateMutation.isPending}
        isDestructive={true}
      />
    </div>
  );
}
