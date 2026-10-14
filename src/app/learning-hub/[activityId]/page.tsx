'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, Lightbulb } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '@/store/useStore';

const exercises: Record<string, { title: string; category: string; instruction: string; question: string; options: string[]; answer: string }> = {
  '1': { title: 'Memory Match', category: 'Memory', instruction: 'Read the word pair, then choose the matching partner.', question: 'Which word belongs with Garden?', options: ['Flower', 'Train', 'Keyboard', 'Mountain'], answer: 'Flower' },
  '2': { title: 'Word Association', category: 'Vocabulary', instruction: 'Choose the word most closely related to the prompt.', question: 'Which word belongs with Garden?', options: ['Flower', 'Train', 'Keyboard', 'Mountain'], answer: 'Flower' },
  '3': { title: 'Focus Timer', category: 'Focus', instruction: 'Choose a short focus session and complete it when the timer ends.', question: 'Choose your focus session', options: ['5 minutes', '10 minutes', '15 minutes', '20 minutes'], answer: '5 minutes' },
  '4': { title: 'Reading Comprehension', category: 'Reading', instruction: 'Read the passage, then answer the question.', question: 'What helps a daily routine feel easier?', options: ['Small regular steps', 'Skipping rest', 'Doing everything at once', 'Avoiding practice'], answer: 'Small regular steps' },
  '5': { title: 'Pattern Recognition', category: 'ProblemSolving', instruction: 'Look for the rule in the sequence.', question: '2, 4, 6, 8, ?', options: ['10', '11', '12', '14'], answer: '10' },
  '6': { title: 'Sequence Memory', category: 'Memory', instruction: 'Remember the sequence and choose what comes next.', question: 'What comes next? 1, 1, 2, 3, 5, ?', options: ['6', '7', '8', '9'], answer: '8' },
};

export default function LearningActivityPage() {
  const { activityId } = useParams<{ activityId: string }>();
  const router = useRouter();
  const activity = exercises[activityId] || exercises['1'];
  const completeActivity = useStore((state) => state.completeActivity);
  const [selected, setSelected] = useState('');
  const [finished, setFinished] = useState(false);
  const [startedAt] = useState(() => Date.now());

  const finish = () => {
    if (!selected) return;
    completeActivity(activityId);
    setFinished(true);
  };

  return <div className="mx-auto max-w-3xl space-y-6"><Link href="/learning-hub" className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft className="h-4 w-4" /> Back to Learning Hub</Link><div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-10"><div className="mb-8 flex items-start justify-between"><div><span className="text-sm font-semibold text-primary">{activity.category}</span><h1 className="mt-2 text-3xl font-bold text-foreground">{activity.title}</h1></div><Lightbulb className="h-8 w-8 text-warning" /></div><div className="rounded-xl bg-muted p-5"><p className="font-semibold text-foreground">Instructions</p><p className="mt-2 text-muted-foreground">{activity.instruction}</p></div>{activity.title === 'Reading Comprehension' && <p className="mt-5 rounded-xl border border-border p-5 leading-7 text-foreground">Practising one small activity at a time can make routines feel familiar. A quiet moment, a clear goal, and regular encouragement help create a comfortable learning rhythm.</p>}<div className="mt-8"><p className="mb-4 text-lg font-bold text-foreground">{activity.question}</p><div className="grid gap-3 sm:grid-cols-2">{activity.options.map((option) => <button key={option} onClick={() => setSelected(option)} className={`rounded-xl border-2 p-4 text-left font-semibold transition-colors ${selected === option ? 'border-primary bg-primary/10 text-primary' : 'border-border text-foreground hover:border-primary/50'}`}>{option}</button>)}</div></div>{finished ? <div className="mt-8 rounded-xl bg-success/10 p-5 text-center text-success"><CheckCircle className="mx-auto mb-2 h-8 w-8" /><p className="font-bold">Activity complete</p><p className="mt-1 text-sm">You spent {Math.max(1, Math.round((Date.now() - startedAt) / 60000))} minute(s) practising.</p><button onClick={() => router.push('/learning-hub')} className="mt-4 rounded-lg bg-primary px-5 py-2 font-semibold text-primary-foreground">Continue Learning</button></div> : <button onClick={finish} disabled={!selected} className="mt-8 w-full rounded-xl bg-primary px-5 py-3 font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50">Finish Activity</button>}</div></div>;
}