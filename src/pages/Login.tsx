import { useState } from 'react';
import { auth, db } from '../firebase';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAuthResult = async (user: any, nameOverwrite?: string) => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        name: nameOverwrite || user.displayName || 'User',
        email: user.email,
        role: 'customer',
        createdAt: Date.now()
      });
    }
    navigate('/dashboard');
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await handleAuthResult(result.user);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isSignUp) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await handleAuthResult(result.user, name);
      } else {
        const result = await signInWithEmailAndPassword(auth, email, password);
        await handleAuthResult(result.user);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#FDFBF7]">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-sm border border-[#E8E2D6]">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold font-serif text-[#2D3621]">
            {isSignUp ? 'Create account' : 'Welcome back'}
          </h2>
          <p className="mt-2 text-center text-sm text-[#8B8B8B]">
            Or{' '}
            <button onClick={() => setIsSignUp(!isSignUp)} className="font-bold text-[#A0522D] hover:underline">
              {isSignUp ? 'sign in to existing account' : 'create a new account'}
            </button>
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-[#A0522D] p-4 rounded-xl border border-red-100 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-[#E8E2D6] rounded-xl shadow-sm bg-white text-xs font-bold text-[#3D3D3D] hover:bg-[#F9F7F2] uppercase tracking-widest transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Sign {isSignUp ? 'up' : 'in'} with Google
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E8E2D6]" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-[#8B8B8B]">
            <span className="px-2 bg-white">Or continue with email</span>
          </div>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-bold text-[#5C5C5C] uppercase tracking-widest mb-1.5">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#FDFBF7] border border-[#E8E2D6] rounded-xl focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F] py-3 px-4 text-sm outline-none transition-colors"
                  placeholder="Full name"
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-[#5C5C5C] uppercase tracking-widest mb-1.5">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FDFBF7] border border-[#E8E2D6] rounded-xl focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F] py-3 px-4 text-sm outline-none transition-colors"
                placeholder="Email address"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5C5C5C] uppercase tracking-widest mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#FDFBF7] border border-[#E8E2D6] rounded-xl focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F] py-3 px-4 text-sm outline-none transition-colors"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="mt-6 w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl text-xs font-bold uppercase tracking-widest text-white bg-[#556B2F] hover:bg-[#2D3621] transition-colors"
            >
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
