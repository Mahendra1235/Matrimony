import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from './Frontend/pages/Home';
import Register from './Frontend/pages/Register';
import Matches from './Frontend/pages/MatchList';
import Profile from './Frontend/pages/Profile';
import Header from './Frontend/components/Header';
import About from './Frontend/pages/About';
import Login from './Frontend/pages/Login';
import ViewMatchList from './Frontend/pages/ViewMatchList';
import Support from './Frontend/pages/Support';
import FAQCreateProfile from './Frontend/pages/FAQCreateProfile';
import FAQContactMatch from './Frontend/pages/FAQContactMatch';
import FAQTechnicalIssues from './Frontend/pages/FAQTechnicalIssues';
import Admin from './Frontend/pages/AdminPage';
import ForgotPassword from './Frontend/pages/ForgotPassword';
import ResetPassword from './Frontend/pages/ResetPassword';

function App() {
  const location = useLocation();

  return (
    <>
      {location.pathname !== '/login' && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/register" element={<Register />} />
        <Route path="/support" element={<Support />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/viewmatchlist/:id" element={<ViewMatchList />} />
        <Route path="/faq/create-profile" element={<FAQCreateProfile />} />
        <Route path="/faq/contact-match" element={<FAQContactMatch />} />
        <Route path="/faq/technical-issues" element={<FAQTechnicalIssues />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />


      </Routes>
    </>
  );
}

function AppWithRouter() {
  return (
    <Router>
      <App /> 
    </Router>
  );
}

export default AppWithRouter;
