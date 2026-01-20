
import React, { useState, useEffect, useMemo } from 'react';
import Layout from './components/Layout';
import AuthModal from './components/AuthModal';
import { User, UserMode, StudentProfile, JobListing, Message, Experience } from './types';
import { MOCK_JOBS } from './constants';
import JobCard from './components/JobCard';
import { apiService } from './services/apiService';

type Screen = 'feed' | 'profile' | 'tracker' | 'dashboard' | 'create-job' | 'inbox';

// --- Screen: Job Details (Overlay) ---
const JobDetails = ({ job, onClose, onMessage, canMessage }: { job: JobListing, onClose: () => void, onMessage: (msg: string) => void, canMessage: boolean }) => {
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = () => {
    if (!message.trim()) {
      setError("Please enter a message before sending.");
      return;
    }
    setError(null);
    try {
      onMessage(message);
      setSent(true);
      setTimeout(() => {
        setSent(false);
        setMessage('');
        onClose();
      }, 2000);
    } catch (e) {
      setError("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950/50 backdrop-blur-sm animate-in fade-in flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl h-[90vh] sm:h-auto sm:max-h-[85vh] rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-10">
        <header className="p-4 border-b border-warm-100 dark:border-zinc-800 flex justify-between items-center bg-white dark:bg-zinc-900 sticky top-0 z-10">
          <h2 className="font-bold text-lg">Job Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-warm-50 dark:hover:bg-zinc-800 rounded-full">
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          <div className="flex gap-4">
            <div className="w-20 h-20 rounded-2xl shadow-sm overflow-hidden bg-warm-100 dark:bg-zinc-800 flex-shrink-0">
              <img src={job.logo || `https://picsum.photos/seed/${job.id}/200`} className="w-full h-full object-cover" alt="" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-magenta leading-tight">{job.title}</h1>
              <p className="font-semibold text-zinc-600 dark:text-zinc-400">{job.company}</p>
              <div className="flex items-center gap-1 text-xs text-zinc-400 mt-1">
                <span className="material-symbols-outlined text-sm">location_on</span>
                {job.location}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-warm-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-warm-100 dark:border-zinc-800">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Pay Rate</p>
              <p className="text-lg font-bold">€{job.salaryMin.toFixed(2)}-{job.salaryMax.toFixed(2)}/hr</p>
            </div>
            <div className="bg-warm-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-warm-100 dark:border-zinc-800">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Status</p>
              <p className="text-lg font-bold text-green-500 uppercase text-sm">Active</p>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-2">Description</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap">{job.description}</p>
          </div>

          {job.responsibilities?.length > 0 && (
            <div>
              <h3 className="font-bold mb-2">Responsibilities</h3>
              <ul className="list-disc list-inside text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                {job.responsibilities.map((r, i) => r ? <li key={i}>{r}</li> : null)}
              </ul>
            </div>
          )}

          {canMessage && (
            <div className="border-t border-warm-100 dark:border-zinc-800 pt-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-magenta">mail</span>
                Message Employer
              </h3>
              {error && <p className="text-red-500 text-xs font-bold mb-2">{error}</p>}
              <div className="space-y-3">
                <textarea
                  placeholder="Ask a question about the role or pitch yourself..."
                  className="w-full p-4 bg-warm-50 dark:bg-zinc-800 border border-warm-100 dark:border-zinc-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-magenta transition-all"
                  rows={3}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                ></textarea>
                <button
                  onClick={handleSend}
                  disabled={sent}
                  className={`w-full py-3 rounded-xl font-bold transition-all shadow-lg ${sent ? 'bg-green-500 text-white' : 'bg-magenta text-white active:scale-95 shadow-magenta/20'}`}
                >
                  {sent ? 'Message Sent!' : 'Send Message'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Screen: Inbox (Employer View) ---
const InboxPage = ({ messages, jobs }: { messages: Message[], jobs: JobListing[] }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold">Employer Inbox</h2>
      <div className="grid gap-4">
        {messages.length === 0 ? (
          <div className="py-20 text-center text-zinc-400 bg-white dark:bg-zinc-900 border border-warm-200 dark:border-zinc-800 rounded-3xl">
            <span className="material-symbols-outlined text-6xl mb-4 opacity-20">inbox</span>
            <p className="text-lg">No messages from students yet.</p>
          </div>
        ) : (
          messages.map(msg => {
            const job = jobs.find(j => j.id === msg.jobId);
            return (
              <div key={msg.id} className="bg-white dark:bg-zinc-900 border border-warm-200 dark:border-zinc-800 p-8 rounded-3xl shadow-sm flex gap-6 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                <div className="w-14 h-14 rounded-2xl bg-magenta/10 flex items-center justify-center text-magenta font-bold flex-shrink-0 text-xl">
                  {msg.studentName.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-lg">{msg.studentName}</h4>
                    <span className="text-xs text-zinc-400 font-medium">{msg.timestamp}</span>
                  </div>
                  <p className="text-xs text-magenta font-black uppercase tracking-widest mb-4">Re: {job?.title || 'Job Listing'}</p>
                  <div className="bg-warm-50 dark:bg-zinc-800/50 p-5 rounded-2xl border border-warm-100 dark:border-zinc-800">
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed italic">"{msg.text}"</p>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <button className="px-6 py-2.5 bg-magenta text-white text-xs font-bold rounded-xl shadow-lg shadow-magenta/20 hover:scale-105 active:scale-95 transition-all">Reply to Student</button>
                    <button className="px-6 py-2.5 bg-warm-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-bold rounded-xl border border-warm-200 dark:border-zinc-700 hover:bg-warm-100 transition-all">View Profile</button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// --- Screen: Job Feed ---
const JobFeed = ({ jobs, onJobClick }: { jobs: JobListing[], onJobClick: (id: string) => void }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Remote', 'Nearby', 'Internships', 'On-Campus'];

  const filterChecks: Record<string, (job: JobListing) => boolean> = useMemo(() => ({
    Remote: (job) => /remote/i.test(job.location) || job.tags.some(tag => /remote/i.test(tag)),
    Nearby: (job) => !/remote/i.test(job.location),
    Internships: (job) => /intern/i.test(job.title) || job.tags.some(tag => /intern/i.test(tag)),
    'On-Campus': (job) => /campus/i.test(job.location) || job.tags.some(tag => /campus|on-campus/i.test(tag))
  }), []);

  const filteredJobs = useMemo(() => {
    if (activeFilter === 'All') return jobs;
    const predicate = filterChecks[activeFilter];
    return predicate ? jobs.filter(predicate) : jobs;
  }, [activeFilter, filterChecks, jobs]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div className="text-center space-y-2 mb-10">
        <h2 className="text-4xl font-black tracking-tight">Your next shift is waiting.</h2>
        <p className="text-zinc-500">Connecting Ireland's top student talent with local campus opportunities.</p>
      </div>

      <div className="relative group max-w-3xl mx-auto">
        <input
          type="text"
          placeholder="Search for your next shift (e.g. Barista, Tutor, Library)..."
          className="w-full pl-14 pr-6 py-5 bg-white dark:bg-zinc-900 border border-warm-200 dark:border-zinc-800 rounded-2xl shadow-xl shadow-warm-200/20 dark:shadow-none focus:ring-4 focus:ring-magenta/10 outline-none transition-all text-lg"
        />
        <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 text-2xl">search</span>
      </div>

      <div className="flex items-center justify-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`flex-shrink-0 px-8 py-3 rounded-2xl font-bold text-xs transition-all ${activeFilter === f ? 'bg-magenta text-white shadow-xl shadow-magenta/20 scale-105' : 'bg-white dark:bg-zinc-900 border border-warm-200 dark:border-zinc-800 text-zinc-500 hover:bg-warm-50 dark:hover:bg-zinc-800'}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredJobs.length === 0 ? (
          <div className="py-20 text-center text-zinc-400 col-span-full">
            <span className="material-symbols-outlined text-6xl mb-4 opacity-20">work_off</span>
            <p className="text-lg">No shifts match the {activeFilter} filter yet.</p>
          </div>
        ) : (
          filteredJobs.map(job => (
            <JobCard key={job.id} job={job} onClick={() => onJobClick(job.id)} />
          ))
        )}
      </div>
    </div>
  );
};

// --- Screen 3: Student Profile ---
const ProfilePage = ({ user }: { user: User | null }) => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem(`ss:profile:${user?.email}`);
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
      setLoading(false);
    } else if (user) {
      setProfile({
        id: user.studentId || '1',
        firstName: user.firstName || 'Alex',
        lastName: user.lastName || 'Byrne',
        dob: '2001-05-15',
        email: user.email,
        phone: '+353 87 123 4567',
        university: (user as any).university || 'Trinity College Dublin (TCD)',
        degree: 'BSc Computer Science',
        bio: 'Dedicated student looking for a part-time role to gain experience.',
        skills: ['Communication', 'Time Management'],
        experience: [],
        portfolioUrl: '',
        linkedInUrl: ''
      });
      setLoading(false);
    }
  }, [user]);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    setSaveStatus(null);
    localStorage.setItem(`ss:profile:${user?.email}`, JSON.stringify(profile));
    const success = await apiService.saveStudentProfile(profile);
    setSaving(false);
    if (success) {
      setSaveStatus({ type: 'success', text: 'Profile saved successfully!' });
    } else {
      setSaveStatus({ type: 'error', text: 'Failed to sync with server.' });
    }
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const addExperience = () => {
    if (!profile) return;
    setProfile({
      ...profile,
      experience: [...profile.experience, { role: '', company: '', period: '' }]
    });
  };

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    if (!profile) return;
    const newExp = [...profile.experience];
    newExp[index] = { ...newExp[index], [field]: value };
    setProfile({ ...profile, experience: newExp });
  };

  const removeExperience = (index: number) => {
    if (!profile) return;
    const newExp = profile.experience.filter((_, i) => i !== index);
    setProfile({ ...profile, experience: newExp });
  };

  if (loading) return <div className="p-8 text-center text-zinc-400">Loading profile...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-5xl mx-auto">
      <section className="bg-magenta rounded-[2rem] p-12 text-white relative overflow-hidden shadow-2xl shadow-magenta/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-10">
          <div className="w-32 h-32 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-5xl font-bold shadow-inner">
            {profile?.firstName.charAt(0)}{profile?.lastName.charAt(0)}
          </div>
          <div>
            <h2 className="text-5xl font-black mb-3">{profile?.firstName} {profile?.lastName}</h2>
            <div className="flex flex-wrap items-center gap-4 text-magenta-50 font-medium">
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">school</span>
                {profile?.university}
              </p>
              <div className="w-1.5 h-1.5 rounded-full bg-white/30 hidden md:block"></div>
              <p className="text-sm opacity-90">{profile?.degree}</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-white/5 rounded-full -mr-40 -mt-40 blur-[100px]"></div>
      </section>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-8">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-warm-200 dark:border-zinc-800 p-8 shadow-sm">
            <h3 className="font-black mb-6 text-xs uppercase tracking-[0.2em] text-zinc-400">Professional Links</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-zinc-500 uppercase mb-2">LinkedIn URL</label>
                <input
                  type="url"
                  value={profile?.linkedInUrl}
                  onChange={e => setProfile(p => p ? { ...p, linkedInUrl: e.target.value } : null)}
                  placeholder="linkedin.com/in/..."
                  className="w-full px-5 py-3 bg-warm-50 dark:bg-zinc-800 border border-warm-200 dark:border-zinc-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-magenta transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-zinc-500 uppercase mb-2">Portfolio/CV Link</label>
                <input
                  type="url"
                  value={profile?.portfolioUrl}
                  onChange={e => setProfile(p => p ? { ...p, portfolioUrl: e.target.value } : null)}
                  placeholder="myportfolio.com"
                  className="w-full px-5 py-3 bg-warm-50 dark:bg-zinc-800 border border-warm-200 dark:border-zinc-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-magenta transition-all"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-warm-200 dark:border-zinc-800 p-8 shadow-sm">
            <h3 className="font-black mb-6 text-xs uppercase tracking-[0.2em] text-zinc-400">Skills</h3>
            <textarea
              rows={4}
              placeholder="e.g. Retail, Customer Service, Python, Design"
              value={profile?.skills.join(', ')}
              onChange={e => setProfile(p => p ? { ...p, skills: e.target.value.split(',').map(s => s.trim()) } : null)}
              className="w-full px-5 py-4 bg-warm-50 dark:bg-zinc-800 border border-warm-200 dark:border-zinc-700 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-magenta transition-all resize-none leading-relaxed"
            ></textarea>
            <p className="text-[10px] text-zinc-400 mt-4 italic font-medium">Separate skills with commas.</p>
          </div>
        </div>

        <div className="md:col-span-2 space-y-8">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-warm-200 dark:border-zinc-800 p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-xs uppercase tracking-[0.2em] text-zinc-400">Professional Bio</h3>
            </div>
            <textarea
              rows={5}
              value={profile?.bio}
              onChange={e => setProfile(p => p ? { ...p, bio: e.target.value } : null)}
              className="w-full px-5 py-4 bg-warm-50 dark:bg-zinc-800 border border-warm-200 dark:border-zinc-700 rounded-2xl outline-none focus:ring-2 focus:ring-magenta transition-all text-sm leading-relaxed"
            ></textarea>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-warm-200 dark:border-zinc-800 p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-black text-xs uppercase tracking-[0.2em] text-zinc-400">Experience History</h3>
              <button onClick={addExperience} className="flex items-center gap-2 text-xs font-bold text-magenta hover:underline group">
                <span className="material-symbols-outlined group-hover:scale-125 transition-transform">add_circle</span>
                Add Experience
              </button>
            </div>
            <div className="space-y-6">
              {profile?.experience.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-warm-100 dark:border-zinc-800 rounded-[2rem]">
                  <span className="material-symbols-outlined text-zinc-300 text-5xl mb-4 opacity-30">work_history</span>
                  <p className="text-sm text-zinc-400 font-medium">Your work history is empty. Let's add your first shift!</p>
                </div>
              ) : (
                profile?.experience.map((exp, idx) => (
                  <div key={idx} className="p-6 bg-warm-50 dark:bg-zinc-800/50 rounded-2xl border border-warm-100 dark:border-zinc-800 relative group">
                    <button onClick={() => removeExperience(idx)} className="absolute top-4 right-4 p-2 text-zinc-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all">
                      <span className="material-symbols-outlined text-xl">delete</span>
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Role</label>
                        <input value={exp.role} onChange={e => updateExperience(idx, 'role', e.target.value)} placeholder="e.g. Sales Associate" className="w-full bg-transparent border-b border-warm-200 dark:border-zinc-700 pb-2 text-sm font-bold outline-none focus:border-magenta" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Company</label>
                        <input value={exp.company} onChange={e => updateExperience(idx, 'company', e.target.value)} placeholder="e.g. Starbucks" className="w-full bg-transparent border-b border-warm-200 dark:border-zinc-700 pb-2 text-sm font-bold outline-none focus:border-magenta" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Duration</label>
                        <input value={exp.period} onChange={e => updateExperience(idx, 'period', e.target.value)} placeholder="e.g. 2023 - Present" className="w-full bg-transparent border-b border-warm-200 dark:border-zinc-700 pb-2 text-sm font-bold outline-none focus:border-magenta" />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="sticky bottom-10 left-1/2 mx-auto w-full max-w-2xl px-4 z-[60]">
        <div className="glass border border-warm-200 dark:border-zinc-800 p-6 rounded-[2rem] shadow-2xl flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">Status</span>
            <span className={`text-sm font-bold ${saveStatus?.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
              {saveStatus?.text || 'Profile is ready to save'}
            </span>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-magenta text-white px-12 py-4 rounded-2xl font-black text-sm hover:bg-magenta-600 hover:scale-105 transition-all active:scale-95 shadow-xl shadow-magenta/20 disabled:opacity-50"
          >
            {saving ? 'Syncing...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

const TrackerPage = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black tracking-tight">Shift Tracker</h2>
          <p className="text-zinc-500 mt-2">Manage all your active and previous shift applications.</p>
        </div>
      </div>
      <div className="bg-white dark:bg-zinc-900 border border-warm-200 dark:border-zinc-800 rounded-[2.5rem] p-24 text-center">
        <div className="w-24 h-24 bg-magenta/5 rounded-full flex items-center justify-center mx-auto mb-8">
          <span className="material-symbols-outlined text-6xl text-magenta/30">assignment_turned_in</span>
        </div>
        <p className="text-2xl font-bold">No active applications found.</p>
        <p className="text-zinc-500 mt-4 max-w-sm mx-auto">Once you apply for a shift on the explore page, your status updates will appear right here.</p>
        <button className="mt-10 bg-magenta text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-magenta/10 hover:scale-105 transition-all">Start Exploring</button>
      </div>
    </div>
  );
};

const EmployerDashboard = ({ jobs, onAddListing }: { jobs: JobListing[], onAddListing: () => void }) => {
  return (
    <div className="space-y-10 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-10 rounded-[2rem] border border-warm-200 dark:border-zinc-800 shadow-sm transition-transform hover:-translate-y-1">
          <h4 className="text-5xl font-black text-magenta">{jobs.length}</h4>
          <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mt-3">Live Listings</p>
        </div>
        {/* Monthly Views hidden as per request */}
        {/* <div className="bg-white dark:bg-zinc-900 p-10 rounded-[2rem] border border-warm-200 dark:border-zinc-800 shadow-sm transition-transform hover:-translate-y-1">
          <h4 className="text-5xl font-black">2.4k</h4>
          <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mt-3">Monthly Views</p>
        </div> */}
        <div className="bg-white dark:bg-zinc-900 p-10 rounded-[2rem] border border-warm-200 dark:border-zinc-800 shadow-sm transition-transform hover:-translate-y-1">
          <h4 className="text-5xl font-black text-green-500">18</h4>
          <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mt-3">New Applicants</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black tracking-tight">Shift Console</h2>
          <p className="text-zinc-500 mt-1">Manage and edit your current student opportunities.</p>
        </div>
        <button onClick={onAddListing} className="bg-magenta text-white px-8 py-4 rounded-[1.5rem] font-black text-sm shadow-xl shadow-magenta/20 flex items-center gap-3 hover:scale-105 hover:bg-magenta-600 transition-all">
          <span className="material-symbols-outlined font-black">add_circle</span>
          Create New Listing
        </button>
      </div>

      <div className="grid gap-6">
        {jobs.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 p-24 rounded-[3rem] border-4 border-dashed border-warm-100 dark:border-zinc-800 text-center text-zinc-400">
            <p className="text-2xl font-black text-zinc-600 dark:text-zinc-300">No active shifts found.</p>
            <p className="text-sm mt-4 mb-10 max-w-md mx-auto">StudentShifts.ie helps you find local student talent quickly and efficiently. Post your first role to get started.</p>
            <button onClick={onAddListing} className="bg-magenta text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-magenta/10 hover:scale-105 transition-all">Post Your First Shift</button>
          </div>
        ) : (
          jobs.map(job => (
            <div key={job.id} className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-warm-200 dark:border-zinc-800 p-8 flex items-center gap-10 group hover:shadow-2xl hover:border-magenta/20 transition-all">
              <img src={job.logo || `https://picsum.photos/seed/${job.id}/200`} className="w-20 h-20 rounded-[1.5rem] object-cover shadow-sm group-hover:scale-110 transition-transform duration-500" alt="" />
              <div className="flex-1">
                <h3 className="font-black text-2xl group-hover:text-magenta transition-colors">{job.title}</h3>
                <div className="flex items-center gap-6 mt-3">
                  <p className="text-xs text-zinc-500 font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">group</span>
                    {job.applicantCount || 0} Applicants Applied
                  </p>
                  <div className="h-4 w-px bg-warm-200 dark:bg-zinc-800"></div>
                  <p className="text-xs text-green-500 font-black uppercase tracking-widest">Active Status</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="px-8 py-3 text-zinc-500 hover:bg-warm-50 dark:hover:bg-zinc-800 rounded-2xl text-xs font-black transition-all">Manage Applicants</button>
                <button className="px-8 py-3 bg-warm-50 dark:bg-zinc-800 text-magenta rounded-2xl text-xs font-black hover:bg-magenta hover:text-white transition-all">Edit Listing</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const CreateJobPage = ({ onCancel, onSubmit, companyName }: { onCancel: () => void, onSubmit: (job: Partial<JobListing>) => void, companyName: string }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    deadline: '',
    description: '',
    salaryMin: '12.50',
    salaryMax: '15.00',
    responsibilities: [''],
  });

  const handleSubmit = () => {
    if (!formData.title || !formData.location || !formData.deadline || !formData.description) {
      setStatus({ type: 'error', text: 'Missing required fields.' });
      return;
    }
    setLoading(true);
    const newJob: Partial<JobListing> = {
      title: formData.title,
      company: companyName,
      location: formData.location,
      deadline: formData.deadline,
      description: formData.description,
      salaryMin: parseFloat(formData.salaryMin),
      salaryMax: parseFloat(formData.salaryMax),
      responsibilities: formData.responsibilities.filter(r => r.trim() !== ''),
      tags: ['New Shift'],
      postedAt: 'Just now',
      applicantCount: 0,
      status: 'active'
    };
    setTimeout(() => {
      onSubmit(newJob);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto py-16 px-4 animate-in slide-in-from-bottom-5 duration-500">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-5xl font-black tracking-tight">Post a Shift</h2>
          <p className="text-zinc-500 mt-3 text-lg">Connect with thousands of students looking for work.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={onCancel} className="px-8 py-3 rounded-2xl font-bold text-sm text-zinc-500 hover:bg-warm-100 dark:hover:bg-zinc-800 transition-all">Cancel</button>
          <button onClick={handleSubmit} disabled={loading} className="px-10 py-4 bg-magenta text-white rounded-2xl font-black text-sm shadow-xl shadow-magenta/20 hover:scale-105 transition-all">
            {loading ? 'Posting Shift...' : 'Publish Listing'}
          </button>
        </div>
      </div>

      <div className="grid gap-8">
        {status && (
          <div className={`p-6 rounded-2xl font-bold text-sm border animate-in slide-in-from-top-2 ${status.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
            {status.text}
          </div>
        )}

        <div className="bg-white dark:bg-zinc-900 p-10 rounded-[2.5rem] border border-warm-200 dark:border-zinc-800 shadow-sm space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Listing Title</label>
              <input
                placeholder="e.g. Student Barista"
                className="w-full px-6 py-4 bg-warm-50 dark:bg-zinc-800 border border-warm-200 dark:border-zinc-700 rounded-2xl outline-none focus:ring-4 focus:ring-magenta/10 transition-all font-bold text-lg"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Campus / Location</label>
              <input
                placeholder="e.g. Dublin 2, UCD Belfield..."
                className="w-full px-6 py-4 bg-warm-50 dark:bg-zinc-800 border border-warm-200 dark:border-zinc-700 rounded-2xl outline-none focus:ring-4 focus:ring-magenta/10 transition-all font-bold text-lg"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Role Description</label>
            </div>
            <textarea
              rows={6}
              placeholder="Detail the shift duties, hours, and expectations..."
              className="w-full p-6 bg-warm-50 dark:bg-zinc-800 border border-warm-200 dark:border-zinc-700 rounded-3xl outline-none focus:ring-4 focus:ring-magenta/10 transition-all text-sm leading-relaxed"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Min Rate (€/hr)</label>
              <input
                type="number" step="0.5"
                className="w-full px-6 py-4 bg-warm-50 dark:bg-zinc-800 border border-warm-200 dark:border-zinc-700 rounded-2xl outline-none focus:ring-4 focus:ring-magenta/10 transition-all font-black text-xl"
                value={formData.salaryMin}
                onChange={e => setFormData({ ...formData, salaryMin: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Max Rate (€/hr)</label>
              <input
                type="number" step="0.5"
                className="w-full px-6 py-4 bg-warm-50 dark:bg-zinc-800 border border-warm-200 dark:border-zinc-700 rounded-2xl outline-none focus:ring-4 focus:ring-magenta/10 transition-all font-black text-xl"
                value={formData.salaryMax}
                onChange={e => setFormData({ ...formData, salaryMax: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Apply By</label>
              <input
                type="date"
                className="w-full px-6 py-4 bg-warm-50 dark:bg-zinc-800 border border-warm-200 dark:border-zinc-700 rounded-2xl outline-none focus:ring-4 focus:ring-magenta/10 transition-all font-bold"
                value={formData.deadline}
                onChange={e => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [mode, setMode] = useState<UserMode>(UserMode.STUDENT);
  const [screen, setScreen] = useState<Screen>('feed');
  const [darkMode, setDarkMode] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const savedUserRaw = localStorage.getItem('ss:user');
    if (savedUserRaw && savedUserRaw !== 'null') {
      try {
        const parsed: User = JSON.parse(savedUserRaw);
        if (parsed?.mode) {
          setUser(parsed);
          setMode(parsed.mode);
          setScreen(parsed.mode === UserMode.EMPLOYER ? 'dashboard' : 'feed');
        }
      } catch (error) {
        console.warn('Corrupt saved user detected. Clearing cache.', error);
        localStorage.removeItem('ss:user');
      }
    }

    const savedJobs = localStorage.getItem('ss:jobs');
    // Always try to fetch fresh jobs from API
    apiService.getJobs().then(fetchedJobs => {
      if (fetchedJobs && fetchedJobs.length > 0) {
        setJobs(fetchedJobs);
      } else if (savedJobs) {
        setJobs(JSON.parse(savedJobs));
      } else {
        // Only fall back to mocks if absolutely nothing else
        setJobs(MOCK_JOBS);
      }
    });

    const savedMsgs = localStorage.getItem('ss:messages');
    if (savedMsgs) {
      setMessages(JSON.parse(savedMsgs));
    }

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) setDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('ss:jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('ss:messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('ss:user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ss:user');
    }
  }, [user]);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
    setMode(userData.mode);
    setScreen(userData.mode === UserMode.EMPLOYER ? 'dashboard' : 'feed');
    setShowAuthModal(false);
  };

  const handlePostJob = async (newJobData: Partial<JobListing>) => {
    try {
      const savedJob = await apiService.postJob({
        ...newJobData,
        // Ensure numbers are numbers, backend expects numbers
        salaryMin: Number(newJobData.salaryMin),
        salaryMax: Number(newJobData.salaryMax),
      });
      // Backend returns the full job with _id, map it to frontend structure if needed
      // Our frontend 'JobListing' uses 'id', backend uses '_id'. 
      // We should normalize this, but for now let's just make sure it saves.
      const compatibleJob: JobListing = {
        ...savedJob,
        id: savedJob._id || savedJob.id, // Handle both
        logo: savedJob.logoUrl || `https://picsum.photos/seed/${Math.random()}/200`
      };

      setJobs(prev => [compatibleJob, ...prev]);
      setScreen('dashboard');
    } catch (error) {
      console.error("Failed to post job:", error);
      alert("Failed to save job to database. Check console details.");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setScreen('feed');
    localStorage.removeItem('ss:user');
  };

  const handleSendMessage = (text: string) => {
    if (!user || !selectedJobId) return;
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      jobId: selectedJobId,
      studentId: user.studentId || 'anon',
      studentName: user.firstName || 'Anonymous Student',
      text,
      timestamp: new Date().toLocaleString(),
      isRead: false
    };
    setMessages(prev => [newMessage, ...prev]);
  };

  const renderContent = () => {
    if (!user) {
      if (mode === UserMode.STUDENT) return <JobFeed jobs={jobs} onJobClick={(id) => setSelectedJobId(id)} />;
      return (
        <div className="py-24 text-center space-y-8 animate-in fade-in max-w-2xl mx-auto">
          <div className="w-28 h-28 bg-magenta/10 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-inner">
            <span className="material-symbols-outlined text-6xl text-magenta">campaign</span>
          </div>
          <h2 className="text-5xl font-black tracking-tight leading-tight">Post your shifts. <br />Hire student talent.</h2>
          <p className="text-zinc-500 text-lg leading-relaxed">Join hundreds of Irish businesses finding reliable part-time help on our campus marketplace.</p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-magenta text-white px-12 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-magenta/20 hover:scale-105 hover:bg-magenta-600 transition-all active:scale-95"
          >
            Join as an Employer
          </button>
        </div>
      );
    }

    if (user.mode === UserMode.STUDENT) {
      switch (screen) {
        case 'feed': return <JobFeed jobs={jobs} onJobClick={(id) => setSelectedJobId(id)} />;
        case 'profile': return <ProfilePage user={user} />;
        case 'tracker': return <TrackerPage />;
        default: return <JobFeed jobs={jobs} onJobClick={(id) => setSelectedJobId(id)} />;
      }
    } else {
      switch (screen) {
        case 'dashboard': return <EmployerDashboard jobs={jobs.filter(j => j.company === user?.firstName)} onAddListing={() => setScreen('create-job')} />;
        case 'inbox': return <InboxPage messages={messages} jobs={jobs} />;
        case 'create-job': return <CreateJobPage companyName={user?.firstName || 'Company'} onCancel={() => setScreen('dashboard')} onSubmit={handlePostJob} />;
        default: return <EmployerDashboard jobs={jobs.filter(j => j.company === user?.firstName)} onAddListing={() => setScreen('create-job')} />;
      }
    }
  };

  const selectedJob = jobs.find(j => j.id === selectedJobId);

  return (
    <Layout
      user={user}
      activeMode={mode}
      onModeSwitch={(m) => { setMode(m); if (!user) setScreen(m === UserMode.STUDENT ? 'feed' : 'dashboard'); }}
      onLogout={handleLogout}
      darkMode={darkMode}
      toggleDarkMode={() => setDarkMode(!darkMode)}
      onAuthClick={() => setShowAuthModal(true)}
      currentScreen={screen}
      setScreen={setScreen}
    >
      {renderContent()}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onSuccess={handleLoginSuccess} />}
      {selectedJob && (
        <JobDetails
          job={selectedJob}
          onClose={() => setSelectedJobId(null)}
          onMessage={handleSendMessage}
          canMessage={!!user && user.mode === UserMode.STUDENT}
        />
      )}
    </Layout>
  );
};

export default App;
