import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// Icons
const ChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);

const ZapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>
);

const BrainIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>
);

const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-black"><path d="M20 6 9 17l-5-5"/></svg>
);

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>
);

const ServerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>
);

const HandshakeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m11 17 2 2a1 1 0 1 0 3-1.47l-10-10a1 1 0 0 0-1.47 3l2.22 2.22"/><path d="m14 14 2.89-2.89a2 2 0 0 0-2.83-2.83l-2.89 2.89"/><path d="m22 13-1.29-1.29a1 1 0 0 0-1.41 0L8.03 23"/></svg>
);

// --- VISUAL EFFECTS COMPONENTS ---

// Neural Network Particles Background
const NeuralParticles = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: { x: number; y: number; vx: number; vy: number }[] = [];
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const initParticles = () => {
            particles = [];
            const particleCount = Math.min(window.innerWidth / 15, 60); // Responsive count
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.3, // Slow movement
                    vy: (Math.random() - 0.5) * 0.3
                });
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'; // Particle color
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)'; // Line color (very subtle)

            particles.forEach((p, i) => {
                // Update position
                p.x += p.vx;
                p.y += p.vy;

                // Bounce off edges
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                // Draw particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
                ctx.fill();

                // Draw connections
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 150) { // Connection distance
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 0, 0, ${0.05 * (1 - dist / 150)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        draw();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-60" />;
};


// --- NAV & LAYOUT ---

// Dynamic Island Navbar - Stable Compression Version
const Navbar = () => {
  const navRef = useRef<HTMLDivElement>(null);
  const linksContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!navRef.current || !linksContainerRef.current) return;
      
      const scrollY = window.scrollY;
      const maxScroll = 200; // Increased distance for a smoother, longer transition
      const progress = Math.min(scrollY / maxScroll, 1);
      
      // Easing function for organic feel (ease-out-cubic)
      const ease = 1 - Math.pow(1 - progress, 3);
      
      // 1. WIDTH: From 100% (approx 1200px visual max) to ~680px (enough to fit content comfortably)
      const maxWidthStart = 1100;
      const maxWidthEnd = 640; 
      const currentWidth = maxWidthStart - ((maxWidthStart - maxWidthEnd) * ease);
      navRef.current.style.maxWidth = `${currentWidth}px`;
      
      // 2. PADDING Y: 24px -> 10px (Slimming down vertically)
      const pyStart = 24;
      const pyEnd = 10;
      const currentPy = pyStart - ((pyStart - pyEnd) * ease);
      navRef.current.style.paddingTop = `${currentPy}px`;
      navRef.current.style.paddingBottom = `${currentPy}px`;

      // 3. PADDING X: 32px -> 12px (Slimming down horizontally)
      const pxStart = 32;
      const pxEnd = 12;
      const currentPx = pxStart - ((pxStart - pxEnd) * ease);
      navRef.current.style.paddingLeft = `${currentPx}px`;
      navRef.current.style.paddingRight = `${currentPx}px`;
      
      // 4. MARGIN TOP: 32px -> 12px
      const mtStart = 32;
      const mtEnd = 12;
      const currentMt = mtStart - ((mtStart - mtEnd) * ease);
      navRef.current.style.marginTop = `${currentMt}px`;
      
      // 5. BORDER RADIUS: 20px -> 50px (More pill-like)
      const brStart = 20;
      const brEnd = 50;
      const currentBr = brStart + ((brEnd - brStart) * ease);
      navRef.current.style.borderRadius = `${currentBr}px`;

      // 6. INTERNAL GAPS: Compress the space between links slightly
      const gapStart = 24; // gap-6
      const gapEnd = 4;    // gap-1
      const currentGap = gapStart - ((gapStart - gapEnd) * ease);
      linksContainerRef.current.style.gap = `${currentGap}px`;

    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Init
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    
    if (element) {
        const offset = 120;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
  };

  return (
    <header className="fixed w-full z-50 flex justify-center pointer-events-none top-0 px-4">
      <nav 
        ref={navRef}
        aria-label="Main Navigation"
        className="
          pointer-events-auto
          glass-nav border border-black/5 shadow-island
          flex items-center justify-between
          overflow-hidden whitespace-nowrap
          w-full max-w-6xl
        "
        style={{
            willChange: 'max-width, padding, margin-top, border-radius',
            padding: '24px 32px',
            marginTop: '32px',
            borderRadius: '20px'
        }}
      >
        {/* Logo Section - STABLE */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm shadow-md">
            A
          </div>
          <span className="text-lg font-bold tracking-tight text-black">
            Alturia
          </span>
        </div>
        
        {/* Links Section - STABLE FONT SIZE */}
        <div 
          ref={linksContainerRef}
          className="flex items-center gap-6"
        >
          {[
            { name: 'Soluciones', href: '#soluciones' },
            { name: 'Método', href: '#metodo' },
            { name: 'Nosotros', href: '#nosotros' }
          ].map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-sm font-medium text-slate-500 hover:text-black hover:bg-black/5 rounded-full px-3 py-2 transition-all duration-300 cursor-pointer"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* CTA Section - STABLE */}
        <div className="flex items-center gap-3 shrink-0">
            <a 
                href="#contact" 
                onClick={(e) => handleNavClick(e, '#contact')}
                className="text-sm font-medium text-slate-500 hover:text-black transition-colors px-2 cursor-pointer hidden sm:block"
            >
                Soporte
            </a>
          <button className="bg-black text-white rounded-full font-semibold hover:bg-zinc-800 transition-all flex items-center gap-1 group shadow-lg shadow-black/10 relative overflow-hidden px-5 py-2 text-sm">
             {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent z-10"></div>
            <span className="relative z-20 flex items-center gap-1">
                Agendar
                <span className="group-hover:translate-x-0.5 transition-transform"><ChevronRight /></span>
            </span>
          </button>
        </div>
      </nav>
    </header>
  );
};

const Hero = () => {
    // Client Logos Data
    const logos = ['VORTEX', 'NEXUS', 'SFERA', 'GLOBAL', 'PRIME', 'AURA', 'SYNTH', 'OMEGA', 'ZENITH', 'FLUX'];

  return (
    <section id="inicio" className="relative pt-48 pb-32 md:pt-60 md:pb-40 overflow-hidden mesh-gradient">
      {/* Background Particles - The "Detail" requested */}
      <NeuralParticles />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-black/5 bg-white/50 backdrop-blur-sm text-xs font-semibold text-slate-800 mb-8 shadow-sm animate-fade-in-up hover:scale-105 transition-transform cursor-default">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-20"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
          </span>
          Agencia de Automatización #1 en España
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 text-black leading-[1.1] animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          Escala tu negocio <br />
          en <span className="text-gradient-primary">piloto automático</span>.
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Eliminamos el caos operativo. Alturia integra Inteligencia Artificial y automatizaciones para que tu equipo se enfoque en crecer, no en tareas repetitivas.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <button className="relative w-full sm:w-auto px-8 py-4 bg-black text-white rounded-full font-semibold hover:bg-zinc-800 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group shadow-soft overflow-hidden">
             {/* Button Shine Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent z-10"></div>
            <span className="relative z-20 flex items-center gap-2">
                Empezar transformación
                <span className="group-hover:translate-x-1 transition-transform"><ChevronRight /></span>
            </span>
          </button>
          <button className="w-full sm:w-auto px-8 py-4 bg-white text-black border border-zinc-200 rounded-full font-semibold hover:bg-zinc-50 hover:border-zinc-300 transition-all shadow-sm">
            Ver demostración
          </button>
        </div>

        {/* Infinite Scroll Logos */}
        <div className="mt-24 pt-12 border-t border-black/5 animate-fade-in-up overflow-hidden w-full relative" style={{ animationDelay: '0.4s' }}>
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10"></div>
            
            <p className="text-xs font-bold text-slate-400 mb-8 tracking-[0.2em] uppercase">Empresas que confían en nosotros</p>
            
            <div className="flex overflow-hidden relative w-full">
                 <div className="flex animate-marquee whitespace-nowrap gap-20">
                    {/* Double the logos to ensure seamless loop */}
                    {[...logos, ...logos].map((logo, index) => (
                        <span key={`${logo}-${index}`} className="text-2xl font-bold text-black/20 font-serif tracking-tighter cursor-default hover:text-black transition-colors duration-300">
                            {logo}
                        </span>
                    ))}
                 </div>
            </div>
        </div>
      </div>
    </section>
  );
};

const ServiceCard = ({ icon: Icon, title, description, className = "", delay = "0s" }) => (
  <div 
    className={`p-8 rounded-[2rem] border border-black/5 bg-white shadow-soft hover:shadow-island transition-all duration-500 group relative overflow-hidden ${className}`} 
    style={{ animationDelay: delay }}
  >
    {/* Hover Glow Effect */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-100 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

    <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-black mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 border border-zinc-100 relative z-10">
      <Icon />
    </div>
    <h3 className="text-2xl font-bold mb-3 text-black relative z-10 group-hover:translate-x-1 transition-transform">{title}</h3>
    <p className="text-slate-600 leading-relaxed relative z-10">{description}</p>
    
    {/* Bottom Line interaction */}
    <div className="absolute bottom-0 left-0 h-1 bg-black w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
  </div>
);

const BentoGrid = () => {
  return (
    <section id="soluciones" className="py-32 bg-white relative">
       {/* Decorative subtle grey blobs */}
       <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-zinc-100/50 rounded-full blur-[120px] pointer-events-none opacity-40"></div>
       <div className="absolute bottom-20 left-0 w-[600px] h-[600px] bg-zinc-100/50 rounded-full blur-[120px] pointer-events-none opacity-40"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-20 md:text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black tracking-tight">Tecnología invisible, <br/>resultados visibles.</h2>
          <p className="text-slate-500 text-lg md:text-xl leading-relaxed">
            Creamos ecosistemas digitales a medida. Desde la captación del cliente hasta la post-venta, todo conectado y automatizado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Large Card - Chatbot */}
          <div className="md:col-span-2 p-10 rounded-[2.5rem] bg-zinc-50 border border-zinc-100 relative overflow-hidden group shadow-soft hover:shadow-island transition-all duration-500">
             
             <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center h-full">
                <div>
                    <div className="inline-block px-3 py-1 rounded-full bg-black text-white text-xs font-bold mb-6 shadow-glow">
                    MÁS SOLICITADO
                    </div>
                    <h3 className="text-3xl font-bold mb-4 text-black group-hover:translate-x-1 transition-transform">Agentes de IA Generativa</h3>
                    <p className="text-slate-600 text-lg leading-relaxed mb-8">
                    Asistentes que no duermen. Entienden lenguaje natural, consultan tu base de conocimientos y ejecutan acciones en tus sistemas.
                    </p>
                    <ul className="space-y-4 mb-6">
                        <li className="flex items-center gap-3 text-slate-800 text-sm font-semibold group/item">
                            <div className="w-6 h-6 rounded-full bg-white border border-zinc-200 flex items-center justify-center shadow-sm group-hover/item:scale-110 transition-transform"><CheckIcon /></div>
                            Atención al cliente 24/7
                        </li>
                        <li className="flex items-center gap-3 text-slate-800 text-sm font-semibold group/item">
                            <div className="w-6 h-6 rounded-full bg-white border border-zinc-200 flex items-center justify-center shadow-sm group-hover/item:scale-110 transition-transform"><CheckIcon /></div>
                            Agendamiento automático
                        </li>
                        <li className="flex items-center gap-3 text-slate-800 text-sm font-semibold group/item">
                            <div className="w-6 h-6 rounded-full bg-white border border-zinc-200 flex items-center justify-center shadow-sm group-hover/item:scale-110 transition-transform"><CheckIcon /></div>
                            Cualificación de Leads
                        </li>
                    </ul>
                </div>
                
                {/* Chat UI Mockup - Monochrome */}
                <div className="bg-white rounded-3xl shadow-lg border border-zinc-100 p-6 flex flex-col gap-4 transform rotate-1 group-hover:rotate-0 transition-transform duration-700 group-hover:scale-105">
                   <div className="flex items-center gap-3 border-b border-zinc-50 pb-4">
                        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white text-xs font-bold animate-pulse-slow">AI</div>
                        <div>
                            <div className="text-sm font-bold text-black">Alturia Bot</div>
                            <div className="text-[10px] text-zinc-400 flex items-center gap-1">● En línea</div>
                        </div>
                   </div>
                   <div className="self-end bg-black text-white px-5 py-3 rounded-2xl rounded-tr-sm text-sm shadow-md max-w-[85%]">
                     Necesito reducir el tiempo de respuesta de mis emails.
                   </div>
                   <div className="self-start bg-zinc-100 text-zinc-800 px-5 py-3 rounded-2xl rounded-tl-sm text-sm max-w-[90%]">
                     Podemos implementar un sistema que clasifique emails entrantes y redacte borradores automáticos. ¿Te gustaría ver una demo?
                   </div>
                   <div className="self-end bg-black text-white px-5 py-3 rounded-2xl rounded-tr-sm text-sm shadow-md max-w-[85%]">
                     Sí, por favor.
                   </div>
                </div>
             </div>
          </div>

          {/* Tall Card - Process Automation */}
          <ServiceCard 
            className="md:col-span-1 bg-white"
            icon={ZapIcon} 
            title="Automatización de Flujos" 
            description="Conectamos tu CRM, Facturación y Email. Si pasa X en un sitio, ocurre Y en el otro. Sin errores humanos." 
          />

          {/* Small Cards Row */}
          <ServiceCard 
            className="md:col-span-1 bg-white"
            icon={ChartIcon} 
            title="Business Intelligence" 
            description="Dashboards centralizados. Deja de perder tiempo cruzando Excels y empieza a tomar decisiones." 
          />
          
           <div className="md:col-span-2 p-10 rounded-[2rem] border border-black/5 bg-white shadow-soft flex flex-col md:flex-row items-center gap-8 group hover:border-black/20 transition-all duration-500 relative overflow-hidden">
             {/* Background decoration */}
             <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-zinc-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
             
              <div className="flex-1 relative z-10">
                <h3 className="text-2xl font-bold mb-3 text-black">Consultoría Estratégica & Formación</h3>
                <p className="text-slate-500">
                  No solo te damos el pescado, te enseñamos a pescar. Formamos a tu equipo en el uso de herramientas de IA para potenciar su productividad diaria.
                </p>
              </div>
              <button className="px-8 py-3 rounded-full bg-zinc-100 text-black hover:bg-black hover:text-white transition-all font-bold text-sm whitespace-nowrap relative z-10">
                Ver planes de formación
              </button>
           </div>
        </div>
      </div>
    </section>
  );
};

const Methodology = () => {
    return (
        <section id="metodo" className="py-32 bg-zinc-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black tracking-tight">El Estándar Alturia</h2>
                    <p className="text-slate-500 text-lg">
                        No somos una agencia convencional. Somos tu partner tecnológico. Construimos sobre tres pilares fundamentales para garantizar escalabilidad.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Animated Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-zinc-200 overflow-hidden">
                        <div className="absolute top-0 left-0 h-full w-full bg-black/20 animate-shimmer" style={{backgroundSize: '200% 100%'}}></div>
                    </div>

                    <div className="relative bg-white p-8 rounded-[2rem] border border-zinc-100 shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-2 group">
                        <div className="w-16 h-16 rounded-2xl bg-black text-white flex items-center justify-center mb-6 mx-auto relative z-10 shadow-lg shadow-black/20 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                            <HandshakeIcon />
                        </div>
                        <h3 className="text-xl font-bold text-center mb-4">Compromiso Total</h3>
                        <p className="text-center text-slate-500 text-sm leading-relaxed">
                            No vendemos horas, vendemos resultados. Trabajamos con un número limitado de clientes para garantizar una atención obsesiva al detalle.
                        </p>
                    </div>

                    <div className="relative bg-white p-8 rounded-[2rem] border border-zinc-100 shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-2 group">
                        <div className="w-16 h-16 rounded-2xl bg-white border-2 border-black text-black flex items-center justify-center mb-6 mx-auto relative z-10 group-hover:scale-110 group-hover:-rotate-6 transition-transform">
                            <ServerIcon />
                        </div>
                        {/* Animation Dots */}
                        <div className="absolute top-12 -left-4 w-2 h-2 rounded-full bg-black animate-ping"></div>
                        <div className="absolute top-12 -right-4 w-2 h-2 rounded-full bg-black animate-ping" style={{animationDelay: '0.5s'}}></div>

                        <h3 className="text-xl font-bold text-center mb-4">Infraestructura Robusta</h3>
                        <p className="text-center text-slate-500 text-sm leading-relaxed">
                            Sistemas diseñados para escalar. Usamos servidores seguros y APIs redundantes para asegurar que tus automatizaciones nunca se detengan.
                        </p>
                    </div>

                    <div className="relative bg-white p-8 rounded-[2rem] border border-zinc-100 shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-2 group">
                        <div className="w-16 h-16 rounded-2xl bg-zinc-100 text-black flex items-center justify-center mb-6 mx-auto relative z-10 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                            <ShieldIcon />
                        </div>
                        <h3 className="text-xl font-bold text-center mb-4">Seguridad Grado A</h3>
                        <p className="text-center text-slate-500 text-sm leading-relaxed">
                            Tus datos son sagrados. Implementamos encriptación de extremo a extremo y cumplimos rigurosamente con la RGPD europea.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

const About = () => {
    return (
        <section id="nosotros" className="py-32 bg-white relative overflow-hidden">
             <div className="absolute -left-20 top-40 w-96 h-96 bg-zinc-50 rounded-full blur-3xl pointer-events-none"></div>
             
             <div className="max-w-5xl mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-16 items-center">
                 <div>
                     <span className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-4 block">Manifiesto</span>
                     <h2 className="text-4xl md:text-5xl font-bold mb-8 text-black leading-tight">
                         La eficiencia no es un lujo, <br/>es una necesidad.
                     </h2>
                     <div className="space-y-6 text-lg text-slate-600 font-light leading-relaxed">
                         <p>
                             Fundada en Madrid, Alturia nació de una frustración: ver cómo empresas brillantes desperdiciaban su talento humano en tareas mecánicas.
                         </p>
                         <p>
                             Creemos que el futuro del trabajo no consiste en reemplazar a las personas, sino en liberarlas. Nuestra misión es democratizar el acceso a la Inteligencia Artificial de alto nivel para las PYMES españolas.
                         </p>
                         <p className="font-medium text-black pt-4">
                             — El equipo de Alturia.
                         </p>
                     </div>
                 </div>
                 
                 <div className="relative group cursor-default">
                     <div className="aspect-square rounded-[2.5rem] bg-zinc-900 p-12 flex flex-col justify-between text-white relative overflow-hidden transition-transform duration-700 group-hover:scale-[1.02] shadow-2xl">
                         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                         <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000"></div>
                         
                         <div className="text-6xl font-serif opacity-20 transform group-hover:translate-x-2 group-hover:translate-y-2 transition-transform">"</div>
                         <p className="text-2xl font-light italic leading-normal relative z-10">
                             La automatización aplicada a una operación eficiente magnificará la eficiencia. La automatización aplicada a una operación ineficiente magnificará la ineficiencia.
                         </p>
                         <div className="text-sm font-bold tracking-widest uppercase opacity-60 mt-8">Bill Gates</div>
                     </div>
                 </div>
             </div>
        </section>
    )
}

const CTA = () => {
  return (
    <section id="contact" className="py-32 relative overflow-hidden bg-zinc-50">
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight text-black">
          ¿Tu negocio está listo para <br/><span className="text-zinc-400">el siguiente nivel</span>?
        </h2>
        <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto">
          Deja de perder tiempo en tareas que un robot haría mejor y más rápido. Recupera tu libertad y escala sin aumentar costes fijos.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="relative overflow-hidden bg-black text-white text-lg font-bold px-10 py-4 rounded-full hover:bg-zinc-800 hover:shadow-xl hover:-translate-y-1 transition-all group">
                 {/* Shine */}
                <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent z-10"></div>
                Agendar Auditoría Gratuita
            </button>
            <button className="bg-white text-black border border-zinc-200 text-lg font-semibold px-10 py-4 rounded-full hover:bg-white hover:border-zinc-400 hover:shadow-lg transition-all">
                Hablemos por WhatsApp
            </button>
        </div>
        <div className="mt-10 flex items-center justify-center gap-3 text-sm text-slate-500">
            <div className="flex -space-x-3">
                {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-zinc-300 border-2 border-zinc-50 hover:-translate-y-1 transition-transform cursor-pointer"></div>
                ))}
            </div>
            <span>Más de 50 empresas auditadas este mes.</span>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-white border-t border-zinc-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
               <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold text-sm">A</div>
               <span className="text-2xl font-bold text-black">Alturia</span>
            </div>
            <p className="text-slate-500 max-w-sm mb-6 leading-relaxed">
              Transformamos la operativa de las empresas españolas mediante automatización inteligente e IA. Menos caos, más rentabilidad.
            </p>
            <div className="flex gap-4">
               {/* Social placeholders */}
               <a href="#" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors cursor-pointer border border-zinc-100 group">
                  <svg className="group-hover:scale-110 transition-transform" width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
               </a>
               <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors cursor-pointer border border-zinc-100 group">
                  <svg className="group-hover:scale-110 transition-transform" width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
               </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-black font-bold mb-6">Servicios</h4>
            <ul className="flex flex-col gap-4 text-slate-500 text-sm font-medium">
              <li className="hover:text-black cursor-pointer transition-colors">Chatbots AI</li>
              <li className="hover:text-black cursor-pointer transition-colors">Automatización CRM</li>
              <li className="hover:text-black cursor-pointer transition-colors">Make / Zapier</li>
              <li className="hover:text-black cursor-pointer transition-colors">Consultoría de Datos</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-black font-bold mb-6">Compañía</h4>
            <ul className="flex flex-col gap-4 text-slate-500 text-sm font-medium">
              <li className="hover:text-black cursor-pointer transition-colors">Sobre nosotros</li>
              <li className="hover:text-black cursor-pointer transition-colors">Casos de éxito</li>
              <li className="hover:text-black cursor-pointer transition-colors">Aviso Legal</li>
              <li className="hover:text-black cursor-pointer transition-colors">Política de Privacidad</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-zinc-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-medium">
          <p>© 2024 Alturia Agency S.L. Todos los derechos reservados.</p>
          <div className="flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-black"></span>
             <p>Diseñado en Madrid, España</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

const App = () => {
  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans selection:bg-black selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <BentoGrid />
        <Methodology />
        <About />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);

export default App;
