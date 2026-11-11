import React from 'react';
import Link from 'next/link';
import { getDb } from '@/lib/db';
import { GraduationCap, BookOpen, CheckCircle, Clock, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function LearnPage() {
  const db = getDb();
  const courses = db.prepare('SELECT * FROM courses ORDER BY order_index ASC').all() as any[];

  const courseList = courses.map(crs => {
    const lessons = db.prepare('SELECT * FROM lessons WHERE course_id = ? ORDER BY order_index ASC').all(crs.id) as any[];
    return { ...crs, lessons };
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* HEADER */}
      <div className="border-b border-stone-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
            Structured Academy
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-0.5">
            Vedic Learning Courses
          </h1>
          <p className="text-xs text-stone-500 max-w-2xl mt-1 leading-relaxed">
            Curated pedagogical tracks designed to systematically introduce Vedic literature, Upanishadic psychology, and classical commentarial schools with interactive quizzes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-200">
            Self-Paced Scholarly Curriculum
          </span>
        </div>
      </div>

      {/* COURSES LIST */}
      <div className="space-y-8">
        {courseList.map((course) => (
          <div
            key={course.id}
            className="bg-white border-2 border-stone-200 rounded-2xl overflow-hidden shadow-2xs"
          >
            <div className="bg-stone-50/80 px-6 py-4 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                  {course.level} Level
                </span>
                <h2 className="font-serif text-xl font-bold text-stone-900 mt-1">
                  {course.title}
                </h2>
              </div>

              <span className="text-xs text-stone-500">
                {course.lessons.length} {course.lessons.length === 1 ? 'Lesson' : 'Lessons'}
              </span>
            </div>

            <div className="p-6 space-y-6">
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {course.description}
              </p>

              {/* Lesson Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {course.lessons.map((les: any) => (
                  <Link
                    key={les.id}
                    href={`/learn/${les.slug}`}
                    className="p-4 rounded-xl border border-stone-200 hover:border-amber-500 hover:bg-stone-50 transition block group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                        Lesson {les.order_index}
                      </span>
                      <span className="text-[11px] text-stone-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-stone-400" />
                        {les.estimated_minutes} min
                      </span>
                    </div>

                    <h3 className="font-serif text-base font-bold text-stone-900 group-hover:text-amber-950 transition mt-1">
                      {les.title}
                    </h3>

                    <div className="flex items-center gap-1 text-xs font-semibold text-amber-800 mt-3">
                      <span>Begin Lesson</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
