import React, { useState, useEffect } from 'react';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [orders, setOrders] = useState([]);

  // Mock product data
  const products = [
    {
      id: 1,
      name: 'Casual Cotton Shirt',
      price: 29.99,
      image: 'https://placehold.co/300x400/4f46e5/ffffff?text=Casual+Shirt',
      category: 'Shirts',
      description: 'Comfortable cotton shirt for everyday wear',
      stock: 50
    },
    {
      id: 2,
      name: 'Designer Jeans',
      price: 59.99,
      image: 'https://placehold.co/300x400/059669/ffffff?text=Designer+Jeans',
      category: 'Pants',
      description: 'Premium quality designer jeans with perfect fit',
      stock: 30
    },
    {
      id: 3,
      name: 'Summer Dress',
      price: 45.99,
      image: 'https://placehold.co/300x400/dc2626/ffffff?text=Summer+Dress',
      category: 'Dresses',
      description: 'Light and breezy dress perfect for summer days',
      stock: 25
    },
    {
      id: 4,
      name: 'Formal Suit',
      price: 129.99,
      image: 'https://placehold.co/300x400/7c3aed/ffffff?text=Formal+Suit',
      category: 'Suits',
      description: 'Elegant formal suit for special occasions',
      stock: 15
    },
    {
      id: 5,
      name: 'Sports Jacket',
      price: 79.99,
      image: 'https://placehold.co/300x400/ea580c/ffffff?text=Sports+Jacket',
      category: 'Jackets',
      description: 'Lightweight sports jacket for active lifestyle',
      stock: 20
    },
    {
      id: 6,
      name: 'Winter Coat',
      price: 89.99,
      image: 'https://placehold.co/300x400/1e40af/ffffff?text=Winter+Coat',
      category: 'Coats',
      description: 'Warm and stylish winter coat for cold weather',
      stock: 18
    }
  ];

  // Mock user data
  const mockUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+94 77 123 4567', address: 'Colombo, Sri Lanka', cartItems: 2, totalSpent: 89.98 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+94 77 987 6543', address: 'Kandy, Sri Lanka', cartItems: 1, totalSpent: 59.99 },
    { id: 3, name: 'Michael Johnson', email: 'michael@example.com', phone: '+94 77 456 7890', address: 'Galle, Sri Lanka', cartItems: 3, totalSpent: 165.97 }
  ];

  useEffect(() => {
    // Load cart from session storage if available
    const savedCart = sessionStorage.getItem('bhUniqueCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    
    // Load user from session storage if available
    const savedUser = sessionStorage.getItem('bhUniqueUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    setUsers(mockUsers);
  }, []);

  useEffect(() => {
    // Save cart to session storage
    sessionStorage.setItem('bhUniqueCart', JSON.stringify(cart));
  }, [cart]);

  const handleLogin = (e) => {
    e.preventDefault();
    // Mock login - in real app, you would validate against backend
    const mockUser = {
      id: Date.now(),
      name: 'Demo User',
      email: loginForm.email,
      phone: '+94 77 111 2222',
      address: 'Ideman Kinniya, Sri Lanka'
    };
    setUser(mockUser);
    sessionStorage.setItem('bhUniqueUser', JSON.stringify(mockUser));
    setShowLogin(false);
    setLoginForm({ email: '', password: '' });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const newUser = {
      id: Date.now(),
      ...registerForm,
      cartItems: 0,
      totalSpent: 0
    };
    setUser(newUser);
    setUsers([...users, newUser]);
    sessionStorage.setItem('bhUniqueUser', JSON.stringify(newUser));
    setShowRegister(false);
    setRegisterForm({ name: '', email: '', password: '', phone: '', address: '' });
  };

  const handleAddToCart = (product) => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    
    // Show notification
    alert(`Added ${product.name} to cart!`);
  };

  const handleRemoveFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart(cart.map(item => 
      item.id === productId 
        ? { ...item, quantity: newQuantity } 
        : item
    ));
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    const newOrder = {
      id: Date.now(),
      userId: user.id,
      userName: user.name,
      items: cart,
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      date: new Date().toLocaleString(),
      status: 'Pending'
    };
    
    setOrders([...orders, newOrder]);
    setCart([]);
    alert('Order placed successfully! We will contact you via WhatsApp for payment confirmation.');
    
    // In a real app, you would send this data to WhatsApp or email
    console.log('Order details:', newOrder);
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPassword === 'admin123') { // In real app, use proper authentication
      setShowAdmin(true);
    } else {
      alert('Invalid password');
    }
  };

  const sendWhatsAppMessage = (user) => {
    const message = `Hello ${user.name}, thank you for shopping with BH Unique! We'll contact you soon regarding your order.`;
    window.open(`https://wa.me/${user.phone.replace(/\s/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const Navbar = () => (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">BH Unique</h1>
            <span className="ml-2 text-sm">by Fasly</span>
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <span className="hidden md:block">Hello, {user.name.split(' ')[0]}</span>
            )}
            <button 
              onClick={() => setShowCart(true)}
              className="relative p-2 hover:bg-indigo-700 rounded-full transition"
            >
              🛒
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
            {user ? (
              <button 
                onClick={() => {
                  setUser(null);
                  sessionStorage.removeItem('bhUniqueUser');
                }}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md transition"
              >
                Logout
              </button>
            ) : (
              <>
                <button 
                  onClick={() => setShowLogin(true)}
                  className="px-4 py-2 bg-white text-indigo-600 hover:bg-gray-100 rounded-md transition"
                >
                  Login
                </button>
                <button 
                  onClick={() => setShowRegister(true)}
                  className="px-4 py-2 bg-transparent border border-white hover:bg-indigo-700 rounded-md transition"
                >
                  Register
                </button>
              </>
            )}
            <button 
              onClick={() => setShowAdmin(true)}
              className="px-4 py-2 bg-yellow-500 text-black hover:bg-yellow-600 rounded-md transition text-sm"
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </nav>
  );

  const Hero = () => (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to BH Unique</h1>
        <p className="text-xl mb-8">Premium clothing by Fasly - Quality you can trust</p>
        <div className="flex justify-center space-x-4">
          <button 
            onClick={() => setCurrentPage('shop')}
            className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition"
          >
            Shop Now
          </button>
          <button 
            onClick={() => setCurrentPage('location')}
            className="px-8 py-3 bg-transparent border-2 border-white font-semibold rounded-lg hover:bg-white hover:text-indigo-600 transition"
          >
            Visit Us
          </button>
        </div>
      </div>
    </div>
  );

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
      <img 
        src={product.image} 
        alt={product.name}
        className="w-full h-64 object-cover"
        onClick={() => setSelectedProduct(product)}
      />
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-indigo-600">${product.price}</span>
          <button 
            onClick={() => handleAddToCart(product)}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );

  const ShopPage = () => (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Collection</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );

  const LocationPage = () => (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8 text-center">Visit Our Store</h2>
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold mb-4">Store Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-lg mb-2">Owner: Fasly</h4>
              <p className="mb-2">📍 Location: Ideman Kinniya, Sri Lanka</p>
              <p className="mb-2">📞 Phone: +94 77 123 4567</p>
              <p className="mb-2">📧 Email: info@bhunique.com</p>
              <p className="mb-2">🕒 Hours: Mon-Sat 9AM-8PM, Sun 10AM-6PM</p>
            </div>
            <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">📍</span>
                </div>
                <p className="font-bold">Store Location Map</p>
                <p className="text-sm text-gray-600">Ideman Kinniya, Sri Lanka</p>
                <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
                  Get Directions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const LoginPage = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Login to BH Unique</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={loginForm.email}
              onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={loginForm.password}
              onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setShowLogin(false)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </form>
        <p className="mt-4 text-center">
          Don't have an account?{' '}
          <button 
            onClick={() => {
              setShowLogin(false);
              setShowRegister(true);
            }}
            className="text-indigo-600 hover:underline"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );

  const RegisterPage = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={registerForm.name}
              onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={registerForm.email}
              onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={registerForm.password}
              onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={registerForm.phone}
              onChange={(e) => setRegisterForm({...registerForm, phone: e.target.value})}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Address</label>
            <textarea
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="3"
              value={registerForm.address}
              onChange={(e) => setRegisterForm({...registerForm, address: e.target.value})}
            ></textarea>
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Register
            </button>
            <button
              type="button"
              onClick={() => setShowRegister(false)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </form>
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <button 
            onClick={() => {
              setShowRegister(false);
              setShowLogin(true);
            }}
            className="text-indigo-600 hover:underline"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );

  const CartModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Cart</h2>
          <button
            onClick={() => setShowCart(false)}
            className="text-2xl hover:text-gray-600"
          >
            ×
          </button>
        </div>
        
        {cart.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xl text-gray-600">Your cart is empty</p>
            <button
              onClick={() => {
                setShowCart(false);
                setCurrentPage('shop');
              }}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cart.map(item => (
                <div key={item.id} className="flex items-center border-b pb-4">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                  <div className="ml-4 flex-1">
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="text-indigo-600 font-bold">${item.price}</p>
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        -
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="ml-4 text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between text-xl font-bold mb-4">
                <span>Total:</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              
              <div className="space-y-3">
                <div className="bg-gray-100 p-4 rounded">
                  <h3 className="font-bold mb-2">Delivery Information</h3>
                  <p>{user?.address || 'Please login to see your address'}</p>
                </div>
                
                <button
                  onClick={handleCheckout}
                  className="w-full py-3 bg-green-600 text-white font-bold rounded hover:bg-green-700 transition"
                >
                  Checkout with Card Payment
                </button>
                
                <div className="text-sm text-gray-600 text-center">
                  <p>After checkout, we'll contact you via WhatsApp for payment confirmation</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  const ProductModal = () => (
    selectedProduct && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-screen overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
            <button
              onClick={() => setSelectedProduct(null)}
              className="text-2xl hover:text-gray-600"
            >
              ×
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <img 
              src={selectedProduct.image} 
              alt={selectedProduct.name}
              className="w-full h-96 object-cover rounded-lg"
            />
            <div>
              <p className="text-2xl font-bold text-indigo-600 mb-4">${selectedProduct.price}</p>
              <p className="text-gray-700 mb-6">{selectedProduct.description}</p>
              <p className="text-sm text-gray-600 mb-4">Category: {selectedProduct.category}</p>
              <p className="text-sm text-gray-600 mb-6">In stock: {selectedProduct.stock} items</p>
              
              <button
                onClick={() => {
                  handleAddToCart(selectedProduct);
                  setSelectedProduct(null);
                }}
                className="w-full py-3 bg-indigo-600 text-white font-bold rounded hover:bg-indigo-700 transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  const AdminPanel = () => {
    const [adminView, setAdminView] = useState('login');
    
    if (adminView === 'login') {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
            <form onSubmit={handleAdminLogin}>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAdmin(false);
                    setAdminPassword('');
                  }}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    }
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-screen overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">BH Unique Admin Panel</h2>
            <button
              onClick={() => {
                setShowAdmin(false);
                setAdminPassword('');
              }}
              className="text-2xl hover:text-gray-600"
            >
              ×
            </button>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-4">Store Information</h3>
            <div className="bg-gray-100 p-4 rounded">
              <p><strong>Owner:</strong> Fasly</p>
              <p><strong>Location:</strong> Ideman Kinniya, Sri Lanka</p>
              <p><strong>Store Name:</strong> BH Unique</p>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">Customer Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-100 p-4 rounded">
                <h4 className="font-bold">Total Customers</h4>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <div className="bg-green-100 p-4 rounded">
                <h4 className="font-bold">Total Orders</h4>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
              <div className="bg-purple-100 p-4 rounded">
                <h4 className="font-bold">Revenue</h4>
                <p className="text-2xl font-bold">
                  ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">Customer Details</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2 border">Name</th>
                    <th className="p-2 border">Email</th>
                    <th className="p-2 border">Phone</th>
                    <th className="p-2 border">Address</th>
                    <th className="p-2 border">Cart Items</th>
                    <th className="p-2 border">Total Spent</th>
                    <th className="p-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(customer => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="p-2 border">{customer.name}</td>
                      <td className="p-2 border">{customer.email}</td>
                      <td className="p-2 border">{customer.phone}</td>
                      <td className="p-2 border">{customer.address}</td>
                      <td className="p-2 border text-center">{customer.cartItems}</td>
                      <td className="p-2 border text-center">${customer.totalSpent.toFixed(2)}</td>
                      <td className="p-2 border text-center">
                        <button
                          onClick={() => sendWhatsAppMessage(customer)}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                        >
                          WhatsApp
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {orders.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-4">Recent Orders</h3>
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="border p-4 rounded">
                    <div className="flex justify-between mb-2">
                      <span className="font-bold">Order #{order.id}</span>
                      <span className="text-sm">{order.date}</span>
                    </div>
                    <p><strong>Customer:</strong> {order.userName}</p>
                    <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
                    <p><strong>Status:</strong> {order.status}</p>
                    <div className="mt-2">
                      <strong>Items:</strong>
                      <ul className="list-disc list-inside">
                        {order.items.map(item => (
                          <li key={item.id}>
                            {item.name} x{item.quantity} (${(item.price * item.quantity).toFixed(2)})
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const Footer = () => (
    <footer className="bg-gray-800 text-white py-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">BH Unique</h3>
            <p className="text-gray-400">Premium clothing by Fasly</p>
            <p className="text-gray-400 mt-2">Ideman Kinniya, Sri Lanka</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><button onClick={() => setCurrentPage('home')} className="text-gray-400 hover:text-white">Home</button></li>
              <li><button onClick={() => setCurrentPage('shop')} className="text-gray-400 hover:text-white">Shop</button></li>
              <li><button onClick={() => setCurrentPage('location')} className="text-gray-400 hover:text-white">Location</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <p className="text-gray-400">Phone: +94 77 123 4567</p>
            <p className="text-gray-400">Email: info@bhunique.com</p>
            <p className="text-gray-400">WhatsApp: +94 77 123 4567</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">📱</a>
              <a href="#" className="text-gray-400 hover:text-white">📘</a>
              <a href="#" className="text-gray-400 hover:text-white">📸</a>
            </div>
            <p className="text-gray-400 mt-4 text-sm">
              © 2023 BH Unique. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {currentPage === 'home' && (
        <>
          <Hero />
          <div className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold mb-8 text-center">Featured Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {products.slice(0, 3).map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="text-center mt-8">
                <button 
                  onClick={() => setCurrentPage('shop')}
                  className="px-6 py-3 bg-indigo-600 text-white font-bold rounded hover:bg-indigo-700 transition"
                >
                  View All Products
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      
      {currentPage === 'shop' && <ShopPage />}
      {currentPage === 'location' && <LocationPage />}
      
      {showLogin && <LoginPage />}
      {showRegister && <RegisterPage />}
      {showCart && <CartModal />}
      {selectedProduct && <ProductModal />}
      {showAdmin && <AdminPanel />}
      
      <Footer />
    </div>
  );
};

export default App;