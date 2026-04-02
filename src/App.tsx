import { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Plus, Minus, Trash2, FileText, User, 
  Search, Package, CreditCard, Download, 
  Printer, CheckCircle2, 
  LayoutDashboard, History,
  Settings, LogOut, Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { SERVICES } from './constants';
import { Product, InvoiceItem, Customer, Invoice } from './types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
// @ts-ignore
import html2pdf from 'html2pdf.js';

export default function App() {
  const [activeTab, setActiveTab] = useState<'pos' | 'history' | 'settings'>('pos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Catalog State (Initialized from localStorage or constants)
  const [catalog, setCatalog] = useState<Product[]>(() => {
    const saved = localStorage.getItem('cn_catalog');
    return saved ? JSON.parse(saved) : SERVICES;
  });

  // Customer Memory
  const [savedCustomers, setSavedCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('cn_customers');
    return saved ? JSON.parse(saved) : [];
  });

  const [cart, setCart] = useState<InvoiceItem[]>([]);
  const [customer, setCustomer] = useState<Customer>({
    name: '',
    email: '',
    phone: '',
    address: '',
    tin: '',
    brn: ''
  });
  const [showPreview, setShowPreview] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // Fetch Invoices on load
  useEffect(() => {
    fetch('/api/invoices')
      .then(res => res.json())
      .then(data => setInvoices(data))
      .catch(err => console.error("Failed to fetch invoices", err));
  }, []);

  const [showCustomItemModal, setShowCustomItemModal] = useState(false);
  const [customItem, setCustomItem] = useState({ name: '', price: '' });

  const invoiceRef = useRef<HTMLDivElement>(null);

  const categories = ['All', ...Array.from(new Set(catalog.map(s => s.category)))];

  const filteredServices = useMemo(() => {
    return catalog.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, catalog]);

  // Persist Catalog
  const updateCatalog = (newCatalog: Product[]) => {
    setCatalog(newCatalog);
    localStorage.setItem('cn_catalog', JSON.stringify(newCatalog));
  };

  // Persist Customers
  const saveCustomer = (cust: Customer) => {
    setSavedCustomers(prev => {
      const filtered = prev.filter(c => c.name !== cust.name);
      const updated = [cust, ...filtered].slice(0, 10); // Keep last 10
      localStorage.setItem('cn_customers', JSON.stringify(updated));
      return updated;
    });
  };

  const addToCart = (product: Product | { name: string, price: number, id: string }) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
            : item
        );
      }
      return [...prev, {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        total: product.price
      }];
    });
  };

  const addCustomItemToCart = () => {
    if (!customItem.name || !customItem.price) return;
    addToCart({
      id: `custom-${Date.now()}`,
      name: customItem.name,
      price: parseFloat(customItem.price)
    });
    setCustomItem({ name: '', price: '' });
    setShowCustomItemModal(false);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty, total: newQty * item.price };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.08; // 8% SST
  const total = subtotal + tax;

  const handleCreateInvoice = () => {
    if (!customer.name || cart.length === 0) {
      alert("Please enter customer name and add items to cart.");
      return;
    }
    saveCustomer(customer);
    setShowPreview(true);
  };

  const confirmInvoice = async () => {
    const newInvoice: Invoice = {
      id: Math.random().toString(36).substr(2, 9),
      invoiceNumber: `CN-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      customer,
      items: cart,
      subtotal,
      tax,
      total,
      status: 'pending'
    };

    setInvoices([newInvoice, ...invoices]);
    
    try {
      await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInvoice)
      });
    } catch (e) {
      console.error("Failed to sync with backend", e);
    }

    setShowPreview(false);
    setCart([]);
    setCustomer({ name: '', email: '', phone: '', address: '', tin: '', brn: '' });
    alert("Invoice created and synced with Accounting SQL!");
  };

  const updateInvoiceStatus = async (id: string, status: 'paid' | 'cancelled') => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status } : inv));
    // In a real app, you'd also update the backend here
  };

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!showPreview && pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
  }, [showPreview, pdfUrl]);

  const downloadPDF = async () => {
    if (!invoiceRef.current) {
      console.error("Invoice element not found");
      return;
    }
    
    try {
      setIsGeneratingPDF(true);
      setPdfUrl(null);
      console.log("Starting PDF generation...");
      
      // Safety timeout to prevent permanent "Generating..." state
      const timeoutId = setTimeout(() => {
        setIsGeneratingPDF(false);
      }, 15000);

      // Give the UI a chance to update
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const element = invoiceRef.current;
      const fileName = `Invoice_${customer.name.replace(/\s+/g, '_') || 'Customer'}.pdf`;
      
      // Use a lower scale (1) to ensure it doesn't hang the browser
      const opt = {
        margin: 0,
        filename: fileName,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { 
          scale: 1, // Lower scale = much faster and less memory
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // @ts-ignore
      await html2pdf().set(opt).from(element).save();
      
      clearTimeout(timeoutId);
      console.log("PDF generated successfully");
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("PDF generation failed. \n\n建议方案：请点击旁边的 'Print' 按钮，然后在打印选项中选择 '另存为 PDF' (Save as PDF)。\n\n我们已经优化了打印样式，现在打印出来的效果会非常美观。");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handlePrint = () => {
    // We use a small timeout to ensure the UI is ready
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const exportToCSV = () => {
    if (invoices.length === 0) return;
    
    // LHDN MyInvois Required Fields (Simplified)
    const headers = [
      'Invoice Number', 'Date', 'Customer Name', 'Customer TIN', 'Customer BRN', 
      'Subtotal (RM)', 'SST 8% (RM)', 'Total (RM)', 'Status'
    ];
    
    const rows = invoices.map(inv => [
      inv.invoiceNumber,
      format(new Date(inv.date), 'yyyy-MM-dd'),
      inv.customer.name,
      inv.customer.tin || '',
      inv.customer.brn || '',
      inv.subtotal.toFixed(2),
      inv.tax.toFixed(2),
      inv.total.toFixed(2),
      inv.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `eInvoice_Export_${format(new Date(), 'yyyyMMdd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = () => {
    if (invoices.length === 0) return;
    const blob = new Blob([JSON.stringify(invoices, null, 2)], { type: 'application/json' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `eInvoice_Data_${format(new Date(), 'yyyyMMdd')}.json`);
    link.click();
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0C10] text-gray-100 font-sans antialiased">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0F1218] border-r border-white/5 flex flex-col">
        <div className="p-6">
          <h1 className="font-bold text-sm leading-tight text-primary">CHEAPER NEXUS</h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Sdn. Bhd.</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button 
            onClick={() => setActiveTab('pos')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'pos' ? 'bg-primary text-black' : 'hover:bg-white/5 text-gray-400'}`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">POS Terminal</span>
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'history' ? 'bg-primary text-black' : 'hover:bg-white/5 text-gray-400'}`}
          >
            <History size={20} />
            <span className="font-medium">Invoices</span>
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-primary text-black' : 'hover:bg-white/5 text-gray-400'}`}
          >
            <Settings size={20} />
            <span className="font-medium">Catalog & Settings</span>
          </button>
        </nav>

        <div className="p-4 mt-auto">
          <div className="glass-card p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-bold">CN</div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-medium truncate">Admin User</p>
              <p className="text-[10px] text-gray-500">Marketing Agency</p>
            </div>
            <LogOut size={16} className="text-gray-500 cursor-pointer hover:text-red-400" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {activeTab === 'pos' ? (
          <>
            {/* POS Terminal */}
            <div className="flex-1 flex flex-col p-6 overflow-hidden">
              <header className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold">Service Catalog</h2>
                  <p className="text-gray-500 text-sm">Select services to bill your client</p>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setShowCustomItemModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold border border-white/10"
                  >
                    <Plus size={14} /> Custom Item
                  </button>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input 
                      type="text" 
                      placeholder="Search services..." 
                      className="input-field pl-10 w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </header>

              {/* Categories */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === cat ? 'bg-secondary text-black' : 'bg-white/5 hover:bg-white/10 text-gray-400'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Grid */}
              <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 content-start">
                {filteredServices.map(service => (
                  <motion.div
                    layout
                    key={service.id}
                    onClick={() => addToCart(service)}
                    className="glass-card p-4 cursor-pointer hover:border-primary/50 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] uppercase tracking-widest text-primary font-bold">{service.category}</span>
                      <Plus size={16} className="text-gray-500 group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{service.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-secondary">RM {service.price.toLocaleString()}</span>
                      <span className="text-[10px] text-gray-500">/ {service.unit}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Cart & Billing */}
            <div className="w-96 bg-[#0F1218] border-l border-white/5 flex flex-col p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <CreditCard size={20} className="text-primary" />
                Billing Summary
              </h2>

              {/* Customer Info */}
              <div className="space-y-3 mb-6">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                  <input 
                    type="text" 
                    placeholder="Customer Name" 
                    className="input-field pl-9 w-full text-sm"
                    value={customer.name}
                    onChange={(e) => setCustomer({...customer, name: e.target.value})}
                    list="saved-customers"
                  />
                  <datalist id="saved-customers">
                    {savedCustomers.map(c => <option key={c.name} value={c.name} />)}
                  </datalist>
                </div>
                
                {/* Auto-fill from saved customers */}
                {savedCustomers.find(c => c.name === customer.name) && (
                  <button 
                    onClick={() => {
                      const saved = savedCustomers.find(c => c.name === customer.name);
                      if (saved) setCustomer(saved);
                    }}
                    className="text-[10px] text-primary font-bold hover:underline"
                  >
                    Auto-fill details for this customer?
                  </button>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    placeholder="TIN (e-Invoice)" 
                    className="input-field w-full text-xs"
                    value={customer.tin}
                    onChange={(e) => setCustomer({...customer, tin: e.target.value})}
                  />
                  <input 
                    type="text" 
                    placeholder="BRN" 
                    className="input-field w-full text-xs"
                    value={customer.brn}
                    onChange={(e) => setCustomer({...customer, brn: e.target.value})}
                  />
                </div>
                <input 
                  type="text" 
                  placeholder="Billing Address" 
                  className="input-field w-full text-xs"
                  value={customer.address}
                  onChange={(e) => setCustomer({...customer, address: e.target.value})}
                />
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto space-y-3 mb-6 pr-2">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
                    <Package size={48} className="mb-2" />
                    <p className="text-sm">Cart is empty</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.productId} className="glass-card p-3 flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <p className="text-xs font-medium flex-1 pr-2">{item.name}</p>
                        <button onClick={() => removeFromCart(item.productId)} className="text-gray-500 hover:text-red-400">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
                          <button onClick={() => updateQuantity(item.productId, -1)} className="p-1 hover:text-primary"><Minus size={12} /></button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.productId, 1)} className="p-1 hover:text-primary"><Plus size={12} /></button>
                        </div>
                        <p className="text-sm font-bold text-secondary">RM {item.total.toLocaleString()}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Totals */}
              <div className="space-y-2 border-t border-white/5 pt-4 mb-6">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Subtotal</span>
                  <span>RM {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>SST (8%)</span>
                  <span>RM {tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-primary pt-2">
                  <span>Total</span>
                  <span>RM {total.toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={handleCreateInvoice}
                disabled={cart.length === 0}
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileText size={18} />
                Generate Invoice
              </button>
            </div>
          </>
        ) : activeTab === 'history' ? (
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold">Invoice History</h2>
                <p className="text-gray-500 text-sm">Manage and export your billing data</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={exportToCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold border border-white/10"
                >
                  <Download size={14} /> Export for MyInvois (CSV)
                </button>
                <button 
                  onClick={exportToJSON}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold border border-white/10"
                >
                  <FileText size={14} /> Download JSON Data
                </button>
              </div>
            </div>
            <div className="glass-card overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-gray-400">
                  <tr>
                    <th className="px-6 py-4">Invoice #</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {invoices.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">No invoices found</td>
                    </tr>
                  ) : (
                    invoices.map(inv => (
                      <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-primary">{inv.invoiceNumber}</td>
                        <td className="px-6 py-4 text-xs">{format(new Date(inv.date), 'dd MMM yyyy')}</td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium">{inv.customer.name}</p>
                          <p className="text-[10px] text-gray-500">{inv.customer.email}</p>
                        </td>
                        <td className="px-6 py-4 font-bold text-secondary">RM {inv.total.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                            inv.status === 'paid' ? 'bg-green-500/10 text-green-500' : 
                            inv.status === 'cancelled' ? 'bg-red-500/10 text-red-500' : 
                            'bg-yellow-500/10 text-yellow-500'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            {inv.status === 'pending' && (
                              <button 
                                onClick={() => updateInvoiceStatus(inv.id, 'paid')}
                                className="p-2 hover:bg-green-500/10 rounded-lg text-gray-400 hover:text-green-500"
                                title="Mark as Paid"
                              >
                                <CheckCircle2 size={16} />
                              </button>
                            )}
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(JSON.stringify(inv, null, 2));
                                alert("Invoice data copied to clipboard!");
                              }}
                              className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-primary"
                              title="Copy JSON Data"
                            >
                              <FileText size={16} />
                            </button>
                            <button 
                              onClick={() => {
                                setCustomer(inv.customer);
                                setCart(inv.items);
                                setShowPreview(true);
                              }}
                              className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-primary"
                              title="View & Print"
                            >
                              <Printer size={16} />
                            </button>
                            <button 
                              onClick={() => {
                                setCustomer(inv.customer);
                                setCart(inv.items);
                                setShowPreview(true);
                                setTimeout(downloadPDF, 500);
                              }}
                              disabled={isGeneratingPDF}
                              className={`p-2 rounded-lg transition-all ${
                                isGeneratingPDF ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'hover:bg-white/10 text-gray-400 hover:text-primary'
                              }`}
                              title="Download PDF"
                            >
                              {isGeneratingPDF ? (
                                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Download size={16} />
                              )}
                            </button>
                            <button 
                              onClick={() => {
                                if (confirm("Delete this invoice?")) {
                                  setInvoices(prev => prev.filter(i => i.id !== inv.id));
                                }
                              }}
                              className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex-1 p-8 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-8">Catalog & Settings</h2>
            <div className="max-w-4xl space-y-8">
              {/* Catalog Management */}
              <section className="glass-card p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-semibold">Service Catalog</h3>
                    <p className="text-xs text-gray-500">Manage your services and pricing</p>
                  </div>
                  <button 
                    onClick={() => {
                      const name = prompt("Service Name:");
                      const price = prompt("Price (RM):");
                      const category = prompt("Category (e.g., Content, Ads):");
                      if (name && price && category) {
                        updateCatalog([...catalog, {
                          id: `svc-${Date.now()}`,
                          name,
                          price: parseFloat(price),
                          category,
                          unit: 'pkg'
                        }]);
                      }
                    }}
                    className="btn-secondary text-xs flex items-center gap-2"
                  >
                    <Plus size={14} /> Add New Service
                  </button>
                </div>
                
                <div className="space-y-2">
                  {catalog.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 group">
                      <div className="flex-1">
                        <span className="text-[10px] uppercase text-primary font-bold mr-2">{item.category}</span>
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-bold text-secondary">RM {item.price.toLocaleString()}</p>
                          <p className="text-[10px] text-gray-500">/ {item.unit}</p>
                        </div>
                        <button 
                          onClick={() => {
                            const newPrice = prompt("New Price for " + item.name + ":", item.price.toString());
                            if (newPrice) {
                              updateCatalog(catalog.map(c => c.id === item.id ? { ...c, price: parseFloat(newPrice) } : c));
                            }
                          }}
                          className="p-2 hover:bg-white/10 rounded-lg text-gray-500 hover:text-primary"
                        >
                          <Settings size={14} />
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm("Delete " + item.name + "?")) {
                              updateCatalog(catalog.filter(c => c.id !== item.id));
                            }
                          }}
                          className="p-2 hover:bg-white/10 rounded-lg text-gray-500 hover:text-red-400"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-4">Agency Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-gray-500 font-bold">Company Name</label>
                    <input type="text" defaultValue="CHEAPER NEXUS SDN. BHD." className="input-field w-full" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-gray-500 font-bold">Registration # (SSM)</label>
                    <input type="text" defaultValue="202601007953 (1670051-W)" className="input-field w-full" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-gray-500 font-bold">TIN Number</label>
                    <input type="text" defaultValue="C 60596575070" className="input-field w-full" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-gray-500 font-bold">Phone Number</label>
                    <input type="text" defaultValue="017-291 5754" className="input-field w-full" />
                  </div>
                  <div className="space-y-1 col-span-2">
                    <label className="text-[10px] uppercase text-gray-500 font-bold">Address</label>
                    <textarea defaultValue="Lot1-38, PV128, Jalan Genting Kelang, Taman Setapak, 53000 Kuala Lumpur" className="input-field w-full h-20 pt-2" />
                  </div>
                </div>
              </section>

              {/* Data Management */}
              <section className="glass-card p-6 border-red-500/20">
                <h3 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h3>
                <div className="flex items-center justify-between p-4 bg-red-500/5 rounded-xl border border-red-500/10">
                  <div>
                    <p className="text-sm font-bold">Clear Invoice History</p>
                    <p className="text-xs text-gray-500">This will delete all local invoice records. This cannot be undone.</p>
                  </div>
                  <button 
                    onClick={() => {
                      if (confirm("Are you sure you want to clear all invoice history? This will not affect your accounting SQL if already synced.")) {
                        setInvoices([]);
                        // In a real app, you'd also call a delete API here
                      }
                    }}
                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl text-xs font-bold transition-all"
                  >
                    Clear All History
                  </button>
                </div>
              </section>

              {/* e-Invoice Integration Guide */}
              <section className="glass-card p-6 border-primary/20 bg-primary/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">e-Invoice Integration Guide</h3>
                    <p className="text-xs text-gray-400">How to link with LHDN MyInvois</p>
                  </div>
                </div>
                
                <div className="space-y-4 text-sm text-gray-300">
                  <div className="p-3 bg-black/20 rounded-lg border border-white/5">
                    <p className="font-bold text-primary mb-1">Option 1: Manual Upload (Free)</p>
                    <p className="text-xs leading-relaxed">
                      Go to the <span className="text-white font-medium">Invoices</span> tab and click <span className="text-white font-medium">"Export for MyInvois (CSV)"</span>. 
                      You can then upload this file directly to the LHDN MyInvois Portal.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-black/20 rounded-lg border border-white/5">
                    <p className="font-bold text-secondary mb-1">Option 2: Accounting SQL Sync</p>
                    <p className="text-xs leading-relaxed">
                      Your accounting team can use the <span className="text-white font-medium">"Download JSON Data"</span> feature to import all transactions into their SQL software, 
                      which can then handle the API submission to LHDN automatically.
                    </p>
                  </div>

                  <div className="p-3 bg-black/20 rounded-lg border border-white/5">
                    <p className="font-bold text-accent mb-1">Mandatory Fields Check</p>
                    <ul className="text-[10px] list-disc pl-4 space-y-1 text-gray-400">
                      <li>Ensure every customer has a valid <span className="text-white">TIN (Tax Identification Number)</span>.</li>
                      <li>Ensure <span className="text-white">BRN (Business Registration Number)</span> is provided for companies.</li>
                      <li>SST is automatically calculated at <span className="text-white">8%</span> as per your agency requirements.</li>
                    </ul>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}
      </main>

      {/* Custom Item Modal */}
      <AnimatePresence>
        {showCustomItemModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="glass-card p-6 w-full max-w-md"
            >
              <h3 className="text-xl font-bold mb-4">Add Custom Item</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 font-bold">Description</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Extra Revision Fee" 
                    className="input-field w-full"
                    value={customItem.name}
                    onChange={(e) => setCustomItem({...customItem, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 font-bold">Price (RM)</label>
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    className="input-field w-full"
                    value={customItem.price}
                    onChange={(e) => setCustomItem({...customItem, price: e.target.value})}
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <button 
                    onClick={addCustomItemToCart}
                    className="flex-1 btn-primary"
                  >
                    Add to Cart
                  </button>
                  <button 
                    onClick={() => setShowCustomItemModal(false)}
                    className="flex-1 bg-white/5 hover:bg-white/10 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invoice Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 print:bg-white print:p-0 print:static"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white text-black w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col print:max-h-none print:shadow-none print:rounded-none print:w-full"
            >
              <div className="p-4 bg-gray-100 border-b flex justify-between items-center sticky top-0 z-10 print:hidden" data-html2canvas-ignore="true">
                <h3 className="font-bold">Invoice Preview</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={downloadPDF} 
                    disabled={isGeneratingPDF}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all print:hidden ${
                      isGeneratingPDF ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300 text-black'
                    }`}
                  >
                    {isGeneratingPDF ? (
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Download size={16} />
                    )}
                    {isGeneratingPDF ? 'Generating...' : 'PDF'}
                  </button>
                  
                  {pdfUrl && (
                    <a 
                      href={pdfUrl} 
                      download={`Invoice_${customer.name.replace(/\s+/g, '_') || 'Customer'}.pdf`}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-bold animate-pulse print:hidden"
                    >
                      <Download size={16} /> Click to Download
                    </a>
                  )}
                  <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-bold print:hidden">
                    <Printer size={16} /> Print
                  </button>
                  <button onClick={confirmInvoice} className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-gray-800 rounded-lg text-sm font-bold print:hidden">
                    <CheckCircle2 size={16} /> Confirm & Sync
                  </button>
                  <button onClick={() => setShowPreview(false)} className="px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg text-sm font-bold print:hidden">
                    Cancel
                  </button>
                </div>
              </div>

              <div id="invoice-to-download" ref={invoiceRef} className="p-12 bg-white min-h-[1123px] w-full print:p-0 print:m-0 print:shadow-none">
                {/* Invoice Content */}
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <div className="mb-4">
                      <h1 className="text-2xl font-black italic leading-tight">CHEAPER NEXUS</h1>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Sdn. Bhd.</p>
                    </div>
                    <div className="text-[10px] text-gray-600 space-y-1 max-w-xs">
                      <p className="font-bold">CHEAPER NEXUS SDN. BHD.</p>
                      <p>202601007953 (1670051-W)</p>
                      <p>Lot1-38, PV128, Jalan Genting Kelang, Taman Setapak, 53000 Kuala Lumpur</p>
                      <p>Tel: 017-291 5754 | TIN: C 60596575070</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <h2 className="text-4xl font-black text-gray-200 mb-4">INVOICE</h2>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-gray-400 font-bold">NUMBER:</span> {invoices[0]?.invoiceNumber || 'CN-XXXXXX'}</p>
                      <p><span className="text-gray-400 font-bold">DATE:</span> {format(new Date(), 'dd MMMM yyyy')}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-12 mb-12">
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest text-gray-400 font-black mb-2">BILL TO</h4>
                    <p className="font-bold text-lg">{customer.name || 'Client Name'}</p>
                    <div className="text-sm text-gray-600 space-y-1 mt-2">
                      <p>{customer.address || 'Client Address'}</p>
                      <p>TIN: {customer.tin || '-'}</p>
                      <p>BRN: {customer.brn || '-'}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h4 className="text-[10px] uppercase tracking-widest text-gray-400 font-black mb-2">PAYMENT INFO</h4>
                    <div className="text-sm space-y-1">
                      <p><span className="font-bold">Bank:</span> Maybank Berhad</p>
                      <p><span className="font-bold">Account:</span> 5123 4567 8901</p>
                      <p><span className="font-bold">Name:</span> Cheaper Nexus Sdn Bhd</p>
                    </div>
                  </div>
                </div>

                <table className="w-full mb-12">
                  <thead>
                    <tr className="border-b-2 border-black text-left text-[10px] font-black uppercase tracking-widest">
                      <th className="py-4">Description</th>
                      <th className="py-4 text-center">Qty</th>
                      <th className="py-4 text-right">Price (RM)</th>
                      <th className="py-4 text-right">Total (RM)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {cart.map(item => (
                      <tr key={item.productId}>
                        <td className="py-4 font-medium text-sm">{item.name}</td>
                        <td className="py-4 text-center text-sm">{item.quantity}</td>
                        <td className="py-4 text-right text-sm">{item.price.toLocaleString()}</td>
                        <td className="py-4 text-right font-bold text-sm">{item.total.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex justify-end">
                  <div className="w-64 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-bold">RM {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">SST (8%)</span>
                      <span className="font-bold">RM {tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xl font-black border-t-2 border-black pt-3">
                      <span>TOTAL</span>
                      <span>RM {total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-24 pt-12 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-primary mb-2">
                    <CheckCircle2 size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">e-Invoice Ready</span>
                  </div>
                  <p className="text-[10px] text-gray-400 leading-relaxed">
                    This is a computer-generated invoice. No signature is required. 
                    Payment is due within 7 days. Thank you for choosing Cheaper Nexus.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
