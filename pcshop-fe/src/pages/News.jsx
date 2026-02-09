import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useEffect, useState } from 'react';
import { getAllNews } from '../services/newsService';

export default function News() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNews();
    }, []);

    const loadNews = async () => {
        try {
            const data = await getAllNews();
            setArticles(data);
        } catch (error) {
            console.error("Failed to load news", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background min-h-screen font-sans">
            <Navbar />

            <div className="container-custom mx-auto pt-8 pb-20">
                <div className="flex gap-2 text-sm text-gray-500 mb-6">
                    <a href="/" className="hover:text-primary">Home</a> / <span className="text-primary font-bold">News & Reviews</span>
                </div>

                <div className="grid lg:grid-cols-12 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-8">
                        <h1 className="text-3xl font-bold mb-8 pb-2 border-b-2 border-primary inline-block">Latest News</h1>

                        {loading ? (
                            <div className="text-center py-10">Loading news...</div>
                        ) : (
                            <div className="space-y-8">
                                {articles.length === 0 ? (
                                    <p>No news available.</p>
                                ) : (
                                    articles.map((article) => (
                                        <div key={article.id} className="flex flex-col md:flex-row gap-6 group cursor-pointer border-b border-gray-100 pb-8 last:border-0">
                                            <div className="w-full md:w-64 h-48 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                                                <img
                                                    src={article.imageUrl || "https://via.placeholder.com/600x400"}
                                                    alt={article.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-xs text-red-600 font-bold uppercase mb-2">Technology</div>
                                                <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{article.title}</h2>
                                                <p className="text-gray-500 mb-4 line-clamp-2">{article.content}</p>
                                                <div className="text-xs text-gray-400 flex items-center gap-2">
                                                    <span>By {article.author || "Admin"}</span> • <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Search */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200">
                            <h3 className="font-bold text-lg mb-4">Search News</h3>
                            <input type="text" placeholder="Keyword..." className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary" />
                        </div>

                        {/* Trending */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200">
                            <h3 className="font-bold text-lg mb-4">Trending Now</h3>
                            <ul className="space-y-4">
                                {[1, 2, 3, 4].map(n => (
                                    <li key={n} className="flex gap-3 items-start group cursor-pointer">
                                        <span className="text-2xl font-bold text-gray-200 group-hover:text-primary transition-colors">0{n}</span>
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors line-clamp-2">
                                            Top 10 PC Games to play in 2026 if you have an RTX 5090
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div className="bg-primary text-white p-6 rounded-xl shadow-lg">
                            <h3 className="font-bold text-lg mb-2">Subscribe</h3>
                            <p className="text-sm text-white/80 mb-4">Get the latest tech news delivered to your inbox.</p>
                            <input type="email" placeholder="Email address" className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm text-white placeholder:text-white/50 mb-2 focus:outline-none focus:border-white" />
                            <button className="w-full bg-white text-primary font-bold py-2 rounded-lg text-sm hover:bg-gray-100">Subscribe</button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
