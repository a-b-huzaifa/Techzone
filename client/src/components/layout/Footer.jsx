import { Link } from 'react-router-dom';
import { Zap, ArrowRight } from 'lucide-react';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { Mail, Phone, MapPin } from 'lucide-react';


const footerLinks = {
  Shop: [
    { label: 'Laptops', href: '/products?category=Laptops' },
    { label: 'Smartphones', href: '/products?category=Smartphones' },
    { label: 'Gaming', href: '/products?category=Gaming' },
    { label: 'Audio', href: '/products?category=Audio' },
    { label: 'Accessories', href: '/products?category=Accessories' },
  ],
  Account: [
    { label: 'My Profile', href: '/profile' },
    { label: 'Orders', href: '/orders' },
    { label: 'Wishlist', href: '/wishlist' },
    { label: 'Cart', href: '/cart' },
  ],
  Support: [
    { label: 'Contact Us', href: '#' },
    { label: 'FAQ', href: '#' },
    { label: 'Returns Policy', href: '#' },
    { label: 'Shipping Info', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-dark-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Newsletter Banner */}
        <div className="glass-card p-8 mb-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-cyan-500/5 to-primary-500/10" />
          <div className="relative">
            <h3 className="text-2xl font-bold font-display text-white mb-2">Stay in the Loop</h3>
            <p className="text-slate-400 mb-6">Get the latest deals, product launches, and tech news.</p>
            <form className="flex gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="input-dark flex-1"
              />
              <button type="submit" className="btn-neon py-3 px-5 flex items-center gap-2">
                Subscribe <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center shadow-neon">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold font-display text-gradient">TechZone</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
              Your one-stop destination for premium tech products. Experience the future of technology, today.
            </p>
            <div className="space-y-2 text-sm text-slate-400">
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary-400" /> 123 Tech Street, Silicon Valley</div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary-400" /> +1 (800) TECH-ZONE</div>
              <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary-400" /> support@techzone.com</div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-white mb-4 font-display">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-slate-400 hover:text-primary-400 transition-colors hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="neon-divider my-10" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} TechZone. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-primary-500/50 transition-all">
              <FaGithub className="w-4 h-4" />
            </a>
            <a href="#" className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-primary-500/50 transition-all">
              <FaTwitter className="w-4 h-4" />
            </a>
            <a href="#" className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-primary-500/50 transition-all">
              <FaLinkedin className="w-4 h-4" />
            </a>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Secured by</span>
            <span className="text-primary-400 font-semibold">Stripe</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
