import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import { loadUser } from './redux/actions/user';
import { ProtectedRoute } from 'protected-route-react';
import Loader from './components/Layout/Loader/Loader';

const ForgetPassword = lazy(() => import('./components/Auth/ForgetPassword'));
const Login = lazy(() => import('./components/Auth/Login'));
const Register = lazy(() => import('./components/Auth/Register'));
const ResetPassword = lazy(() => import('./components/Auth/ResetPassword'));
const Contact = lazy(() => import('./components/Auth/Contact/Contact'));
const Courses = lazy(() => import('./components/Courses/Courses'));
const Home = lazy(() => import('./components/Home/Home'));
const Footer = lazy(() => import('./components/Layout/Footer/Footer'));
const Header = lazy(() => import('./components/Layout/Header/Header'));
const Request = lazy(() => import('./components/Request/Request'));
const About = lazy(() => import('./components/About/About'));
const Subscribe = lazy(() => import('./components/Payments/Subscribe'));
const PaymentFail = lazy(() => import('./components/Payments/PaymentFail'));
const PaymentSuccess = lazy(() => import('./components/Payments/PaymentSuccess'));
const NotFound = lazy(() => import('./components/Layout/NotFound/NotFound'));
const CoursePage = lazy(() => import('./components/CoursePage/CoursePage'));
const Profile = lazy(() => import('./components/Profile/Profile'));
const ChangePassword = lazy(() => import('./components/Profile/ChangePassword'));
const UpdateProfile = lazy(() => import('./components/Profile/UpdateProfile'));
const Dashboard = lazy(() => import('./components/Admin/Dashboard/Dashboard'));
const CreateCourse = lazy(() => import('./components/Admin/CreateCourse/CreateCourse'));
const AdminCourses = lazy(() => import('./components/Admin/AdminCourses/AdminCourses'));
const Users = lazy(() => import('./components/Admin/Users/Users'));
const RecommendedCourses = lazy(() => import('./components/Courses/RecommendedCourses'));

function App() {
  const { isAuthenticated, user, message, error, loading } = useSelector(
    state => state.user
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: 'clearError' });
    }
    if (message) {
      toast.success(message);
      dispatch({ type: 'clearMessage' });
    }
  }, [dispatch, error, message]);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <Router future={{
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  }}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Header isAuthenticated={isAuthenticated} user={user} />
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/recommend" element={<RecommendedCourses />} />

              <Route
                path="/course/:id"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <CoursePage user={user} />
                  </ProtectedRoute>
                }
              />

              <Route path="/contact" element={<Contact />} />
              <Route path="/request" element={<Request />} />
              <Route path="/about" element={<About />} />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <Profile user={user} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/changepassword"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <ChangePassword />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/updateprofile"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <UpdateProfile user={user} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/login"
                element={
                  <ProtectedRoute isAuthenticated={!isAuthenticated} redirect="/profile">
                    <Login />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <ProtectedRoute isAuthenticated={!isAuthenticated} redirect="/profile">
                    <Register />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/forgetpassword"
                element={
                  <ProtectedRoute isAuthenticated={!isAuthenticated} redirect="/profile">
                    <ForgetPassword />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resetpassword/:token"
                element={
                  <ProtectedRoute isAuthenticated={!isAuthenticated} redirect="/profile">
                    <ResetPassword />
                  </ProtectedRoute>
                }
              />
              <Route path="/subscribe" element={<Subscribe />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/paymentsuccess" element={<PaymentSuccess />} />
              <Route path="/paymentfail" element={<PaymentFail />} />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute adminRoute={true} isAuthenticated={isAuthenticated} isAdmin={user && user.role === 'admin'}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/createcourse"
                element={
                  <ProtectedRoute adminRoute={true} isAuthenticated={isAuthenticated} isAdmin={user && user.role === 'admin'}>
                    <CreateCourse />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/courses"
                element={
                  <ProtectedRoute adminRoute={true} isAuthenticated={isAuthenticated} isAdmin={user && user.role === 'admin'}>
                    <AdminCourses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute adminRoute={true} isAuthenticated={isAuthenticated} isAdmin={user && user.role === 'admin'}>
                    <Users />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
          <Footer />
          <Toaster
            toastOptions={{
              style: {
                fontFamily: "'DM Sans', sans-serif",
                borderRadius: '10px',
                fontSize: '14px',
              },
            }}
          />
        </>
      )}
    </Router>
  );
}

export default App;