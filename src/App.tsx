import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Blog from './pages/Blog';
import Article from './pages/Article';
import Admin from './pages/Admin';
import Services from './pages/Services';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import Works from './pages/Works';
import WorkDetail from './pages/WorkDetail';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"           element={<Home />} />
        <Route path="/services"   element={<Services />} />
        <Route path="/pricing"    element={<Pricing />} />
        <Route path="/contact"    element={<Contact />} />
        <Route path="/works"      element={<Works />} />
        <Route path="/works/:slug" element={<WorkDetail />} />
        <Route path="/blog"       element={<Blog />} />
        <Route path="/blog/:slug" element={<Article />} />
        <Route path="/admin"      element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
