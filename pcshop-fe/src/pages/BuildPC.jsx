import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

export default function BuildPC() {
    const { addToCart } = useCart();
    const [categories, setCategories] = useState([
        { id: 'cpu', name: 'Processor', items: [] },
        { id: 'main', name: 'Mainboard', items: [] },
        { id: 'ram', name: 'RAM', items: [] },
        { id: 'vga', name: 'Graphics Card', items: [] },
        { id: 'ssd', name: 'SSD Storage', items: [] },
        { id: 'psu', name: 'Power Supply', items: [] },
        { id: 'case', name: 'Case', items: [] },
        { id: 'screen', name: 'Monitor', items: [] },
    ]);

    const [selectedItems, setSelectedItems] = useState(() => {
        try {
            const saved = sessionStorage.getItem("pc_build_state");
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            return {};
        }
    });

    const [totalPrice, setTotalPrice] = useState(0);
    const [totalWattage, setTotalWattage] = useState(0);

    useEffect(() => {
        sessionStorage.setItem("pc_build_state", JSON.stringify(selectedItems));

        // Calculate total price and wattage
        let price = 0;
        let wattage = 0;
        Object.entries(selectedItems).forEach(([key, item]) => {
            if (item) {
                price += item.price;
                if (key !== 'psu' && item.wattage) {
                    wattage += item.wattage;
                }
            }
        });
        setTotalPrice(price);
        setTotalWattage(wattage);
    }, [selectedItems]);

    const handleReset = () => {
        if (window.confirm("Are you sure you want to reset your configuration?")) {
            setSelectedItems({});
            sessionStorage.removeItem("pc_build_state");
        }
    };

    // Mock fetching products for selection modal (simplified for now)
    const [showModal, setShowModal] = useState(null); // 'cpu', 'main', etc.
    const [modalProducts, setModalProducts] = useState([]);

    const openSelection = async (categoryId) => {
        setShowModal(categoryId);
        try {
            // Fetch products from backend or use mocks if backend is empty
            const res = await fetch('http://localhost:8080/api/products');
            const allProducts = await res.json();

            // Filter roughly by name/category
            // In a real app, use the category ID. Here we map string category names.
            // Mapping: 'cpu' -> category name contains 'CPU'

            const mapping = {
                'cpu': 'CPU',
                'main': 'Mainboard',
                'ram': 'RAM',
                'vga': 'VGA',
                'ssd': 'SSD',
                'psu': 'PSU',
                'case': 'Case',
                'screen': 'Monitor'
            };

            const keyword = mapping[categoryId];
            let filtered = allProducts.filter(p => p.category?.name?.includes(keyword) || p.name?.includes(keyword));

            // Logic Recommendation for PSU
            if (categoryId === 'psu' && totalWattage > 0) {
                const recommendedWattage = totalWattage + 150; // Buffer
                // Sort by wattage closest to recommended, but must be higher
                filtered = filtered.sort((a, b) => {
                    const wa = a.wattage || 0;
                    const wb = b.wattage || 0;
                    if (wa >= recommendedWattage && wb < recommendedWattage) return -1;
                    if (wa < recommendedWattage && wb >= recommendedWattage) return 1;
                    return wa - wb;
                });
            }

            setModalProducts(filtered);

        } catch (e) {
            console.error("Failed to fetch products", e);
            setModalProducts([]);
        }
    };

    const selectItem = (categoryId, product) => {
        setSelectedItems(prev => ({ ...prev, [categoryId]: product }));
        setShowModal(null);
    };

    const chatEndRef = useRef(null);
    const [chatInput, setChatInput] = useState("");
    const [chatHistory, setChatHistory] = useState([
        { text: "Hello! I'm your AI PC Builder. Tell me your needs and budget — e.g. \"Gaming PC under 25M VND for GTA VI\" — and I'll suggest the best config!", isUser: false }
    ]);
    const [aiLoading, setAiLoading] = useState(false);
    const [suggestedConfig, setSuggestedConfig] = useState([]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, aiLoading]);

    const sendChat = async (text) => {
        const userMsg = text || chatInput;
        if (!userMsg.trim() || aiLoading) return;
        const currentHistory = [...chatHistory, { text: userMsg, isUser: true }];
        setChatHistory(currentHistory);
        setChatInput("");
        setAiLoading(true);

        // Build history for backend: exclude first bot greeting, map to Gemini roles
        const history = currentHistory
            .slice(1)   // skip initial greeting
            .slice(0, -1) // exclude the message just sent
            .map(m => ({ role: m.isUser ? 'user' : 'model', text: m.text }));

        try {
            const res = await fetch("http://localhost:8080/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMsg, context: 'build_pc', history })
            });
            const data = await res.json();
            setChatHistory(prev => [...prev, { text: data.reply, isUser: false }]);
            if (data.recommendations?.length > 0) setSuggestedConfig(data.recommendations);
        } catch {
            setChatHistory(prev => [...prev, { text: "Sorry, I'm having trouble connecting. Please try again.", isUser: false }]);
        } finally {
            setAiLoading(false);
        }
    };

    const handleChatSubmit = (e) => { e.preventDefault(); sendChat(); };

    const handleAddAllToCart = () => {
        Object.values(selectedItems).forEach(item => {
            if (item) addToCart(item);
        });
        alert("All components added to cart!");
    };

    return (
        <div className="bg-background min-h-screen font-sans">
            <Navbar />
            <div className="container-custom mx-auto pt-8 pb-20">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Builder List */}
                    <div className="flex-1 space-y-4">
                        <h1 className="text-3xl font-bold mb-6">Build Your PC</h1>

                        {categories.map(cat => (
                            <div key={cat.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                                <div className="w-24 text-sm font-bold text-gray-500 uppercase">{cat.name}</div>

                                {selectedItems[cat.id] ? (
                                    <div className="flex-1 flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gray-50 rounded p-1">
                                            <img src={selectedItems[cat.id].imageUrl} alt="" className="w-full h-full object-contain" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold text-primary">{selectedItems[cat.id].name}</div>
                                            <div className="text-red-600 font-bold">{selectedItems[cat.id].price.toLocaleString()} ₫</div>
                                            {selectedItems[cat.id].wattage && <div className="text-xs text-gray-500">{selectedItems[cat.id].wattage}W</div>}
                                        </div>
                                        <button
                                            onClick={() => setSelectedItems(prev => ({ ...prev, [cat.id]: null }))}
                                            className="text-gray-400 hover:text-red-500"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex items-center justify-between border-2 border-dashed border-gray-200 rounded-lg p-3 hover:border-red-200 transition-colors cursor-pointer group" onClick={() => openSelection(cat.id)}>
                                        <span className="text-gray-400 group-hover:text-red-500 font-medium">Select {cat.name}</span>
                                        <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded text-xs font-bold group-hover:bg-red-50 group-hover:text-red-600">+ ADD</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Summary Sidebar */}
                    <div className="w-full lg:w-96">
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg sticky top-24">
                            <h2 className="text-xl font-bold mb-6">Configuration Summary</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Components</span>
                                    <span>{Object.values(selectedItems).filter(i => i).length} items</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Estimated Wattage</span>
                                    <span className="text-blue-600 font-bold">{totalWattage > 0 ? `~ ${totalWattage}W` : '0W'}</span>
                                </div>
                                {totalWattage > 0 && (
                                    <div className="text-xs text-gray-400 mt-1">
                                        Recommended PSU: <span className="font-bold text-black">{totalWattage + 150}W+</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between text-2xl font-bold mb-8 pt-4 border-t border-gray-100 text-red-600">
                                <span>Total</span>
                                <span>{totalPrice.toLocaleString()} ₫</span>
                            </div>

                            <button onClick={handleAddAllToCart} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-red-500/30 transition-all uppercase tracking-wider mb-3">
                                Add Config to Cart
                            </button>
                            <button className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 rounded-xl shadow-lg transition-all mb-3">
                                Print / Download
                            </button>
                            <button onClick={handleReset} className="w-full bg-white hover:bg-gray-50 text-red-600 border border-red-200 font-bold py-3 rounded-xl transition-all">
                                Reset Configuration
                            </button>
                        </div>
                    </div>
                </div>

                {/* AI Support Section */}
                <div className="mt-12 rounded-2xl text-white shadow-2xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e3a5f 100%)' }}>
                    {/* Decorative blobs */}
                    <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500 opacity-10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-56 h-56 bg-purple-600 opacity-10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

                    <div className="relative z-10 flex flex-col lg:flex-row">
                        {/* Chat Column */}
                        <div className="flex-1 flex flex-col p-6 lg:p-8">
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-xl backdrop-blur-sm border border-white/20">🤖</div>
                                <div>
                                    <h2 className="text-lg font-bold leading-tight">AI PC Builder Assistant</h2>
                                    <div className="flex items-center gap-1.5 text-xs text-blue-300">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                                        Powered by Gemini AI
                                    </div>
                                </div>
                            </div>

                            {/* Message area */}
                            <div className="flex-1 bg-black/20 rounded-2xl p-4 mb-4 overflow-y-auto space-y-3" style={{ minHeight: 260, maxHeight: 340 }}>
                                {chatHistory.map((msg, idx) => (
                                    <div key={idx} className={`flex items-end gap-2 ${msg.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                                        {!msg.isUser && (
                                            <div className="w-7 h-7 rounded-lg bg-white/15 border border-white/20 flex items-center justify-center text-sm flex-shrink-0">🤖</div>
                                        )}
                                        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed max-w-[78%] ${msg.isUser
                                            ? 'bg-blue-500 text-white rounded-br-sm'
                                            : 'bg-white/12 text-blue-50 rounded-bl-sm border border-white/10'
                                            }`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                {aiLoading && (
                                    <div className="flex items-end gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-white/15 border border-white/20 flex items-center justify-center text-sm flex-shrink-0">🤖</div>
                                        <div className="bg-white/12 border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center">
                                            <span className="w-1.5 h-1.5 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-1.5 h-1.5 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-1.5 h-1.5 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Quick prompts */}
                            <div className="flex flex-wrap gap-2 mb-3">
                                {['Gaming PC 20M', 'Workstation render 3D', 'Office PC budget', 'AI/ML rig'].map(q => (
                                    <button key={q} onClick={() => sendChat(q)}
                                        className="text-xs px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-blue-200 hover:text-white transition-all">
                                        {q}
                                    </button>
                                ))}
                            </div>

                            {/* Input */}
                            <form onSubmit={handleChatSubmit} className="flex gap-2">
                                <input
                                    type="text"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    placeholder="e.g. Gaming PC for GTA VI under 30M VND..."
                                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-blue-300/60 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
                                />
                                <button type="submit" disabled={aiLoading || !chatInput.trim()}
                                    className="bg-blue-500 hover:bg-blue-400 disabled:opacity-40 text-white px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                        <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.155.75.75 0 0 0 0-1.114A28.897 28.897 0 0 0 3.105 2.288Z" />
                                    </svg>
                                    Send
                                </button>
                            </form>
                        </div>

                        {/* Suggested Config Column */}
                        <div className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-white/10 p-6 lg:p-8 flex flex-col">
                            <h3 className="font-bold text-base mb-1">Suggested Config</h3>
                            <p className="text-blue-300 text-xs mb-4">AI-generated recommendation</p>
                            <div className="flex-1 space-y-2">
                                {suggestedConfig.length > 0 ? suggestedConfig.map((item, idx) => (
                                    <div key={idx} className="bg-white/8 border border-white/10 rounded-xl px-3 py-2.5">
                                        <div className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-0.5">{item.category}</div>
                                        <div className="text-sm text-white font-medium line-clamp-1">{item.productName}</div>
                                    </div>
                                )) : (
                                    <div className="flex flex-col items-center justify-center h-32 text-center">
                                        <div className="text-3xl mb-2 opacity-30">💡</div>
                                        <p className="text-blue-300/60 text-sm">Chat with AI to receive a personalized config</p>
                                    </div>
                                )}
                            </div>
                            {suggestedConfig.length > 0 && (
                                <button className="mt-4 w-full py-2.5 rounded-xl border border-blue-400/40 text-blue-300 hover:bg-blue-500 hover:text-white hover:border-blue-500 font-semibold text-sm transition-all">
                                    Apply This Config
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Selection Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-4xl max-h-[80vh] rounded-2xl shadow-2xl flex flex-col">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold">Select {categories.find(c => c.id === showModal)?.name}</h3>
                            <button onClick={() => setShowModal(null)} className="p-2 hover:bg-gray-100 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {modalProducts.length > 0 ? modalProducts.map(product => (
                                <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow bg-white flex flex-col gap-3">
                                    <div className="h-40 bg-gray-50 rounded-lg p-2">
                                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-sm text-primary line-clamp-2 mb-1">{product.name}</div>
                                        <div className="text-red-600 font-bold">{product.price.toLocaleString()} ₫</div>
                                        {product.wattage && <div className="text-xs text-gray-500">Power: {product.wattage}W</div>}
                                    </div>
                                    <button
                                        onClick={() => selectItem(showModal, product)}
                                        className="w-full bg-primary hover:bg-primary-hover text-white py-2 rounded-lg font-bold text-sm"
                                    >
                                        Select
                                    </button>
                                </div>
                            )) : (
                                <div className="col-span-full text-center py-10 text-gray-500">No products found for this category.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
