'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, AlertCircle, CheckCircle, Clock, ClipboardCheck, Sparkles, TrendingUp } from 'lucide-react';
import { mockAssessmentQuestions } from '@/data/mockData';
import { ActivityCategory, AssessmentResult, CognitiveSupportLevel } from '@/types';
import { useStore } from '@/store/useStore';
import { getCategoryLabel, getSupportLevelLabel, translateText } from '@/utils/translations';

export default function AssessmentPage() {
  const router = useRouter();
  const { completeAssessment, setAssessmentResult, skipAssessment, language } = useStore();
  const [stage, setStage] = useState<'intro' | 'questions' | 'results'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [timeLeft, setTimeLeft] = useState(mockAssessmentQuestions[0]?.timeLimit ?? 30);

  const t = (key: string, fallback: string) => translateText(language, key, fallback);
  const question = mockAssessmentQuestions[currentQuestion];

  useEffect(() => {
    if (stage !== 'questions') return;
    const timer = window.setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return previous - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [stage, currentQuestion]);

  useEffect(() => {
    if (stage !== 'questions' || timeLeft > 0) return;
    if (currentQuestion < mockAssessmentQuestions.length - 1) {
      setCurrentQuestion((previous) => previous + 1);
      setTimeLeft(mockAssessmentQuestions[currentQuestion + 1]?.timeLimit ?? 30);
      return;
    }
    calculateResults();
  }, [currentQuestion, stage, timeLeft]);

  const handleAnswer = (answerIndex: number) => {
    setAnswers((previous) => ({ ...previous, [currentQuestion]: answerIndex }));
  };

  const handleNext = () => {
    if (currentQuestion < mockAssessmentQuestions.length - 1) {
      setCurrentQuestion((previous) => previous + 1);
      setTimeLeft(mockAssessmentQuestions[currentQuestion + 1]?.timeLimit ?? 30);
      return;
    }
    calculateResults();
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((previous) => previous - 1);
      setTimeLeft(mockAssessmentQuestions[currentQuestion - 1]?.timeLimit ?? 30);
    }
  };

  const calculateResults = () => {
    let correctAnswers = 0;
    const categoryScores: Record<ActivityCategory, number> = { Memory: 0, Focus: 0, Reading: 0, Vocabulary: 0, ProblemSolving: 0 };
    const answeredByCategory: Record<ActivityCategory, number> = { Memory: 0, Focus: 0, Reading: 0, Vocabulary: 0, ProblemSolving: 0 };

    mockAssessmentQuestions.forEach((questionItem, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === questionItem.correctAnswer;
      if (isCorrect) correctAnswers += 1;
      answeredByCategory[questionItem.category] += 1;
      if (isCorrect) categoryScores[questionItem.category] += 1;
    });

    const overallScore = (correctAnswers / mockAssessmentQuestions.length) * 100;
    const finalCategoryScores: Record<ActivityCategory, number> = {
      Memory: (categoryScores.Memory / Math.max(answeredByCategory.Memory, 1)) * 100,
      Focus: (categoryScores.Focus / Math.max(answeredByCategory.Focus, 1)) * 100,
      Reading: (categoryScores.Reading / Math.max(answeredByCategory.Reading, 1)) * 100,
      Vocabulary: (categoryScores.Vocabulary / Math.max(answeredByCategory.Vocabulary, 1)) * 100,
      ProblemSolving: (categoryScores.ProblemSolving / Math.max(answeredByCategory.ProblemSolving, 1)) * 100,
    };

    const strengths = (Object.keys(finalCategoryScores) as ActivityCategory[]).filter((category) => finalCategoryScores[category] >= 70);
    const areasForImprovement = (Object.keys(finalCategoryScores) as ActivityCategory[]).filter((category) => finalCategoryScores[category] < 70);
    const level: CognitiveSupportLevel = overallScore >= 75 ? 'low' : overallScore >= 50 ? 'moderate' : 'high';

    const resultData: AssessmentResult = {
      overallScore,
      categoryScores: finalCategoryScores,
      strengths,
      areasForImprovement,
      recommendedActivities: strengths.length > 0
        ? ['Continue practicing with short memory drills', 'Try a mixed cognitive session for extra confidence']
        : ['Start with gentle memory exercises', 'Focus on one skill at a time', 'Repeat the assessment after a few days'],
      level,
    };

    completeAssessment();
    setAssessmentResult(resultData);
    setResult(resultData);
    setStage('results');
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setTimeLeft(mockAssessmentQuestions[0]?.timeLimit ?? 30);
    setResult(null);
    setStage('intro');
  };

  const goToDashboard = () => {
    skipAssessment();
    router.push('/');
  };

  if (stage === 'intro') {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
          <div className="mb-4 flex items-center gap-3 text-primary">
            <ClipboardCheck className="h-6 w-6" />
            <span className="text-sm font-semibold uppercase tracking-wide">{t('assessment', 'Assessment')}</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">{t('assessmentIntroTitle', 'Let’s begin with a short baseline assessment')}</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t('assessmentIntroText', 'This 30-question check helps us understand your cognitive strengths and any areas that may need support. You can continue now or go to the dashboard.')}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <button
            onClick={() => setStage('questions')}
            className="rounded-2xl bg-primary px-6 py-4 text-left text-white shadow-sm hover:bg-primary/90 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5" />
              <span className="text-lg font-semibold">{t('proceedToAssessment', 'Proceed to assessment')}</span>
            </div>
          </button>

          <button
            onClick={goToDashboard}
            className="rounded-2xl border border-border bg-background px-6 py-4 text-left text-foreground hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <ArrowRight className="h-5 w-5" />
              <span className="text-lg font-semibold">{t('goToDashboard', 'Go to dashboard')}</span>
            </div>
          </button>
        </div>
      </div>
    );
  }

  if (stage === 'results' && result) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{t('assessmentResults', 'Assessment Results')}</h1>
          <p className="text-muted-foreground">{t('cognitiveInsights', 'Your cognitive performance insights')}</p>
        </div>

        <div className="rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-8 shadow-lg">
          <div className="flex items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">{t('overallScore', 'Overall Score')}</h2>
              <p className="text-muted-foreground">{t('basedOnPerformance', 'Based on your performance across all categories')}</p>
            </div>
            <div className="text-right">
              <p className="text-5xl font-bold text-primary">{result.overallScore.toFixed(0)}%</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-warning/30 bg-warning/10 p-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-warning">{t('screeningLevel', 'Cognitive support level')}</p>
          <h2 className="mt-1 text-2xl font-bold text-foreground">{getSupportLevelLabel(language, result.level)}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t('screeningLevelNote', 'This is a wellness screening guide, not a dementia diagnosis. A healthcare professional can provide a complete evaluation.')}</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="font-semibold text-foreground mb-4">{t('categoryPerformance', 'Category Performance')}</h3>
          <div className="space-y-4">
            {(Object.keys(result.categoryScores) as ActivityCategory[]).map((category) => {
              const score = result.categoryScores[category];
              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-foreground">{getCategoryLabel(language, category)}</span>
                    <span className="text-sm font-semibold text-foreground">{score.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className={`h-2 rounded-full ${score >= 70 ? 'bg-success' : score >= 50 ? 'bg-warning' : 'bg-error'}`} style={{ width: `${score}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-success" />
              <h3 className="font-semibold text-foreground">{t('strengths', 'Strengths')}</h3>
            </div>
            {result.strengths.length > 0 ? (
              <ul className="space-y-2">
                {result.strengths.map((strength) => (
                  <li key={strength} className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle className="h-4 w-4 text-success" /> {strength}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">{t('noStrengths', 'No strengths identified yet. Keep practicing!')}</p>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="h-5 w-5 text-warning" />
              <h3 className="font-semibold text-foreground">{t('majorAreas', 'Areas for Improvement')}</h3>
            </div>
            {result.areasForImprovement.length > 0 ? (
              <ul className="space-y-2">
                {result.areasForImprovement.map((area) => (
                  <li key={area} className="flex items-center gap-2 text-sm text-foreground">
                    <ArrowRight className="h-4 w-4 text-warning" /> {getCategoryLabel(language, area)}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">{t('noImprovements', 'Great job! No areas need immediate improvement.')}</p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="font-semibold text-foreground mb-4">{t('recommendedActivities', 'Recommended Activities')}</h3>
          <ul className="space-y-2">
            {result.recommendedActivities.map((activity) => (
              <li key={activity} className="flex items-center gap-2 text-sm text-foreground">
                <CheckCircle className="h-4 w-4 text-primary" /> {activity}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={resetAssessment} className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
            {t('retakeAssessment', 'Retake Assessment')}
          </button>
          <button onClick={goToDashboard} className="rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors">
            {t('goToDashboard', 'Go to dashboard')}
          </button>
        </div>

        <div className="rounded-xl border border-warning/20 bg-warning/5 p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Disclaimer:</strong> {t('disclaimer', 'These results are for general informational purposes only and do not constitute medical or diagnostic advice. Please consult a healthcare professional for proper evaluation.')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">{t('assessment', 'Assessment')}</h1>
        <p className="text-muted-foreground">{t('questionPrompt', 'Please answer all questions to complete the assessment.')}</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">{t('assessmentQuestionOf', 'Question {current} of {total}').replace('{current}', String(currentQuestion + 1)).replace('{total}', String(mockAssessmentQuestions.length))}</span>
          <div className="flex items-center gap-2 text-primary">
            <Clock className="h-4 w-4" />
            <span className="font-semibold">{timeLeft}s</span>
          </div>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${((currentQuestion + 1) / mockAssessmentQuestions.length) * 100}%` }} />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-2">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{question.category}</span>
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-6">{question.question}</h2>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className={`w-full rounded-lg border p-4 text-left transition-colors ${answers[currentQuestion] === index ? 'border-primary bg-primary/5 text-foreground' : 'border-border bg-background text-foreground hover:border-primary/50'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-6 w-6 items-center justify-center rounded-full border ${answers[currentQuestion] === index ? 'border-primary bg-primary text-white' : 'border-border'}`}>
                  {answers[currentQuestion] === index && <CheckCircle className="h-4 w-4" />}
                </div>
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button onClick={handlePrevious} disabled={currentQuestion === 0} className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          <ArrowLeft className="h-4 w-4" /> {t('previous', 'Previous')}
        </button>

        <button onClick={handleNext} disabled={answers[currentQuestion] === undefined} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          {currentQuestion === mockAssessmentQuestions.length - 1 ? t('submit', 'Submit') : t('next', 'Next')}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
