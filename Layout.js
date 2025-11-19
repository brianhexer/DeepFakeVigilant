import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Shield, Home, Menu, X, Settings, LogIn, LogOut, UserCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, [location.pathname]);

  const checkAuth = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await base44.auth.logout();
      window.location.href = createPageUrl("SignIn");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const handleSignIn = () => {
    navigate(createPageUrl("SignIn"));
  };

  const isAdmin = user && (user.role === 'admin' || user.admin_level === 'primary' || user.admin_level === 'secondary');

  const noHeaderFooterPages = ["SignIn", "Terms", "Privacy", "PDFReport"];
  const showHeaderFooter = !noHeaderFooterPages.includes(currentPageName);

  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />
      <style>{`
        :root {
          --primary-blue: #0D47A1;
          --secondary-blue: #1976D2;
          --accent-blue: #64B5F6;
          --light-blue: #E3F2FD;
        }
        
        .gradient-bg {
          background: linear-gradient(135deg, var(--light-blue) 0%, rgba(255,255,255,0.8) 100%);
        }
        
        .floating-animation {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .pulse-blue {
          animation: pulse-blue 3s infinite;
        }
        
        @keyframes pulse-blue {
          0%, 100% { box-shadow: 0 0 0 0 rgba(13, 71, 161, 0.4); }
          50% { box-shadow: 0 0 0 10px rgba(13, 71, 161, 0); }
        }

        .scanner-bar {
          height: 3px;
          background: linear-gradient(90deg, transparent, rgba(13, 71, 161, 0.8), transparent);
          width: 100%;
          animation: scan 3s linear infinite;
          border-radius: 3px;
        }

        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @media (max-width: 768px) {
          .floating-animation {
            animation: none;
            padding-top: 2rem;
          }
        }

        /* Enhanced floating effects for all cards */
        .card {
          transition: all 0.3s ease;
        }
        
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }
        
        /* Additional floating effects */
        .floating-card {
          animation: gentle-float 4s ease-in-out infinite;
        }
        
        @keyframes gentle-float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-8px) scale(1.02); }
        }
      `}</style>

      {/* Header */}
      {showHeaderFooter && (
        <header className="border-b border-gray-100 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link to={createPageUrl("Home")} className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center pulse-blue">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    DeepFakeVigilant
                  </span>
                  <span className="text-xs text-gray-500 -mt-1">AI-Powered Detection</span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                <Link to={createPageUrl("Home")} 
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Home
                </Link>
                <Link to={createPageUrl("Contact")} 
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Contact
                </Link>
                <Link to={createPageUrl("Research")} 
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Research
                </Link>
                <Link to={createPageUrl("About")} 
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  About
                </Link>
                {isAdmin && (
                  <Link to={createPageUrl("AdminPortal")} 
                        className="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Admin Portal
                  </Link>
                )}
              </nav>

              <div className="hidden md:flex items-center space-x-4">
                {!loading && (
                  <>
                    {user ? (
                      <>
                        <span className="text-sm text-gray-600 flex items-center gap-2">
                          <UserCircle className="w-4 h-4" />
                          {user.full_name || user.email}
                        </span>
                        <Button onClick={handleSignOut} variant="outline" size="sm">
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <Button onClick={handleSignIn} variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <LogIn className="w-4 h-4 mr-2" />
                        Sign In
                      </Button>
                    )}
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open menu</span>
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-100 bg-white">
              <div className="px-4 py-3 space-y-3">
                <Link to={createPageUrl("Home")} onClick={() => setMobileMenuOpen(false)}
                      className="block text-gray-700 hover:text-blue-600 font-medium py-2">
                  Home
                </Link>
                <Link to={createPageUrl("Contact")} onClick={() => setMobileMenuOpen(false)}
                      className="block text-gray-700 hover:text-blue-600 font-medium py-2">
                  Contact
                </Link>
                <Link to={createPageUrl("Research")} onClick={() => setMobileMenuOpen(false)}
                      className="block text-gray-700 hover:text-blue-600 font-medium py-2">
                  Research
                </Link>
                <Link to={createPageUrl("About")} onClick={() => setMobileMenuOpen(false)}
                      className="block text-gray-700 hover:text-blue-600 font-medium py-2">
                  About
                </Link>
                {isAdmin && (
                  <Link to={createPageUrl("AdminPortal")} onClick={() => setMobileMenuOpen(false)}
                        className="block text-gray-700 hover:text-blue-600 font-medium py-2 flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Admin Portal
                  </Link>
                )}
                {!loading && (
                  <div className="pt-3 border-t border-gray-200">
                    {user ? (
                      <>
                        <div className="text-sm text-gray-600 py-2 flex items-center gap-2">
                          <UserCircle className="w-4 h-4" />
                          {user.full_name || user.email}
                        </div>
                        <Button onClick={handleSignOut} variant="outline" size="sm" className="w-full">
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <Button onClick={handleSignIn} variant="default" size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                        <LogIn className="w-4 h-4 mr-2" />
                        Sign In
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      {showHeaderFooter && (
        <footer className="bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-bold text-gray-900">DeepFakeVigilant</span>
                </div>
                <p className="text-gray-600 text-sm max-w-md">
                  Advanced AI-powered deepfake detection using CNN-ELA-GAN Fusion with Semantic Consistency Check analysis. 
                  Protecting digital authenticity with cutting-edge technology.
                </p>
                <div className="mt-4">
                  <Link to={createPageUrl("Home")}>
                    <Button variant="outline" size="sm">
                      <Home className="w-4 h-4 mr-2" />
                      Home
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Legal</h4>
                <div className="space-y-2">
                  <Link to={createPageUrl("Terms")} className="block text-sm text-gray-600 hover:text-blue-600">
                    Terms & Conditions
                  </Link>
                  <Link to={createPageUrl("Privacy")} className="block text-sm text-gray-600 hover:text-blue-600">
                    Privacy Policy
                  </Link>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Support</h4>
                <div className="space-y-2">
                  <Link to={createPageUrl("Home")} className="block text-sm text-gray-600 hover:text-blue-600">
                    Home
                  </Link>
                  <Link to={createPageUrl("Contact")} className="block text-sm text-gray-600 hover:text-blue-600">
                    Contact Us
                  </Link>
                  <Link to={createPageUrl("About")} className="block text-sm text-gray-600 hover:text-blue-600">
                    About Us
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600">
                © 2025 NetzSpaz / DeepFakeVigilant. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}