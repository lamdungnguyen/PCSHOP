import { useState, useEffect } from 'react';
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

    const [selectedItems, setSelectedItems] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        // Calculate total
        const total = Object.values(selectedItems).reduce((sum, item) => sum + (item ? item.price : 0), 0);
        setTotalPrice(total);
    }, [selectedItems]);

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
            const filtered = allProducts.filter(p => p.category?.name?.includes(keyword) || p.name?.includes(keyword));
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

    const [chatInput, setChatInput] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [aiLoading, setAiLoading] = useState(false);
    const [suggestedConfig, setSuggestedConfig] = useState([]);

    const handleChatSubmit = async (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const userMsg = chatInput;
        setChatHistory(prev => [...prev, { text: userMsg, isUser: true }]);
        setChatInput("");
        setAiLoading(true);

        try {
            const res = await fetch("http://localhost:8080/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMsg })
            });
            const data = await res.json();

            setChatHistory(prev => [...prev, { text: data.reply, isUser: false }]);
            if (data.recommendations && data.recommendations.length > 0) {
                setSuggestedConfig(data.recommendations);
            }
        } catch (err) {
            setChatHistory(prev => [...prev, { text: "Sorry, I am having trouble connecting to the server.", isUser: false }]);
        } finally {
            setAiLoading(false);
        }
    };

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
                                    <span className="text-blue-600 font-bold">~ 450W</span>
                                </div>
                            </div>

                            <div className="flex justify-between text-2xl font-bold mb-8 pt-4 border-t border-gray-100 text-red-600">
                                <span>Total</span>
                                <span>{totalPrice.toLocaleString()} ₫</span>
                            </div>

                            <button onClick={handleAddAllToCart} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-red-500/30 transition-all uppercase tracking-wider mb-3">
                                Add Config to Cart
                            </button>
                            <button className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 rounded-xl shadow-lg transition-all">
                                Print / Download
                            </button>
                        </div>
                    </div>
                </div>

                {/* AI Support Section */}
                <div className="mt-12 bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>

                    <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1">
                            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                                <span className="text-4xl">🤖</span> AI PC Builder Assistant
                            </h2>
                            <p className="text-blue-100 text-lg mb-6">
                                Not sure what to pick? Tell our AI what you need (e.g., "Gaming PC for GTA VI under 30 million VND") and get an instant recommendation.
                            </p>

                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                                <div className="h-40 overflow-y-auto mb-4 space-y-3 font-mono text-sm" id="ai-chat-box">
                                    <div className="bg-white/10 p-2 rounded rounded-tl-none self-start mr-12">
                                        Hello! I'm your AI assistant. How can I help you build your PC today?
                                    </div>
                                    {chatHistory.map((msg, idx) => (
                                        <div key={idx} className={`p-2 rounded max-w-[80%] ${msg.isUser ? 'bg-blue-500 self-end ml-auto rounded-tr-none text-right' : 'bg-white/10 self-start mr-12 rounded-tl-none'}`}>
                                            {msg.text}
                                        </div>
                                    ))}
                                    {aiLoading && <div className="text-xs text-blue-200 animate-pulse">AI is thinking...</div>}
                                </div>
                                <form onSubmit={handleChatSubmit} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        placeholder="Type your request... (e.g. 'Gaming PC 30 million')"
                                        className="flex-1 bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                    <button type="submit" disabled={aiLoading} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-bold transition-all shadow-lg disabled:opacity-50">
                                        {aiLoading ? '...' : 'Ask AI'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div className="w-full md:w-1/3 bg-white/5 rounded-xl p-6 border border-white/10">
                            <h3 className="font-bold text-xl mb-4 border-b border-white/10 pb-2">Suggested Config</h3>
                            <div className="space-y-3 text-sm text-blue-100">
                                {suggestedConfig.length > 0 ? suggestedConfig.map((item, idx) => (
                                    <div key={idx} className="flex justify-between">
                                        <span>{item.category}:</span>
                                        <span className="font-bold text-white text-right ml-2">{item.productName}</span>
                                    </div>
                                )) : (
                                    <p className="text-center text-blue-300 italic">Chat with AI to get a config...</p>
                                )}

                                {suggestedConfig.length > 0 && (
                                    <div className="pt-3 border-t border-white/10 text-center">
                                        <button className="text-blue-300 hover:text-white font-bold underline">Apply This Config</button>
                                    </div>
                                )}
                            </div>
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
