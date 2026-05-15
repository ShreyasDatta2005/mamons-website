import { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Package, Truck, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        try {
          // Fetch Profile
          const profSnap = await getDoc(doc(db, 'users', u.uid));
          if (profSnap.exists()) setProfile(profSnap.data());

          // Fetch Orders
          const qOrders = query(collection(db, 'orders'), where('userId', '==', u.uid));
          const snapOrders = await getDocs(qOrders);
          setOrders(snapOrders.docs.map(doc => ({ id: doc.id, ...doc.data() })));

          // Fetch Requests
          const qReq = query(collection(db, 'distributor_requests'), where('userId', '==', u.uid));
          const snapReq = await getDocs(qReq);
          setRequests(snapReq.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (err) {
          console.error("Dashboard error:", err);
        } finally {
          setLoading(false);
        }
      } else {
        navigate('/login');
      }
    });

    return () => unsub();
  }, [navigate]);

  if (loading) {
    return <div className="flex-grow flex items-center justify-center text-[#5C5C5C]">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 w-full flex-grow">
      
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between border-b border-[#E8E2D6] pb-6">
        <div>
          <h1 className="text-4xl font-bold font-serif text-[#2D3621] mb-2">My Dashboard</h1>
          <p className="text-[#8B8B8B] text-sm">Welcome back, <span className="font-bold text-[#A0522D]">{profile?.name || user?.email}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Orders Section */}
        <div className="bg-white border border-[#E8E2D6] p-8 rounded-3xl shadow-sm flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#F2EDE4] text-[#556B2F] flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-[#2D3621] font-serif">My Orders</h2>
          </div>
          
          {orders.length === 0 ? (
            <div className="bg-[#FDFBF7] border border-[#E8E2D6] rounded-2xl p-8 text-center text-[#8B8B8B] text-sm flex-grow flex items-center justify-center">
              You haven't placed any orders yet.
            </div>
          ) : (
            <div className="space-y-4 flex-grow">
              {orders.map(order => (
                <div key={order.id} className="bg-[#FDFBF7] border border-[#E8E2D6] rounded-2xl p-6 transition-shadow hover:shadow-md">
                  <div className="flex justify-between items-start mb-4 pb-4 border-b border-[#E8E2D6]">
                    <div>
                      <p className="text-[10px] text-[#A2A2A2] uppercase tracking-widest font-bold mb-1">ORDER #{order.id.slice(0, 8)}</p>
                      <p className="text-sm font-semibold text-[#3D3D3D]">{format(new Date(order.createdAt), 'MMM dd, yyyy')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#2D3621] font-bold text-lg">${order.totalAmount.toFixed(2)}</p>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mt-2
                        ${order.status === 'delivered' ? 'bg-[#556B2F]/10 text-[#556B2F]' : 
                          order.status === 'processing' ? 'bg-[#A0522D]/10 text-[#A0522D]' : 
                          'bg-[#E8E2D6] text-[#5C5C5C]'}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-xs">
                        <span className="text-[#5C5C5C] font-medium">{item.name} <span className="text-[#8B8B8B] ml-1">x{item.quantity}</span></span>
                        <span className="text-[#3D3D3D] font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Distributor Requests Section */}
        <div className="bg-[#556B2F] text-white p-8 rounded-3xl shadow-xl flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold font-serif">Partnership Requests</h2>
          </div>
          
          {requests.length === 0 ? (
            <div className="bg-white/10 border border-white/20 rounded-2xl p-8 text-center text-white/70 text-sm flex-grow flex items-center justify-center">
              You haven't submitted any partnership requests.
            </div>
          ) : (
            <div className="space-y-4 flex-grow">
              {requests.map(req => (
                <div key={req.id} className="bg-white/10 border border-white/20 rounded-2xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{req.companyName}</h3>
                      <p className="text-[10px] text-white/60 uppercase tracking-widest font-bold mt-1">Applied as <span className="text-white">{req.partnerType}</span></p>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest
                      ${req.status === 'approved' ? 'bg-[#556B2F] border border-[#C9D6B3] text-[#C9D6B3]' : 
                        req.status === 'rejected' ? 'bg-red-900/30 text-red-200' : 
                        'bg-white text-[#556B2F]'}`}>
                      {req.status === 'pending' ? <Clock className="w-3 h-3 mr-1" /> : null}
                      {req.status}
                    </span>
                  </div>
                  <div className="pt-4 border-t border-white/20 text-xs text-white/80 flex justify-between">
                    <span>{req.city}</span>
                    <span>{format(new Date(req.createdAt), 'MMM dd, yyyy')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
