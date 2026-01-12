
import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  Phone, 
  MessageCircle, 
  Dumbbell, 
  Apple, 
  BarChart3, 
  Clock, 
  ChevronDown,
  User,
  ShieldCheck,
  Zap,
  Target,
  MinusCircle,
  PlusCircle,
  X,
  Loader2,
  Volume2,
  VolumeX
} from 'lucide-react';

// --- Types ---

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  contactPref: 'phone' | 'whatsapp';
  consent: boolean;
}

type ModalType = 'accessibility' | 'privacy' | 'terms' | null;

// --- EmailJS Types ---
declare global {
  interface Window {
    emailjs: {
      send: (
        serviceId: string,
        templateId: string,
        templateParams: Record<string, string>,
        publicKey: string
      ) => Promise<{ status: number; text: string }>;
    };
  }
}

// --- EmailJS Configuration ---
const EMAILJS_SERVICE_ID = 'service_fphe5xu';
const EMAILJS_TEMPLATE_ID = 'template_8p1hgtg';
const EMAILJS_PUBLIC_KEY = 'vT2iqiRsrq5f4D03A';
const RECIPIENT_EMAIL = 'gilad042@gmail.com';

// --- Constants ---

const STAGES = [
  { id: 'hero', label: 'התחלה' },
  { id: 'diagnosis', label: 'איפה אתה היום' },
  { id: 'about', label: 'מי אני' },
  // { id: 'stuck', label: 'למה זה קורה' }, // DRAFT MODE - HIDDEN
  { id: 'waiting', label: 'המחיר' },
  { id: 'guarantee', label: 'ההתחייבות' },
  { id: 'get', label: 'הפתרון' },
  { id: 'how', label: 'הדרך' },
  { id: 'proof', label: 'התוצאות' },
  { id: 'action', label: 'הצטרפות' }
];

// --- Legal Content ---

const LEGAL_CONTENT = {
  accessibility: {
    title: 'הצהרת נגישות',
    content: (
      <div className="space-y-4 text-gray-300">
        <p>אנחנו רואים חשיבות רבה בהנגשת האתר לכלל האוכלוסייה, מתוך אמונה כי לכל אדם מגיעה גישה שווה ונוחה לשירותים ולמידע ברשת.</p>
        <p>האתר נבנה במטרה לעמוד בהנחיות WCAG 2.1 ברמה AA ככל הניתן.</p>
        <ul className="list-disc pr-6 space-y-2">
          <li>ניווט מלא באמצעות המקלדת.</li>
          <li>היררכיית כותרות ברורה ותקינה.</li>
          <li>טקסטים חלופיים (Alt-text) לתמונות משמעותיות.</li>
          <li>ניגודיות צבעים המותאמת לקריאה נוחה.</li>
          <li>תמיכה במצב העדפת תנועה מופחתת (Reduced Motion).</li>
        </ul>
        <div className="pt-4 border-t border-white/10">
          <p className="font-bold text-white mb-2">נתקלתם בבעיה? נשמח לעזור:</p>
          <p>רכז/ת נגישות: גילעד דורון</p>
          <p>טלפון: 050-0000000</p>
          <p>אימייל: support@giladdoron.co.il</p>
        </div>
      </div>
    )
  },
  privacy: {
    title: 'מדיניות פרטיות',
    content: (
      <div className="space-y-4 text-gray-300">
        <p>הפרטיות שלך חשובה לנו. המידע שאנו אוספים (שם, טלפון, אימייל) משמש אך ורק למטרות הבאות:</p>
        <ul className="list-disc pr-6 space-y-2">
          <li>יצירת קשר ראשוני ובדיקת התאמה לליווי.</li>
          <li>מתן השירות המקצועי שסוכם עליו.</li>
          <li>שיפור חוויית השימוש באתר.</li>
        </ul>
        <p>אנו מתחייבים כי לא נמכור את פרטיך לצדדים שלישיים. המידע נשמר באמצעי אבטחה סבירים ומקובלים.</p>
        <p>לכל בקשה לעדכון או מחיקת המידע, ניתן לפנות אלינו בכתובת support@giladdoron.co.il.</p>
      </div>
    )
  },
  terms: {
    title: 'תקנון שימוש',
    content: (
      <div className="space-y-4 text-gray-300">
        <p>השימוש באתר ובשירותי הליווי של גילעד דורון כפוף לתנאים הבאים:</p>
        <ul className="list-disc pr-6 space-y-2">
          <li><strong>תיאור השירות:</strong> ליווי אונליין לאימונים ותזונה בהתאמה אישית.</li>
          <li><strong>ייעוץ רפואי:</strong> המידע באתר ובליווי אינו מהווה ייעוץ רפואי. יש להיוועץ ברופא לפני תחילת כל פעילות גופנית או שינוי תזונתי.</li>
          <li><strong>תוצאות:</strong> התוצאות משתנות מאדם לאדם ותלויות במידת היישום וההתמדה.</li>
          <li><strong>קניין רוחני:</strong> כל התכנים, התוכניות והעיצובים באתר שייכים בלעדית לגילעד דורון.</li>
        </ul>
        <p>אנו שואפים לתת את השירות הטוב ביותר ובשקיפות מלאה.</p>
      </div>
    )
  }
};

// --- Modal Component ---

const LegalModal: React.FC<{ type: ModalType; onClose: () => void }> = ({ type, onClose }) => {
  if (!type) return null;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  const { title, content } = LEGAL_CONTENT[type];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} aria-label="סגור חלון" role="button" tabIndex={-1} />
      <div className="bg-brandGray border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 p-6 md:p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-brandGray py-2">
          <h2 id="modal-title" className="text-2xl font-bold heading-font text-white">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label="סגור חלון"
          >
            <X size={24} />
          </button>
        </div>
        <div className="leading-relaxed">
          {content}
        </div>
        <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
          <button 
            onClick={onClose}
            className="bg-accent text-white px-8 py-2 rounded-lg font-bold hover:brightness-110 transition-all"
          >
            הבנתי
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Shared Components ---

const MobileProgressBar: React.FC<{ activeStageIndex: number }> = ({ activeStageIndex }) => {
  const progress = ((activeStageIndex + 1) / STAGES.length) * 100;

  return (
    <div className="mobile-progress-container" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
      <div className="mobile-progress-fill" style={{ width: `${progress}%` }} />
    </div>
  );
};

const StoryHeader: React.FC<{ text: string }> = ({ text }) => (
  <div className="text-center mb-4 md:mb-6">
    <span className="story-header-text text-gray-400 text-sm md:text-lg font-medium tracking-wide">
      {text}
    </span>
  </div>
);

const JourneyRail: React.FC<{ activeStage: string }> = ({ activeStage }) => {
  return (
    <nav className="journey-rail" aria-label="ניווט בין מקטעים">
      {STAGES.map((stage) => (
        <a 
          key={stage.id} 
          href={`#${stage.id}`}
          className={`journey-dot ${activeStage === stage.id ? 'active' : ''}`}
          aria-label={`מעבר למקטע: ${stage.label}`}
          aria-current={activeStage === stage.id ? 'step' : undefined}
          onClick={(e) => {
            e.preventDefault();
            const el = document.getElementById(stage.id);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span className="journey-tooltip">{stage.label}</span>
        </a>
      ))}
    </nav>
  );
};

const WhatsAppButton: React.FC = () => {
  const handleClick = () => {
    window.open('https://wa.me/972528765992?text=היי גילעד, ראיתי את האתר שלך ואשמח לשמוע פרטים על הליווי', '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 md:right-auto md:left-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 group flex items-center gap-2"
      aria-label="צור קשר בוואטסאפ"
    >
      <span className="hidden group-hover:block font-bold pr-2">דברו איתי בוואטסאפ</span>
      <MessageCircle size={32} aria-hidden="true" />
    </button>
  );
};

const Navbar: React.FC = () => (
  <header className="absolute top-0 left-0 right-0 z-50 py-6 px-4 md:px-12 flex justify-between items-center bg-transparent">
    <div className="text-2xl font-black heading-font tracking-tighter text-white">
      גילעד <span className="text-accent">דורון</span>
    </div>
    <nav className="hidden md:flex gap-8 text-sm font-medium" aria-label="ניווט ראשי">
      <a href="#how" className="hover:text-accent transition-colors">איך זה עובד</a>
      <a href="#about" className="hover:text-accent transition-colors">מי אני</a>
      <a href="#faq" className="hover:text-accent transition-colors">שאלות נפוצות</a>
    </nav>
    <a 
      href="#action" 
      className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-4 py-2 rounded-full text-sm font-bold transition-all"
    >
      בדיקת התאמה
    </a>
  </header>
);

const LeadForm: React.FC<{ isFooter?: boolean }> = ({ isFooter = false }) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '',
    email: '',
    contactPref: 'phone',
    consent: false
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Check if EmailJS is loaded
      if (!window.emailjs) {
        throw new Error('EmailJS לא נטען. אנא רענן את הדף.');
      }

      // Prepare template parameters
      const templateParams = {
        to_email: RECIPIENT_EMAIL,
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        contactPref: formData.contactPref === 'phone' ? 'טלפון' : 'וואטסאפ',
        message: `בקשת התאמה חדשה מ-${formData.fullName}`,
        date: new Date().toLocaleDateString('he-IL', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      // Send email via EmailJS
      await window.emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      // Success - reset form and show success message
      setSubmitted(true);
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        contactPref: 'phone',
        consent: false
      });
    } catch (err) {
      // Handle errors
      console.error('Form submission error:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'אירעה שגיאה בשליחת הטופס. אנא נסה שוב מאוחר יותר.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${isFooter ? 'bg-brandGray/50 border border-white/10' : 'bg-white text-brandDark'} p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-md mx-auto`}>
      {submitted ? (
        <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500" aria-live="polite">
          <div className={`${isFooter ? 'bg-green-900/30' : 'bg-green-100'} w-16 h-16 rounded-full flex items-center justify-center mx-auto`}>
            <CheckCircle2 className={isFooter ? 'text-green-400' : 'text-green-600'} size={32} aria-hidden="true" />
          </div>
          <div>
            <h3 className={`text-2xl font-bold mb-2 ${isFooter ? 'text-white' : 'text-brandDark'}`}>תודה רבה!</h3>
            <p className={isFooter ? 'text-gray-300' : 'text-gray-600'}>הפרטים שלך התקבלו. אחזור אליך בהקדם לבדיקת התאמה.</p>
          </div>
          <div className={`pt-4 border-t ${isFooter ? 'border-white/10' : 'border-gray-100'}`}>
            <button 
              onClick={() => window.open('https://wa.me/972528765992', '_blank')}
              className="w-full bg-[#25D366] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-90 transition-all"
            >
              <MessageCircle size={20} aria-hidden="true" />
              שלח לי הודעה בוואטסאפ
            </button>
          </div>
        </div>
      ) : (
        <>
          <h3 className={`text-xl font-bold mb-6 text-center ${isFooter ? 'text-white' : 'text-brandDark'}`}>השאר פרטים לבדיקת התאמה לליווי</h3>
          {error && (
            <div id="form-error" className={`mb-4 p-4 rounded-lg border ${isFooter ? 'bg-red-900/20 border-red-500/30' : 'bg-red-50 border-red-200'}`} role="alert" aria-live="assertive">
              <div className={`flex items-center gap-2 ${isFooter ? 'text-red-300' : 'text-red-800'}`}>
                <XCircle size={20} aria-hidden="true" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className={`block text-xs font-bold mb-1 opacity-70 ${isFooter ? 'text-gray-300' : 'text-gray-700'}`}>שם מלא</label>
              <input 
                id="fullName"
                name="name"
                type="text" 
                required
                aria-required="true"
                autoComplete="name"
                disabled={isSubmitting}
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? "form-error" : undefined}
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-accent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isFooter ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-brandDark'}`}
                placeholder="ישראל ישראלי"
                value={formData.fullName}
                onChange={e => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
            <div>
              <label htmlFor="phone" className={`block text-xs font-bold mb-1 opacity-70 ${isFooter ? 'text-gray-300' : 'text-gray-700'}`}>טלפון</label>
              <input 
                id="phone"
                name="tel"
                type="tel" 
                required
                aria-required="true"
                autoComplete="tel"
                disabled={isSubmitting}
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? "form-error" : undefined}
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-accent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isFooter ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-brandDark'}`}
                placeholder="050-0000000"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div>
              <label htmlFor="email" className={`block text-xs font-bold mb-1 opacity-70 ${isFooter ? 'text-gray-300' : 'text-gray-700'}`}>אימייל</label>
              <input 
                id="email"
                name="email"
                type="email" 
                required
                aria-required="true"
                autoComplete="email"
                disabled={isSubmitting}
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? "form-error" : undefined}
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-accent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isFooter ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-brandDark'}`}
                placeholder="example@email.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <fieldset className="flex gap-4 py-2">
              <legend className="sr-only">העדפת התקשרות</legend>
              <label className={`flex items-center gap-2 cursor-pointer ${isFooter ? 'text-white' : 'text-brandDark'} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <input 
                  type="radio" 
                  name="contactPref" 
                  className="accent-accent"
                  disabled={isSubmitting}
                  checked={formData.contactPref === 'phone'}
                  onChange={() => setFormData({...formData, contactPref: 'phone'})}
                />
                <span className="text-sm">טלפון</span>
              </label>
              <label className={`flex items-center gap-2 cursor-pointer ${isFooter ? 'text-white' : 'text-brandDark'} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <input 
                  type="radio" 
                  name="contactPref" 
                  className="accent-accent"
                  disabled={isSubmitting}
                  checked={formData.contactPref === 'whatsapp'}
                  onChange={() => setFormData({...formData, contactPref: 'whatsapp'})}
                />
                <span className="text-sm">וואטסאפ</span>
              </label>
            </fieldset>
            <div className="flex items-start gap-2 pt-2">
              <input 
                type="checkbox" 
                required 
                aria-required="true"
                id="consent" 
                disabled={isSubmitting}
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? "form-error" : undefined}
                className="mt-1 accent-accent disabled:opacity-50 disabled:cursor-not-allowed"
                checked={formData.consent}
                onChange={e => setFormData({...formData, consent: e.target.checked})}
              />
              <label htmlFor="consent" className={`text-xs opacity-70 cursor-pointer ${isFooter ? 'text-gray-300' : 'text-gray-700'} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                אני מאשר/ת יצירת קשר בהתאם למדיניות פרטיות
              </label>
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-accent text-white py-4 rounded-xl font-bold text-lg hover:brightness-110 shadow-lg shadow-accent/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" aria-hidden="true" />
                  שולח...
                </>
              ) : (
                'בודקים התאמה'
              )}
            </button>
            <p className={`text-center text-[10px] uppercase tracking-wider opacity-50 ${isFooter ? 'text-gray-400' : 'text-gray-500'}`}>
              הבדיקה ללא התחייבות
            </p>
          </form>
        </>
      )}
    </div>
  );
};

// --- Video Player Component ---

declare global {
  interface Window {
    Vimeo: any;
  }
}

const VideoPlayer: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Start muted (browser requirement for autoplay)
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<any>(null);
  const hasInitializedRef = useRef(false);
  const volumeChangeHandlerRef = useRef<(() => Promise<void>) | null>(null);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isVisibleRef = useRef(false); // Track visibility in ref to avoid stale closures
  const playTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayingRef = useRef(false); // Track if we've started playing to prevent rapid toggles

  // Vimeo embed URL - single URL that won't change
  // Start muted (browser requirement) - we'll unmute when visible
  const baseUrl = "https://player.vimeo.com/video/1152174898?context=Vimeo%5CController%5CApi%5CResources%5CVideoController.&h=6e172adfe8&s=e8675d0eb6c47f57274868162088cbf80f997c1c_1767884558";
  const vimeoUrl = `${baseUrl}&autoplay=0&muted=1&loop=1&controls=1&background=0`;

  // Initialize Vimeo Player when iframe loads
  useEffect(() => {
    if (!iframeRef.current || hasInitializedRef.current) return;

    let retryCount = 0;
    const maxRetries = 50; // 5 seconds max wait
    const timeoutIds: NodeJS.Timeout[] = [];

    const initPlayer = async () => {
      if (window.Vimeo?.Player && iframeRef.current && !playerRef.current) {
        try {
          playerRef.current = new window.Vimeo.Player(iframeRef.current);
          hasInitializedRef.current = true;
          
          // Set up volume change listener after player is ready
          try {
            // Wait a bit for player to be fully ready
            await new Promise(resolve => setTimeout(resolve, 200));
            
            // Check initial mute state
            const initialMuted = await playerRef.current.getMuted();
            setIsMuted(initialMuted);
            
            // Create handler function for volume changes
            const volumeChangeHandler = async () => {
              try {
                if (playerRef.current) {
                  const muted = await playerRef.current.getMuted();
                  setIsMuted(muted);
                }
              } catch (err) {
                // Ignore errors
              }
            };
            
            // Store handler reference for cleanup
            volumeChangeHandlerRef.current = volumeChangeHandler;
            
            // Listen for volume changes
            playerRef.current.on('volumechange', volumeChangeHandler);
            
            // Mark player as ready
            setIsPlayerReady(true);
            
            // If section is already visible when player initializes, start playing
            if (isVisibleRef.current) {
              setTimeout(async () => {
                try {
                  if (playerRef.current && isVisibleRef.current) {
                    await playerRef.current.play();
                    try {
                      const muted = await playerRef.current.getMuted();
                      setIsMuted(muted);
                      if (muted) {
                        await playerRef.current.setMuted(false);
                        setIsMuted(false);
                      }
                    } catch (err) {
                      // Ignore
                    }
                  }
                } catch (err) {
                  // Ignore play errors
                }
              }, 300);
            }
          } catch (err) {
            // Ignore errors if player not fully ready yet
            console.debug('Volume change listener setup failed:', err);
            // Still mark as ready even if listener setup fails
            setIsPlayerReady(true);
          }
          
          // Clear all timeouts once initialized
          timeoutIds.forEach(id => clearTimeout(id));
        } catch (error) {
          console.error('Failed to initialize Vimeo player:', error);
        }
      } else if (!window.Vimeo?.Player && retryCount < maxRetries) {
        // Retry if Vimeo SDK hasn't loaded yet
        retryCount++;
        const id = setTimeout(initPlayer, 100);
        timeoutIds.push(id);
      }
    };

    // Wait for iframe to load first
    const iframe = iframeRef.current;
    const handleLoad = () => {
      // Small delay to ensure Vimeo player is ready
      const id = setTimeout(initPlayer, 300);
      timeoutIds.push(id);
      iframe.removeEventListener('load', handleLoad);
    };
    iframe.addEventListener('load', handleLoad);

    // Also try to initialize after a short delay in case load event already fired
    const initialTimeoutId = setTimeout(() => {
      if (!hasInitializedRef.current) {
        initPlayer();
      }
    }, 1000);
    timeoutIds.push(initialTimeoutId);

    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
      iframe.removeEventListener('load', handleLoad);
      
      // Clean up volume change listener
      if (playerRef.current && volumeChangeHandlerRef.current) {
        try {
          playerRef.current.off('volumechange', volumeChangeHandlerRef.current);
        } catch (err) {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  // Control playback when section is visible
  useEffect(() => {
    if (!playerRef.current) {
      // If player not ready yet, wait a bit and retry
      const checkPlayer = setTimeout(() => {
        if (playerRef.current && isVisible) {
          // Retry playing when player becomes ready
          playerRef.current.play().catch(() => {});
        }
      }, 500);
      return () => clearTimeout(checkPlayer);
    }

    const controlPlayback = async () => {
      if (isVisible) {
        // Clear any pending pause timeouts
        if (pauseTimeoutRef.current) {
          clearTimeout(pauseTimeoutRef.current);
          pauseTimeoutRef.current = null;
        }

        // Clear any pending play timeouts and schedule new one
        if (playTimeoutRef.current) {
          clearTimeout(playTimeoutRef.current);
        }

        // Debounce play call to prevent rapid toggling during scroll snap
        playTimeoutRef.current = setTimeout(async () => {
          // Double-check visibility hasn't changed back during delay
          if (!playerRef.current || !isVisibleRef.current) {
            playTimeoutRef.current = null;
            return;
          }

          try {
            // Check if already playing to avoid unnecessary calls
            const paused = await playerRef.current.getPaused();
            if (paused) {
              await playerRef.current.play();
              isPlayingRef.current = true;
            }
            
            // Update mute state and try to unmute after play starts
            setTimeout(async () => {
              try {
                if (playerRef.current && isVisibleRef.current) {
                  const muted = await playerRef.current.getMuted();
                  setIsMuted(muted);
                  if (muted) {
                    await playerRef.current.setMuted(false);
                    setIsMuted(false);
                  }
                }
              } catch (err) {
                // If unmute fails, user can use button
              }
            }, 300);
          } catch (err) {
            // If play fails, retry after delay
            setTimeout(async () => {
              if (playerRef.current && isVisibleRef.current) {
                try {
                  const paused = await playerRef.current.getPaused();
                  if (paused) {
                    await playerRef.current.play();
                    isPlayingRef.current = true;
                  }
                } catch (retryErr) {
                  // Ignore - might need user interaction
                }
              }
            }, 500);
          }
          
          playTimeoutRef.current = null;
        }, 300); // 300ms debounce to let scroll snap complete
      } else {
        // Clear any pending play timeouts
        if (playTimeoutRef.current) {
          clearTimeout(playTimeoutRef.current);
          playTimeoutRef.current = null;
        }
        
        // Add delay before pausing to allow scroll snap to complete
        if (pauseTimeoutRef.current) {
          clearTimeout(pauseTimeoutRef.current);
        }
        
        pauseTimeoutRef.current = setTimeout(async () => {
          // Double-check visibility hasn't changed back
          if (!isVisibleRef.current && playerRef.current && videoContainerRef.current) {
            const rect = videoContainerRef.current.getBoundingClientRect();
            const isReallyOutOfView = rect.bottom < 0 || rect.top > window.innerHeight;
            
            if (isReallyOutOfView) {
              try {
                await playerRef.current.pause();
                isPlayingRef.current = false;
              } catch (err) {
                // Ignore pause errors
              }
            }
          }
          pauseTimeoutRef.current = null;
        }, 800); // 800ms delay to allow scroll snap to complete
      }
    };

    controlPlayback();

    return () => {
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
        pauseTimeoutRef.current = null;
      }
      if (playTimeoutRef.current) {
        clearTimeout(playTimeoutRef.current);
        playTimeoutRef.current = null;
      }
    };
  }, [isVisible]);

  // Toggle mute/unmute handler
  const handleToggleMute = async () => {
    if (!playerRef.current) return;

    try {
      const currentMuted = await playerRef.current.getMuted();
      await playerRef.current.setMuted(!currentMuted);
      setIsMuted(!currentMuted);
    } catch (err) {
      console.error('Failed to toggle mute:', err);
    }
  };

  // Intersection Observer to detect when video section is visible
  useEffect(() => {
    if (!videoContainerRef.current) return;

    const isMobile = window.innerWidth < 768;
    const threshold = isMobile ? 0.1 : 0.2; // Lower threshold for more lenient detection
    const rootMargin = isMobile ? '150px 0px' : '200px 0px'; // Larger margin to prevent false triggers during scroll snap

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const visible = entry.isIntersecting;
          isVisibleRef.current = visible;
          setIsVisible(visible);
        });
      },
      {
        threshold: threshold,
        rootMargin: rootMargin
      }
    );

    observer.observe(videoContainerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div 
      ref={videoContainerRef}
      style={{ 
        backgroundColor: '#000', 
        width: '100%', 
        height: '100%', 
        minHeight: '400px',
        position: 'relative', 
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <iframe
        ref={iframeRef}
        src={vimeoUrl}
        className="w-full h-full absolute inset-0"
        style={{ 
          border: 'none', 
          width: '100%', 
          height: '100%', 
          minHeight: '400px',
          backgroundColor: '#000',
          position: 'absolute',
          top: 0,
          left: 0
        }}
        frameBorder="0"
        allow="autoplay; fullscreen"
        allowFullScreen
        loading="eager"
        title="גילעד דורון - וידאו אימון"
      />
      {/* Left side overlay to hide white areas */}
      <div 
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '20%',
          background: 'linear-gradient(to right, #0A0A0A, transparent)',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />
      {/* Right side overlay to hide white areas */}
      <div 
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '20%',
          background: 'linear-gradient(to left, #0A0A0A, transparent)',
          pointerEvents: 'none',
          zIndex: 1
        }}
        aria-hidden="true"
      />
      {/* Custom Mute/Unmute Button Overlay */}
      <button
        onClick={handleToggleMute}
        aria-label={isMuted ? 'הפעל קול' : 'השתק קול'}
        className="absolute bottom-4 right-4 md:bottom-6 md:right-6 z-10 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20 hover:border-white/40 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-black"
        style={{
          minWidth: '48px',
          minHeight: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {isMuted ? (
          <VolumeX size={24} aria-hidden="true" />
        ) : (
          <Volume2 size={24} aria-hidden="true" />
        )}
      </button>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeStage, setActiveStage] = useState('hero');
  const [modalType, setModalType] = useState<ModalType>(null);
  const snapTimeoutRef = useRef<number | null>(null);
  const isSnappingRef = useRef(false);
  const isUserScrollingRef = useRef(false);
  const lastScrollTimeRef = useRef<number>(0);
  const scrollVelocityRef = useRef<number>(0);
  const lastScrollYRef = useRef<number>(0);

  const activeStageIndex = STAGES.findIndex(s => s.id === activeStage);

  useEffect(() => {
    // 1. Reveal Observer
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

    // 2. Stage/Focus Observer
    const stageOptions = {
      root: null,
      rootMargin: "-20% 0px -55% 0px",
      threshold: [0, 0.1, 0.2, 0.5]
    };

    const stageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const stageId = entry.target.getAttribute('data-stage');
        if (stageId) {
          if (entry.isIntersecting) {
            setActiveStage(stageId);
            document.querySelectorAll('[data-snap="true"]').forEach(s => s.classList.remove('active-section'));
            entry.target.classList.add('active-section');

            if (stageId === 'guarantee') {
              entry.target.classList.add('guarantee-revealed');
            }
          }
        }
      });
    }, stageOptions);

    document.querySelectorAll('[data-snap="true"]').forEach((el) => stageObserver.observe(el));

    // 3. Track wheel events for active scrolling detection
    const handleWheel = () => {
      const now = Date.now();
      const scrollY = window.pageYOffset || window.scrollY || 0;
      
      // Calculate scroll velocity
      const timeDelta = now - lastScrollTimeRef.current;
      const scrollDelta = Math.abs(scrollY - lastScrollYRef.current);
      
      if (timeDelta > 0) {
        scrollVelocityRef.current = scrollDelta / timeDelta;
      }
      
      lastScrollTimeRef.current = now;
      lastScrollYRef.current = scrollY;
      isUserScrollingRef.current = true;
      
      // Clear the flag after scroll stops (longer delay for snap)
      clearTimeout(snapTimeoutRef.current);
      snapTimeoutRef.current = window.setTimeout(() => {
        isUserScrollingRef.current = false;
      }, 150);
    };

    // 4. Robust Magnet Snapping + Active Section Update
    const handleScroll = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName || '')) return;

      // Update scroll position tracking
      const scrollY = window.pageYOffset || window.scrollY || 0;
      const now = Date.now();
      
      if (lastScrollTimeRef.current > 0) {
        const timeDelta = now - lastScrollTimeRef.current;
        const scrollDelta = Math.abs(scrollY - lastScrollYRef.current);
        if (timeDelta > 0) {
          scrollVelocityRef.current = scrollDelta / timeDelta;
        }
      }
      
      lastScrollTimeRef.current = now;
      lastScrollYRef.current = scrollY;

      // Clear existing timeout
      if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);

      // Increased delay - wait for scroll to stop (700ms instead of 160ms)
      snapTimeoutRef.current = window.setTimeout(() => {
        // Don't snap if user is actively scrolling or just finished fast scroll
        if (isSnappingRef.current || isUserScrollingRef.current) return;
        
        // Don't snap if scroll velocity was high (fast intentional scroll)
        if (scrollVelocityRef.current > 2.0) return;

        const sections = Array.from(document.querySelectorAll('[data-snap="true"]'));
        const focusLine = window.innerHeight * 0.15;
        const viewportHeight = window.innerHeight;
        
        let nearestSection: Element | null = null;
        let minDistance = Infinity;
        let currentSection: Element | null = null;

        // Find nearest section and current section
        sections.forEach((section) => {
          const rect = section.getBoundingClientRect();
          const distance = Math.abs(rect.top - focusLine);
          
          // Check if we're currently well within this section (dead zone)
          // Dead zone: section top is below 20% of viewport AND section bottom is above 80% of viewport
          // This means the section is well contained within the viewport, not near boundaries
          const sectionTop = rect.top;
          const sectionBottom = rect.bottom;
          
          // Check if section is well within viewport (dead zone - no snapping)
          const topMargin = viewportHeight * 0.2;
          const bottomMargin = viewportHeight * 0.8;
          const isInDeadZone = sectionTop > topMargin && sectionBottom < bottomMargin;
          
          if (isInDeadZone) {
            currentSection = section;
          }
          
          if (distance < minDistance) {
            minDistance = distance;
            nearestSection = section;
          }
        });

        // Update active section highlighting (always do this)
        if (nearestSection) {
          const stageId = nearestSection.getAttribute('data-stage');
          if (stageId) {
            setActiveStage(stageId);
            document.querySelectorAll('[data-snap="true"]').forEach(s => s.classList.remove('active-section'));
            nearestSection.classList.add('active-section');
            
            if (stageId === 'guarantee') {
              nearestSection.classList.add('guarantee-revealed');
            }
          }
        }

        // Only snap if NOT in dead zone (well within a section)
        if (currentSection) {
          // We're in a dead zone - don't snap, allow free scrolling
          return;
        }

        // Only snap when near section boundaries
        if (nearestSection) {
          const rect = nearestSection.getBoundingClientRect();
          const sectionTop = rect.top;
          const sectionBottom = rect.bottom;
          const viewportHeight = window.innerHeight;
          
          // Check if we're near top boundary (within 20% of viewport top) or bottom boundary (within 20% of viewport bottom)
          const nearTopBoundary = sectionTop > -50 && sectionTop < viewportHeight * 0.2;
          const nearBottomBoundary = sectionBottom > viewportHeight * 0.8 && sectionBottom < viewportHeight + 50;
          
          // Only snap if near a boundary and within reasonable distance
          if ((nearTopBoundary || nearBottomBoundary) && Math.abs(sectionTop) > 50 && Math.abs(sectionTop) < viewportHeight * 0.6) {
            isSnappingRef.current = true;
            window.scrollTo({
              top: window.pageYOffset + sectionTop,
              behavior: 'smooth'
            });

            setTimeout(() => {
              isSnappingRef.current = false;
            }, 850);
          }
        }
      }, 700); // Increased from 160ms to 700ms
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      revealObserver.disconnect();
      stageObserver.disconnect();
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
      if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen selection:bg-accent selection:text-white">
      <a href="#main-content" className="sr-only">
        דלג לתוכן הראשי
      </a>
      <MobileProgressBar activeStageIndex={activeStageIndex} />
      <Navbar />
      <JourneyRail activeStage={activeStage} />
      
      <main id="main-content">
        {/* STAGE 1: HERO */}
        <section id="hero" data-stage="hero" data-snap="true" className="stage reveal hero-bg">
          <div className="absolute inset-0 z-0 hero-bg-layer" aria-hidden="true"></div>
          <div className="absolute inset-0 z-0 hero-overlay" aria-hidden="true"></div>

          <div className="container mx-auto px-4 md:px-12 relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-6xl font-black heading-font leading-[1.1]">
                מתאמן כבר תקופה <br /> 
                <span className="text-accent underline decoration-4 underline-offset-8">ולא רואה תוצאות?</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 font-light max-w-xl">
                זה לא כי אתה צריך להשקיע יותר, <br className="hidden md:block" /> 
                <strong>זה כי אתה צריך להיות אפקטיבי יותר</strong>
              </p>
              <div className="space-y-4">
                <p className="text-lg md:text-xl text-white font-medium">
                  ליווי אונליין באימונים ותזונה למי שלא מפחדים לעבוד איתי קשה ולראות תוצאות אמיתיות
                </p>
                <ul className="space-y-3">
                  {["תוכנית אימון ותזונה מותאמת אישית", "ליווי צמוד ומעקב שוטף", "תהליך ברור, מסודר, אפקטיבי"].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircle2 className="text-accent flex-shrink-0" size={20} aria-hidden="true" />
                      <span className="text-gray-200 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="delay-100">
              <LeadForm />
            </div>
          </div>
        </section>

        {/* STAGE 2: REFLECTIVE DIAGNOSIS */}
        <section id="diagnosis" data-stage="diagnosis" data-snap="true" className="stage stage-alt-1 reveal reflection-bg">
          <div className="absolute inset-0 z-0 reflection-bg-layer" aria-hidden="true"></div>
          <div className="absolute inset-0 z-0 reflection-overlay" aria-hidden="true"></div>
          <div className="container mx-auto px-4 md:px-12 py-12 md:py-24 relative z-10">
            <StoryHeader text="איפה אתה נמצא היום" />
            
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl md:text-5xl font-black heading-font leading-tight">
                כשהתהליך לא מדוייק <span className="text-accent">הכל מרגיש כבד</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                זה לא כי אתה לא משקיע. <br className="md:hidden" />
                זה כי בלי התהליך הנכון גם עבודה קשה לא מביאה תוצאות.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              <div className="bg-brandGray/40 border-r-2 border-white/10 p-8 md:p-10 rounded-2xl relative group transition-all">
                <h3 className="text-xl md:text-2xl font-bold mb-8 text-gray-300 flex items-center gap-3">
                  <MinusCircle className="text-gray-500 opacity-50" size={24} aria-hidden="true" />
                  ככה זה מרגיש בלי התהליך הנכון בשבילך
                </h3>
                <ul className="space-y-6">
                  {[
                    "אתה קופץ בין פתרונות ומחליף תוכנית כל הזמן",
                    "אתה לא באמת בטוח שאתה בכיוון הנכון",
                    "אתה עובד קשה אבל זה לא מתבטא בתוצאות",
                    "המוטיבציה שלך נחלשת משבוע לשבוע"
                  ].map((item, idx) => (
                    <li key={idx} className="text-base md:text-lg text-gray-400 flex items-start gap-4">
                      <span className="w-1 h-1 bg-gray-600 rounded-full mt-2.5 flex-shrink-0" aria-hidden="true"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-brandGray/40 border-r-2 border-accent/20 p-8 md:p-10 rounded-2xl relative group transition-all">
                <h3 className="text-xl md:text-2xl font-bold mb-8 text-white flex items-center gap-3">
                  <PlusCircle className="text-accent opacity-80" size={24} aria-hidden="true" />
                  ככה זה נראה אחרי שאיבחנו מה התהליך הנכון עבורך
                </h3>
                <ul className="space-y-6">
                  {[
                    "יש לך יעדים ברורים לכל אימון",
                    "אתה לא רק פועל לפי התוכנית, אתה מבין למה זה עובד והופך את זה לדרך חיים שנכונה רק לך",
                    "אתה יודע למדוד את ההתקדמות ומפסיק לנחש",
                    "אתה מצליח להתמיד לאורך זמן ומסופק מהדרך"
                  ].map((item, idx) => (
                    <li key={idx} className="text-base md:text-lg text-gray-200 flex items-start gap-4">
                      <span className="w-1 h-1 bg-accent rounded-full mt-2.5 flex-shrink-0" aria-hidden="true"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="text-center mt-16 max-w-2xl mx-auto">
              <p className="text-lg md:text-2xl font-bold text-white border-b border-white/5 pb-4">
                אם אתה רוצה תהליך אחד מדוייק שמביא תוצאות, <br className="hidden md:block" />
                <span className="text-accent">זה השלב שאני נכנס לתמונה</span>
              </p>
            </div>
          </div>
        </section>

        {/* STAGE 3: ABOUT */}
        <section id="about" data-stage="about" data-snap="true" className="stage reveal">
          <div className="container mx-auto px-4 md:px-12 max-w-5xl">
            <StoryHeader text="מי עומד מאחורי התהליך" />
            <div className="grid md:grid-cols-2 gap-12 items-center mt-8">
              <div className="space-y-6 text-center md:text-right">
                <div className="space-y-2">
                  <p className="text-accent font-bold tracking-[0.2em] uppercase text-sm">המאמן שלך</p>
                  <h2 className="text-4xl md:text-5xl font-black heading-font leading-tight">גילעד דורון</h2>
                </div>
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                  אני מלווה גברים בתהליכים משמעותיים כבר שנים. הליווי שלי הוא לא עוד תפריט גנרי, הוא דרך חיים שתביא אותך לתוצאה שאתה מחפש, בלי לנחש.
                </p>
                <div className="bg-brandGray/40 p-6 rounded-2xl border border-white/5 space-y-4">
                  <h3 className="font-bold flex items-center gap-2 text-white justify-center md:justify-start"><ShieldCheck className="text-accent" size={20} aria-hidden="true" /> ההבטחה שלי:</h3>
                  <p className="text-sm text-gray-400">אני לא מוכר הבטחות ריקות. אני מוכר תהליך. אם תעבוד לפי התוכנית ולא תראה תוצאות - אני איתך עד שזה קורה.</p>
                </div>
              </div>
              <div className="relative w-full">
                {/* Quiet depth card - purely visual, behind video */}
                <div 
                  className="absolute -bottom-8 -left-8 w-[108%] h-[108%] rounded-[2.5rem] bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.3)] -z-0 pointer-events-none hidden md:block"
                  style={{ 
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)'
                  }}
                  aria-hidden="true"
                />
                {/* Video container */}
                <div 
                  className="w-full rounded-3xl overflow-hidden shadow-2xl relative z-10 border border-white/10" 
                  style={{ 
                    aspectRatio: '4/5',
                    minHeight: '400px',
                    maxWidth: '100%'
                  }}
                >
                  <div style={{ height: '100%', width: '100%', position: 'relative' }}>
                    <VideoPlayer />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STAGE 4: STUCK - DRAFT MODE (HIDDEN) */}
        {/* <section id="stuck" data-stage="stuck" data-snap="true" className="stage reveal confusion-bg">
          <div className="absolute inset-0 z-0 confusion-bg-layer"></div>
          <div className="absolute inset-0 z-0 confusion-overlay"></div>
          <div className="container mx-auto px-4 md:px-12 relative z-10">
            <StoryHeader text="איפה רוב האנשים נתקעים" />
            <div className="grid md:grid-cols-2 gap-12 items-center mt-12">
              <div className="relative w-full aspect-[3/4] md:aspect-auto md:h-[700px] rounded-3xl overflow-hidden shadow-2xl bg-brandGray/40 flex items-center justify-center">
                <img 
                  src="/assets/about/whynoprogress.webp" 
                  alt="אדם מרוכז באימון" 
                  className="w-full h-full object-contain" 
                  loading="lazy"
                />
              </div>
              <div className="space-y-8">
                <h2 className="text-3xl md:text-5xl font-black heading-font leading-tight">למה אתה עומד במקום?</h2>
                <div className="space-y-6">
                  <p className="text-xl text-gray-300 leading-relaxed">רוב המתאמנים שמגיעים אלי משקיעים. הם מתאמנים מנסים ומשקיעים זמן ואנרגיה אבל לא רואים תוצאות</p>
                  <p className="text-xl font-bold text-white">זה קורה בדרך כלל בגלל:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[{icon:<Target />, t:"חוסר בהירות"}, {icon:<Zap />, t:"קפיצה בין שיטות"}, {icon:<User />, t:"תהליך לא מתאים"}, {icon:<ShieldCheck />, t:"אין עין מקצועית"}].map((item, idx) => (
                      <div key={idx} className="bg-brandGray/40 p-5 rounded-2xl flex items-center gap-3">
                        <span className="text-accent">{React.cloneElement(item.icon as React.ReactElement, { size: 20, "aria-hidden": "true" })}</span>
                        <span className="font-medium">{item.t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> */}

        {/* STAGE 5: WAITING COST */}
        <section id="waiting" data-stage="waiting" data-snap="true" className="stage stage-alt-2 text-center">
          <div className="container mx-auto px-4 relative z-10 max-w-4xl reveal">
            <StoryHeader text="זה הרגע שרוב האנשים עוצרים" />
            <h2 className="text-4xl md:text-6xl font-black heading-font mb-4">המחיר של להמשיך לחכות?</h2>
            <div className="text-5xl md:text-7xl font-black text-accent mb-12 block animate-pulse">הוא גבוה מדי.</div>
            <div className="space-y-6 text-xl md:text-2xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
              <p>כל חודש שעובר בלי תוכנית ברורה זה עוד חודש שאתה משקיע — ולא מתקדם.</p>
              <div className="py-4 font-bold text-white uppercase tracking-[0.2em] space-y-2">
                <div>עוד אימונים.</div>
                <div>עוד ניסיונות.</div>
              </div>
              <p className="text-white font-medium">לא כי אתה לא רוצה מספיק. אלא כי בלי דרך נכונה — רוב האנשים פשוט נתקעים.</p>
            </div>
          </div>
        </section>

        {/* STAGE 6: GUARANTEE */}
        <section id="guarantee" data-stage="guarantee" data-snap="true" className="stage stage-guarantee commitment-bg">
          <div className="absolute inset-0 z-0 commitment-bg-layer" aria-hidden="true"></div>
          <div className="absolute inset-0 z-0 commitment-overlay" aria-hidden="true"></div>
          <div className="guarantee-content-wrapper container mx-auto px-4 md:px-12 max-w-4xl text-center flex flex-col justify-center h-full space-y-3 md:space-y-4 relative z-10">
            <StoryHeader text="לא הבטחות. לא דיבורים. אחריות אמיתית." />
            
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black heading-font leading-tight text-white mb-2">
              <span className="guarantee-part-1">התוצאה שלך </span>
              <span className="guarantee-part-2"> – <span className="underline-responsibility">האחריות</span> שלי.</span>
            </h2>

            <div className="space-y-2 md:space-y-3 text-lg md:text-xl text-gray-300 font-light leading-relaxed max-w-3xl mx-auto">
              <p className="font-medium text-white">אני לא מוכר ליווי.</p>
              <p>
                אני לוקח אחריות על תוצאה שסיכמנו עליה מראש — <span className="text-white font-medium">ביחד.</span>
              </p>
              <p className="text-base md:text-lg">
                אם עמדת בתהליך, יישמת את מה שבנינו, <br className="hidden md:block" />
                ועדיין לא הגעת לתוצאה שסיכמנו עליה —
              </p>
              <p className="text-white font-bold text-xl md:text-2xl">אני לא משאיר אותך לבד עם זה.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-4xl mx-auto">
              <div className="bg-white/5 border border-white/10 p-4 md:p-6 rounded-2xl transition-all hover:border-accent/40 group">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <CheckCircle2 size={18} aria-hidden="true" />
                </div>
                <p className="text-white text-sm md:text-base font-bold">המשך ליווי מלא, ללא עלות, עד הגעה לתוצאה</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 md:p-6 rounded-2xl transition-all hover:border-accent/40 group">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <ShieldCheck size={18} aria-hidden="true" />
                </div>
                <p className="text-white text-sm md:text-base font-bold">או החזר כספי מלא</p>
              </div>
            </div>

            <div className="pt-2 md:pt-4">
              <p className="text-base md:text-lg font-medium text-gray-400 italic">
                "כי כשאני לוקח מתאמן — השם שלי והאחריות שלי על הקו."
              </p>
              <div className="w-16 h-px bg-accent/30 mx-auto mt-2"></div>
            </div>
          </div>
        </section>

        {/* STAGE 7: SOLUTION (GET) */}
        <section id="get" data-stage="get" className="stage stage-alt-1 reveal">
          <div className="container mx-auto px-4 md:px-12">
            <StoryHeader text="מכאן מתחיל הסדר" />
            <h2 className="text-3xl md:text-5xl font-black heading-font text-center mb-12">מה אתה מקבל בליווי?</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mt-8">
              {[
                { i: <Dumbbell />, t: "תוכנית אימונים אישית" },
                { i: <Apple />, t: "תזונה מותאמת אישית" },
                { i: <MessageCircle />, t: "ליווי ומענה בוואטסאפ" },
                { i: <BarChart3 />, t: "מעקב והתאמות שבועיות" },
                { i: <Clock />, t: "סדר ובהירות בתהליך" }
              ].map((item, idx) => (
                <div key={idx} className="bg-brandDark/40 p-6 md:p-8 rounded-2xl border border-white/5 flex flex-col items-center text-center gap-4 transition-all hover:-translate-y-2">
                  <div className="text-accent">{React.cloneElement(item.i as React.ReactElement, { size: 32, "aria-hidden": "true" })}</div>
                  <h3 className="text-sm md:text-lg font-bold leading-tight">{item.t}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STAGE 8: SOLUTION (HOW) */}
        <section id="how" data-stage="how" data-snap="true" className="stage reveal process-bg">
          <div className="absolute inset-0 z-0 process-bg-layer" aria-hidden="true"></div>
          <div className="absolute inset-0 z-0 process-overlay" aria-hidden="true"></div>
          <div className="container mx-auto px-4 md:px-12 relative z-10">
            <StoryHeader text="ככה נראה תהליך שעובד" />
            <h2 className="text-3xl md:text-5xl font-black heading-font text-center mb-16">4 צעדים לתוצאה</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative mt-8">
              <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent/30 to-transparent" aria-hidden="true"></div>
              {[
                { s: "01", t: "בדיקת התאמה", d: "שיחה קצרה להבין איפה אתה נמצא ולאן אתה רוצה להגיע." },
                { s: "02", t: "אבחון ואסטרטגיה", d: "איסוף כל הנתונים ובניית אסטרטגיה מותאמת אישית." },
                { s: "03", t: "ליווי ומעקב", d: "עבודה שוטפת, וואטסאפ זמין, ובדיקות התקדמות." },
                { s: "04", t: "תוצאה במראה", d: "התאמות בזמן אמת עד שרואים את השינוי שרצית." }
              ].map((item, idx) => (
                <div key={idx} className="relative z-10 flex flex-col items-center text-center group">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-brandGray border-4 border-brandDark rounded-full flex items-center justify-center text-accent text-2xl font-black mb-6 group-hover:bg-accent group-hover:text-white transition-all" aria-hidden="true">
                    {item.s}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.t}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed px-2">{item.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STAGE 9: PROOF */}
        <section id="proof" data-stage="proof" data-snap="true" className="stage stage-alt-1 reveal">
          <div className="container mx-auto px-4 md:px-12 relative z-10 py-12 md:py-24">
            <StoryHeader text="כשהתהליך נכון – רואים את זה" />
            
            {/* Header Section */}
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-5xl font-black heading-font leading-tight mb-4">התוצאות מדברות</h2>
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                מתאמנים אמיתיים שעברו את התהליך המלא. כל אחד עם מטרות שונות, כל אחד הגיע ליעדים שלו.
              </p>
              
              {/* Statistics Boxes */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
                <div className="bg-brandGray border border-white/10 rounded-2xl px-6 md:px-8 py-4 md:py-5 flex-1 max-w-[200px] sm:max-w-none">
                  <div className="text-3xl md:text-4xl font-black text-accent mb-1">+200</div>
                  <div className="text-sm md:text-base text-gray-300">מתאמנים מרוצים</div>
                </div>
                <div className="bg-brandGray border border-white/10 rounded-2xl px-6 md:px-8 py-4 md:py-5 flex-1 max-w-[200px] sm:max-w-none">
                  <div className="text-3xl md:text-4xl font-black text-accent mb-1">95%</div>
                  <div className="text-sm md:text-base text-gray-300">הגיעו ליעדים</div>
                </div>
              </div>
            </div>

            {/* Client Testimonial 1 - Daniel B. */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-16 md:mb-24">
              {/* Client Info - Left */}
              <div className="space-y-6">
                {/* Profile */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="text-accent" size={24} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-white">דניאל ב.</h3>
                    <p className="text-gray-400 text-sm md:text-base">מהנדס תוכנה, גיל 34</p>
                  </div>
                </div>

                {/* Quote */}
                <div className="bg-brandGray border-r-4 border-accent rounded-lg p-4 md:p-5">
                  <p className="text-gray-200 text-base md:text-lg leading-relaxed italic">
                    "הפעם הראשונה שאני רואה תוצאות אמיתיות. התהליך היה ברור מהתחלה."
                  </p>
                </div>

                {/* Goals Achieved */}
                <div>
                  <h4 className="text-lg font-bold text-white mb-3">יעדים שהושגו:</h4>
                  <ul className="space-y-2">
                    {['ירידה במשקל', 'עליה במסת שריר', 'שיפור בכושר'].map((goal, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-gray-300">
                        <CheckCircle2 className="text-accent flex-shrink-0" size={18} aria-hidden="true" />
                        <span>{goal}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Duration and Commitment */}
                <div className="bg-brandGray border border-white/10 rounded-lg p-4 md:p-5 flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="text-2xl md:text-3xl font-black text-accent mb-1">3</div>
                    <div className="text-sm text-gray-400">חודשים משך התהליך</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-2xl md:text-3xl font-black text-accent mb-1">100%</div>
                    <div className="text-sm text-gray-400">מחויבות לתוכנית</div>
                  </div>
                </div>
              </div>

              {/* Before/After Image - Right */}
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden bg-brandGray border border-white/10">
                  <img 
                    src={`${import.meta.env.BASE_URL}assets/results/result-01.webp`}
                    alt="תוצאות לפני ואחרי - דניאל ב."
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                  {/* Labels Overlay */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between">
                    <div className="bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-bold">לפני</div>
                    <div className="bg-accent text-white px-3 py-1.5 rounded-lg text-sm font-bold">אחרי</div>
                  </div>
                  {/* Time Badge */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-bold">
                    3 חודשים
                  </div>
                </div>
                
                {/* Statistics Bar */}
                <div className="bg-brandGray border border-white/10 rounded-lg p-4 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg md:text-xl font-black text-accent mb-1">12 ק"ג-</div>
                    <div className="text-xs text-gray-400">משקל</div>
                  </div>
                  <div>
                    <div className="text-lg md:text-xl font-black text-accent mb-1">+2.5 ק"ג</div>
                    <div className="text-xs text-gray-400">מסת שריר</div>
                  </div>
                  <div>
                    <div className="text-lg md:text-xl font-black text-accent mb-1">+40%</div>
                    <div className="text-xs text-gray-400">כוח</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Client Testimonial 2 - Ori K. */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              {/* Before/After Image - Left */}
              <div className="space-y-4 order-2 md:order-1">
                <div className="relative rounded-2xl overflow-hidden bg-brandGray border border-white/10">
                  <img 
                    src={`${import.meta.env.BASE_URL}assets/results/result-02.webp`}
                    alt="תוצאות לפני ואחרי - אורי כ."
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                  {/* Labels Overlay */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between">
                    <div className="bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-bold">לפני</div>
                    <div className="bg-accent text-white px-3 py-1.5 rounded-lg text-sm font-bold">אחרי</div>
                  </div>
                  {/* Time Badge */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-bold">
                    4 חודשים
                  </div>
                </div>
                
                {/* Statistics Bar */}
                <div className="bg-brandGray border border-white/10 rounded-lg p-4 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg md:text-xl font-black text-accent mb-1">+3 ק"ג</div>
                    <div className="text-xs text-gray-400">משקל</div>
                  </div>
                  <div>
                    <div className="text-lg md:text-xl font-black text-accent mb-1">+5 ק"ג</div>
                    <div className="text-xs text-gray-400">מסת שריר</div>
                  </div>
                  <div>
                    <div className="text-lg md:text-xl font-black text-accent mb-1">+65%</div>
                    <div className="text-xs text-gray-400">כוח</div>
                  </div>
                </div>
              </div>

              {/* Client Info - Right */}
              <div className="space-y-6 order-1 md:order-2">
                {/* Profile */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="text-accent" size={24} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-white">אורי כ.</h3>
                    <p className="text-gray-400 text-sm md:text-base">יזם, גיל 29</p>
                  </div>
                </div>

                {/* Quote */}
                <div className="bg-brandGray border-r-4 border-accent rounded-lg p-4 md:p-5">
                  <p className="text-gray-200 text-base md:text-lg leading-relaxed italic">
                    "גילעד עזר לי להבין מה אני עושה לא נכון. התוצאות הגיעו מהר מהצפוי."
                  </p>
                </div>

                {/* Goals Achieved */}
                <div>
                  <h4 className="text-lg font-bold text-white mb-3">יעדים שהושגו:</h4>
                  <ul className="space-y-2">
                    {['בניית שריר', 'עליה בכוח', 'שיפור בביצועים'].map((goal, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-gray-300">
                        <CheckCircle2 className="text-accent flex-shrink-0" size={18} aria-hidden="true" />
                        <span>{goal}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Duration and Commitment */}
                <div className="bg-brandGray border border-white/10 rounded-lg p-4 md:p-5 flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="text-2xl md:text-3xl font-black text-accent mb-1">4</div>
                    <div className="text-sm text-gray-400">חודשים משך התהליך</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-2xl md:text-3xl font-black text-accent mb-1">100%</div>
                    <div className="text-sm text-gray-400">מחויבות לתוכנית</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STAGE 10: ACTION */}
        <section id="action" data-stage="action" data-snap="true" className="stage stage-alt-1 reveal cta-bg">
          <div className="absolute inset-0 z-0 cta-bg-layer" aria-hidden="true"></div>
          <div className="absolute inset-0 z-0 cta-overlay" aria-hidden="true"></div>
          <div className="container mx-auto px-4 md:px-12 relative z-10">
            <StoryHeader text="הצעד האחרון בדרך שלך" />
            <div className="grid md:grid-cols-2 gap-12 items-center mt-8">
              <div className="space-y-8">
                <h2 className="text-4xl md:text-6xl font-black heading-font leading-tight">מוכן <br /> <span className="text-accent underline decoration-accent underline-offset-8">להתחיל?</span></h2>
                <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">השאר פרטים לבדיקת התאמה קצרה וללא התחייבות. נחזור אליך תוך 24 שעות.</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-xl">
                    <div className="w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true"><Phone size={24} /></div>
                    <span>שיחה קצרה לתיאום ציפיות</span>
                  </div>
                  <div className="flex items-center gap-4 text-xl">
                    <div className="w-12 h-12 bg-[#25D366]/10 text-[#25D366] rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true"><MessageCircle size={24} /></div>
                    <span>מענה מהיר בוואטסאפ</span>
                  </div>
                </div>
              </div>
              <LeadForm isFooter={true} />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 bg-brandDark border-t border-white/5 text-center text-gray-500 text-sm">
        <div className="container mx-auto px-4">
          <div className="text-xl font-black heading-font text-white mb-6">גילעד <span className="text-accent">דורון</span></div>
          <p className="mb-4">כל הזכויות שמורות &copy; {new Date().getFullYear()} גילעד דורון - ליווי אונליין</p>
          <div className="flex justify-center gap-6 text-xs md:text-sm">
            <button onClick={() => setModalType('accessibility')} className="hover:text-white hover:underline transition-all">הצהרת נגישות</button>
            <button onClick={() => setModalType('privacy')} className="hover:text-white hover:underline transition-all">מדיניות פרטיות</button>
            <button onClick={() => setModalType('terms')} className="hover:text-white hover:underline transition-all">תקנון שימוש</button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LegalModal type={modalType} onClose={() => setModalType(null)} />
      
      <WhatsAppButton />
    </div>
  );
}
