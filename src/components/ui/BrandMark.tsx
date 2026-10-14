import { Brain } from 'lucide-react';

export default function BrandMark({ compact = false }: { compact?: boolean }) {
  return <div className="flex items-center gap-2"><div className={`flex items-center justify-center rounded-xl bg-primary/10 text-primary ${compact ? 'h-9 w-9' : 'h-11 w-11'}`}><Brain className={compact ? 'h-5 w-5' : 'h-6 w-6'} /></div><span className={compact ? 'text-lg font-bold text-foreground' : 'text-xl font-bold text-foreground'}>Manas Mitra</span></div>;
}