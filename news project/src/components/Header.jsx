import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
  FaUserPlus,
} from "react-icons/fa";
import { FiLogOut, FiMoon, FiSun, FiUser } from "react-icons/fi";
import { CiMenuBurger } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { useAuth } from "../context/AuthContext";

const Header = ({ isDarkMode, onToggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isLoggedIn, profile, user, logout } = useAuth();
  const navigate = useNavigate();

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const handleLogout = async () => {
    closeMenus();
    await logout();
    navigate("/signin", { replace: true });
  };

  const navLinkClass =
    "inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-900 hover:border-orange-500";
  const mobileLinkClass =
    "block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-orange-700 hover:bg-gray-100";
  const themeToggle = (
    <button
      type="button"
      onClick={onToggleTheme}
      aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
      title={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
    >
      {isDarkMode ? (
        <FiSun className="h-5 w-5" aria-hidden="true" />
      ) : (
        <FiMoon className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );

  return (
    <header className="bg-white shadow">
      <div className="border-b border-gray-100 px-4 sm:px-6 lg:px-8 dark:border-gray-700">
        <div className="mx-auto flex h-[4.5rem]  justify-between">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link
                to={isLoggedIn ? "/dashboard" : "/"}
                onClick={closeMenus}
                className="flex flex-col leading-none text-gray-950 dark:text-white"
              >
                <span className="text-2xl font-black tracking-tight"><span className="text-blue-700"></span> Dashboard</span>
              </Link>
            </div>

            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8" aria-label="Main navigation">
              <Link to="/" className={navLinkClass}>Home</Link>
              <Link to="/about" className={navLinkClass}>All stories</Link>
              {isLoggedIn && (
                <>
                  <Link to="/create" className={navLinkClass}>Write</Link>
                  <Link to="/manage" className={navLinkClass}>Read</Link>
                </>
              )}
            </nav>
          </div>

          <div className="hidden sm:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <div className="relative">
                  <button
                    type="button"
                    aria-label="Open account menu"
                    aria-expanded={isDropdownOpen}
                    onClick={() => setIsDropdownOpen((open) => !open)}
                    className="flex justify-center items-center h-8 w-8 rounded-full bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    {profile?.avatar_url ? (
                      <img
                        className="h-8 w-8 rounded-full object-cover"
                        src={profile.avatar_url}
                        alt=""
                      />
                    ) : (
                      <FaUser className="text-gray-600" aria-hidden="true" />
                    )}
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl z-50">
                      <div className="flex items-center gap-3 p-5">
                        {profile?.avatar_url ? (
                          <img
                            className="h-11 w-11 rounded-full object-cover"
                            src={profile.avatar_url}
                            alt=""
                          />
                        ) : (
                          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-100 text-orange-700">
                            <FaUser aria-hidden="true" />
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-900">
                            Hello, {profile?.username || "there"}
                          </p>
                          <p className="truncate text-sm text-gray-500">
                            {user?.email}
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-gray-100 py-2">
                        <Link
                          to="/profile"
                          onClick={closeMenus}
                          className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <FiUser className="text-gray-400" aria-hidden="true" />
                          Profile
                        </Link>
                      </div>

                      <div className="border-t border-gray-100 py-2">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                        >
                          <FiLogOut className="text-gray-400" aria-hidden="true" />
                          Log out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  <FaSignInAlt aria-hidden="true" /> Sign In
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 border text-sm font-medium text-orange-600 bg-white rounded-md border-orange-600 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  <FaUserPlus aria-hidden="true" /> Sign Up
                </Link>
              </>
            )}
            {themeToggle}
          </div>

          <div className="flex items-center sm:hidden">
            {themeToggle}
            <button
              type="button"
              aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((open) => !open)}
              className="inline-flex items-center p-2 rounded-md text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {isMenuOpen ? (
                <IoMdClose className="h-6 w-6" aria-hidden="true" />
              ) : (
                <CiMenuBurger className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <nav className="sm:hidden py-4" aria-label="Mobile navigation">
          <div>
            <Link to="/" onClick={closeMenus} className={mobileLinkClass}>Home</Link>
            <Link to="/about" onClick={closeMenus} className={mobileLinkClass}>About</Link>
          </div>

          {isLoggedIn ? (
            <div className="pt-2 pb-4">
              <Link to="/dashboard" onClick={closeMenus} className={mobileLinkClass}>Dashboard</Link>
              <Link to="/profile" onClick={closeMenus} className={`${mobileLinkClass} flex items-center gap-2`}>
                <FaUser aria-hidden="true" /> Your Profile
              </Link>
              <Link to="/create" onClick={closeMenus} className={mobileLinkClass}>Write</Link>
              <Link to="/manage" onClick={closeMenus} className={mobileLinkClass}>
                Read
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className={`${mobileLinkClass} flex w-full items-center gap-2 text-left`}
              >
                <FaSignOutAlt aria-hidden="true" /> Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-2 pb-4">
              <Link to="/signin" onClick={closeMenus} className={`${mobileLinkClass} flex items-center gap-2`}>
                <FaSignInAlt aria-hidden="true" /> Sign In
              </Link>
              <Link to="/signup" onClick={closeMenus} className={`${mobileLinkClass} flex items-center gap-2`}>
                <FaUserPlus aria-hidden="true" /> Sign Up
              </Link>
            </div>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
