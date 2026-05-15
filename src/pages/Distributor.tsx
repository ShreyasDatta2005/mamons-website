import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Briefcase, Handshake, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Distributor() {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    contactNumber: '',
    city: '',
    partnerType: 'Retailers'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUser(u));
    return () => unsub();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please login first to apply as a partner.");
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await addDoc(collection(db, 'distributor_requests'), {
        userId: user.uid,
        ...formData,
        status: 'pending',
        createdAt: Date.now()
      });
      setSuccess(true);
      setFormData({ companyName: '', contactNumber: '', city: '', partnerType: 'Retailers' });
    } catch (err: any) {
      setError(err.message || 'Failed to submit application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow bg-[#FDFBF7]">
      <div className="bg-[#E8E2D6] py-16 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-[#2D3621] mb-6">Trade Partner Program</h1>
          <p className="text-sm md:text-base text-[#5C5C5C] max-w-2xl mx-auto leading-relaxed">
            We're inviting retailers, distributors, super stockists & wholesalers to partner with us in spreading the joy of healthy snacking worldwide.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-2xl font-bold text-[#2D3621] font-serif mb-8">Benefits to our Trade Partners</h2>
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="shrink-0 w-12 h-12 bg-[#F2EDE4] text-[#A0522D] rounded-full flex items-center justify-center">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#3D3D3D]">High earning potential</h3>
                <p className="text-[#8B8B8B] text-sm mt-1">Excellent margins and support for scalable growth in key markets.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="shrink-0 w-12 h-12 bg-[#F2EDE4] text-[#A0522D] rounded-full flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#3D3D3D]">Dedicated Account Manager</h3>
                <p className="text-[#8B8B8B] text-sm mt-1">Personalized assistance to ensure smooth operations and mutual success.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="shrink-0 w-12 h-12 bg-[#F2EDE4] text-[#A0522D] rounded-full flex items-center justify-center">
                <Handshake className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#3D3D3D]">Marketing Support</h3>
                <p className="text-[#8B8B8B] text-sm mt-1">Regular supply of promotional materials such as posters, danglers, and digital assets.</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-3xl shadow-xl border border-[#E8E2D6] p-8">
            <h3 className="text-2xl font-bold text-[#2D3621] font-serif mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-[#A0522D]/10 text-[#A0522D] rounded-full flex items-center justify-center text-xl">🤝</span>
              Apply Now
            </h3>
            
            {!user && (
              <div className="bg-[#F9F7F2] text-[#A0522D] p-4 rounded-2xl mb-6 text-sm border border-[#E8E2D6]">
                You must be <Link to="/login" className="font-bold underline">logged in</Link> to submit a partnership application.
              </div>
            )}
            
            {success ? (
              <div className="bg-[#556B2F]/10 text-[#556B2F] p-8 rounded-3xl text-center border border-[#556B2F]/20">
                <p className="font-serif font-bold text-xl mb-2">Application Submitted!</p>
                <p className="text-sm">Thank you for your interest. Our team will review your application and contact you shortly.</p>
                <button 
                  onClick={() => setSuccess(false)}
                  className="mt-6 text-[#556B2F] font-bold text-[10px] uppercase tracking-widest underline"
                >
                  Submit another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="text-[#A0522D] text-sm bg-red-50 p-4 rounded-xl border border-red-100">{error}</div>}
                
                <div>
                  <label className="block text-xs font-bold text-[#5C5C5C] uppercase tracking-widest mb-1.5">Company Name</label>
                  <input 
                    required 
                    type="text" 
                    name="companyName" 
                    value={formData.companyName} 
                    onChange={handleChange}
                    className="w-full border-[#E8E2D6] bg-[#FDFBF7] rounded-xl focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F] py-3 px-4 border text-sm outline-none"
                    placeholder="Enter your company name"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-[#5C5C5C] uppercase tracking-widest mb-1.5">Contact Number</label>
                  <input 
                    required 
                    type="tel" 
                    name="contactNumber" 
                    value={formData.contactNumber} 
                    onChange={handleChange}
                    className="w-full border-[#E8E2D6] bg-[#FDFBF7] rounded-xl focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F] py-3 px-4 border text-sm outline-none"
                    placeholder="10-digit mobile number"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-[#5C5C5C] uppercase tracking-widest mb-1.5">City</label>
                  <input 
                    required 
                    type="text" 
                    name="city" 
                    value={formData.city} 
                    onChange={handleChange}
                    className="w-full border-[#E8E2D6] bg-[#FDFBF7] rounded-xl focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F] py-3 px-4 border text-sm outline-none"
                    placeholder="Enter your city"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-[#5C5C5C] uppercase tracking-widest mb-1.5">Partnering As</label>
                  <select 
                    name="partnerType" 
                    value={formData.partnerType} 
                    onChange={handleChange}
                    className="w-full border-[#E8E2D6] bg-[#FDFBF7] rounded-xl focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F] py-3 px-4 border text-sm outline-none"
                  >
                    <option value="Retailers">Retailer</option>
                    <option value="Distributors">Distributor</option>
                    <option value="Super_Stockists">Super Stockist</option>
                    <option value="Wholesalers">Wholesaler</option>
                  </select>
                </div>
                
                <button 
                  type="submit" 
                  disabled={loading || !user}
                  className="w-full bg-[#A0522D] text-white font-bold py-4 rounded-xl mt-6 text-xs uppercase tracking-widest hover:bg-[#8B4513] transition-colors disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Request Partnership'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
