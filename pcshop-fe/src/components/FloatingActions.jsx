import { useState, useRef, useEffect } from 'react';

export default function FloatingActions() {
    const [showChat, setShowChat] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I'm your AI Assistant. How can I help you build your dream PC today?", sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isExpanded, setIsExpanded] = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, showChat]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMsg = { id: Date.now(), text: inputValue, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        try {
            const response = await fetch('http://localhost:8080/api/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: inputValue })
            });

            if (!response.ok) throw new Error('Failed to get response');

            const data = await response.json();

            const botMsg = { id: Date.now() + 1, text: data.reply, sender: 'bot' };
            setMessages(prev => [...prev, botMsg]);

        } catch (error) {
            console.error("Chat error:", error);
            const errorMsg = { id: Date.now() + 2, text: "Sorry, I'm having trouble connecting to the server. Please try again later.", sender: 'bot' };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 font-sans">
            {/* Expanded Content */}
            {isExpanded && (
                <div className="flex flex-col items-end gap-3 animate-fade-in-up">
                    {/* Social Buttons */}
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => window.open('https://zalo.me/0904560681', '_blank')}
                            className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform group relative" title="Zalo">
                            <span className="font-bold text-[10px]">Zalo</span>
                            <span className="absolute right-full mr-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Chat Zalo</span>
                        </button>
                        <button
                            onClick={() => window.open('https://t.me/lamdunggg', '_blank')}
                            className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform group relative" title="Messenger">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.03 2 11c0 2.87 1.69 5.4 4.37 6.96-.06.55-.38 1.94-1.29 3.03 1.15.12 3.01-.13 4.29-1.09 1.48.51 3.08.79 4.63.79 5.52 0 10-4.03 10-9s-4.48-9-10-9z" /></svg>
                            <span className="absolute right-full mr-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Messenger</span>
                        </button>
                        <button
                            onClick={() => window.open('https://maps.app.goo.gl/N1gv95cg918wRMkD8', '_blank')}
                            className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform group relative" title="Map">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                            </svg>
                            <span className="absolute right-full mr-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Find Store</span>
                        </button>
                    </div>

                    {/* Chatbot Window */}
                    <div className="relative">
                        {showChat && (
                            <div className="absolute bottom-20 right-0 w-[400px] md:w-[450px] h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in origin-bottom-right flex flex-col ring-1 ring-black/5">
                                {/* Header */}
                                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-5 flex justify-between items-center flex-shrink-0 shadow-md">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                                            <span className="text-xl">✨</span>
                                        </div>
                                        <div>
                                            <div className="font-bold text-lg">AI Assistant</div>
                                            <div className="text-xs text-indigo-100 flex items-center gap-1">
                                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                                Online & Ready
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowChat(false)}
                                        className="hover:bg-white/10 p-2 rounded-full transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Messages Area */}
                                <div className="flex-1 bg-gray-50 p-5 overflow-y-auto space-y-4">
                                    {messages.map(msg => (
                                        <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs shadow-sm ${msg.sender === 'bot'
                                                    ? 'bg-indigo-600'
                                                    : 'bg-gray-400'
                                                }`}>
                                                {msg.sender === 'bot'
                                                    ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7V5.73C7.4 5.39 7 4.74 7 4a2 2 0 0 1 2-2h3zM7.5 13A2.5 2.5 0 1 0 5 15.5 2.5 2.5 0 0 0 7.5 13zm9 2.5A2.5 2.5 0 1 0 19 13a2.5 2.5 0 0 0-2.5 2.5z" /></svg>
                                                    : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" /></svg>
                                                }
                                            </div>
                                            <div className={`p-3.5 rounded-2xl shadow-sm text-sm border max-w-[80%] leading-relaxed ${msg.sender === 'bot'
                                                    ? 'bg-white border-gray-100 rounded-tl-none text-gray-700'
                                                    : 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-transparent rounded-tr-none'
                                                }`}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Typing Indicator */}
                                    {isTyping && (
                                        <div className="flex gap-3">
                                            <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-indigo-600 text-white shadow-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7V5.73C7.4 5.39 7 4.74 7 4a2 2 0 0 1 2-2h3zM7.5 13A2.5 2.5 0 1 0 5 15.5 2.5 2.5 0 0 0 7.5 13zm9 2.5A2.5 2.5 0 1 0 19 13a2.5 2.5 0 0 0-2.5 2.5z" /></svg>
                                            </div>
                                            <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input Area */}
                                <div className="p-4 bg-white border-t border-gray-100 flex gap-3 items-end">
                                    <div className="flex-1 bg-gray-100 rounded-2xl flex items-center px-4 py-3 border border-transparent focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                                        <input
                                            type="text"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                            placeholder="Ask me anything..."
                                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm placeholder-gray-400 text-gray-800"
                                            autoFocus
                                        />
                                    </div>
                                    <button
                                        onClick={handleSend}
                                        disabled={!inputValue.trim() || isTyping}
                                        className={`p-3 rounded-full flex items-center justify-center transition-all shadow-md flex-shrink-0 ${inputValue.trim() && !isTyping
                                                ? 'bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-105 active:scale-95'
                                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={() => setShowChat(!showChat)}
                            className="flex items-center gap-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 group"
                        >
                            <span className="font-bold tracking-wide">AI Asistant</span>
                            <div className="relative">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                                </svg>
                                <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full border-2 border-indigo-600"></span>
                            </div>
                        </button>
                    </div>
                </div>
            )}

            {/* Main Toggle Button */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 ${isExpanded ? 'bg-gray-200 text-gray-600 hover:bg-gray-300' : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white'}`}
                title={isExpanded ? "Collapse" : "Contact Support"}
            >
                {isExpanded ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3.75h9m-9 3.75h9m-9 3.75h9" />
                    </svg>
                )}
            </button>
        </div>
    );
}
