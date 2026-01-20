import React from 'react';

interface ContactModalProps {
  onClose: () => void;
  type: string | null;
}

const ContactModal: React.FC<ContactModalProps> = ({ onClose, type }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-warm-200 dark:border-zinc-800 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-warm-100 dark:hover:bg-zinc-800 rounded-full transition-colors z-10"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-magenta/10 rounded-2xl flex items-center justify-center mb-6 text-magenta">
            <span className="material-symbols-outlined text-4xl">
              {type === 'contact' ? 'mail' : 
               type === 'privacy' ? 'security' :
               type === 'terms' ? 'gavel' : 'info'}
            </span>
          </div>

          <h2 className="text-2xl font-black mb-2 dark:text-white">
            {type === 'contact' ? 'Get in Touch' : 
             type === 'privacy' ? 'Privacy Policy' :
             type === 'terms' ? 'Terms of Service' : 'About Us'}
          </h2>

          {type === 'contact' ? (
            <div className="mt-4 w-full">
              <p className="text-zinc-500 mb-6 font-medium">
                We'd love to hear from you. Drop us a line directly:
              </p>
              <div className="bg-warm-50 dark:bg-zinc-800 border border-warm-200 dark:border-zinc-700 rounded-xl p-4 flex items-center justify-between group cursor-pointer hover:border-magenta/50 transition-colors"
                   onClick={() => {
                     navigator.clipboard.writeText('studentshifts@outlook.com');
                     alert('Email copied to clipboard!');
                   }}>
                <span className="font-bold text-zinc-700 dark:text-zinc-200 text-sm select-all">
                  studentshifts@outlook.com
                </span>
                <span className="material-symbols-outlined text-zinc-400 group-hover:text-magenta transition-colors">content_copy</span>
              </div>
              <a 
                href="mailto:studentshifts@outlook.com"
                className="mt-4 block w-full py-3 bg-magenta text-white font-bold rounded-xl shadow-lg shadow-magenta/20 hover:bg-magenta-600 transition-all active:scale-95 text-sm"
              >
                Send Email
              </a>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-zinc-400 font-medium">
                This page is coming soon. 
                <br />
                We are currently updating our legal and informational documents.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
