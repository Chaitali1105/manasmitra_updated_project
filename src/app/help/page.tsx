'use client';

import { HelpCircle, BookOpen, MessageSquare, Phone, Mail } from 'lucide-react';

export default function HelpPage() {
  const faqs = [
    {
      question: 'How do I start an assessment?',
      answer: 'Navigate to the Assessment page from the sidebar and click "Start Assessment" to begin your cognitive evaluation.',
    },
    {
      question: 'What are daily challenges?',
      answer: 'Daily challenges are special activities that change every day. Completing them earns you bonus points and helps maintain your streak.',
    },
    {
      question: 'How is my progress tracked?',
      answer: 'Your progress is automatically tracked as you complete activities and games. View detailed analytics in the Progress section.',
    },
    {
      question: 'Can I customize my daily plan?',
      answer: 'Yes! Visit the Daily Plan page to add, remove, and prioritize tasks according to your preferences.',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Help Center</h1>
        <p className="text-muted-foreground">Find answers to common questions and get support</p>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <BookOpen className="h-8 w-8 text-primary mb-3" />
          <h3 className="font-semibold text-foreground mb-2">User Guide</h3>
          <p className="text-sm text-muted-foreground">Learn how to use all features of Manas Mitra</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <MessageSquare className="h-8 w-8 text-accent mb-3" />
          <h3 className="font-semibold text-foreground mb-2">AI Assistant</h3>
          <p className="text-sm text-muted-foreground">Get personalized help from our AI assistant</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <HelpCircle className="h-8 w-8 text-success mb-3" />
          <h3 className="font-semibold text-foreground mb-2">FAQs</h3>
          <p className="text-sm text-muted-foreground">Find answers to frequently asked questions</p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-border pb-4 last:border-0">
              <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
              <p className="text-sm text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-xl font-bold text-foreground mb-4">Contact Support</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium text-foreground">support@manasmitra.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium text-foreground">+91 1234567890</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
