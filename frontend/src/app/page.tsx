import Link from 'next/link';
import { Zap, ArrowRight, Star, Shield, Cpu } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center">
              <Zap size={15} className="text-white" />
            </div>
            <span className="font-bold text-gray-900">JobAI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-sm bg-brand-500 text-white px-4 py-2 rounded-xl hover:bg-brand-700 transition-colors font-semibold"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-50 text-brand-600 rounded-full text-xs font-bold mb-6 border border-brand-100">
          <Cpu size={12} />
          AI-Powered Job Matching
        </div>
        <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
          Find jobs that match{' '}
          <span className="text-brand-500">your exact skills</span>
        </h1>
        <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          Upload your resume or add your skills. Our AI matches you to the best jobs,
          shows your match score, and highlights exactly what you need to land your dream role.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-brand-500 text-white px-6 py-3 rounded-xl hover:bg-brand-700 transition-colors font-semibold text-sm shadow-sm"
          >
            Start matching jobs <ArrowRight size={16} />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-sm border border-gray-200"
          >
            Sign in
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-3 gap-6">
          {[
            { icon: Cpu, title: 'AI skill matching', desc: 'Intelligent algorithm matches your skills to job requirements with a precise percentage score.' },
            { icon: Star, title: 'Skill gap analysis', desc: "See exactly which skills you're missing for each job so you can level up strategically." },
            { icon: Shield, title: 'Resume parsing', desc: 'Upload your PDF resume and we automatically extract all your skills in seconds.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-gray-200 transition-all">
              <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center mb-4">
                <Icon size={18} className="text-brand-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}