import React from 'react';
import { auth, googleProvider } from '../firebaseConfig';
import { signInWithPopup } from 'firebase/auth';

interface SignInProps {
    onSignIn: () => void;
}

const SignIn: React.FC<SignInProps> = ({ onSignIn }) => {
    const [error, setError] = React.useState('');

    const handleGoogleSignIn = async () => {
        setError('');
        try {
            await signInWithPopup(auth, googleProvider);
            onSignIn();
        } catch (err: any) {
            setError('Google sign-in failed. Please try again.');
        }
    };

    return (
        <main className="flex flex-col items-center justify-center flex-grow w-full text-center animate-fade-in">
            <div className="w-full max-w-md p-px mx-auto rounded-2xl bg-gradient-to-b from-blue-500/50 via-blue-800/20 to-transparent shadow-2xl shadow-blue-900/40">
                <div className="bg-[#0c142b]/80 backdrop-blur-2xl rounded-[15px] p-8 text-white">
                    <h1 className="mb-2 text-3xl font-bold text-white">Welcome Back</h1>
                    <p className="mb-8 text-gray-400">Sign in to continue your dive into facts.</p>
                    {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}
                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full py-3 mt-2 font-bold text-white transition-all transform rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:scale-105 shadow-[0_4px_20px_rgba(59,130,246,0.4)] hover:shadow-blue-500/50 flex items-center justify-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24" height="24" className="mr-2"><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.22l6.85-6.85C36.36 2.34 30.57 0 24 0 14.64 0 6.4 5.48 2.44 13.44l7.98 6.21C12.36 13.13 17.73 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.5c0-1.64-.15-3.22-.43-4.75H24v9.02h12.44c-.54 2.92-2.18 5.39-4.64 7.07l7.2 5.6C43.6 37.36 46.1 31.44 46.1 24.5z"/><path fill="#FBBC05" d="M10.42 28.65c-1.13-3.36-1.13-6.94 0-10.3l-7.98-6.21C.86 16.36 0 20.07 0 24c0 3.93.86 7.64 2.44 11.06l7.98-6.21z"/><path fill="#EA4335" d="M24 48c6.57 0 12.36-2.17 16.99-5.93l-7.2-5.6c-2.01 1.35-4.57 2.13-7.79 2.13-6.27 0-11.64-3.63-14.58-8.94l-7.98 6.21C6.4 42.52 14.64 48 24 48z"/></svg>
                        Continue with Google
                    </button>
                </div>
            </div>
        </main>
    );
};

export default SignIn;
