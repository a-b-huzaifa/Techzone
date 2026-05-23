import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { ArrowRight, Star, Zap, Shield, Truck, Headphones, TrendingUp } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import { useGetHomepageProductsQuery } from '../redux/api/productApi';
import ProductCard from '../components/ProductCard';

const heroSlides = [
  {
    tag: 'New Release',
    title: 'Next-Gen',
    highlight: 'Laptops',
    subtitle: 'Experience unmatched performance with the latest Intel & AMD processors.',
    cta: 'Shop Laptops',
    href: '/products?category=Laptops',
    gradient: 'from-primary-500 to-cyan-500',
    emoji: '💻',
  },
  {
    tag: 'Best Seller',
    title: 'Flagship',
    highlight: 'Smartphones',
    subtitle: 'Capture every moment with pro-grade cameras and all-day battery life.',
    cta: 'Shop Phones',
    href: '/products?category=Smartphones',
    gradient: 'from-violet-500 to-pink-500',
    emoji: '📱',
  },
  {
    tag: 'Hot Deals',
    title: 'Pro Gaming',
    highlight: 'Setup',
    subtitle: 'Dominate every match with ultra-fast displays and precision peripherals.',
    cta: 'Shop Gaming',
    href: '/products?category=Gaming',
    gradient: 'from-green-500 to-cyan-500',
    emoji: '🎮',
  },
];

const categories = [
  { name: 'Laptops',     icon: '💻', count: '120+', color: 'from-primary-500 to-cyan-500' },
  { name: 'Smartphones', icon: '📱', count: '85+',  color: 'from-violet-500 to-pink-500' },
  { name: 'Gaming',      icon: '🎮', count: '60+',  color: 'from-green-500 to-cyan-500' },
  { name: 'Audio',       icon: '🎧', count: '45+',  color: 'from-amber-500 to-orange-500' },
  { name: 'Tablets',     icon: '📟', count: '30+',  color: 'from-blue-500 to-cyan-500' },
  { name: 'Accessories', icon: '⌨️', count: '200+', color: 'from-pink-500 to-rose-500' },
  { name: 'Cameras',     icon: '📷', count: '40+',  color: 'from-indigo-500 to-purple-500' },
  { name: 'Wearables',   icon: '⌚', count: '35+',  color: 'from-teal-500 to-cyan-500' },
];

const features = [
  { icon: Truck,      title: 'Free Shipping',  desc: 'On all orders above $50',  color: 'text-cyan-400' },
  { icon: Shield,     title: 'Secure Payment', desc: '100% protected by Stripe', color: 'text-primary-400' },
  { icon: Zap,        title: 'Fast Delivery',  desc: '2-3 business days',        color: 'text-amber-400' },
  { icon: Headphones, title: '24/7 Support',   desc: 'Always here to help',      color: 'text-green-400' },
];

const stats = [
  { value: '50K+', label: 'Happy Customers' },
  { value: '500+', label: 'Products' },
  { value: '15+',  label: 'Brands' },
  { value: '99%',  label: 'Satisfaction Rate' },
];

const fadeUp = {
  hidden:   { opacity: 0, y: 40 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};
const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
};

function Section({ children }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger}>
      {children}
    </motion.div>
  );
}

function SkeletonGrid({ count = 4, cols = 4 }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${cols} gap-6`}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="glass-card overflow-hidden">
          <div className="skeleton h-48" />
          <div className="p-4 space-y-3">
            <div className="skeleton h-4 w-3/4" />
            <div className="skeleton h-4 w-1/2" />
            <div className="skeleton h-8 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const { data, isLoading } = useGetHomepageProductsQuery();

  return (
    <div className="pt-16 md:pt-20">

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 animated-bg" />
        {/* Glow orbs */}
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse-slow"
          style={{ background: 'rgba(99,102,241,0.18)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl animate-pulse-slow"
          style={{ background: 'rgba(6,182,212,0.12)', animationDelay: '2s' }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
          <Swiper
            modules={[Autoplay, Pagination, EffectFade]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="w-full"
          >
            {heroSlides.map((slide, idx) => (
              <SwiperSlide key={idx}>
                <div className="grid lg:grid-cols-2 gap-12 items-center py-8 pb-16">
                  {/* Text */}
                  <div>
                    <motion.div
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="inline-flex items-center gap-2 badge badge-primary mb-6"
                    >
                      <Zap className="w-3 h-3" />
                      {slide.tag}
                    </motion.div>

                    <motion.h1
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-5xl md:text-7xl font-bold font-display leading-tight mb-6"
                    >
                      <span className="text-white">{slide.title}</span>
                      <br />
                      <span className={`bg-gradient-to-r ${slide.gradient} bg-clip-text text-transparent`}>
                        {slide.highlight}
                      </span>
                    </motion.h1>

                    <motion.p
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-lg text-slate-400 mb-8 max-w-md leading-relaxed"
                    >
                      {slide.subtitle}
                    </motion.p>

                    <motion.div
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="flex flex-wrap gap-4"
                    >
                      <Link to={slide.href} className="btn-neon gap-2">
                        {slide.cta} <ArrowRight className="w-4 h-4" />
                      </Link>
                      <Link to="/products" className="btn-ghost gap-2">
                        View All
                      </Link>
                    </motion.div>

                    {/* Social proof */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="flex items-center gap-6 mt-10"
                    >
                      <div className="flex -space-x-2">
                        {['A', 'B', 'C', 'D'].map((letter, i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white"
                            style={{ border: '2px solid #0d0d14' }}
                          >
                            {letter}
                          </div>
                        ))}
                      </div>
                      <div>
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                        <p className="text-slate-400 text-xs mt-1">50,000+ happy customers</p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Hero Visual */}
                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="hidden lg:flex items-center justify-center"
                  >
                    <div className="relative">
                      <div
                        className={`w-72 h-72 rounded-full bg-gradient-to-br ${slide.gradient} opacity-20 blur-3xl absolute inset-0 m-auto`}
                      />
                      <div className="relative glass-card p-12 text-center">
                        <div className="text-9xl mb-4 animate-float">{slide.emoji}</div>
                        <div className={`text-lg font-bold bg-gradient-to-r ${slide.gradient} bg-clip-text text-transparent`}>
                          {slide.highlight}
                        </div>
                        <div className="absolute -top-4 -right-4 glass-card px-3 py-2 text-xs font-semibold text-green-400 whitespace-nowrap">
                          ✓ In Stock
                        </div>
                        <div className="absolute -bottom-4 -left-4 glass-card px-3 py-2 text-xs font-semibold text-amber-400 whitespace-nowrap">
                          ⚡ Flash Deal
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-300 to-transparent" />
      </section>

      {/* ===== FEATURES BAR ===== */}
      <section className="py-8 border-t border-b bg-dark-200" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-3"
              >
                <div className={`p-2.5 rounded-xl ${feat.color}`} style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <feat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{feat.title}</p>
                  <p className="text-slate-500 text-xs">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Section>
            <motion.div variants={fadeUp} className="text-center mb-12">
              <span className="badge badge-primary mb-4 inline-flex">Browse By Category</span>
              <h2 className="section-title text-white mt-3">
                Shop by <span className="text-gradient">Category</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {categories.map((cat, i) => (
                <motion.div key={i} variants={fadeUp}>
                  <Link
                    to={`/products?category=${cat.name}`}
                    className="group flex flex-col items-center gap-3 p-4 glass-card"
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {cat.icon}
                    </div>
                    <div className="text-center">
                      <p className="text-white font-medium text-sm group-hover:text-primary-400 transition-colors">{cat.name}</p>
                      <p className="text-slate-500 text-xs">{cat.count} items</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="py-20 bg-dark-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Section>
            <motion.div variants={fadeUp} className="flex items-center justify-between mb-12">
              <div>
                <span className="badge badge-primary mb-3 inline-flex">Hand-picked for you</span>
                <h2 className="section-title text-white mt-2">
                  Featured <span className="text-gradient">Products</span>
                </h2>
              </div>
              <Link to="/products?featured=true" className="btn-ghost gap-2 hidden md:inline-flex">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {isLoading ? (
              <SkeletonGrid count={8} cols={4} />
            ) : (data?.featured || []).length === 0 ? (
              <div className="text-center py-16 glass-card">
                <p className="text-slate-400 text-lg">No featured products yet.</p>
                <Link to="/products" className="btn-neon mt-4 inline-flex">Browse All Products</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {(data?.featured || []).map((product, i) => (
                  <motion.div key={product._id} variants={fadeUp} custom={i}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            )}
          </Section>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-20 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(49,46,129,0.3), #0d0d14, rgba(6,78,59,0.1))' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, type: 'spring', stiffness: 100 }}
                viewport={{ once: true }}
                className="glass-card p-8"
              >
                <div className="text-4xl md:text-5xl font-bold font-display text-gradient mb-2">
                  {stat.value}
                </div>
                <p className="text-slate-400 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NEW ARRIVALS ===== */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Section>
            <motion.div variants={fadeUp} className="flex items-center justify-between mb-12">
              <div>
                <span className="badge badge-warning mb-3 inline-flex gap-1">
                  <TrendingUp className="w-3 h-3" /> New Arrivals
                </span>
                <h2 className="section-title text-white mt-2">
                  Just <span className="text-gradient">Arrived</span>
                </h2>
              </div>
              <Link to="/products?newArrival=true" className="btn-ghost gap-2 hidden md:inline-flex">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {isLoading ? (
              <SkeletonGrid count={4} cols={4} />
            ) : (data?.newArrivals || []).length === 0 ? (
              <div className="text-center py-12 glass-card">
                <p className="text-slate-400">No new arrivals yet — check back soon!</p>
              </div>
            ) : (
              <Swiper
                modules={[Autoplay, Navigation]}
                spaceBetween={24}
                slidesPerView={1}
                navigation
                autoplay={{ delay: 3000 }}
                breakpoints={{
                  640:  { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                  1280: { slidesPerView: 4 },
                }}
              >
                {(data?.newArrivals || []).map((product) => (
                  <SwiperSlide key={product._id}>
                    <ProductCard product={product} />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </Section>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="py-20 bg-dark-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl p-12 md:p-20 text-center"
          >
            <div
              className="absolute inset-0 rounded-3xl"
              style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.3), #181825, rgba(6,182,212,0.2))' }}
            />
            <div
              className="absolute inset-0 rounded-3xl"
              style={{ border: '1px solid rgba(99,102,241,0.2)' }}
            />
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 blur-3xl"
              style={{ background: 'rgba(99,102,241,0.2)' }}
            />

            <div className="relative">
              <span className="badge badge-primary mb-6 inline-flex">Limited Time Offer</span>
              <h2 className="text-4xl md:text-6xl font-bold font-display text-white mb-4 mt-3">
                Get <span className="text-gradient">20% Off</span> Your First Order
              </h2>
              <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
                Sign up today and unlock exclusive deals, early access to new products, and member-only discounts.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/register" className="btn-neon gap-2 text-lg px-8 py-4">
                  Get Started Free <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/products" className="btn-ghost gap-2 text-lg px-8 py-4">
                  Browse Products
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
