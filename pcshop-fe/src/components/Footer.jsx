export default function Footer() {
    return (
        <footer className="bg-primary text-white pt-12 pb-6 mt-16 text-sm">
            <div className="container-custom mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                <div className="col-span-1 md:col-span-1">
                    <h3 className="text-xl font-bold mb-4 uppercase text-white">
                        About Us
                    </h3>
                    <div className="space-y-2 text-gray-400">
                        <p>PCSHOP - High End PC & Gaming Gear</p>
                        <p>Address: Long Biên, Hà Nội</p>
                        <p>Hotline: 090 456 0681</p>
                        <p>Email: lamdung04@gmail.com</p>
                    </div>
                </div>

                <div>
                    <h4 className="font-bold mb-4 uppercase">Customer Support</h4>
                    <ul className="space-y-2 text-gray-400">
                        <li><a href="#" className="hover:text-white transition-colors">Purchase Guide</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Warranty Police</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Payment Methods</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Transportation</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold mb-4 uppercase">Information</h4>
                    <ul className="space-y-2 text-gray-400">
                        <li><a href="#" className="hover:text-white transition-colors">Showroom System</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Business Cooperation</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">News & Review</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold mb-4 uppercase">Community</h4>
                    <div className="flex gap-4 mb-4">
                        {/* Social Icons would go here */}
                        <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">FB</div>
                        <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors">YT</div>
                        <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center cursor-pointer hover:bg-pink-600 transition-colors">IG</div>
                    </div>
                    <h4 className="font-bold mb-2 uppercase">Newsletter</h4>
                    <div className="flex">
                        <input type="email" placeholder="Email address" className="bg-white text-black px-3 py-2 text-xs w-full focus:outline-none" />
                        <button className="bg-red-600 text-white px-3 font-bold uppercase hover:bg-red-700">Sub</button>
                    </div>
                </div>
            </div>

            <div className="container-custom mx-auto border-t border-white/10 pt-6 text-center text-gray-500 text-xs">
                © {new Date().getFullYear()} PCSHOP Vietnam. All rights reserved.
            </div>
        </footer>
    );
}
