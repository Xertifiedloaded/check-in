import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaGoogle, FaGithub } from 'react-icons/fa';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        ...credentials,
        redirect: false,
      });

      if (result.error) {
        setError(result.error);
      } else {
        router.push('/');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProviderSignIn = (provider) => {
    signIn(provider, { callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Welcome Back</h2>
          <p className="text-sm text-center text-gray-600 mb-8">
            Sign in to your account to continue
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                name="email"
                type="email"
                placeholder="Email address"
                value={credentials.email}
                onChange={handleChange}
                className="w-full px-3 placeholder:text-xs py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={credentials.password}
                onChange={handleChange}
                className="w-full px-3 placeholder:text-xs py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <button
              type="submit"
              className={`w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg ${
                loading ? 'opacity-75 cursor-not-allowed' : 'hover:from-purple-700 hover:to-pink-700'
              }`}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {error && (
            <div className="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
              <p>{error}</p>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between">
            <span className="border-b w-1/5 lg:w-1/4"></span>
            <span className="text-xs text-center text-gray-500 uppercase">or login with</span>
            <span className="border-b w-1/5 lg:w-1/4"></span>
          </div>

          <div className="mt-4 flex flex-col space-y-4">
            <button
              onClick={() => handleProviderSignIn('google')}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <FaGoogle className="w-5 h-5 mr-2 text-red-500" />
              <span>Sign in with Google</span>
            </button>
            <button
              onClick={() => handleProviderSignIn('github')}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <FaGithub className="w-5 h-5 mr-2 text-gray-800" />
              <span>Sign in with GitHub</span>
            </button>
          </div>
        </div>
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-600 text-center">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-purple-600 hover:underline font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;