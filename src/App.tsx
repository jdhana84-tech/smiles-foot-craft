/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, useInView } from "motion/react";
import { 
  Star, 
  MapPin, 
  Phone, 
  Instagram, 
  ChevronRight, 
  Award, 
  Users, 
  Zap,
  Menu,
  X,
  ArrowDown,
  Heart,
  Sparkles,
  Youtube,
  Facebook,
  MessageCircle
} from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// --- 3D Component ---

const ThreeDHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Abstract Shape: TorusKnot for a "crafted" feel
    const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0xD4AF37, 
      metalness: 0.9, 
      roughness: 0.1,
      wireframe: true
    });
    const knot = new THREE.Mesh(geometry, material);
    scene.add(knot);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(20, 20, 20);
    scene.add(pointLight);

    camera.position.z = 30;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);
      
      knot.rotation.x += 0.001;
      knot.rotation.y += 0.001;

      // Mouse interaction
      knot.rotation.x += mouse.current.y * 0.005;
      knot.rotation.y += mouse.current.x * 0.005;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
};

// --- UI Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Story", href: "#about" },
    { name: "Experience", href: "#experience" },
    { name: "Showcase", href: "#showcase" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? "bg-black/90 backdrop-blur-xl py-3 border-b border-gold/10" : "bg-transparent py-6 md:py-8"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl md:text-2xl font-bold tracking-tighter text-white flex items-center gap-2"
        >
          <span className="text-gold">SMILES</span>
          <span className="font-light opacity-50">FOOT CRAFT</span>
        </motion.div>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link, i) => (
            <motion.a
              key={link.name}
              href={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-gold transition-all"
            >
              {link.name}
            </motion.a>
          ))}
        </div>

        <button 
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 w-full bg-black border-b border-gold/10 py-10 px-8 md:hidden"
        >
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xl font-bold uppercase tracking-widest text-gray-400 hover:text-gold"
              >
                {link.name}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

const Hero = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(".hero-text", 
      { opacity: 0, y: 50 }, 
      { opacity: 1, y: 0, duration: 1.5, ease: "power4.out", stagger: 0.2 }
    );
  }, []);

  return (
    <section id="home" ref={sectionRef} className="relative min-h-screen flex items-center overflow-hidden bg-black pt-20 md:pt-0">
      {/* 3D Background Element */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full md:w-[60%] h-[50vh] md:h-[90vh] pointer-events-none opacity-20 blur-[1px] z-0">
        <ThreeDHero />
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-black" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 w-full relative z-10">
        <div className="max-w-3xl text-center md:text-left">
          <span className="hero-text inline-block text-gold font-bold tracking-[0.3em] uppercase text-[10px] mb-4 md:mb-6">
            Crafting Comfort Since 2003
          </span>
          <h1 className="hero-text font-bold text-white leading-[0.85] tracking-tighter mb-6 md:mb-8">
            Step Into <br />
            <span className="text-gold italic serif">Comfort.</span>
          </h1>
          <p className="hero-text text-gray-500 text-base md:text-xl max-w-md mx-auto md:mx-0 mb-8 md:mb-12 leading-relaxed font-light">
            A legacy of trust and affordable luxury for families, rooted in the heart of Chennai.
          </p>
          <motion.a
            href="#about"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hero-text inline-flex items-center gap-4 text-white font-bold uppercase tracking-widest text-xs group"
          >
            <span className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-gold group-hover:border-gold transition-all duration-500">
              <ArrowDown className="w-4 h-4 group-hover:text-black" />
            </span>
            Explore Our Story
          </motion.a>
          
          <motion.a
            href="https://wa.me/919884567854"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            whileHover={{ opacity: 1, x: 5 }}
            className="hero-text block mt-8 text-[10px] uppercase tracking-[0.2em] text-white font-medium transition-all"
          >
            Online Shopping Available via WhatsApp →
          </motion.a>
        </div>
      </div>
    </section>
  );
};

const About = () => {
  const container = useRef(null);
  const isInView = useInView(container, { once: true, margin: "-100px" });

  return (
    <section id="about" ref={container} className="section-padding bg-[#050505] relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative order-2 md:order-1"
        >
          <div className="aspect-[3/4] rounded-3xl overflow-hidden border border-white/5">
            <img 
              src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=1000" 
              alt="Artistic Footwear" 
              className="w-full h-full object-cover grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-1000"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-gold/5 blur-[80px] rounded-full" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="order-1 md:order-2 text-center md:text-left"
        >
          <h2 className="text-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-6 md:mb-8">The Legacy</h2>
          <h3 className="font-bold text-white mb-6 md:mb-10 leading-tight tracking-tighter">
            Two Decades of <br />
            Unwavering Trust.
          </h3>
          <p className="text-gray-400 text-base md:text-lg mb-6 md:mb-10 leading-relaxed font-light">
            Located on the historic Mint Street of Sowcarpet, Smiles Foot Craft has been more than just a store since 2003. It's a place where quality meets affordability, and where every family finds their perfect fit.
          </p>
          <p className="text-gray-500 text-sm md:text-base mb-8 md:mb-12 leading-relaxed font-light">
            Our journey is built on the smiles of thousands of customers who value comfort as much as style. We believe that premium footwear should be accessible to everyone.
          </p>
          <div className="flex items-center justify-center md:justify-start gap-4 text-gold">
            <Award className="w-6 h-6" />
            <span className="font-bold uppercase tracking-widest text-[10px]">Certified Comfort Excellence</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Experience = () => {
  const features = [
    { icon: <Award />, title: "20+ Years", desc: "A heritage of excellence in Chennai's retail landscape." },
    { icon: <Sparkles />, title: "600+ Designs", desc: "Curated variety for every occasion and personality." },
    { icon: <Users />, title: "Family First", desc: "Trusted by generations for kids and women's footwear." },
    { icon: <Heart />, title: "Comfort Focus", desc: "Ergonomic designs that prioritize your daily ease." },
  ];

  return (
    <section id="experience" className="section-padding bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-4 md:mb-6">Experience</h2>
          <h3 className="font-bold text-white tracking-tighter">The Smiles Standard</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-8 md:p-10 rounded-3xl bg-[#080808] border border-white/5 hover:border-gold/20 transition-all duration-500"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gold/5 text-gold flex items-center justify-center mb-6 md:mb-8 group-hover:bg-gold group-hover:text-black transition-all duration-500">
                {f.icon}
              </div>
              <h4 className="text-white font-bold text-lg md:text-xl mb-3 md:mb-4">{f.title}</h4>
              <p className="text-gray-500 text-xs md:text-sm leading-relaxed font-light">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Showcase = () => {
  const categories = [
    { title: "Kids Collection", desc: "Playful, durable, and supportive.", image: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&q=80&w=800" },
    { title: "Women's Elegance", desc: "Graceful designs for daily comfort.", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800" },
    { title: "Party & Festive", desc: "Celebrate in style and ease.", image: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&q=80&w=800" },
  ];

  return (
    <section id="showcase" className="section-padding bg-[#050505]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 md:mb-24 gap-6 md:gap-8 text-center md:text-left">
          <div>
            <h2 className="text-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-4 md:mb-6">Showcase</h2>
            <h3 className="font-bold text-white tracking-tighter">Curated Collections</h3>
          </div>
          <p className="text-gray-500 max-w-sm font-light text-sm md:text-base">Explore our diverse range of footwear styles, each crafted with attention to detail and comfort.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="group relative aspect-[4/5] rounded-3xl overflow-hidden"
            >
              <img 
                src={cat.image} 
                alt={cat.title} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
              <div className="absolute bottom-6 md:bottom-10 left-6 md:left-10 right-6 md:right-10">
                <h4 className="text-white font-bold text-xl md:text-2xl mb-2">{cat.title}</h4>
                <p className="text-gray-400 text-xs md:text-sm font-light opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500">{cat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Trust = () => {
  const testimonials = [
    { name: "Priya S.", text: "The only place I trust for my kids' school and party shoes. The comfort is unmatched.", rating: 5 },
    { name: "Anjali R.", text: "Beautiful designs that are actually comfortable to wear all day. A Sowcarpet gem.", rating: 5 },
    { name: "Meera K.", text: "Been a customer for 15 years. The quality and service have always been consistent.", rating: 5 },
  ];

  return (
    <section className="section-padding bg-black border-y border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-4 md:mb-6">Customer Trust</h2>
          <h3 className="font-bold text-white tracking-tighter">Voices of Satisfaction</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 md:p-10 rounded-3xl bg-[#080808] border border-white/5"
            >
              <div className="flex gap-1 mb-6 md:mb-8">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-gold fill-gold" />
                ))}
              </div>
              <p className="text-gray-300 italic mb-8 md:mb-10 leading-relaxed font-light text-sm md:text-base">"{t.text}"</p>
              <h4 className="text-white font-bold tracking-widest text-[10px] uppercase">{t.name}</h4>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Gallery = () => {
  const images = [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1581101767113-1677fe075684?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&q=80&w=600",
  ];

  return (
    <section className="section-padding bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto mb-12 md:mb-16 text-center md:text-left">
        <h2 className="text-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-4 md:mb-6">Visual Journey</h2>
        <h3 className="font-bold text-white tracking-tighter">Details in Craft</h3>
      </div>
      <div className="flex gap-6 md:gap-8 overflow-x-auto px-6 md:px-8 no-scrollbar pb-10">
        {images
  .filter((img) => typeof img === "string" && img.trim() !== "")
  .map((img, i) => (
    <motion.div
      key={i}
      whileHover={{ scale: 1.05 }}
      className="flex-shrink-0 w-64 md:w-80 h-80 md:h-96"
    >
      <img
        src={img}
        alt=""
        className="w-full h-full object-cover grayscale hover:grayscale-0 transition"
        onError={(e) => {
          e.currentTarget.parentElement.style.display = "none";
        }}
      />
    </motion.div>
))}
      </div>
    </section>
  );
};

const Contact = () => {
  return (
    <section id="contact" className="section-padding bg-[#050505]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
          <div className="text-center md:text-left">
            <h2 className="text-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-6 md:mb-8">Connect</h2>
            <h3 className="font-bold text-white mb-8 md:mb-12 tracking-tighter">Visit Our Store.</h3>
            
            <div className="space-y-8 md:space-y-10">
              <a 
                href="https://wa.me/919884567854" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-gold/5 text-gold flex items-center justify-center shrink-0 group-hover:bg-gold group-hover:text-black transition-all duration-500">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm mb-2 uppercase tracking-widest">WhatsApp Shopping</p>
                  <p className="text-gray-500 font-light text-sm md:text-base">+91 98845 67854</p>
                </div>
              </a>

              <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
                <div className="w-12 h-12 rounded-2xl bg-gold/5 text-gold flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm mb-2 uppercase tracking-widest">Address</p>
                  <p className="text-gray-500 font-light leading-relaxed text-sm md:text-base">94 Mint Street, Sowcarpet, Chennai, <br />Tamil Nadu 600079</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-4">
                <a href="https://www.instagram.com/smilesfootcraft/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 text-gray-400 flex items-center justify-center group-hover:bg-gold group-hover:text-black transition-all duration-500">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">Instagram</span>
                </a>
                <a href="https://www.youtube.com/@SMILESFOOTCRAFT" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 text-gray-400 flex items-center justify-center group-hover:bg-gold group-hover:text-black transition-all duration-500">
                    <Youtube className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">YouTube</span>
                </a>
                <a href="https://www.facebook.com/smilesfootcraft" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 text-gray-400 flex items-center justify-center group-hover:bg-gold group-hover:text-black transition-all duration-500">
                    <Facebook className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">Facebook</span>
                </a>
              </div>
            </div>
          </div>

          <div className="aspect-square rounded-3xl overflow-hidden border border-white/5 grayscale hover:grayscale-0 transition-all duration-1000">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.0467760582064!2d80.27736927484368!3d13.096222087230691!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a526f59aec0df21%3A0xae3c1e078d3232e4!2sSmiles%20Foot%20Craft!5e0!3m2!1sen!2sin!4v1777990519307!5m2!1sen!2sin"
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy"
              title="Google Maps"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-12 md:py-20 bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-10">
        <div className="text-xl md:text-2xl font-bold tracking-tighter text-white text-center md:text-left">
          <span className="text-gold">SMILES</span>
          <span className="font-light opacity-50 ml-2">FOOT CRAFT</span>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Privacy</a>
          <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Terms</a>
          <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Cookies</a>
        </div>

        <div className="flex gap-6">
          <a href="https://www.instagram.com/smilesfootcraft/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-gold hover:text-black transition-all duration-500">
            <Instagram className="w-4 h-4" />
          </a>
          <a href="https://www.youtube.com/@SMILESFOOTCRAFT" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-gold hover:text-black transition-all duration-500">
            <Youtube className="w-4 h-4" />
          </a>
          <a href="https://www.facebook.com/smilesfootcraft" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-gold hover:text-black transition-all duration-500">
            <Facebook className="w-4 h-4" />
          </a>
        </div>
      </div>
      <div className="text-center mt-10 md:mt-12 px-6">
        <p className="text-gray-700 text-[10px] uppercase tracking-[0.3em]">© 2026 Smiles Foot Craft • Chennai</p>
      </div>
    </footer>
  );
};

// --- Main App ---

export default function App() {
  useEffect(() => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId) {
          const target = document.querySelector(targetId);
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth'
            });
          }
        }
      });
    });
  }, []);

  return (
    <div className="bg-black min-h-screen font-sans selection:bg-gold selection:text-black text-white">
      <Navbar />
      <Hero />
      <About />
      <Experience />
      <Showcase />
      <Trust />
      <Gallery />
      <Contact />
      <Footer />
      
      {/* Floating WhatsApp Button */}
      <motion.a
        href="https://wa.me/919884567854"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1, y: -5 }}
        className="fixed bottom-8 right-8 z-[60] w-14 h-14 rounded-full bg-gold shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center justify-center text-black transition-all"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.a>
      
      {/* Custom Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;900&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
          background-color: black;
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .serif {
          font-family: 'Georgia', serif;
        }
        
        .bg-radial-gradient {
          background: radial-gradient(circle at center, var(--tw-gradient-from), var(--tw-gradient-to));
        }
      `}} />
    </div>
  );
}
