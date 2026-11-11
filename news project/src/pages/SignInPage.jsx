import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiMoon,
  FiSun,
} from "react-icons/fi";
import { signIn } from "../lib/auth";

const SignInPage = ({ isDarkMode, onToggleTheme }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { state } = useLocation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await signIn(email, password);
      navigate("/");
    } catch (signInError) {
      setError(signInError.message || "Unable to sign in. Please check your credentials.");
      console.error("Sign-in failed:", signInError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 lg:grid lg:grid-cols-2">
      <aside className="hidden bg-gray-50 p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
        <Link to="/" className="text-2xl font-bold tracking-tight text-orange-600">
        </Link>
        <div className="mx-auto max-w-lg">
          <p className="text-3xl font-semibold leading-snug tracking-tight text-gray-900 xl:text-4xl">
            “Maqaal kasta oo weyn wuxuu ka bilaabmaa fikrad mudan in la wadaago.”
          </p>
   
        </div>
        </aside>

      <section className="flex min-h-screen items-center justify-center px-6 py-10 sm:px-12 lg:px-14 xl:px-20">
        <div className="w-full max-w-md">
          <div className="mb-10 flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600"
            >
       
            </Link>
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {isDarkMode ? (
                <FiSun className="h-5 w-5" aria-hidden="true" />
              ) : (
                <FiMoon className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
          <div className="mb-10">
           
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Sign in to your account
            </h1>
            <p className="mt-3 text-gray-500">
              Enter your credentials below to continue writing and reading.
            </p>
          </div>

          {state?.message && (
            <div
              role="status"
              className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
            >
              {state.message}
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="w-full rounded-xl border border-gray-200 bg-blue-50 px-4 py-3.5 text-gray-900 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={isPasswordVisible ? "text" : "password"}
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-gray-200 bg-blue-50 px-4 py-3.5 pr-12 text-gray-900 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible((visible) => !visible)}
                  aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {isPasswordVisible ? (
                    <FiEyeOff className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <FiEye className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">Must be at least 6 characters.</p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gray-950 px-4 py-3.5 font-semibold text-white shadow-sm transition hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-500/25 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Signing in..." : "Sign in"}
              {!isLoading && <FiArrowRight aria-hidden="true" />}
            </button>
          </form>

          <p className="mt-8 border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
            Don&apos;t Already have an account{" "}
            <Link
              to="/signup"
              className="font-semibold text-gray-900 hover:text-orange-600"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default SignInPage;
