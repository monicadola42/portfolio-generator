"use client"

import * as React from "react"
import { FormData } from "../types"
import { Mail, Linkedin, Github, LayoutGrid, Award, BookOpen, Briefcase, UserRound, GraduationCap } from "lucide-react"

interface PortfolioPreviewProps {
  data: FormData;
}

export const PortfolioPreview = React.forwardRef<HTMLDivElement, PortfolioPreviewProps>(
  ({ data }, ref) => {
    return (
      <div 
        ref={ref} 
        className="w-full max-w-4xl mx-auto bg-white text-slate-800 shadow-2xl rounded-2xl overflow-hidden print:shadow-none print:rounded-none ring-1 ring-slate-900/5"
        style={{ minHeight: "297mm" }} // Approx A4 aspect
      >
        {/* Header Section */}
        <header className="bg-slate-900 text-white px-10 py-12">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">
            {data.fullName || "Your Name"}
          </h1>
          <div className="flex flex-wrap gap-6 text-sm text-slate-300">
            {data.email && (
              <a href={`mailto:${data.email}`} className="flex items-center hover:text-white transition-colors">
                <Mail className="w-4 h-4 mr-2 opacity-70" />
                {data.email}
              </a>
            )}
            {data.linkedin && (
              <a href={data.linkedin.startsWith("http") ? data.linkedin : `https://${data.linkedin}`} target="_blank" rel="noreferrer" className="flex items-center hover:text-white transition-colors">
                <Linkedin className="w-4 h-4 mr-2 opacity-70" />
                {data.linkedin.replace(/https?:\/\//, "")}
              </a>
            )}
            {data.github && (
              <a href={data.github.startsWith("http") ? data.github : `https://${data.github}`} target="_blank" rel="noreferrer" className="flex items-center hover:text-white transition-colors">
                <Github className="w-4 h-4 mr-2 opacity-70" />
                {data.github.replace(/https?:\/\//, "")}
              </a>
            )}
          </div>
        </header>

        <div className="px-10 py-10 space-y-10">
          {/* Objective */}
          {data.objective && (
            <section>
              <h2 className="text-xl font-bold text-slate-900 flex items-center border-b-2 border-slate-100 pb-2 mb-4 tracking-tight uppercase text-sm">
                <UserRound className="w-5 h-5 mr-3 text-indigo-600" />
                Professional Summary
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {data.objective}
              </p>
            </section>
          )}

          {/* Education */}
          {data.education && data.education.length > 0 && data.education.some((e: any) => e.collegeName || e.degree) && (
            <section>
              <h2 className="text-xl font-bold text-slate-900 flex items-center border-b-2 border-slate-100 pb-2 mb-4 tracking-tight uppercase text-sm">
                <GraduationCap className="w-5 h-5 mr-3 text-indigo-600" />
                Education
              </h2>
              <div className="space-y-4">
                {data.education.map((edu: any, idx: number) => (
                  (edu.collegeName || edu.degree) && (
                    <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <div>
                        <h3 className="font-semibold text-gray-900">{edu.degree} {edu.branch && `in ${edu.branch}`}</h3>
                        <p className="text-gray-600 text-sm">{edu.collegeName}</p>
                      </div>
                      <div className="text-sm text-gray-500 font-medium sm:text-right mt-1 sm:mt-0 whitespace-nowrap">
                        {edu.yearOfStudy && <div>{edu.yearOfStudy}</div>}
                        {edu.cgpa && <div>CGPA: {edu.cgpa}</div>}
                      </div>
                    </div>
                  )
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {data.skills && (
            <section>
              <h2 className="text-xl font-bold text-slate-900 flex items-center border-b-2 border-slate-100 pb-2 mb-4 tracking-tight uppercase text-sm">
                <LayoutGrid className="w-5 h-5 mr-3 text-indigo-600" />
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.split(",").map((skill: string, idx: number) => {
                  const s = skill.trim();
                  if (!s) return null;
                  return (
                    <span key={idx} className="bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium border border-indigo-100/50 shadow-sm">
                      {s}
                    </span>
                  )
                })}
              </div>
            </section>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && data.projects.some((p: any) => p.title || p.description) && (
            <section>
              <h2 className="text-xl font-bold text-gray-900 flex items-center border-b border-gray-200 pb-2 mb-4">
                <Briefcase className="w-5 h-5 mr-3 text-indigo-600" />
                Projects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.projects.map((proj: any, idx: number) => (
                  (proj.title || proj.description) && (
                    <div key={idx} className="bg-slate-50/50 rounded-xl p-6 border border-slate-100 transition-all hover:shadow-md hover:border-indigo-100">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-slate-900 text-lg">{proj.title}</h3>
                        {proj.githubLink && (
                          <a href={proj.githubLink.startsWith("http") ? proj.githubLink : `https://${proj.githubLink}`} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-600 transition-colors">
                            <Github className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                      {proj.description && (
                        <p className="text-sm text-slate-600 mb-4 line-clamp-3 leading-relaxed">
                          {proj.description}
                        </p>
                      )}
                      {proj.technologies && (
                        <div className="text-xs font-semibold text-indigo-600 mt-auto pt-3 border-t border-slate-100/50">
                          {proj.technologies}
                        </div>
                      )}
                    </div>
                  )
                ))}
              </div>
            </section>
          )}

          {/* Achievements */}
          {data.achievements && (
            <section>
              <h2 className="text-xl font-bold text-slate-900 flex items-center border-b-2 border-slate-100 pb-2 mb-4 tracking-tight uppercase text-sm">
                <Award className="w-5 h-5 mr-3 text-indigo-600" />
                Achievements
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                {data.achievements}
              </p>
            </section>
          )}

          {/* Certifications */}
          {data.certifications && (
            <section>
              <h2 className="text-xl font-bold text-slate-900 flex items-center border-b-2 border-slate-100 pb-2 mb-4 tracking-tight uppercase text-sm">
                <BookOpen className="w-5 h-5 mr-3 text-indigo-600" />
                Certifications
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                {data.certifications}
              </p>
            </section>
          )}
        </div>
      </div>
    )
  }
)
PortfolioPreview.displayName = "PortfolioPreview"
