import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

// Home stays in the main bundle (it is the most common entry point). Every other
// route is split out so a visitor landing on /works does not download Home's
// canvas hero, the blog reader and the admin screen before anything renders.
const Services   = lazy(() => import('./pages/Services'));
const Pricing    = lazy(() => import('./pages/Pricing'));
const Contact    = lazy(() => import('./pages/Contact'));
const Works      = lazy(() => import('./pages/Works'));
const WorkDetail = lazy(() => import('./pages/WorkDetail'));
// Layout prototype, kept alongside the live pages until one is chosen.
const WorksV2      = lazy(() => import('./pages/WorksV2'));
const WorkDetailV2 = lazy(() => import('./pages/WorkDetailV2'));
const Blog       = lazy(() => import('./pages/Blog'));
const Article    = lazy(() => import('./pages/Article'));
const Admin      = lazy(() => import('./pages/Admin'));

/** Matches the page background so a route swap never flashes white. */
const RouteFallback = () => <div className="min-h-screen bg-brand-white" />;

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/"            element={<Home />} />
          <Route path="/services"    element={<Services />} />
          <Route path="/pricing"     element={<Pricing />} />
          <Route path="/contact"     element={<Contact />} />
          <Route path="/works"       element={<Works />} />
          <Route path="/works/:slug" element={<WorkDetail />} />
          <Route path="/works-v2"       element={<WorksV2 />} />
          <Route path="/works-v2/:slug" element={<WorkDetailV2 />} />
          <Route path="/blog"        element={<Blog />} />
          <Route path="/blog/:slug"  element={<Article />} />
          <Route path="/admin"       element={<Admin />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
