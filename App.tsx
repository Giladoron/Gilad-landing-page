
import React, { useState, useEffect, useRef, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import FocusTrap from 'focus-trap-react';
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
  ChevronLeft,
  ChevronRight,
  User,
  ShieldCheck,
  Zap,
  Target,
  MinusCircle,
  PlusCircle,
  X,
  Loader2,
  Volume2,
  VolumeX,
  Instagram
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
  
  interface ImportMetaEnv {
    readonly VITE_EMAILJS_SERVICE_ID?: string;
    readonly VITE_EMAILJS_TEMPLATE_ID?: string;
    readonly VITE_EMAILJS_PUBLIC_KEY?: string;
    readonly VITE_RECIPIENT_EMAIL?: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

// --- EmailJS Configuration ---
// Load from environment variables, fallback to hardcoded values for backward compatibility
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_fphe5xu';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_8p1hgtg';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'vT2iqiRsrq5f4D03A';
const RECIPIENT_EMAIL = import.meta.env.VITE_RECIPIENT_EMAIL || 'gilad042@gmail.com';

// --- Constants ---

const STAGES = [
  { id: 'hero', label: 'התחלה' },
  { id: 'diagnosis', label: 'איפה אתה היום' },
  { id: 'proof', label: 'התוצאות' },
  { id: 'about', label: 'מי אני' },
  // { id: 'stuck', label: 'למה זה קורה' }, // DRAFT MODE - HIDDEN
  { id: 'guarantee', label: 'ההתחייבות' },
  { id: 'get', label: 'הפתרון' },
  { id: 'how', label: 'הדרך' },
  { id: 'waiting', label: 'המחיר' },
  { id: 'faq', label: 'שאלות נפוצות' },
  { id: 'action', label: 'הצטרפות' }
];

// --- Client Results Data ---
interface ClientResult {
  name: string;
  profession: string;
  age: number;
  quote: string;
  goals: string[];
  duration: number;
  commitment: number;
  image: string;
  imageAlt: string;
  stats: {
    weight: string;
    muscleMass: string;
    strength: string;
  };
}

const CLIENT_RESULTS: ClientResult[] = [
  {
    name: 'דניאל ב.',
    profession: 'מהנדס תוכנה',
    age: 34,
    quote: 'הפעם הראשונה שאני רואה תוצאות אמיתיות. התהליך היה ברור מהתחלה.',
    goals: ['ירידה במשקל', 'עליה במסת שריר', 'שיפור בכושר'],
    duration: 3,
    commitment: 100,
    image: 'result-01.webp',
    imageAlt: 'תוצאות לפני ואחרי - דניאל ב.',
    stats: {
      weight: '12 ק"ג-',
      muscleMass: '+2.5 ק"ג',
      strength: '+40%'
    }
  },
  {
    name: 'אורי כ.',
    profession: 'יזם',
    age: 29,
    quote: 'גילעד עזר לי להבין מה אני עושה לא נכון. התוצאות הגיעו מהר מהצפוי.',
    goals: ['בניית שריר', 'עליה בכוח', 'שיפור בביצועים'],
    duration: 4,
    commitment: 100,
    image: 'result-02.webp',
    imageAlt: 'תוצאות לפני ואחרי - אורי כ.',
    stats: {
      weight: '+3 ק"ג',
      muscleMass: '+5 ק"ג',
      strength: '+65%'
    }
  },
  {
    name: 'דניאל ב.',
    profession: 'מהנדס תוכנה',
    age: 34,
    quote: 'הפעם הראשונה שאני רואה תוצאות אמיתיות. התהליך היה ברור מהתחלה.',
    goals: ['ירידה במשקל', 'עליה במסת שריר', 'שיפור בכושר'],
    duration: 3,
    commitment: 100,
    image: 'result-01.webp',
    imageAlt: 'תוצאות לפני ואחרי - דניאל ב.',
    stats: {
      weight: '12 ק"ג-',
      muscleMass: '+2.5 ק"ג',
      strength: '+40%'
    }
  },
  {
    name: 'אורי כ.',
    profession: 'יזם',
    age: 29,
    quote: 'גילעד עזר לי להבין מה אני עושה לא נכון. התוצאות הגיעו מהר מהצפוי.',
    goals: ['בניית שריר', 'עליה בכוח', 'שיפור בביצועים'],
    duration: 4,
    commitment: 100,
    image: 'result-02.webp',
    imageAlt: 'תוצאות לפני ואחרי - אורי כ.',
    stats: {
      weight: '+3 ק"ג',
      muscleMass: '+5 ק"ג',
      strength: '+65%'
    }
  }
];

// --- FAQ Data ---
interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'איך אפשר להגיע לתוצאות בלי להיפגש פיזית?',
    answer: (
      <div className="space-y-2 text-gray-300">
        <p>זה היתרון הכי גדול שלך. הליווי הוא לא "שעה בחדר כושר", אלא מערכת שעוטפת אותך 24/7.</p>
        <p>עם מעקב דיגיטלי, ניתוח טכניקה בוידאו וזמינות מלאה בוואטסאפ. אתה מקבל פי 10 יותר תשומת לב ממאמן שרואה אותך פעמיים בשבוע והולך הביתה.</p>
      </div>
    )
  },
  {
    question: 'זה מתאים גם אם בחיים לא נגעתי במשקולת?',
    answer: (
      <div className="space-y-2 text-gray-300">
        <p>בדיוק בשביל זה יש ליווי. התוכנית נבנית מהיסוד לפי הרמה הנוכחית שלך.</p>
        <p>במקום לנחש ולעשות טעויות שיגרמו לך לפרוש, אתה מקבל שיטה מסודרת לבניית בסיס חזק מהצעד הראשון.</p>
      </div>
    )
  },
  {
    question: 'מה המחיר של הליווי?',
    answer: (
      <div className="space-y-2 text-gray-300">
        <p>השאלה האמיתית היא: כמה עלה לך עד היום לנסות לבד ולא להגיע לתוצאות?</p>
        <p>המחיר מותאם אישית למטרות ולתוכנית שנבנה עבורך. זה לא מנוי גנרי לחדר כושר, זו השקעה חד פעמית בגוף שילך איתך שנים קדימה. בשיחת ההתאמה נבין בדיוק מה אתה צריך.</p>
      </div>
    )
  },
  {
    question: 'מה קורה אם הלו״ז משתבש או שפספסתי אימון?',
    answer: (
      <div className="space-y-2 text-gray-300">
        <p>אנחנו מתאימים את התוכנית לחיים, לא להפך. החיים קורים – עבודה, משפחה, מילואים.</p>
        <p>התפקיד שלי הוא לעשות את ההתאמות בזמן אמת כדי שתישאר על המסלול גם כשקשה, בלי "עונשים" ובלי ייסורי מצפון.</p>
      </div>
    )
  },
  {
    question: 'אצטרך להרעיב את עצמי או לוותר על האוכל שאני אוהב?',
    answer: (
      <div className="space-y-2 text-gray-300">
        <p>ממש לא. דיאטות כאסח נכשלות ב-100% מהמקרים בטווח הארוך.</p>
        <p>אנחנו נבנה תפריט שכולל אוכל שאתה אוהב, שמשתלב עם ארוחות שישי ובילויים. אם זה לא יהיה טעים ונוח – אתה לא תחזיק מעמד, ואני לא עשיתי את העבודה שלי.</p>
      </div>
    )
  },
  {
    question: 'בוא נדבר תכלס: אתם באמת מבטיחים תוצאות?',
    answer: (
      <div className="space-y-2 text-gray-300">
        <p>כן. ב-100%. אם יישמת את התוכנית ולא הגעת למה שסיכמנו – אני ממשיך ללוות אותך בחינם עד שזה קורה, או שאתה מקבל החזר כספי מלא.</p>
        <p>האחריות על התוצאה היא עלי, לא רק עליך.</p>
      </div>
    )
  },
  {
    question: 'מה אם אגלה אחרי שיחת ההתאמה שזה לא בשבילי?',
    answer: (
      <div className="space-y-2 text-gray-300">
        <p>הכל בסדר. שיחת ההתאמה נועדה בדיוק בשביל זה: להבין אם אנחנו מתאימים.</p>
        <p>אם אראה שהשיטה שלי לא תביא אותך לתוצאות, אגיד לך את זה בכנות. בלי מכירות בלחץ ובלי התחייבויות מיותרות.</p>
      </div>
    )
  }
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
  useEffect(() => {
    if (!type) {
      // Ensure scrolling is enabled when modal is closed
      document.body.style.overflow = '';
      return;
    }

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    
    // Disable scrolling when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      // Restore scrolling when modal closes
      document.body.style.overflow = '';
    };
  }, [type, onClose]);

  if (!type) return null;

  const { title, content } = LEGAL_CONTENT[type];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} aria-label="סגור חלון" role="button" tabIndex={-1} />
      <FocusTrap>
        <div className="bg-brandGray/60 backdrop-blur-md border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 p-6 md:p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-brandGray/50 backdrop-blur-md py-2">
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
      </FocusTrap>
    </div>
  );
};

// --- Client Story Modal Component ---
const ClientStoryModal: React.FC<{ clientIndex: number | null; onClose: () => void }> = ({ clientIndex, onClose }) => {
  useEffect(() => {
    if (clientIndex === null) {
      document.body.style.overflow = '';
      return;
    }

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [clientIndex, onClose]);

  if (clientIndex === null) return null;

  const client = CLIENT_RESULTS[clientIndex];
  if (!client) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="client-story-title">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} aria-label="סגור חלון" role="button" tabIndex={-1} />
      <FocusTrap>
        <div className="bg-brandGray/60 backdrop-blur-md border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 p-6 md:p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-brandGray/50 backdrop-blur-md py-2">
          <div>
            <h2 id="client-story-title" className="text-2xl font-bold heading-font text-white mb-1">{client.name}</h2>
            <p className="text-gray-400 text-sm">{client.profession}, גיל {client.age}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label="סגור חלון"
          >
            <X size={24} />
          </button>
        </div>
        <div className="leading-relaxed space-y-6">
          {/* Full Quote */}
          <div className="bg-brandGray/60 backdrop-blur-sm border-r-4 border-accent rounded-lg p-4 md:p-5">
            <p className="text-gray-200 text-base md:text-lg leading-relaxed italic">
              "{client.quote}"
            </p>
          </div>

          {/* Before/After Image */}
          <div className="relative rounded-2xl overflow-hidden bg-brandGray/40 backdrop-blur-sm border border-white/10">
            <img 
              src={`${(import.meta as any).env.BASE_URL}assets/results/${client.image}`}
              alt={client.imageAlt}
              className="w-full h-auto object-cover scale-x-[-1]"
              loading="lazy"
            />
            <div className="absolute top-4 left-4 right-4 flex justify-between">
              <div className="bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-bold">לפני</div>
              <div className="bg-accent text-white px-3 py-1.5 rounded-lg text-sm font-bold">אחרי</div>
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-bold">
              {client.duration} חודשים
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-brandGray/40 backdrop-blur-sm border border-white/10 rounded-lg p-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg md:text-xl font-black text-accent mb-1">{client.stats.weight}</div>
              <div className="text-xs text-gray-400">משקל</div>
            </div>
            <div>
              <div className="text-lg md:text-xl font-black text-accent mb-1">{client.stats.muscleMass}</div>
              <div className="text-xs text-gray-400">מסת שריר</div>
            </div>
            <div>
              <div className="text-lg md:text-xl font-black text-accent mb-1">{client.stats.strength}</div>
              <div className="text-xs text-gray-400">כוח</div>
            </div>
          </div>

          {/* Goals Achieved */}
          <div>
            <h4 className="text-lg font-bold text-white mb-3">יעדים שהושגו:</h4>
            <ul className="space-y-2">
              {client.goals.map((goal, idx) => (
                <li key={idx} className="flex items-center gap-3 text-gray-300">
                  <CheckCircle2 className="text-accent flex-shrink-0" size={18} aria-hidden="true" />
                  <span>{goal}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Duration and Commitment */}
          <div className="bg-brandGray/40 backdrop-blur-sm border border-white/10 rounded-lg p-4 md:p-5 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="text-2xl md:text-3xl font-black text-accent mb-1">{client.duration}</div>
              <div className="text-sm text-gray-400">חודשים משך התהליך</div>
            </div>
            <div className="flex-1">
              <div className="text-2xl md:text-3xl font-black text-accent mb-1">{client.commitment}%</div>
              <div className="text-sm text-gray-400">מחויבות לתוכנית</div>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
          <button 
            onClick={onClose}
            className="bg-accent text-white px-8 py-2 rounded-lg font-bold hover:brightness-110 transition-all"
          >
            סגור
          </button>
        </div>
        </div>
      </FocusTrap>
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
  <div className="text-center mb-2 sm:mb-4 md:mb-6 mt-4 sm:mt-8 md:mt-0 pt-2 sm:pt-4 md:pt-0 flex flex-col items-center">
    <span className="story-header-text text-gray-400 text-sm md:text-lg font-medium tracking-wide">
      {text}
    </span>
    <div className="w-16 h-0.5 bg-accent mt-3" aria-hidden="true" />
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleClick = () => {
    window.open('https://wa.me/972528765992?text=היי גילעד, ראיתי את האתר שלך ואשמח לשמוע פרטים על הליווי', '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 md:right-auto md:left-6 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 group flex items-center gap-2 max-w-fit md:max-w-none"
      aria-label="צור קשר בוואטסאפ"
      style={isMobile ? { 
        bottom: '1.5rem',
        right: '1.5rem'
      } : undefined}
    >
      <span className="hidden group-hover:block font-bold pr-2 whitespace-nowrap">דברו איתי בוואטסאפ</span>
      <MessageCircle size={32} aria-hidden="true" />
    </button>
  );
};

const FloatingCTA: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasReachedAction, setHasReachedAction] = useState(false);
  
  // Cache action section position to avoid layout thrashing
  const actionSectionRef = useRef<HTMLElement | null>(null);
  const actionTopRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const hasReachedActionRef = useRef(hasReachedAction);
  const isVisibleRef = useRef(isVisible);

  // Sync refs when state changes (from outside this effect)
  useEffect(() => {
    hasReachedActionRef.current = hasReachedAction;
    isVisibleRef.current = isVisible;
  }, [hasReachedAction, isVisible]);

  useEffect(() => {
    // Cache action section element and position
    const updateActionPosition = () => {
      const actionSection = document.getElementById('action');
      actionSectionRef.current = actionSection;
      if (actionSection) {
        const actionRect = actionSection.getBoundingClientRect();
        actionTopRef.current = actionRect.top + window.scrollY;
      }
    };

    // Initial cache
    updateActionPosition();

    // Recalculate on resize (position changes)
    const handleResize = () => {
      updateActionPosition();
    };
    window.addEventListener('resize', handleResize, { passive: true });

    const handleScroll = () => {
      // Cancel any pending RAF
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }

      // Batch layout reads and state updates in RAF
      rafIdRef.current = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const actionSection = actionSectionRef.current;
        
        let newHasReachedAction = hasReachedActionRef.current;
        let newIsVisible = isVisibleRef.current;

        // Check if user has reached action section (use cached position)
        if (actionSection) {
          // Only recalculate if we're near the action section (within 200px)
          if (Math.abs(scrollY - actionTopRef.current) < 200) {
            const actionRect = actionSection.getBoundingClientRect();
            actionTopRef.current = actionRect.top + window.scrollY;
          }
          
          if (scrollY + window.innerHeight >= actionTopRef.current - 100) {
            newHasReachedAction = true;
            newIsVisible = false;
          } else {
            newHasReachedAction = false;
          }
        }

        // Show after scrolling 100px, hide before action section
        if (scrollY > 100 && !newHasReachedAction) {
          newIsVisible = true;
        } else {
          newIsVisible = false;
        }

        // Only update state if values changed (prevent unnecessary re-renders)
        if (newHasReachedAction !== hasReachedActionRef.current || newIsVisible !== isVisibleRef.current) {
          hasReachedActionRef.current = newHasReachedAction;
          isVisibleRef.current = newIsVisible;
          setHasReachedAction(newHasReachedAction);
          setIsVisible(newIsVisible);
        }
      });
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []); // Empty deps - use refs to avoid stale closures and prevent re-runs

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const actionSection = document.getElementById('action');
    if (actionSection) {
      actionSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 left-6 md:bottom-20 md:left-auto md:right-8 z-[60] bg-accent text-white px-6 py-3 rounded-full shadow-2xl hover:brightness-110 transition-all duration-300 font-bold text-sm md:text-base flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-300"
      aria-label="מעבר לבדיקת התאמה"
    >
      בדיקת התאמה
    </button>
  );
};

const ExitIntentPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const hasShownRef = useRef(false);

  useEffect(() => {
    // Check if already shown in this session
    if (sessionStorage.getItem('exitIntentShown') === 'true') {
      return;
    }

    let scrollDepth = 0;
    let timeOnPage = 0;
    const startTime = Date.now();
    const isMobile = window.innerWidth < 768;

    // Cache scrollHeight (only changes on resize, not scroll)
    let cachedScrollHeight = document.documentElement.scrollHeight;
    let scrollTimeout: NodeJS.Timeout | null = null;

    // Update cached scrollHeight on resize
    const handleResize = () => {
      cachedScrollHeight = document.documentElement.scrollHeight;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Track scroll depth (throttled to avoid layout thrashing)
    const handleScroll = () => {
      // Clear any pending timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      // Throttle scroll handler (100ms debounce)
      scrollTimeout = setTimeout(() => {
        const windowHeight = window.innerHeight;
        const scrollTop = window.scrollY;
        // Use cached scrollHeight instead of reading it every scroll
        scrollDepth = (scrollTop + windowHeight) / cachedScrollHeight;
      }, 100);
    };

    // Track time on page
    const timeInterval = setInterval(() => {
      timeOnPage = (Date.now() - startTime) / 1000;
    }, 1000);

    // Desktop: Mouse leave detection (trigger at 50% scroll depth to reduce false triggers)
    const handleMouseLeave = (e: MouseEvent) => {
      if (isMobile) return; // Explicitly disable for mobile
      if (e.clientY <= 0 && !hasShownRef.current && scrollDepth > 0.5) {
        hasShownRef.current = true;
        setIsOpen(true);
        sessionStorage.setItem('exitIntentShown', 'true');
      }
    };

    // Mobile: Disabled per user request
    const checkMobileTrigger = () => {
      // Logic removed for mobile abandonment popup
    };

    const mobileCheckInterval = setInterval(checkMobileTrigger, 1000);

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearInterval(timeInterval);
      clearInterval(mobileCheckInterval);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsOpen(false);
          document.body.style.overflow = '';
        }
      };
      window.addEventListener('keydown', handleEsc);
      return () => {
        window.removeEventListener('keydown', handleEsc);
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    document.body.style.overflow = '';
  };

  const handleCTAClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleClose();
    const actionSection = document.getElementById('action');
    if (actionSection) {
      setTimeout(() => {
        actionSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="exit-intent-title">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose} aria-label="סגור חלון" role="button" tabIndex={-1} />
      <FocusTrap>
        <div className="bg-brandGray/60 backdrop-blur-md border border-white/10 rounded-2xl w-full max-w-md relative z-10 p-6 md:p-8 shadow-2xl">
        <button 
          onClick={handleClose}
          className="absolute top-4 left-4 p-2 hover:bg-white/10 rounded-full transition-colors"
          aria-label="סגור חלון"
        >
          <X size={24} />
        </button>
        <div className="text-center space-y-6">
          <h2 id="exit-intent-title" className="text-2xl md:text-3xl font-black heading-font text-white">
            רגע לפני שאתה עוזב...
          </h2>
          <p className="text-gray-300 text-lg">
            בוא נבדוק ביחד אם זה מתאים לך
          </p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={handleCTAClick}
              className="bg-accent hover:brightness-110 text-white px-8 py-4 rounded-full text-lg font-bold transition-all shadow-lg"
            >
              בדיקת התאמה
            </button>
            <button 
              onClick={handleClose}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              אולי מאוחר יותר
            </button>
          </div>
        </div>
        </div>
      </FocusTrap>
    </div>
  );
};

const Navbar: React.FC = () => (
  <header className="absolute top-0 left-0 right-0 z-50 py-2 md:py-6 px-3 md:px-12 flex justify-between items-center bg-transparent w-full">
    <div className="text-lg md:text-2xl font-black heading-font tracking-tighter text-white shrink-0">
      גילעד <span className="text-accent">דורון</span>
    </div>
    <nav className="hidden md:flex gap-8 text-sm font-medium" aria-label="ניווט ראשי">
      <a href="#how" className="hover:text-accent transition-colors">איך זה עובד</a>
      <a href="#about" className="hover:text-accent transition-colors">מי אני</a>
      <a href="#faq" className="hover:text-accent transition-colors">שאלות נפוצות</a>
    </nav>
    <a 
      href="#action" 
      className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold transition-all whitespace-nowrap"
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
    <div className={`${isFooter ? 'bg-brandGray/50 backdrop-blur-md border border-white/10' : 'bg-white/95 backdrop-blur-sm text-brandDark'} p-4 md:p-6 rounded-2xl shadow-2xl w-full max-w-md mx-auto`}>
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
          <form onSubmit={handleSubmit} className="space-y-2 md:space-y-3">
            <div>
              <label htmlFor="fullName" className={`block text-[10px] md:text-xs font-bold mb-0.5 md:mb-1 opacity-70 ${isFooter ? 'text-gray-300' : 'text-gray-700'}`}>שם מלא</label>
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
                className={`w-full px-3 py-2 md:px-4 md:py-3 rounded-lg border text-sm md:text-base focus:ring-2 focus:ring-accent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isFooter ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-brandDark'}`}
                placeholder="ישראל ישראלי"
                value={formData.fullName}
                onChange={e => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
            <div>
              <label htmlFor="phone" className={`block text-[10px] md:text-xs font-bold mb-0.5 md:mb-1 opacity-70 ${isFooter ? 'text-gray-300' : 'text-gray-700'}`}>טלפון</label>
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
                className={`w-full px-3 py-2 md:px-4 md:py-3 rounded-lg border text-sm md:text-base focus:ring-2 focus:ring-accent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isFooter ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-brandDark'}`}
                placeholder="050-0000000"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div>
              <label htmlFor="email" className={`block text-[10px] md:text-xs font-bold mb-0.5 md:mb-1 opacity-70 ${isFooter ? 'text-gray-300' : 'text-gray-700'}`}>אימייל</label>
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

// Helper function to detect iOS devices
const isIOS = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

// Simple testimonial video component with Vimeo Player API and custom floating mute/unmute button
const ClientTestimonialVideo: React.FC<{ videoId: string }> = ({ videoId }) => {
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Start muted (browser requirement for autoplay)
  const [isVisible, setIsVisible] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<any>(null);
  const hasInitializedRef = useRef(false);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isVisibleRef = useRef(false); // Track visibility in ref to avoid stale closures
  const playTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayingRef = useRef(false); // Track if we've started playing to prevent rapid toggles
  
  useEffect(() => {
    setIsIOSDevice(isIOS());
  }, []);
  
  // Sync refs when state changes
  useEffect(() => {
    isVisibleRef.current = isVisible;
  }, [isVisible]);
  
  // Vimeo URL with controls enabled for interactivity (controls=1 to make video clickable, we use custom button for mute)
  const vimeoUrl = `https://player.vimeo.com/video/${videoId}?autoplay=0&muted=1&loop=0&controls=1&background=0&playsinline=1&responsive=1`;
  
  // Initialize Vimeo Player when iframe loads (similar to VideoPlayer)
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
          
          // Check initial mute state
          try {
            await new Promise(resolve => setTimeout(resolve, 200));
            const initialMuted = await playerRef.current.getMuted();
            setIsMuted(initialMuted);
          } catch (err) {
            // Ignore errors if player not fully ready yet
          }
          
          // If section is already visible when player initializes, start playing
          if (isVisibleRef.current) {
            setTimeout(async () => {
              try {
                if (playerRef.current && isVisibleRef.current) {
                  await playerRef.current.play();
                  // Get initial mute state (video starts muted per browser requirements)
                  try {
                    const muted = await playerRef.current.getMuted();
                    setIsMuted(muted);
                  } catch (err) {
                    // Ignore
                  }
                }
              } catch (err) {
                // Ignore play errors
              }
            }, 300);
          }
          
          // Clear all timeouts once initialized
          timeoutIds.forEach(id => clearTimeout(id));
        } catch (error) {
          // Failed to initialize Vimeo player - non-critical, video will still work
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
    }, 500);
    timeoutIds.push(initialTimeoutId);

    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
      if (iframe) {
        iframe.removeEventListener('load', handleLoad);
      }
    };
  }, []);

  // Toggle mute/unmute handler
  const handleToggleMute = async () => {
    if (!playerRef.current) return;

    try {
      const currentMuted = await playerRef.current.getMuted();
      await playerRef.current.setMuted(!currentMuted);
      setIsMuted(!currentMuted);
    } catch (err) {
      // Failed to toggle mute - non-critical, continue silently
    }
  };
  
  return (
    <div 
      ref={videoContainerRef}
      style={{ 
        backgroundColor: '#000', 
        width: '100%', 
        height: '100%', 
        minHeight: '400px',
        position: 'relative', 
        overflow: isIOSDevice ? 'visible' : 'hidden',
        overflowX: 'hidden', // Always hide horizontal overflow
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: isIOSDevice ? '60px' : '0'
      }}
    >
      <iframe
        ref={iframeRef}
        src={vimeoUrl}
        className="w-full h-full absolute inset-0"
        style={{ 
          border: 'none', 
          width: '100%', 
          height: isIOSDevice ? 'calc(100% - 60px)' : '100%', 
          minHeight: '400px',
          backgroundColor: '#000',
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: isIOSDevice ? '60px' : 0,
          pointerEvents: 'auto' // Ensure touch events work on iOS
        }}
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        playsInline
        loading="lazy"
        title="תעודת לקוח - וידאו"
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

const VideoPlayer: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Start muted (browser requirement for autoplay)
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<any>(null);
  const hasInitializedRef = useRef(false);
  const volumeChangeHandlerRef = useRef<(() => Promise<void>) | null>(null);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isVisibleRef = useRef(false); // Track visibility in ref to avoid stale closures
  const playTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayingRef = useRef(false); // Track if we've started playing to prevent rapid toggles

  // Detect iOS device
  useEffect(() => {
    setIsIOSDevice(isIOS());
  }, []);

  // Vimeo embed URL - single URL that won't change
  // Start muted (browser requirement) - we'll unmute when visible
  // Added playsinline and responsive for better mobile support
  const baseUrl = "https://player.vimeo.com/video/1152174898?context=Vimeo%5CController%5CApi%5CResources%5CVideoController.&h=6e172adfe8&s=e8675d0eb6c47f57274868162088cbf80f997c1c_1767884558";
  const vimeoUrl = `${baseUrl}&autoplay=0&muted=1&loop=1&controls=1&background=0&playsinline=1&responsive=1`;

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
                    // Get initial mute state (video starts muted per browser requirements)
                    try {
                      const muted = await playerRef.current.getMuted();
                      setIsMuted(muted);
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
            // Volume change listener setup failed - non-critical, continue silently
            // Still mark as ready even if listener setup fails
            setIsPlayerReady(true);
          }
          
          // Clear all timeouts once initialized
          timeoutIds.forEach(id => clearTimeout(id));
        } catch (error) {
          // Failed to initialize Vimeo player - non-critical, video will not play
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

        // Debounce play call to prevent rapid toggling
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
            
            // Update mute state (video stays muted - user must manually unmute via button)
            setTimeout(async () => {
              try {
                if (playerRef.current && isVisibleRef.current) {
                  const muted = await playerRef.current.getMuted();
                  setIsMuted(muted);
                }
              } catch (err) {
                // Ignore errors
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
        }, 300); // 300ms debounce
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
        }, 800); // 800ms delay before pausing
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
                // Failed to toggle mute - non-critical, continue silently
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
        overflow: isIOSDevice ? 'visible' : 'hidden',
        overflowX: 'hidden', // Always hide horizontal overflow
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: isIOSDevice ? '60px' : '0'
      }}
    >
      <iframe
        ref={iframeRef}
        src={vimeoUrl}
        className="w-full h-full absolute inset-0"
        style={{ 
          border: 'none', 
          width: '100%', 
          height: isIOSDevice ? 'calc(100% - 60px)' : '100%', 
          minHeight: '400px',
          backgroundColor: '#000',
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: isIOSDevice ? '60px' : 0,
          pointerEvents: 'auto' // Ensure touch events work on iOS
        }}
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        playsInline
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
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [expandedFAQIndex, setExpandedFAQIndex] = useState<number | null>(null);
  const [selectedClientIndex, setSelectedClientIndex] = useState<number | null>(null);
  const [expandedStepIndex, setExpandedStepIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setExpandedFAQIndex(expandedFAQIndex === index ? null : index);
  };

  const toggleStep = (index: number) => {
    setExpandedStepIndex(expandedStepIndex === index ? null : index);
  };

  const openClientStory = (index: number) => {
    setSelectedClientIndex(index);
  };

  const closeClientStory = () => {
    setSelectedClientIndex(null);
  };

  const activeStageIndex = STAGES.findIndex(s => s.id === activeStage);

  // ============================================================================
  // Embla Carousel Implementation
  // ============================================================================
  // Replaced complex custom carousel with Embla Carousel for reliability
  // - Handles infinite scroll/loop automatically
  // - Native RTL support
  // - Touch/swipe gestures work out of the box
  // - No race conditions or edge case bugs
  // ============================================================================

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true, 
      align: 'center',
      direction: 'rtl',
      slidesToScroll: 1,
      skipSnaps: false,
      dragFree: false
    }
  );

  // Navigation handlers
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  // Track selected slide
  useEffect(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    });
  }, [emblaApi]);

  // Center carousel when proof section becomes active
  useEffect(() => {
    if (activeStage === 'proof' && emblaApi) {
      emblaApi.scrollTo(0, true); // Scroll to first slide smoothly
    }
  }, [activeStage, emblaApi]);

  // Keyboard navigation for carousel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle keyboard navigation when results section is active
      if (activeStage !== 'proof') return;
      
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        if (e.key === 'ArrowRight') {
          scrollPrev(); // Right arrow = previous (RTL)
        } else {
          scrollNext(); // Left arrow = next (RTL)
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeStage, scrollPrev, scrollNext]);

  useEffect(() => {
    // Stage/Focus Observer
    const stageOptions = {
      root: null,
      rootMargin: "-20% 0px -55% 0px",
      // Reduced thresholds from 6 to 3 key points to reduce callback frequency
      threshold: [0.1, 0.5, 0.9]
    };

    // Track intersection ratios for all sections
    const sectionRatios = new Map<Element, number>();

    // Cache snap elements (only query once, not on every callback)
    const snapElements = document.querySelectorAll('[data-snap="true"]');

    // Debounce state updates to prevent excessive re-renders
    let stageUpdateTimeout: NodeJS.Timeout | null = null;
    const DEBOUNCE_DELAY = 75; // ms

    const stageObserver = new IntersectionObserver((entries) => {
      // Update the ratios map with current intersection data
      entries.forEach(entry => {
          if (entry.isIntersecting) {
          sectionRatios.set(entry.target, entry.intersectionRatio);
        } else {
          sectionRatios.delete(entry.target);
        }
      });

      // Find the section with the highest intersection ratio (most visible)
      let maxRatio = 0;
      let mostVisibleElement: Element | null = null;
      
      sectionRatios.forEach((ratio, element) => {
        if (ratio > maxRatio) {
          maxRatio = ratio;
          mostVisibleElement = element;
        }
      });

      // Clear any pending update
      if (stageUpdateTimeout) {
        clearTimeout(stageUpdateTimeout);
      }

      // Debounce state updates and DOM manipulation
      stageUpdateTimeout = setTimeout(() => {
        // Only update if we found a visible section
        if (mostVisibleElement) {
          const stageId = mostVisibleElement.getAttribute('data-stage');
          if (stageId) {
            setActiveStage(stageId);
            // Use cached querySelectorAll result
            snapElements.forEach(s => s.classList.remove('active-section'));
            mostVisibleElement.classList.add('active-section');

            if (stageId === 'guarantee') {
              mostVisibleElement.classList.add('guarantee-revealed');
            }
          }
        }
      }, DEBOUNCE_DELAY);
    }, stageOptions);

    // Observe all snap elements (using cached reference)
    snapElements.forEach((el) => stageObserver.observe(el));

    // Staggered animation for get section cards
    const getCardsContainer = document.getElementById('get-cards-container');
    if (getCardsContainer) {
      const getCardsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.get-card');
            cards.forEach((card, index) => {
              const cardElement = card as HTMLElement;
              const delay = index * 100;
              setTimeout(() => {
                cardElement.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                cardElement.style.opacity = '1';
                cardElement.style.transform = 'translateY(0)';
              }, delay);
            });
            getCardsObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      getCardsObserver.observe(getCardsContainer);
    }

    return () => {
      stageObserver.disconnect();
      if (stageUpdateTimeout) {
        clearTimeout(stageUpdateTimeout);
      }
    };
  }, []);

  return (
    <div className="min-h-screen selection:bg-accent selection:text-white">
      <div className="global-parallax-bg" aria-hidden="true" />
      <a href="#main-content" className="sr-only">
        דלג לתוכן הראשי
      </a>
      <MobileProgressBar activeStageIndex={activeStageIndex} />

      <JourneyRail activeStage={activeStage} />
      
      <main id="main-content">
        {/* STAGE 1: HERO */}
        <section id="hero" data-stage="hero" data-snap="true" className="stage">
          <div className="absolute inset-0 z-0 hero-overlay" aria-hidden="true"></div>
          <Navbar />

          <div className="container mx-auto px-4 md:px-12 relative z-10 py-4 md:py-6 h-full flex flex-col justify-center pt-24 md:pt-0 mobile-hero-spacing">
            <StoryHeader text="החלום שלך מתחיל כאן" />
            <div className="grid md:grid-cols-2 gap-6 items-center mt-2 md:mt-4">
              <div className="space-y-4 md:space-y-6 text-center md:text-right">
                <h2 className="hero-headline text-2xl md:text-5xl lg:text-6xl font-black heading-font leading-tight">מתאמן כבר חודשים <br /> <span className="text-accent underline decoration-accent underline-offset-8">והגוף מסרב להשתנות?</span></h2>
                <p className="hero-subheadline text-lg md:text-xl lg:text-2xl text-gray-300 leading-relaxed font-light">השאר פרטים לבדיקת התאמה קצרה וללא התחייבות. נחזור אליך תוך 24 שעות.</p>
                <div className="space-y-3 md:space-y-4 flex flex-col items-center md:items-start">
                  <div className="flex items-center gap-3 md:gap-4 text-base md:text-xl">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true"><Phone size={20} className="md:w-6 md:h-6" /></div>
                    <span>שיחה קצרה לתיאום ציפיות</span>
                  </div>
                  <div className="flex items-center gap-3 md:gap-4 text-base md:text-xl">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-[#25D366]/10 text-[#25D366] rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true"><MessageCircle size={20} className="md:w-6 md:h-6" /></div>
                    <span>מענה מהיר בוואטסאפ</span>
                  </div>
                </div>
              </div>
              <div className="delay-100 w-full flex-1 flex flex-col justify-end pb-2 md:pb-0">
                <div className="mobile-form-container">
                  <LeadForm isFooter={true} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STAGE 2: REFLECTIVE DIAGNOSIS */}
        <section id="diagnosis" data-stage="diagnosis" data-snap="true" className="stage stage-alt-1">
          <div className="absolute inset-0 z-0 reflection-overlay" aria-hidden="true"></div>
          <div className="container mx-auto px-4 md:px-12 py-2 md:py-10 relative z-10 h-full flex flex-col justify-center pb-safe mobile-section-spacing">
            <StoryHeader text="למה נתקעת?" />
            
            <div className="text-center max-w-3xl mx-auto mb-2 md:mb-8 space-y-1 md:space-y-4">
              <h2 className="text-xl md:text-5xl font-black heading-font leading-tight compact-heading">
                אתה עובד 'קשה' <span className="text-accent">במקום לעבוד 'נכון'</span>
              </h2>
              <p className="text-sm md:text-xl text-gray-300 leading-relaxed compact-text">
                זה לא כי אתה לא משקיע. <br className="md:hidden hidden" />
                זה כי בלי התהליך הנכון גם עבודה קשה לא מביאה תוצאות.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-2 md:gap-8 flex-1 min-h-0">
              <div className="bg-brandGray/20 backdrop-blur-sm border-r-2 border-white/10 p-3 md:p-10 rounded-xl relative group transition-all flex flex-col justify-center">
                <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-6 text-gray-300 flex items-center gap-2 md:gap-3 compact-heading">
                  <MinusCircle className="text-gray-500 opacity-50" size={20} aria-hidden="true" />
                  ככה זה מרגיש בלי הליווי
                </h3>
                <ul className="space-y-1.5 md:space-y-4">
                  {[
                    "אתה מחליף תוכניות כל שבועיים ומתפלל שמשהו יעבוד",
                    "אתה לא באמת בטוח שאתה בכיוון הנכון",
                    "אתה עובד קשה אבל זה לא מתבטא בתוצאות",
                    "המוטיבציה שלך נחלשת משבוע לשבוע"
                  ].map((item, idx) => (
                    <li key={idx} className="text-sm md:text-lg text-gray-400 flex items-start gap-2 md:gap-4 compact-text">
                      <span className="w-1 h-1 bg-gray-600 rounded-full mt-2 flex-shrink-0" aria-hidden="true"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-brandGray/20 backdrop-blur-sm border-r-2 border-accent/20 p-3 md:p-10 rounded-xl relative group transition-all flex flex-col justify-center">
                <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-8 text-white flex items-center gap-2 md:gap-3 compact-heading">
                  <PlusCircle className="text-accent opacity-80" size={20} aria-hidden="true" />
                  ככה זה נראה עם התהליך הנכון
                </h3>
                <ul className="space-y-1.5 md:space-y-4">
                  {[
                    "יש לך יעדים ברורים לכל אימון",
                    "אתה לא רק פועל, אתה מבין למה זה עובד",
                    "אתה יודע למדוד את ההתקדמות ומפסיק לנחש",
                    "אתה מצליח להתמיד לאורך זמן ומסופק מהדרך"
                  ].map((item, idx) => (
                    <li key={idx} className="text-sm md:text-lg text-gray-200 flex items-start gap-2 md:gap-4 compact-text">
                      <span className="w-1 h-1 bg-accent rounded-full mt-2 flex-shrink-0" aria-hidden="true"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="text-center mt-2 md:mt-8 max-w-2xl mx-auto compact-hide">
              <p className="text-base md:text-2xl font-bold text-white border-b border-white/5 pb-2 md:pb-4 compact-text">
                אם אתה רוצה תהליך אחד מדוייק שמביא תוצאות, <span className="text-accent">אני כאן.</span>
              </p>
            </div>
          </div>
        </section>

        {/* STAGE 3: PROOF */}
        <section id="proof" data-stage="proof" data-snap="true" className="stage stage-alt-1">
          <div className="absolute inset-0 z-0 proof-overlay" aria-hidden="true"></div>
          <div className="container mx-auto px-4 md:px-12 relative z-10 py-2 md:py-4 h-full flex flex-col">
            <StoryHeader text="כשהתהליך נכון – רואים את זה" />
            
            {/* Header Section */}
            <div className="text-center mb-2 md:mb-3 flex-shrink-0">
              <h2 className="text-4xl md:text-7xl font-black heading-font leading-tight mb-4">התוצאות מדברות</h2>
              <div className="text-lg md:text-2xl text-accent font-black max-w-3xl mx-auto leading-relaxed mb-2">
                התוצאה שלך – האחריות שלי.
              </div>
              <p className="text-sm md:text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
                אנשים רגילים שהחליטו להפסיק לנחש ולהתחיל לראות תוצאות.
              </p>
            </div>

            {/* Client Results Carousel */}
            <div className="relative px-4 md:px-12 flex-1 flex flex-col justify-center min-h-0" style={{ touchAction: 'pan-x pan-y', pointerEvents: 'auto' }}>
              {/* Arrow Navigation Controls */}
              {CLIENT_RESULTS.length > 1 && (
                <>
                  <button
                    onClick={scrollPrev}
                    className="absolute -right-2 md:-right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-brandGray/40 hover:bg-brandGray/60 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 shadow-lg pointer-events-auto"
                    aria-label="לקוח קודם"
                  >
                    <ChevronRight size={20} aria-hidden="true" />
                  </button>
                  <button
                    onClick={scrollNext}
                    className="absolute -left-2 md:-left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-brandGray/40 hover:bg-brandGray/60 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 shadow-lg pointer-events-auto"
                    aria-label="לקוח הבא"
                  >
                    <ChevronLeft size={20} aria-hidden="true" />
                  </button>
                </>
              )}

              {/* Embla Carousel Container */}
              <div className="embla overflow-hidden" ref={emblaRef}>
                <div className="embla__container flex gap-6 md:gap-8 py-8">
                  {CLIENT_RESULTS.map((client, index) => {
                    const isActive = index === selectedIndex;
                    
                    return (
                      <div
                        key={`${client.name}-${client.age}-${index}`}
                        className={`embla__slide flex-shrink-0 w-[80vw] sm:w-[70vw] md:w-[35%] lg:w-[38%] md:max-w-[500px] transition-all duration-500 ${
                          isActive 
                            ? 'opacity-100 z-10 scale-[1.03] md:scale-105' 
                            : 'opacity-40 scale-95 blur-[1px]'
                        }`}
                        style={{
                          perspective: '1000px'
                        }}
                      >
                        <div className={`bg-brandGray/50 border rounded-2xl pt-2 md:pt-2.5 px-2 md:px-2.5 pb-2 md:pb-2.5 flex flex-col transition-all duration-500 shadow-[0_10px_40px_rgba(0,0,0,0.6)] ${
                          isActive 
                            ? 'border-accent shadow-[0_0_40px_rgba(255,107,53,0.3),0_10px_40px_rgba(0,0,0,0.6)]' 
                            : 'border-white/5 shadow-none'
                        }`}>
                          {/* Content Wrapper */}
                          <div className="carousel-card-content-wrapper w-full flex flex-col min-h-0 bg-brandGray/40 backdrop-blur-sm border border-white/10 rounded-2xl p-2 md:p-3">
                            {/* Header Row: Avatar + Name + Age */}
                            <div className="flex items-center gap-2.5 mb-2">
                              <div className="w-10 h-10 md:w-12 md:h-12 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                                <User className="text-accent" size={20} aria-hidden="true" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg md:text-xl font-black text-white truncate">{client.name}</h3>
                                <p className="text-gray-400 text-xs md:text-sm">{client.profession}, גיל {client.age}</p>
                              </div>
                            </div>

                            {/* Quote: Max 2 lines with ellipsis */}
                            <div className="bg-brandGray/60 border-r-4 md:border-r-[6px] border-accent rounded-lg p-2 md:p-2.5 mb-2 shadow-inner">
                              <p className="text-gray-200 text-sm md:text-base leading-relaxed italic line-clamp-2 overflow-hidden">
                                "{client.quote}"
                              </p>
                            </div>

                            {/* Before/After Image: Fixed aspect ratio with reserved space */}
                            <div className="relative rounded-xl overflow-hidden bg-brandGray/40 backdrop-blur-sm border border-white/10 mb-1.5 md:mb-2 aspect-[2/1] md:aspect-[3/2] min-h-[100px] md:min-h-[140px]">
                              <img 
                                src={`${(import.meta as any).env.BASE_URL}assets/results/${client.image}`}
                                alt={client.imageAlt}
                                className="w-full h-full object-contain scale-x-[-1]"
                                loading="lazy"
                                style={{ 
                                  display: 'block',
                                  height: '100%',
                                  width: '100%'
                                }}
                              />
                              {/* Labels Overlay */}
                              <div className="absolute top-2 left-2 right-2 flex justify-between">
                                <div className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-bold">לפני</div>
                                <div className="bg-accent text-white px-2 py-1 rounded-lg text-xs font-bold">אחרי</div>
                              </div>
                              {/* Time Badge */}
                              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs font-bold">
                                {client.duration} חודשים
                              </div>
                            </div>
                            
                            {/* Statistics Row: Compact single row */}
                            <div className="bg-brandGray/40 backdrop-blur-sm border border-white/10 rounded-lg p-1 md:p-1.5 grid grid-cols-3 gap-1 md:gap-1.5 text-center">
                              <div>
                                <div className="text-base md:text-lg font-black text-accent mb-0.5">{client.stats.weight}</div>
                                <div className="text-[10px] md:text-xs text-gray-400">משקל</div>
                              </div>
                              <div>
                                <div className="text-base md:text-lg font-black text-accent mb-0.5">{client.stats.muscleMass}</div>
                                <div className="text-[10px] md:text-xs text-gray-400">מסת שריר</div>
                              </div>
                              <div>
                                <div className="text-base md:text-lg font-black text-accent mb-0.5">{client.stats.strength}</div>
                                <div className="text-[10px] md:text-xs text-gray-400">כוח</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
                
              {/* Dot Indicators */}
              <div className="flex justify-center gap-2 mt-6 md:mt-8 flex-shrink-0" role="tablist" aria-label="ניווט בין תוצאות לקוחות">
                {CLIENT_RESULTS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollTo(index)}
                    className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                      index === selectedIndex
                        ? 'bg-accent w-4 md:w-8'
                        : 'bg-white/30 hover:bg-white/50'
                    }`}
                    aria-label={`מעבר לתוצאות לקוח ${index + 1}`}
                    aria-selected={index === selectedIndex}
                    role="tab"
                  />
                ))}
              </div>
            </div>

            {/* CTA Button - Always visible at bottom */}
            <div className="flex justify-center mt-6 md:mt-8 mb-20 md:mb-2 flex-shrink-0 relative z-20">
              <a
                href="#action"
                className="bg-accent hover:brightness-110 text-white px-8 py-4 rounded-full text-lg font-bold transition-all hover:scale-105 shadow-lg relative z-20 pointer-events-auto"
              >
                בנה לי את הגוף שתמיד רציתי
              </a>
                  </div>
                  </div>
        </section>

        {/* STAGE 3.5: CLIENT TESTIMONIAL VIDEO */}
        <section id="client-testimonial-video" data-stage="client-testimonial-video" data-snap="true" className="stage stage-alt-1">
          <div className="absolute inset-0 z-0 proof-overlay" aria-hidden="true"></div>
          <div className="container mx-auto px-4 md:px-12 max-w-5xl relative z-10 py-4 md:py-10 h-full flex flex-col justify-center mobile-section-spacing">
            <StoryHeader text="הלקוח מדבר" />
            
            <div className="flex flex-col md:grid md:grid-cols-2 gap-2 md:gap-8 items-center mt-2 md:mt-6">
              {/* Testimonial Text - First on mobile, secondary on desktop */}
              <div className="space-y-4 md:space-y-6 text-center md:text-right w-full md:w-auto">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                    ראובן כ. · מהנדס · גיל 31
                  </h3>
                  <div className="bg-brandGray/60 backdrop-blur-sm border-r-4 border-accent rounded-lg p-4 md:p-5">
                    <p className="text-gray-200 text-base md:text-lg leading-relaxed italic line-clamp-2">
                      "טקסט עד 2 שורות מקסימום - תוכן עדכני יוזן מאוחר יותר"
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Video - Second on mobile, primary on desktop */}
              <div className="relative w-full flex-1 min-h-0 flex items-center justify-center flex-col gap-4 md:gap-6">
                {/* Video container with floating shadow */}
                <div 
                  className="w-full rounded-2xl md:rounded-3xl overflow-hidden relative z-10 border border-white/10"
                  style={{ 
                    aspectRatio: '9/16', // Match actual video format (portrait)
                    maxHeight: '75dvh', // Increased from 65vh to 75dvh for iOS Safari compatibility and to accommodate Vimeo controls
                    minHeight: '400px',
                    maxWidth: '100%',
                    margin: '0 auto',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 40px rgba(255, 107, 53, 0.15)'
                  }}
                >
                  <div style={{ height: '100%', width: '100%', position: 'relative' }}>
                    <ClientTestimonialVideo videoId="1152174898" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STAGE 4: ABOUT */}
        <section id="about" data-stage="about" data-snap="true" className="stage">
          <div className="absolute inset-0 z-0 about-overlay" aria-hidden="true"></div>
          <div className="container mx-auto px-4 md:px-12 max-w-5xl relative z-10 py-2 md:py-10 h-full flex flex-col justify-center pb-safe mobile-section-spacing">
            <StoryHeader text="מי עומד מאחורי התהליך" />
            <div className="flex flex-col md:grid md:grid-cols-2 gap-2 md:gap-8 items-center mt-2 md:mt-4 h-full min-h-0 overflow-hidden">
              <div className="space-y-2 text-center md:text-right shrink-0">
                <div className="space-y-1">
                  <p className="text-accent font-bold tracking-[0.2em] uppercase text-xs compact-text">המאמן שלך</p>
                  <h2 className="text-2xl md:text-5xl font-black heading-font leading-tight compact-heading">גילעד דורון</h2>
                </div>
                <p className="text-sm md:text-xl text-gray-300 leading-relaxed compact-text line-clamp-3 md:line-clamp-none">
                  אני לא 'מאמן כושר' שסופר חזרות. אני בונה <strong>מערכות חיים</strong> שמייצרות גוף חזק — ונשארות איתך לתמיד.
                </p>
                <div className="bg-brandGray/20 backdrop-blur-sm p-3 md:p-6 rounded-2xl border border-white/5 space-y-2 md:space-y-4">
                  <h3 className="font-bold flex items-center gap-2 text-white justify-center md:justify-start compact-text"><ShieldCheck className="text-accent" size={16} aria-hidden="true" /> ההבטחה שלי:</h3>
                  <p className="text-xs md:text-sm text-gray-400 compact-text leading-tight">אני לא מוכר הבטחות ריקות. אני מוכר תהליך. אם תעבוד לפי התוכנית ולא תראה תוצאות - אני איתך עד שזה קורה.</p>
                </div>
              </div>
              <div className="relative w-full flex-1 min-h-0 flex items-center justify-center flex-col gap-4 md:gap-6">
                {/* Video container with floating shadow */}
                <div 
                  className="w-full rounded-2xl md:rounded-3xl overflow-hidden relative z-10 border border-white/10" 
                  style={{ 
                    aspectRatio: '9/16', // Match actual video format (portrait)
                    maxHeight: '75dvh', // Increased from 65vh to 75dvh for iOS Safari compatibility and to accommodate Vimeo controls
                    minHeight: '400px',
                    maxWidth: '100%',
                    margin: '0 auto',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 40px rgba(255, 107, 53, 0.15)'
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
            <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-center mt-8 md:mt-12">
              <div className="relative w-full aspect-[3/4] md:aspect-auto md:h-[700px] rounded-3xl overflow-hidden shadow-2xl bg-brandGray/20 backdrop-blur-sm flex items-center justify-center">
                <img 
                  src="/assets/about/whynoprogress.webp" 
                  alt="אדם מרוכז באימון" 
                  className="w-full h-full object-contain" 
                  loading="lazy"
                />
              </div>
              <div className="space-y-6">
                <h2 className="text-2xl md:text-5xl font-black heading-font leading-tight">למה אתה עומד במקום?</h2>
                <div className="space-y-6">
                  <p className="text-xl text-gray-300 leading-relaxed">רוב המתאמנים שמגיעים אלי משקיעים. הם מתאמנים מנסים ומשקיעים זמן ואנרגיה אבל לא רואים תוצאות</p>
                  <p className="text-xl font-bold text-white">זה קורה בדרך כלל בגלל:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[{icon:<Target />, t:"חוסר בהירות"}, {icon:<Zap />, t:"קפיצה בין שיטות"}, {icon:<User />, t:"תהליך לא מתאים"}, {icon:<ShieldCheck />, t:"אין עין מקצועית"}].map((item, idx) => (
                      <div key={idx} className="bg-brandGray/20 backdrop-blur-sm p-5 rounded-2xl flex items-center gap-3">
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

        {/* STAGE 6: GUARANTEE */}
        <section id="guarantee" data-stage="guarantee" data-snap="true" className="stage stage-guarantee">
          <div className="absolute inset-0 z-0 commitment-overlay" aria-hidden="true"></div>
          <div className="guarantee-content-wrapper container mx-auto px-4 md:px-12 max-w-4xl text-center flex flex-col justify-center h-full space-y-3 md:space-y-4 relative z-10">
            <StoryHeader text="לא הבטחות. לא דיבורים. אחריות אמיתית." />
            
            <div className="space-y-2 md:space-y-3">
              <h2 className="text-2xl md:text-5xl lg:text-6xl font-black heading-font leading-tight text-white mb-2">
                <span className="guarantee-part-1">אני לא צריך את הכסף שלך </span>
                <span className="guarantee-part-2"> – <span className="underline-responsibility">אם לא הבאתי לך תוצאות.</span></span>
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
        <section id="get" data-stage="get" data-snap="true" className="stage stage-alt-1">
          <div className="absolute inset-0 z-0 get-overlay" aria-hidden="true"></div>
          <div className="container mx-auto px-4 md:px-12 relative z-10 py-4 md:py-10 h-full flex flex-col justify-center mobile-section-spacing">
            <StoryHeader text="מכאן מתחיל הסדר" />
            <h2 className="text-2xl md:text-5xl font-black heading-font text-center mb-6 md:mb-8">מה אתה מקבל בליווי?</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mt-4" id="get-cards-container">
              {[
                { i: <Dumbbell />, t: "תוכנית אימונים אישית" },
                { i: <Apple />, t: "תזונה מותאמת אישית" },
                { i: <MessageCircle />, t: "ליווי ומענה בוואטסאפ" },
                { i: <BarChart3 />, t: "מעקב והתאמות שבועיות" },
                { i: <Clock />, t: "סדר ובהירות בתהליך" }
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  className={`get-card bg-brandDark/20 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-white/5 flex flex-col items-center text-center gap-4 transition-all hover:-translate-y-2 ${idx === 4 ? 'col-span-2 md:col-span-1' : ''}`}
                  style={{ opacity: 0, transform: 'translateY(20px)' }}
                  data-card-index={idx}
                >
                  <div className="text-accent">{React.cloneElement(item.i as React.ReactElement, { size: 32, "aria-hidden": "true" })}</div>
                  <h3 className="text-sm md:text-lg font-bold leading-tight">{item.t}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STAGE 8: SOLUTION (HOW) */}
        <section id="how" data-stage="how" data-snap="true" className="stage section-with-fitness-bg">
          <div className="absolute inset-0 z-0 process-overlay" aria-hidden="true"></div>
          <div className="container mx-auto px-4 md:px-12 relative z-10 py-0 md:py-10 h-full flex flex-col justify-center pb-safe mobile-section-spacing">
            <StoryHeader text="ככה נראה תהליך שעובד" />
            <h2 className="text-xl md:text-5xl font-black heading-font text-center mb-4 md:mb-10 compact-heading">4 צעדים לתוצאה</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-6 relative mt-2 md:mt-4 min-h-0 mobile-steps-timeline">
              <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent/30 to-transparent" aria-hidden="true"></div>
              {[
                { 
                  s: "01", 
                  t: "בדיקת התאמה", 
                  d: "שיחה קצרה להבין איפה אתה נמצא ולאן אתה רוצה להגיע.",
                  explanation: "בשיחה נבין יחד את המטרות שלך, הרקע שלך באימונים, והציפיות. זה לא תהליך מכירה - זה תהליך התאמה. אם נראה שזה לא בשבילך, אגיד לך את זה בכנות."
                },
                { 
                  s: "02", 
                  t: "אבחון ואסטרטגיה", 
                  d: "איסוף כל הנתונים ובניית אסטרטגיה מותאמת אישית.",
                  explanation: "אני אוסף את כל המידע: רקע רפואי, זמינות, ציוד, העדפות תזונתיות. מזה אני בונה תוכנית שמתאימה בדיוק לחיים שלך - לא תוכנית גנרית שתצטרך להתאים."
                },
                { 
                  s: "03", 
                  t: "ליווי ומעקב", 
                  d: "עבודה שוטפת, וואטסאפ זמין, ובדיקות התקדמות.",
                  explanation: "זה לא 'תוכנית ששולחים לך'. זה ליווי פעיל: מענה מהיר בוואטסאפ, בדיקות שבועיות, התאמות בזמן אמת. אם משהו לא עובד - אנחנו משנים את זה מיד."
                },
                { 
                  s: "04", 
                  t: "תוצאה שלא נעלמת", 
                  d: "אנחנו מוודאים שהגוף נשמר גם אחרי שהתהליך נגמר.",
                  explanation: "המטרה היא לא רק להגיע לתוצאה - אלא לשמור עליה. אני מלמד אותך את העקרונות, בונה הרגלים, ומוודא שאתה יודע איך להמשיך לבד גם אחרי שהליווי נגמר."
                }
              ].map((item, idx) => {
                const isExpanded = expandedStepIndex === idx;
                
                return (
                  <div key={idx} className="mobile-step-wrapper relative">
                    {/* Vertical connector line - only on mobile */}
                    <div className="mobile-timeline-connector" aria-hidden="true"></div>
                    
                    {/* Step content */}
                    <div className="relative z-10 flex flex-row md:flex-col items-start md:items-center text-right md:text-center group bg-transparent p-3 rounded-xl md:border-none">
                      {/* Step number - more dominant on mobile */}
                      <div className="mobile-step-number w-16 h-16 md:w-20 md:h-20 bg-brandGray/30 backdrop-blur-sm border-2 md:border-4 border-brandDark rounded-full flex items-center justify-center text-accent text-xl md:text-2xl font-black mb-0 md:mb-6 mr-4 md:mr-0 group-hover:bg-accent group-hover:text-white transition-all shrink-0" aria-hidden="true">
                        {item.s}
                      </div>
                      
                      {/* Step content */}
                      <div className="flex-1 md:flex-none">
                        <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-3 compact-text">{item.t}</h3>
                        <p className="text-gray-400 text-xs md:text-sm leading-relaxed px-1 md:px-2 compact-text line-clamp-3 md:line-clamp-none">{item.d}</p>
                        
                        {/* Desktop: Click to expand */}
                        <button
                          onClick={() => toggleStep(idx)}
                          className="hidden md:flex justify-center w-fit mx-auto mt-3 text-accent hover:text-accent/80 transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded px-2 py-1"
                          aria-expanded={isExpanded}
                          aria-label={isExpanded ? 'סגור הסבר' : 'קרא עוד על שלב זה'}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              toggleStep(idx);
                            }
                          }}
                        >
                          <ChevronDown className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} size={14} aria-hidden="true" />
                        </button>
                        
                        {/* Mobile: Tap to expand accordion - centered with text content */}
                        <div className="md:hidden flex justify-center mt-3 px-1">
                          <button
                            onClick={() => toggleStep(idx)}
                            className="flex justify-center w-fit text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent rounded px-2 py-1"
                            aria-expanded={isExpanded}
                            aria-label={isExpanded ? 'סגור הסבר' : 'קרא עוד על שלב זה'}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                toggleStep(idx);
                              }
                            }}
                          >
                            <ChevronDown className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} size={16} aria-hidden="true" />
                          </button>
                        </div>
                        
                        {/* Expanded explanation */}
                        {isExpanded && (
                          <div className="mt-3 text-gray-300 text-xs md:text-sm leading-relaxed px-2 animate-in fade-in slide-in-from-top-2 duration-300">
                            <p>{item.explanation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* STAGE 9: WAITING COST */}
        <section id="waiting" data-stage="waiting" data-snap="true" className="stage stage-alt-2 text-center">
          <div className="absolute inset-0 z-0 waiting-overlay" aria-hidden="true"></div>
          <div className="container mx-auto px-4 relative z-10 max-w-4xl">
            <StoryHeader text="זה הרגע שרוב האנשים עוצרים" />
            <h2 className="text-4xl md:text-6xl font-black heading-font mb-4">המחיר של להמשיך לחכות?</h2>
            <div className="text-5xl md:text-7xl font-black text-accent mb-12 block animate-pulse">הוא גבוה מדי</div>
            <div className="space-y-6 text-xl md:text-2xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
              <p>כל חודש שעובר בלי תוכנית ברורה זה עוד חודש שאתה משקיע — ולא מתקדם.</p>
              <div className="py-4 font-bold text-white uppercase tracking-[0.2em] space-y-2">
                <div>עוד אימונים.</div>
                <div>עוד ניסיונות.</div>
            </div>
              <p className="text-white font-medium">לא כי אתה לא רוצה מספיק. אלא כי בלי דרך נכונה — רוב האנשים פשוט נתקעים.</p>
                  </div>
            <div className="flex justify-center mt-6 md:mt-8 mb-4">
              <a
                href="#action"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full text-lg font-bold transition-all hover:scale-105"
              >
                בוא נבדוק אם זה מתאים לך
              </a>
                  </div>
                  </div>
        </section>

        {/* STAGE 10: FAQ */}
        <section id="faq" data-stage="faq" data-snap="true" className="stage stage-alt-1">
          <div className="absolute inset-0 z-0 faq-overlay" aria-hidden="true"></div>
          <div className="container mx-auto px-4 md:px-12 relative z-10 py-6 md:py-10 h-full flex flex-col">
            <StoryHeader text="יש לך שאלות? יש לנו תשובות" />
            
            <div className="text-center mb-4 md:mb-6">
              <h2 className="text-2xl md:text-5xl font-black heading-font leading-tight mb-4">שאלות נפוצות</h2>
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                כל מה שרצית לדעת על הליווי, התהליך, והתשובות
                  </p>
                </div>

            <div className="max-w-4xl mx-auto space-y-2 md:space-y-4 flex-1 w-full min-h-0">
              {FAQ_ITEMS.map((item, index) => { 
                const isExpanded = expandedFAQIndex === index;
                return (
                  <div
                    key={index}
                    className="bg-brandGray/20 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full flex items-center justify-between p-4 md:p-6 text-right hover:bg-white/5 transition-colors"
                      aria-expanded={isExpanded}
                      aria-controls={`faq-answer-${index}`}
                    >
                      <h3 className="text-lg md:text-xl font-bold text-white pl-4 flex-1 text-right">
                        {item.question}
                      </h3>
                      <ChevronDown
                        className={`text-white flex-shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                        size={24}
                        aria-hidden="true"
                      />
                    </button>
                    <div
                      id={`faq-answer-${index}`}
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="px-4 md:px-6 pb-4 md:pb-6 pt-0 text-gray-300">
                        {typeof item.answer === 'string' ? (
                          <p>{item.answer}</p>
                        ) : (
                          item.answer
                        )}
                </div>
                  </div>
                  </div>
                );
              })}
                </div>
            <div className="flex justify-center mt-4 md:mt-6 mb-4">
              <a
                href="#action"
                className="bg-accent hover:brightness-110 text-white px-8 py-4 rounded-full text-lg font-bold transition-all hover:scale-105 shadow-lg"
              >
                מוכן להתחיל?
              </a>
            </div>
          </div>
        </section>

        {/* STAGE 11: ACTION */}
        <section id="action" data-stage="action" data-snap="true" className="stage stage-alt-1">
          <div className="absolute inset-0 z-0 cta-overlay" aria-hidden="true"></div>
          <div className="container mx-auto px-4 md:px-12 relative z-10 py-4 md:py-6 h-full flex flex-col justify-center">
            <StoryHeader text="הצעד האחרון בדרך שלך" />
            <div className="grid md:grid-cols-2 gap-6 items-center mt-2 md:mt-4">
              <div className="space-y-4 md:space-y-6">
                <h2 className="text-2xl md:text-5xl lg:text-6xl font-black heading-font leading-tight">מוכן <br /> <span className="text-accent underline decoration-accent underline-offset-8">להתחיל?</span></h2>
                <p className="text-lg md:text-xl lg:text-2xl text-gray-300 leading-relaxed">השאר פרטים לבדיקת התאמה קצרה וללא התחייבות. נחזור אליך תוך 24 שעות.</p>
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center gap-3 md:gap-4 text-base md:text-xl">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true"><Phone size={20} className="md:w-6 md:h-6" /></div>
                    <span>שיחה קצרה לתיאום ציפיות</span>
                  </div>
                  <div className="flex items-center gap-3 md:gap-4 text-base md:text-xl">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-[#25D366]/10 text-[#25D366] rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true"><MessageCircle size={20} className="md:w-6 md:h-6" /></div>
                    <span>מענה מהיר בוואטסאפ</span>
                  </div>
                </div>
              </div>
              <div className="mobile-form-container">
                <LeadForm isFooter={true} />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer 
        className="py-12 bg-black/90 border-t border-white/5 text-center text-gray-500 text-sm"
      >
        <div className="container mx-auto px-4">
          <div className="text-xl font-black heading-font text-white mb-6">גילעד <span className="text-accent">דורון</span></div>
          
          <a 
            href="https://www.instagram.com/gilad_doron?igsh=MWx3dmRlNXFzdzd4bQ==" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block text-gray-500 hover:text-accent transition-colors duration-300 mb-6"
            aria-label="Instagram"
          >
            <Instagram size={20} strokeWidth={1.5} />
          </a>

          <p className="mb-4">כל הזכויות שמורות &copy; {new Date().getFullYear()} גילעד דורון | ליווי אונליין</p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-xs md:text-sm">
            <button onClick={() => setModalType('accessibility')} className="hover:text-white hover:underline transition-all whitespace-nowrap">הצהרת נגישות</button>
            <button onClick={() => setModalType('privacy')} className="hover:text-white hover:underline transition-all whitespace-nowrap">מדיניות פרטיות</button>
            <button onClick={() => setModalType('terms')} className="hover:text-white hover:underline transition-all whitespace-nowrap">תקנון שימוש</button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LegalModal type={modalType} onClose={() => setModalType(null)} />
      <ClientStoryModal clientIndex={selectedClientIndex} onClose={closeClientStory} />
      <ExitIntentPopup />
      
      <WhatsAppButton />
      <FloatingCTA />
    </div>
  );
}


