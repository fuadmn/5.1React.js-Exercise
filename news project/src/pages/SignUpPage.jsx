import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiMoon,
  FiSun,
} from "react-icons/fi";
import { signUp } from "../lib/auth";

const SignUpPage = ({ isDarkMode, onToggleTheme }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await signUp(email, password, username);
      navigate("/signin", {
        replace: true,
        state: { message: "Account created. Check your email for verification, then sign in." },
      });
    } catch (signUpError) {
      console.error("Sign-up failed:", signUpError);
      setError(signUpError.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-blue-50 px-4 py-3.5 text-gray-900 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10";

  return (
    <div className="min-h-screen bg-white text-gray-900 lg:grid lg:grid-cols-2">
      <aside className="hidden bg-gray-50 p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
        <Link to="/" className="text-2xl font-bold tracking-tight text-orange-600">
          
          
        </Link>
        <div className="mx-auto max-w-lg">
          <p className="text-3xl font-semibold leading-snug tracking-tight text-gray-900 xl:text-4xl">
            “Fikrad kasta oo wanaagsan waxay mudan tahay in lala wadaago dunida.”
          </p>
 
        </div>
      </aside>

      <section className="flex min-h-screen items-center justify-center px-6 py-10 sm:px-12 lg:px-14 xl:px-20">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-between">
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

          <>
              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                </p>
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Create your account
                </h1>
                <p className="mt-3 text-gray-500">
                  Sign up to share your writing with the community.
                </p>
              </div>

              {error && (
                <div
                  role="alert"
                  className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="username"
                    className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    className={inputClass}
                    placeholder="Your name"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    required
                  />
                </div>

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
                    className={inputClass}
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
                      autoComplete="new-password"
                      className={`${inputClass} pr-12`}
                      placeholder="Create a password"
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

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    Confirm password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={isConfirmPasswordVisible ? "text" : "password"}
                      autoComplete="new-password"
                      className={`${inputClass} pr-12`}
                      placeholder="Enter your password again"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setIsConfirmPasswordVisible((visible) => !visible)}
                      aria-label={isConfirmPasswordVisible ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      {isConfirmPasswordVisible ? (
                        <FiEyeOff className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <FiEye className="h-5 w-5" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gray-950 px-4 py-3.5 font-semibold text-white shadow-sm transition hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-500/25 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? "Creating account..." : "Create account"}
                  {!isLoading && <FiArrowRight aria-hidden="true" />}
                </button>
              </form>

              <p className="mt-8 border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link
                  to="/signin"
                  className="font-semibold text-gray-900 hover:text-orange-600"
                >
                  Sign in
                </Link>
              </p>
          </>
        </div>
      </section>
    </div>
  );
};

export default SignUpPage;
