import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Orders from './pages/Orders'
import Categories from './pages/Categories'
import CategoryPage from './pages/CategoryPage'
import ProductDetail from './pages/ProductDetail'
import Checkout from './pages/Checkout'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

function UserLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Admin routes — no navbar */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* User routes — with navbar */}
          <Route path="/" element={<UserLayout><Home /></UserLayout>} />
          <Route path="/cart" element={<UserLayout><Cart /></UserLayout>} />
          <Route path="/checkout" element={<UserLayout><Checkout /></UserLayout>} />
          <Route path="/login" element={<UserLayout><Login /></UserLayout>} />
          <Route path="/profile" element={<UserLayout><Profile /></UserLayout>} />
          <Route path="/orders" element={<UserLayout><Orders /></UserLayout>} />
          <Route path="/categories" element={<UserLayout><Categories /></UserLayout>} />
          <Route path="/category/:category" element={<UserLayout><CategoryPage /></UserLayout>} />
          <Route path="/product/:id" element={<UserLayout><ProductDetail /></UserLayout>} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
