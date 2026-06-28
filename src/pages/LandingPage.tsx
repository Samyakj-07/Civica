import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  BarChart3,
  Layers,
  MapPin,
  Building2,
  Users,
  ArrowRight,
  Zap,
  Clock,
  ThumbsUp
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function LandingPage() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-transparent text-ink font-sans relative overflow-hidden"
    >
      
      {/* Animated Background Blobs */}
      <div className="blob-bg w-[600px] h-[600px] rounded-full bg-violet top-[-10%] left-[-10%] mix-blend-multiply" />
      <div className="blob-bg w-[500px] h-[500px] rounded-full bg-mint top-[20%] right-[-5%] mix-blend-multiply" style={{ animationDelay: '2s' }} />
      <div className="blob-bg w-[700px] h-[700px] rounded-full bg-amber bottom-[-20%] left-[20%] mix-blend-multiply" style={{ animationDelay: '4s' }} />

      <Header />
      <main className="relative z-10 pt-20 pb-20">
        <HeroSection />
        <MetricsSection />
        <ProblemSolutionSection />
        <FeatureBentoSection />
        <AudienceSection />
      </main>
      <Footer />
    </motion.div>
  );
}

function Header() {
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-4 left-0 right-0 z-50 max-w-6xl mx-auto px-4"
    >
      <div className="glass-panel rounded-full px-6 py-3 flex justify-between items-center transition-all">
        <div className="flex items-center gap-3 font-display font-bold text-xl tracking-tight text-ink">
          <span className="relative flex items-center justify-center w-8 h-8 rounded-full bg-ink text-white shadow-md">
            <ShieldCheck size={18} />
          </span>
          Civica
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-semibold text-muted">
          <a href="#platform" className="hover:text-ink transition-colors">Platform</a>
          <a href="#solutions" className="hover:text-ink transition-colors">Solutions</a>
          <a href="#metrics" className="hover:text-ink transition-colors">Impact</a>
        </nav>
        <div className="flex items-center gap-4">
          <a href="#login" className="hidden text-sm font-bold text-muted hover:text-ink transition-colors md:block">Log In</a>
          <Link
            to="/create-case"
            className="inline-block px-5 py-2.5 rounded-full bg-violet-deep text-white font-bold text-sm hover:bg-violet transition-colors shadow-lg shadow-violet/20 hover:scale-105 active:scale-95 transition-transform"
          >
            Book Demo
          </Link>
        </div>
      </div>
    </motion.header>
  );
}

function HeroSection() {
  return (
    <section className="relative pt-4 pb-12 lg:pt-8 lg:pb-24 px-4">
      <motion.div 
        className="max-w-5xl mx-auto text-center"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div variants={fadeInUp}>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet/10 bg-white/60 backdrop-blur-md text-violet-deep text-sm font-bold mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-violet animate-pulse" />
            The AI Assurance Layer for Civic Operations
          </span>
        </motion.div>
        
        <motion.h1 
          variants={fadeInUp}
          className="text-5xl md:text-[4.5rem] font-display font-extrabold tracking-tight mb-6 leading-[1.05] text-ink"
        >
          Verify the repair <br className="hidden md:block"/>
          <span className="text-gradient">before the payout.</span>
        </motion.h1>
        
        <motion.p 
          variants={fadeInUp}
          className="text-lg md:text-xl text-muted leading-relaxed max-w-3xl mx-auto mb-8 font-medium"
        >
          Stop paying for ghost repairs. Civica converts citizen reports into verified work orders, using AI to validate contractor proof-of-work before you release payment.
        </motion.p>
        
        <motion.div 
          variants={fadeInUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link 
            to="/create-case"
            className="w-full sm:w-auto px-10 py-4 rounded-full bg-ink text-white font-bold text-lg hover:bg-slate-800 transition-colors shadow-xl shadow-black/15 flex items-center justify-center gap-2 group hover:scale-105 active:scale-95 transition-transform"
          >
            Start Free Pilot <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </motion.div>

      {/* Floating Dashboard Elements */}
      <motion.div 
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-4xl mx-auto mt-12 relative h-[280px] hidden md:block"
      >
        <div className="absolute left-0 top-10 w-64 glass-panel rounded-2xl p-4 transform -rotate-6 shadow-2xl hover:rotate-0 transition-all duration-500 hover:z-20 cursor-default">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-coral/10 text-coral flex items-center justify-center"><XCircle size={16}/></div>
            <div>
              <div className="text-sm font-bold">Unverified Invoice</div>
              <div className="text-xs text-muted">Hold Payment</div>
            </div>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-coral w-[32%]" />
          </div>
          <div className="text-xs text-muted mt-2">AI Confidence: 32%</div>
        </div>

        <div className="absolute right-0 top-10 w-64 glass-panel rounded-2xl p-4 transform rotate-6 shadow-2xl hover:rotate-0 transition-all duration-500 hover:z-20 cursor-default">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-mint/10 text-mint flex items-center justify-center"><CheckCircle2 size={16}/></div>
            <div>
              <div className="text-sm font-bold">Verified Invoice</div>
              <div className="text-xs text-muted">Release Payment</div>
            </div>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-mint w-[94%]" />
          </div>
          <div className="text-xs text-muted mt-2">AI Confidence: 94%</div>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-80 glass-panel rounded-2xl p-6 shadow-2xl z-10 hover:-translate-y-4 transition-all duration-500 cursor-default border border-violet/10">
          <div className="text-xs font-bold text-violet uppercase tracking-wider mb-2">Assurance Engine</div>
          <div className="text-2xl font-bold mb-1">Work Order #8892</div>
          <div className="text-sm text-muted mb-4">Pothole Repair • Ward 12</div>
          <div className="flex gap-2">
            <div className="flex-1 h-20 rounded-lg bg-slate-200 relative overflow-hidden flex items-center justify-center">
              <span className="text-xs font-bold text-white bg-black/40 px-2 py-1 rounded absolute bottom-2 left-2">Before</span>
            </div>
            <div className="flex-1 h-20 rounded-lg bg-slate-300 relative overflow-hidden flex items-center justify-center">
              <span className="text-xs font-bold text-white bg-black/40 px-2 py-1 rounded absolute bottom-2 left-2">After</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-sm font-bold text-mint">
              <ShieldCheck size={16} /> Verified Match
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function MetricsSection() {
  const metrics = [
    { value: "16%", label: "Ghost Repairs Caught", icon: Zap, color: "text-amber" },
    { value: "38%", label: "Faster Resolution", icon: Clock, color: "text-violet" },
    { value: "91%", label: "AI Verification Accuracy", icon: ThumbsUp, color: "text-mint" }
  ];

  return (
    <section id="metrics" className="py-12 max-w-6xl mx-auto px-4">
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid md:grid-cols-3 gap-6"
      >
        {metrics.map((m, i) => (
          <motion.div 
            key={i}
            variants={fadeInUp}
            whileHover={{ y: -5 }}
            className="bento-card bg-white p-6 flex items-center gap-5"
          >
            <div className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center ${m.color} border border-slate-100 shadow-sm`}>
              <m.icon size={24} />
            </div>
            <div>
              <div className="text-3xl font-extrabold">{m.value}</div>
              <div className="text-sm font-bold text-muted">{m.label}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

function ProblemSolutionSection() {
  return (
    <section className="py-24 relative">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-extrabold mb-6 text-ink">The standard 311 model is broken.</h2>
          <p className="text-xl text-muted font-medium">Reporting an issue is easy. Making sure the contractor actually fixed it properly—before they get paid—is the hard part.</p>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
        >
          {/* Problem */}
          <motion.div 
            variants={fadeInUp}
            className="bento-card p-10 bg-white border border-slate-100 hover:border-coral/20 transition-colors duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-coral/5 rounded-full blur-3xl" />
            <div className="w-14 h-14 rounded-2xl bg-coral/10 flex items-center justify-center text-coral mb-8 border border-coral/10">
              <XCircle size={28} />
            </div>
            <h3 className="text-2xl font-extrabold mb-6 text-ink">The "Report & Forget" Era</h3>
            <ul className="space-y-5">
              {[
                "Citizens report issues into a black hole.",
                "Contractors mark jobs 'done' with poor or no proof.",
                "Municipalities pay invoices blindly.",
                "The same pothole breaks again next month."
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-4 text-muted font-medium text-lg">
                  <span className="mt-1.5 text-slate-300 w-2 h-2 rounded-full bg-slate-300 shrink-0" /> {text}
                </li>
              ))}
            </ul>
          </motion.div>
          
          {/* Solution */}
          <motion.div 
            variants={fadeInUp}
            className="bento-card p-10 bg-slate-900 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-mint/10 rounded-full blur-3xl" />
            
            <div className="w-14 h-14 rounded-2xl bg-violet flex items-center justify-center mb-8 shadow-lg shadow-violet/30 border border-violet-deep">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-2xl font-extrabold mb-6">The Civica Assurance Era</h3>
            <ul className="space-y-5">
              {[
                "AI converts reports into structured Issue DNA.",
                "Contractors must submit GPS-locked 'after' photos.",
                "AI verifies repair quality visually before approval.",
                "Contractor scorecards ensure long-term accountability."
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-4 font-medium text-lg text-slate-300">
                  <CheckCircle2 size={24} className="text-mint shrink-0" /> {text}
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function FeatureBentoSection() {
  return (
    <section id="platform" className="py-24">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-extrabold mb-6 text-ink">The Civic Operating System.</h2>
          <p className="text-xl text-muted font-medium max-w-2xl mx-auto">Everything you need to run, verify, and scale your civic operations with unprecedented accountability.</p>
        </motion.div>
        
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-6"
        >
          <motion.div 
            variants={fadeInUp}
            whileHover={{ y: -8 }}
            className="bento-card bg-white p-8 md:col-span-2 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-violet mb-6">
              <Layers size={28} />
            </div>
            <h3 className="text-2xl font-extrabold mb-4 text-ink">Issue DNA</h3>
            <p className="text-lg text-muted font-medium leading-relaxed max-w-lg">
              Automatically categorize, prioritize, and detect duplicate reports using AI. Turn messy citizen complaints into structured, assignable work orders in seconds.
            </p>
          </motion.div>

          <motion.div 
            variants={fadeInUp}
            whileHover={{ y: -8 }}
            className="bento-card bg-white p-8 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-mint/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-mint mb-6">
              <BarChart3 size={28} />
            </div>
            <h3 className="text-2xl font-extrabold mb-4 text-ink">Vendor Pulse</h3>
            <p className="text-lg text-muted font-medium leading-relaxed">
              Track SLA compliance, first-time fix rates, and AI repair confidence to build a definitive quality score for every vendor.
            </p>
          </motion.div>

          <motion.div 
            variants={fadeInUp}
            whileHover={{ y: -8 }}
            className="bento-card bg-white p-8 relative overflow-hidden group md:col-span-3"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-amber mb-6">
                  <MapPin size={28} />
                </div>
                <h3 className="text-2xl font-extrabold mb-4 text-ink">Asset Memory</h3>
                <p className="text-lg text-muted font-medium leading-relaxed">
                  Roads, streetlights, and drainage systems have a history. Know exactly how many times a specific asset has failed and who repaired it last, preventing vendors from billing for the same broken asset repeatedly.
                </p>
              </div>
              <div className="flex-1 w-full glass-panel rounded-2xl p-6 relative">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/20">
                  <div className="font-bold">Asset ID: R-192 (Streetlight)</div>
                  <div className="text-xs font-bold text-coral px-2 py-1 bg-coral/10 rounded-full">High Failure Rate</div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm"><span className="text-muted">Last Repaired</span><span className="font-bold">2 weeks ago (Vendor C)</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted">Total Failures YTD</span><span className="font-bold">4</span></div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function AudienceSection() {
  return (
    <section className="py-32 relative">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-display font-extrabold mb-6 text-ink">Built for scale, starting with your community.</h2>
          <p className="text-xl text-muted font-medium">Whether you manage a private society or an entire city district, Civica brings undeniable accountability to your operations.</p>
        </motion.div>
        
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8 text-center max-w-5xl mx-auto relative"
        >
          {/* Connecting line */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-px bg-slate-200 z-0" />

          <motion.div variants={fadeInUp} className="relative z-10">
            <div className="w-24 h-24 mx-auto bg-white border border-slate-100 shadow-xl rounded-3xl flex items-center justify-center mb-8 text-violet">
              <Building2 size={40} />
            </div>
            <h3 className="text-2xl font-extrabold mb-4">Smart Campuses</h3>
            <p className="text-muted font-medium text-lg leading-relaxed">Ensure facility management vendors are delivering on their SLAs with verified visual proof.</p>
          </motion.div>

          <motion.div variants={fadeInUp} className="relative z-10">
            <div className="w-24 h-24 mx-auto bg-white border border-slate-100 shadow-xl rounded-3xl flex items-center justify-center mb-8 text-mint">
              <Users size={40} />
            </div>
            <h3 className="text-2xl font-extrabold mb-4">RWAs & Societies</h3>
            <p className="text-muted font-medium text-lg leading-relaxed">Give residents transparency while ensuring maintenance fees are spent on actual, verified repairs.</p>
          </motion.div>

          <motion.div variants={fadeInUp} className="relative z-10">
            <div className="w-24 h-24 mx-auto bg-white border border-slate-100 shadow-xl rounded-3xl flex items-center justify-center mb-8 text-amber">
              <MapPin size={40} />
            </div>
            <h3 className="text-2xl font-extrabold mb-4">Municipalities</h3>
            <p className="text-muted font-medium text-lg leading-relaxed">Upgrade from legacy 311 systems to an AI-driven assurance model that prevents contractor fraud.</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 py-12">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 font-display font-extrabold text-xl text-ink">
          <ShieldCheck size={20} className="text-violet" />
          Civica
        </div>
        <p className="text-sm text-muted font-bold">© {new Date().getFullYear()} Civica Assurance OS. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="text-sm font-bold text-muted hover:text-ink transition-colors">Privacy Policy</a>
          <a href="#" className="text-sm font-bold text-muted hover:text-ink transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
