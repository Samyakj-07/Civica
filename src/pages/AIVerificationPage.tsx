import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";

export default function AIVerificationPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="min-h-screen bg-[#FAFAFA] text-ink font-sans flex flex-col"
    >
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link to={`/contractor-task/${id}`} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-muted hover:text-ink">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-2 font-display font-bold text-lg text-ink">
            <span className="flex items-center justify-center w-6 h-6 rounded bg-ink text-white shadow-sm">
              <ShieldCheck size={14} />
            </span>
            Civica
          </div>
          <div className="h-4 w-px bg-slate-300 mx-2" />
          <span className="font-semibold text-slate-500 text-sm">AI Verification</span>
        </div>
      </header>

      <main className="flex-1 w-full flex items-center justify-center p-6">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-violet mx-auto mb-6" />
          <h1 className="text-3xl font-display font-extrabold mb-2">Verifying Repair Evidence</h1>
          <p className="text-slate-500 font-medium max-w-md mx-auto">
            AI is analyzing the uploaded image, GPS coordinates, and timestamp to confirm the repair matches the original work order.
          </p>
        </div>
      </main>
    </motion.div>
  );
}
