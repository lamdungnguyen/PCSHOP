import { useState } from 'react';

export default function FloatingActions() {
    const [showChat, setShowChat] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! How can I help you choose a PC today?", sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isExpanded, setIsExpanded] = useState(true);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMsg = { id: Date.now(), text: inputValue, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');

        // Show loading state (optional, can add a typing indicator later)
        const loadingMsgId = Date.now() + 1;
        // setMessages(prev => [...prev, { id: loadingMsgId, text: "Thinking...", sender: 'bot', loading: true }]);

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
            // Remove loading message if implemented
            // setMessages(prev => prev.filter(msg => msg.id !== loadingMsgId));

            const botMsg = { id: Date.now() + 2, text: data.reply, sender: 'bot' };
            setMessages(prev => [...prev, botMsg]);

        } catch (error) {
            console.error("Chat error:", error);
            const errorMsg = { id: Date.now() + 3, text: "Sorry, I'm having trouble connecting to the server.", sender: 'bot' };
            setMessages(prev => [...prev, errorMsg]);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
            {/* Expanded Content */}
            {isExpanded && (
                <div className="flex flex-col items-end gap-3 animate-fade-in-up">
                    {/* Social Buttons */}
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={() => window.open('https://zalo.me/0904560681', '_blank')}
                            className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform" title="Zalo">
                            <span className="font-bold text-[10px]">Zalo</span>
                        </button>
                        <button
                            onClick={() => window.open('https://t.me/lamdunggg', '_blank')}
                            className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform" title="Messenger">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.03 2 11c0 2.87 1.69 5.4 4.37 6.96-.06.55-.38 1.94-1.29 3.03 1.15.12 3.01-.13 4.29-1.09 1.48.51 3.08.79 4.63.79 5.52 0 10-4.03 10-9s-4.48-9-10-9z" /></svg>
                        </button>
                        <button
                            onClick={() => window.open('https://maps.app.goo.gl/N1gv95cg918wRMkD8', '_blank')}
                            className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform" title="Map">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                            </svg>
                        </button>
                    </div>

                    {/* Chatbot Toggle (Main Pill Button) */}
                    <div className="relative">
                        {showChat && (
                            <div className="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden animate-fade-in origin-bottom-right flex flex-col h-96">
                                <div className="bg-primary text-white p-4 flex justify-between items-center flex-shrink-0">
                                    <div>
                                        <div className="font-bold">Chat Support</div>
                                        <div className="text-xs text-white/80">Always here to help</div>
                                    </div>
                                    <button onClick={() => setShowChat(false)} className="hover:bg-white/10 p-1 rounded">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="flex-1 bg-gray-50 p-4 overflow-y-auto space-y-3">
                                    {messages.map(msg => (
                                        <div key={msg.id} className={`flex gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs ${msg.sender === 'bot' ? 'bg-primary' : 'bg-gray-400'}`}>
                                                {msg.sender === 'bot' ? 'AI' : 'U'}
                                            </div>
                                            <div className={`p-2 rounded-lg shadow-sm text-sm border max-w-[80%] break-words ${msg.sender === 'bot'
                                                ? 'bg-white border-gray-100 rounded-tl-none text-gray-800'
                                                : 'bg-primary text-white border-primary rounded-tr-none'
                                                }`}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-3 border-t border-gray-100 bg-white flex gap-2">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                        placeholder="Type a message..."
                                        className="flex-1 text-sm border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:border-primary"
                                    />
                                    <button onClick={handleSend} className="bg-primary hover:bg-primary-hover text-white p-2 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.126A59.768 59.768 0 0 1 21.485 12 59.77 59.77 0 0 1 3.27 20.876L5.999 12Zm0 0h7.5" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={() => setShowChat(!showChat)}
                            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-full shadow-lg transition-all text-sm"
                        >
                            <span className="font-bold">Chat Support</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                            </svg>
                            {/* Notification Dot */}
                            <span className="absolute -top-1 -right-1 bg-red-600 w-3 h-3 rounded-full border-2 border-white"></span>
                        </button>
                    </div>
                </div>
            )}

            {/* Main Toggle Button */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 ${isExpanded ? 'bg-gray-200 text-gray-600 hover:bg-gray-300' : 'bg-primary text-white'}`}
                title={isExpanded ? "Collapse" : "Contact Support"}
            >
                {isExpanded ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3.75h9m-9 3.75h9m-9 3.75h9" />
                    </svg>
                    // Or a headset icon
                    // <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    //     <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                    // </svg>
                )}
            </button>
        </div>
    );
}
