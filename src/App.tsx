/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  CheckCircle2, 
  Circle, 
  Clock,
  Filter,
  LayoutGrid,
  List
} from 'lucide-react';

enum ProjectStatus {
  NOT_STARTED = 'Not Started',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done'
}

interface Project {
  id: string;
  name: string;
  owner: string;
  status: ProjectStatus;
  createdAt: number;
}

const statusColors = {
  [ProjectStatus.NOT_STARTED]: 'bg-slate-200 text-slate-600',
  [ProjectStatus.IN_PROGRESS]: 'bg-amber-100 text-amber-700',
  [ProjectStatus.DONE]: 'bg-emerald-100 text-emerald-700',
};

const statusIcons = {
  [ProjectStatus.NOT_STARTED]: Circle,
  [ProjectStatus.IN_PROGRESS]: Clock,
  [ProjectStatus.DONE]: CheckCircle2,
};

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectName, setProjectName] = useState('');
  const [owner, setOwner] = useState('');
  const [status, setStatus] = useState<ProjectStatus>(ProjectStatus.NOT_STARTED);
  const [searchQuery, setSearchQuery] = useState('');

  const activeCount = useMemo(() => projects.filter(p => p.status === ProjectStatus.IN_PROGRESS).length, [projects]);
  const completedCount = useMemo(() => projects.filter(p => p.status === ProjectStatus.DONE).length, [projects]);

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim() || !owner.trim()) return;

    const newProject: Project = {
      id: Math.floor(Math.random() * 900 + 100).toString(), // Match the #402 style ID
      name: projectName.trim(),
      owner: owner.trim(),
      status,
      createdAt: Date.now(),
    };

    setProjects(prev => [newProject, ...prev]);
    setProjectName('');
    setOwner('');
    setStatus(ProjectStatus.NOT_STARTED);
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.owner.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [projects, searchQuery]);

  const currentTime = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  }).format(new Date());

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-8 flex flex-col">
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col">
        
        {/* Header Section */}
        <header className="mb-8 flex flex-col md:flex-row justify-between items-end border-b border-slate-200 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Team Project Tracker</h1>
            <p className="text-slate-500 mt-1 text-sm">Centralized oversight for department deliverables</p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white border border-slate-200 px-4 py-2 rounded shadow-sm text-center min-w-[100px]">
              <span className="block text-xs uppercase font-bold text-slate-400 tracking-wider">Active</span>
              <span className="text-xl font-mono font-bold text-slate-800">{activeCount}</span>
            </div>
            <div className="bg-white border border-slate-200 px-4 py-2 rounded shadow-sm text-center min-w-[100px]">
              <span className="block text-xs uppercase font-bold text-slate-400 tracking-wider">Completed</span>
              <span className="text-xl font-mono font-bold text-slate-800">{completedCount}</span>
            </div>
            
            {/* Search integrated into header row in high density style */}
            <div className="hidden lg:flex items-center gap-2 bg-white border border-slate-200 rounded px-3 h-[42px] shadow-sm ml-4">
              <Search className="w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-slate-600 w-32 placeholder:text-slate-300"
              />
            </div>
          </div>
        </header>

        {/* Entry Form Section */}
        <section className="bg-slate-100 p-6 rounded-lg mb-8 border border-slate-200 shadow-inner">
          <form onSubmit={handleAddProject} className="flex flex-col xl:flex-row items-end gap-6">
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Project Name</label>
              <input
                type="text"
                placeholder="e.g. Website Redesign"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            
            <div className="w-full xl:w-64">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Owner</label>
              <input
                type="text"
                placeholder="Enter name"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            
            <div className="w-full xl:w-48">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
              >
                {Object.values(ProjectStatus).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            
            <button
              type="submit"
              className="w-full xl:w-auto bg-slate-900 text-white font-bold px-6 py-2 rounded hover:bg-slate-800 transition-all uppercase text-xs tracking-widest h-[42px] active:scale-95 whitespace-nowrap"
            >
              Add Project
            </button>
          </form>
        </section>

        {/* Table Section */}
        <section className="flex-1 bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest w-24">ID</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Project Name</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Owner</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date Added</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-600">
                <AnimatePresence mode="popLayout">
                  {filteredProjects.length === 0 ? (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <td colSpan={5} className="p-20 text-center text-slate-400">
                        <div className="flex flex-col items-center gap-2">
                          <LayoutGrid className="w-8 h-8 opacity-20" />
                          <p className="font-medium">No projects in database</p>
                        </div>
                      </td>
                    </motion.tr>
                  ) : (
                    filteredProjects.map((project) => (
                      <motion.tr
                        key={project.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-b border-slate-100 hover:bg-slate-50 cursor-default group transition-colors"
                      >
                        <td className="p-4 font-mono text-slate-400">#{project.id}</td>
                        <td className="p-4 font-medium text-slate-900">{project.name}</td>
                        <td className="p-4">{project.owner}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide inline-block ${statusColors[project.status]}`}>
                            {project.status}
                          </span>
                        </td>
                        <td className="p-4 text-slate-400 tabular-nums">
                          {new Date(project.createdAt).toLocaleDateString(undefined, { 
                            month: 'short', 
                            day: '2-digit', 
                            year: 'numeric' 
                          })}
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer Status Bar */}
        <footer className="mt-4 flex justify-between items-center text-[11px] text-slate-400 font-bold uppercase tracking-widest">
          <div>Last Updated: {currentTime}</div>
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Connection: Stable
            </span>
            <span>Auto-sync: Active</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

