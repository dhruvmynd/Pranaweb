import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { AuthProvider } from '@/contexts/auth-context';
import { ProfileProvider } from '@/contexts/profile-context';
import { LoadingProvider } from '@/contexts/loading-context';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ChatBot } from '@/components/chat/chat-bot';
import { StructuredData } from '@/components/seo/structured-data';
import { CookieConsent } from '@/components/cookie/cookie-consent';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { initializeGA, pageview } from '@/lib/analytics/google-analytics';
import { useLoading } from '@/contexts/loading-context';

// Pages
import { HomePage } from '@/pages/home';
import { LoginPage } from '@/pages/auth/login';
import { RegisterPage } from '@/pages/auth/register';
import { AuthCallbackPage } from '@/pages/auth/callback';
import { VerifyPage } from '@/pages/auth/verify';
import { ResetPasswordPage } from '@/pages/auth/reset-password';
import { PranayamaPage } from '@/pages/pranayama';
import { DashboardPage } from '@/pages/dashboard';
import { ContactPage } from '@/pages/contact';
import { BlogListPage } from '@/pages/blog/blog-list';
import { BlogPostPage } from '@/pages/blog/blog-post';
import { AdminLayout } from '@/pages/admin/admin-layout';
import { AnalyticsPage } from '@/pages/admin/analytics/analytics-page';
import { GoogleAnalyticsPage } from '@/pages/admin/analytics/google-analytics';
import { PostList } from '@/pages/admin/blog/post-list';
import { PostForm } from '@/pages/admin/blog/post-form';
import { ProfilePage } from '@/pages/profile';
import { VisionPage } from '@/pages/vision';
import { LeadershipPage } from '@/pages/leadership';
import { FAQPage } from '@/pages/faq';
import { PrivacyPage } from '@/pages/privacy';
import { TermsPage } from '@/pages/terms';
import { InvestorPage } from '@/pages/investor';
import { AppLaunchPage } from '@/pages/app-launch';

// Create router with future flags enabled
const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

function AppLayout() {
  const location = useLocation();
  const { isLoadingSpinnerVisible, resetLoading } = useLoading();
  const hideNavbar = ['/auth/reset-password', '/auth/verify', '/auth/callback', '/investor'].includes(location.pathname);
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    initializeGA();
  }, []);

  useEffect(() => {
    // Reset loading state when navigating to a new page
    if (location.pathname !== prevPathRef.current) {
      resetLoading();
      prevPathRef.current = location.pathname;
    }
    
    pageview(location.pathname + location.search);
  }, [location, resetLoading]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {isLoadingSpinnerVisible && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
      <StructuredData />
      {!hideNavbar && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/auth/verify" element={<VerifyPage />} />
          <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
          <Route path="/pranayama" element={<PranayamaPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/vidhya" element={<BlogListPage />} />
          <Route path="/vidhya/:slug" element={<BlogPostPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/vision" element={<VisionPage />} />
          <Route path="/leadership" element={<LeadershipPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/app" element={<AppLaunchPage />} />
          <Route path="/investor" element={<InvestorPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/analytics" replace />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="google-analytics" element={<GoogleAnalyticsPage />} />
            <Route path="blog" element={<PostList />} />
            <Route path="blog/new" element={<PostForm />} />
            <Route path="blog/edit/:id" element={<PostForm />} />
            <Route path="ai" element={<div />} />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!hideNavbar && <Footer />}
      <ChatBot />
      <CookieConsent />
    </div>
  );
}

function App() {
  return (
    <Router {...router}>
      <LoadingProvider>
        <AuthProvider>
          <ProfileProvider>
            <AppLayout />
          </ProfileProvider>
        </AuthProvider>
      </LoadingProvider>
    </Router>
  );
}

export default App;