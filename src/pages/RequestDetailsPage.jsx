import React from 'react';
import PageHeader from '../components/requests/PageHeader';
import { useParams } from 'react-router-dom';
import { requests } from '../lib/requestsData';
import { Clock, ClipboardList, MessageCircle, CheckCircle, ShoppingBag } from 'lucide-react';

function StatusDot({ active, color }) {
  return <div className={`w-3 h-3 rounded-full ${active ? color : 'bg-gray-200'}`} />;
}

export default function RequestDetailsPage() {
  const { id } = useParams();
  const item = requests.find((r) => r.id === id) || requests[0];

  const stages = [
    { key: 'Pending', icon: <Clock className="w-5 h-5" />, text: "We've received your request" },
    { key: 'Confirmed', icon: <ClipboardList className="w-5 h-5" />, text: "We'll confirm availability" },
    { key: 'In Conversation', icon: <MessageCircle className="w-5 h-5" />, text: "We're chatting on WhatsApp" },
    { key: 'Completed', icon: <CheckCircle className="w-5 h-5" />, text: "Request completed" },
  ];

  const currentIndex = stages.findIndex((s) => s.key === item.status);

  return (
    <div className="min-h-screen max-w-[900px] mx-auto px-4">
      <PageHeader title="Request Details" onBack={() => window.history.back()} />

      <main className="py-4 space-y-4">
        <div className="bg-white border border-gray-100 rounded-[14px] p-4">
          <div className="flex items-start gap-3">
            <div className="w-20 h-20 rounded-md bg-gray-200 flex items-center justify-center">
              {item.isCustom ? <ShoppingBag className="w-8 h-8 text-emerald-700" /> : 'IMG'}
            </div>
            <div className="flex-1">
              <div className="text-lg font-semibold text-slate-900">{item.title}</div>
              <div className="text-sm text-gray-500 mt-1">{item.specs}</div>
              <div className="flex items-center justify-between mt-3">
                <div className="text-xs text-gray-500">Requested on {item.date}</div>
                <div className="text-xs px-2 py-1 rounded-full text-emerald-700 bg-emerald-50">{item.status}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-[14px] p-4">
          <div className="text-sm font-semibold text-slate-900 mb-3">Request Status</div>
          <div className="flex items-center gap-3">
            {stages.map((s, idx) => (
              <div key={s.key} className="flex-1 text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${idx <= currentIndex ? 'bg-emerald-50' : 'bg-gray-100'}`}>
                    {s.icon}
                  </div>
                </div>
                <div className={`text-xs ${idx <= currentIndex ? 'text-slate-900' : 'text-gray-400'}`}>{s.text}</div>
              </div>
            ))}
          </div>
        </div>

        {item.status === 'Pending' && (
          <div className="bg-orange-50 border border-orange-100 rounded-[14px] p-4">
            <div className="text-sm font-semibold text-orange-800">Your request is pending confirmation.</div>
            <div className="text-sm text-orange-700 mt-1">We will check availability and get back to you soon on WhatsApp.</div>
          </div>
        )}

        <div className="bg-white border border-gray-100 rounded-[14px] p-4">
          <div className="text-sm font-semibold text-slate-900 mb-3">Request Information</div>
          <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
            <div>
              <div className="text-xs text-gray-500">Requested on</div>
              <div className="font-medium">{item.date} • 10:30 AM</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Quantity</div>
              <div className="font-medium">1</div>
            </div>
            <div className="col-span-2">
              <div className="text-xs text-gray-500">Your Message</div>
              <div className="font-medium">Please let me know the condition and battery health.</div>
            </div>
            <div className="col-span-2 flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500">Contact</div>
                <div className="text-sm font-medium text-emerald-700">+234 801 234 5678</div>
              </div>
              <button className="h-10 px-3 bg-emerald-700 text-white rounded-md">WhatsApp</button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-[14px] p-4">
          <div className="text-sm font-semibold text-slate-900 mb-3">Need Help?</div>
          <div className="text-sm text-gray-600 mb-3">Chat with us on WhatsApp for faster updates about your request.</div>
          <button className="w-full h-12 bg-emerald-700 text-white rounded-md flex items-center justify-center gap-2">WhatsApp Chat</button>
        </div>
      </main>
    </div>
  );
}
