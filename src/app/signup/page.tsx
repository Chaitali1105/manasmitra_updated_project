'use client';

import { FormEvent, useState } from 'react';
import { CheckCircle2, LockKeyhole, Sparkles, UserRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import BrandMark from '@/components/ui/BrandMark';
import { translateText } from '@/utils/translations';

export default function SignupPage() {
  const router = useRouter();
  const { signUp, tryDemo, language } = useStore();
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', age: '', caregiverName: '' });
  const [error, setError] = useState('');
  const t = (key: string, fallback: string) => translateText(language, key, fallback);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setError('');
    if (!form.email || !form.password || (mode === 'signup' && !form.name)) return setError('Please complete the required fields.');
    if (mode === 'signup' && form.password !== form.confirmPassword) return setError('Passwords do not match.');
    if (mode === 'signin') {
      tryDemo();
    } else {
      signUp({ name: form.name, email: form.email, age: form.age ? Number(form.age) : undefined, caregiverName: form.caregiverName || undefined });
    }
    router.replace('/assessment');
  };

  const demo = () => {
    tryDemo();
    router.replace('/assessment');
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-violet-100 px-4 py-8 text-slate-900 lg:px-10">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1fr_0.85fr]">
        <section className="rounded-3xl bg-linear-to-br from-indigo-600 via-violet-600 to-blue-700 p-8 text-white shadow-xl lg:p-12">
          <div className="mb-16"><div className="**:text-white"><BrandMark compact /></div></div>
          <div className="max-w-xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-indigo-100">{t('cognitiveWellness', 'Cognitive wellness companion')}</p>
            <h1 className="text-4xl font-bold leading-tight lg:text-6xl">{t('valueProps', 'Practice the moments that matter.')}</h1>
            <p className="mt-6 text-lg leading-8 text-indigo-100">{t('platformDescription', 'Build confidence with gentle exercises for memory, focus, problem-solving, and everyday routines.')}</p>
          </div>
          <div className="mt-12 grid gap-3 sm:grid-cols-3">
            {[t('memoryPractice', 'Memory practice'), t('focusedGames', 'Focused games'), t('dailySupport', 'Daily support')].map((item) => (
              <div key={item} className="rounded-2xl border border-white/20 bg-white/10 p-4"><CheckCircle2 className="mb-3 h-5 w-5 text-emerald-200" /><p className="text-sm font-semibold">{item}</p></div>
            ))}
          </div>
        </section>
        <section className="rounded-3xl border border-indigo-100 bg-white p-6 shadow-xl sm:p-10">
          <div className="mb-8"><div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600"><UserRound className="h-6 w-6" /></div><h2 className="text-2xl font-bold">{mode === 'signup' ? t('createAccount', 'Create your Manas Mitra Account') : t('welcomeBack', 'Welcome back')}</h2><p className="mt-2 text-slate-500">{t('accountDescription', 'A calm, private place to keep your practice moving.')}</p></div>
          <form onSubmit={submit} className="space-y-4">
            {mode === 'signup' && <label className="block text-sm font-semibold">{t('userName', 'Full Name')}<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" placeholder="Your name" /></label>}
            <label className="block text-sm font-semibold">{t('email', 'Email')}<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" placeholder="you@example.com" /></label>
            <label className="block text-sm font-semibold">{t('password', 'Password')}<input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" placeholder="At least 6 characters" /></label>
            {mode === 'signup' && <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-semibold">{t('confirmPassword', 'Confirm Password')}<input required type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" /></label><label className="block text-sm font-semibold">{t('age', 'Age')} <span className="font-normal text-slate-400">{t('optional', '(optional)')}</span><input type="number" min="1" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" /></label></div>}
            {mode === 'signup' && <label className="block text-sm font-semibold">{t('caregiverName', 'Caregiver Name')} <span className="font-normal text-slate-400">{t('optional', '(optional)')}</span><input value={form.caregiverName} onChange={(e) => setForm({ ...form, caregiverName: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" /></label>}
            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white hover:bg-indigo-700"><Sparkles className="h-4 w-4" />{mode === 'signup' ? t('createAccount', 'Create Account') : t('signIn', 'Sign In')}</button>
          </form>
          <div className="my-5 flex items-center gap-3 text-xs text-slate-400"><span className="h-px flex-1 bg-slate-200" />OR<span className="h-px flex-1 bg-slate-200" /></div>
          <button onClick={demo} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-indigo-200 bg-indigo-50 px-4 py-3 font-bold text-indigo-700 hover:bg-indigo-100"><LockKeyhole className="h-4 w-4" />{t('tryDemo', 'Try Demo')}</button>
          <p className="mt-4 text-center text-sm text-slate-500">{mode === 'signup' ? t('alreadyHaveAccount', 'Already have an account?') : t('newToManasMitra', 'New to Manas Mitra?')} <button onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')} className="font-bold text-indigo-600 hover:underline">{mode === 'signup' ? t('signIn', 'Sign In') : t('createAccount', 'Create Account')}</button></p>
          <p className="mt-6 text-center text-xs text-slate-400">Demo mode uses sample data and does not save personal information.</p>
        </section>
      </div>
    </main>
  );
}