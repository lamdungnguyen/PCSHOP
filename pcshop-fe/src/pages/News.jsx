import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function News() {
    const articles = [
        { title: "NVIDIA RTX 50 Series: What we know so far", image: "https://via.placeholder.com/600x400", date: "Jan 28, 2026", excerpt: "The next generation of graphics cards is around the corner. here is everything we know about performance, pricing, and release dates." },
        { title: "Intel Core Ultra vs AMD Ryzen 9000: The Showdown", image: "https://via.placeholder.com/600x400", date: "Jan 25, 2026", excerpt: "We benchmark the latest flagship CPUs to see which one reigns supreme for gaming and productivity." },
        { title: "Building a White PC Setup? Read this first", image: "https://via.placeholder.com/600x400", date: "Jan 20, 2026", excerpt: "Tips and tricks for selecting the best white components for a clean, aesthetic build." },
        { title: "Best Gaming Keyboards of 2026", image: "https://via.placeholder.com/600x400", date: "Jan 15, 2026", excerpt: "From custom mechanical boards to hall effect switches, here are the top picks for every budget." },
    ];

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

                        <div className="space-y-8">
                            {articles.map((article, index) => (
                                <div key={index} className="flex flex-col md:flex-row gap-6 group cursor-pointer">
                                    <div className="w-full md:w-64 h-48 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                                        <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-xs text-red-600 font-bold uppercase mb-2">Technology</div>
                                        <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{article.title}</h2>
                                        <p className="text-gray-500 mb-4 line-clamp-2">{article.excerpt}</p>
                                        <div className="text-xs text-gray-400 flex items-center gap-2">
                                            <span>By Admin</span> • <span>{article.date}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
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
