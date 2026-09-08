import React, { useState, useEffect } from 'react';
import { apiRequest } from '../api/client';
import { OperationalTask } from '../types';
import { ClipboardList, CheckCircle2, Clock, AlertTriangle, Check, Plus, X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<OperationalTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newOwner, setNewOwner] = useState('Dr. Ananya Sharma');
  const [newPriority, setNewPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('HIGH');
  const [newSource, setNewSource] = useState('Manual Task Board');

  const loadTasks = () => {
    apiRequest<OperationalTask[]>('/tasks')
      .then(setTasks)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleToggleStatus = async (task: OperationalTask) => {
    const nextStatus = task.status === 'COMPLETED' ? 'OPEN' : 'COMPLETED';
    try {
      await apiRequest(`/tasks/${task.id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: nextStatus }),
      });
      if (nextStatus === 'COMPLETED') {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.8 },
          colors: ['#0B4D3C', '#10B981', '#0284C7'],
        });
      }
      loadTasks();
    } catch (e: any) {
      alert(e.message || 'Error updating task status');
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: OperationalTask = {
      id: `task-${Date.now()}`,
      title: newTitle,
      owner_name: newOwner,
      due_date: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      priority: newPriority,
      status: 'OPEN',
      source_module: newSource,
      created_at: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);
    setShowNewTaskModal(false);
    setNewTitle('');
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-[#E2EEE7] shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-[#EBF7F0] text-[#0B4D3C] text-[11px] font-bold mb-1">
            <Sparkles className="h-3 w-3" />
            <span>Interactive Operational Tasks</span>
          </div>
          <h1 className="text-2xl font-bold text-[#14231E] tracking-tight">Clinical Operations Task Board</h1>
          <p className="text-xs text-[#526D61] mt-0.5">
            Actionable Work Items Generated from CRA Monitoring Findings, Data Queries, and Safety Alerts
          </p>
        </div>
        <button
          onClick={() => setShowNewTaskModal(true)}
          className="px-5 py-2.5 bg-[#0B4D3C] hover:bg-[#07382B] text-white text-xs font-bold rounded-full transition shadow-sm flex items-center space-x-2 shrink-0 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Task</span>
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {loading ? (
          <div className="py-8 text-center text-[#526D61] font-mono text-xs">Loading Tasks...</div>
        ) : (
          tasks.map((task) => {
            const isCompleted = task.status === 'COMPLETED';
            return (
              <div
                key={task.id}
                onClick={() => handleToggleStatus(task)}
                className={`p-5 rounded-[2rem] border transition-all cursor-pointer flex items-center justify-between text-xs shadow-sm hover:shadow-md ${
                  isCompleted
                    ? 'bg-[#F4FBF7] border-[#D5E6DC] opacity-75'
                    : 'bg-white border-[#E2EEE7] hover:border-[#0B4D3C]'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`mt-0.5 h-6 w-6 rounded-full border-2 flex items-center justify-center transition shrink-0 ${
                      isCompleted
                        ? 'bg-[#0B4D3C] border-[#0B4D3C] text-white shadow-sm'
                        : 'border-[#A7F3D0] bg-[#F4FBF7] hover:border-[#0B4D3C]'
                    }`}
                  >
                    {isCompleted && <Check className="h-3.5 w-3.5" />}
                  </div>
                  <div>
                    <h4
                      className={`font-bold text-sm text-[#14231E] ${
                        isCompleted ? 'line-through text-[#718E81]' : ''
                      }`}
                    >
                      {task.title}
                    </h4>
                    <div className="flex items-center space-x-3 text-[11px] text-[#526D61] mt-1 font-medium">
                      <span>Owner: <strong className="text-[#14231E]">{task.owner_name}</strong></span>
                      <span>•</span>
                      <span>Source: {task.source_module}</span>
                      <span>•</span>
                      <span className="font-mono">Due: {task.due_date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 font-mono shrink-0">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                      task.priority === 'URGENT'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : task.priority === 'HIGH'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-[#F4FBF7] text-[#526D61] border border-[#D5E6DC]'
                    }`}
                  >
                    {task.priority}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    isCompleted ? 'bg-[#D7F5E8] text-[#065F46]' : 'bg-[#FFEDD5] text-[#C2410C]'
                  }`}>
                    {task.status}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] border border-[#D5E6DC] max-w-lg w-full p-8 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#F0F7F2] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#14231E]">Create Operational Task</h3>
                <p className="text-xs text-[#526D61]">Action item for site monitor or investigator</p>
              </div>
              <button onClick={() => setShowNewTaskModal(false)} className="p-2 rounded-full hover:bg-[#F4FBF7] text-[#526D61]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#364F44] mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule Root Cause Analysis for Transaminitis SAE..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full bg-[#F4FBF7] border border-[#D5E6DC] text-[#14231E] focus:outline-none focus:border-[#0B4D3C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#364F44] mb-1">Assigned Owner</label>
                  <input
                    type="text"
                    required
                    value={newOwner}
                    onChange={(e) => setNewOwner(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-full bg-[#F4FBF7] border border-[#D5E6DC] text-[#14231E] focus:outline-none focus:border-[#0B4D3C]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#364F44] mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-full bg-[#F4FBF7] border border-[#D5E6DC] text-[#14231E] focus:outline-none focus:border-[#0B4D3C] font-semibold"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-[#F0F7F2]">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="px-5 py-2.5 rounded-full border border-[#D5E6DC] font-bold text-[#526D61]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#0B4D3C] hover:bg-[#07382B] text-white font-bold shadow-sm"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
