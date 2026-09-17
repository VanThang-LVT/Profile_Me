import React, { useState } from 'react';
import { FolderGit2, ExternalLink, Github, Sparkles } from 'lucide-react';
import { sampleProjects } from '../data/defaultData';

export const ProjectsSection = () => {
  const [selectedTag, setSelectedTag] = useState('ALL');

  const allTags = ['ALL', 'React', 'Tailwind CSS', 'Node.js', 'Python', 'Machine Learning'];

  const filteredProjects = selectedTag === 'ALL'
    ? sampleProjects
    : sampleProjects.filter(p => p.tags.some(t => t.toLowerCase().includes(selectedTag.toLowerCase())));

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
            <FolderGit2 size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Dự án Tiêu biểu & Sản phẩm
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Các sản phẩm phần mềm và nghiên cứu thực tế đã thực hiện
            </p>
          </div>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedTag === tag
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {tag === 'ALL' ? 'Tất cả' : tag}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Project Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
              </div>

              {/* Info */}
              <div className="p-6 space-y-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {project.description}
                </p>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[11px] font-semibold"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Links Footer */}
            <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-100 dark:border-slate-700/60 mt-4">
              <a
                href={project.demoLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                <span>Xem Live Demo</span>
                <ExternalLink size={14} />
              </a>
              <a
                href={project.githubLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <Github size={15} />
                <span>Mã nguồn</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
