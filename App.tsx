
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
  Play,
  Pause,
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
// Only PUBLIC_KEY is required (no fallback for security). Others have in-code defaults.
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_fphe5xu';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_8p1hgtg';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
if (!EMAILJS_PUBLIC_KEY) {
  console.error('VITE_EMAILJS_PUBLIC_KEY environment variable is required');
}
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
    name: 'אלמוג',
    profession: 'בודק תוכנה',
    age: 26,
    quote: 'תוצאות מדהימות! התהליך היה מקצועי וברור מההתחלה.',
    goals: ['ירידה במשקל', 'עליה במסת שריר', 'שיפור בכושר'],
    duration: 3,
    commitment: 100,
    image: 'result1.webp',
    imageAlt: 'תוצאות לפני ואחרי - אלמוג',
    stats: {
      weight: '-2 ק"ג',
      muscleMass: '+8 ק"ג',
      strength: '+250%'
    }
  },
  {
    name: 'מאור',
    profession: 'סטודנט',
    age: 25,
    quote: 'הליווי של גילעד שינה לי את החיים. תוצאות מעבר למצופה.',
    goals: ['בניית שריר', 'עליה בכוח', 'שיפור בביצועים'],
    duration: 4,
    commitment: 100,
    image: 'result2.webp',
    imageAlt: 'תוצאות לפני ואחרי - מאור',
    stats: {
      weight: '-8 ק"ג',
      muscleMass: '+4 ק"ג',
      strength: '+150%'
    }
  },
  {
    name: 'בניה',
    profession: 'הנדסאי חשמל',
    age: 23,
    quote: 'פעם ראשונה שאני רואה תוצאות אמיתיות. התהליך היה מדויק וברור.',
    goals: ['ירידה במשקל', 'שיפור בכושר', 'בריאות כללית'],
    duration: 5,
    commitment: 100,
    image: 'result3.webp',
    imageAlt: 'תוצאות לפני ואחרי - בניה',
    stats: {
      weight: '+11 ק"ג',
      muscleMass: '+10 ק"ג',
      strength: '+400%'
    }
  },
  {
    name: 'שרון',
    profession: 'משווק',
    age: 25,
    quote: 'הגעתי למטרות שלי מהר מהצפוי. הליווי היה מקצועי ומדויק.',
    goals: ['חיטוב', 'עליה בכוח', 'שיפור בביטחון עצמי'],
    duration: 3,
    commitment: 100,
    image: 'result4.webp',
    imageAlt: 'תוצאות לפני ואחרי - שרון',
    stats: {
      weight: '-6 ק"ג',
      muscleMass: '+2 ק"ג',
      strength: '+100%'
    }
  },
  {
    name: 'אלכס',
    profession: 'מתכנת',
    age: 30,
    quote: 'תהליך מקצועי עם תוצאות מדהימות. המלצה חמה!',
    goals: ['ירידה במשקל', 'שיפור בכושר', 'בריאות כללית'],
    duration: 6,
    commitment: 100,
    image: 'result5.webp',
    imageAlt: 'תוצאות לפני ואחרי - אלכס',
    stats: {
      weight: '-12 ק"ג',
      muscleMass: '+4 ק"ג',
      strength: '+200%'
    }
  },
  {
    name: 'מלי',
    profession: 'מורה ליוגה',
    age: 26,
    quote: 'התוכנית מותאמת אישית והתוצאות מדברות בעד עצמן.',
    goals: ['חיטוב', 'עליה במסת שריר', 'שיפור בכושר'],
    duration: 4,
    commitment: 100,
    image: 'result6.webp',
    imageAlt: 'תוצאות לפני ואחרי - מלי',
    stats: {
      weight: '+6 ק"ג',
      muscleMass: '+5.5 ק"ג',
      strength: '+200%'
    }
  },
  {
    name: 'עומר',
    profession: 'מתכנת',
    age: 32,
    quote: 'תהליך מקצועי עם ליווי צמוד. התוצאות הגיעו מהר מהצפוי.',
    goals: ['בניית שריר', 'עליה בכוח', 'שיפור בביצועים'],
    duration: 5,
    commitment: 100,
    image: 'result7.webp',
    imageAlt: 'תוצאות לפני ואחרי - עומר',
    stats: {
      weight: '-7 ק"ג',
      muscleMass: '+3 ק"ג',
      strength: '+150%'
    }
  },
  {
    name: 'דניאל',
    profession: 'סטודנט',
    age: 26,
    quote: 'הפעם הראשונה שהגעתי למטרות שלי. התהליך היה ברור ומדויק.',
    goals: ['ירידה במשקל', 'עליה במסת שריר', 'שיפור בכושר'],
    duration: 3,
    commitment: 100,
    image: 'result8.webp',
    imageAlt: 'תוצאות לפני ואחרי - דניאל',
    stats: {
      weight: '-4 ק"ג',
      muscleMass: '+2 ק"ג',
      strength: '+80%'
    }
  },
  {
    name: 'בן',
    profession: 'שירות לאומי',
    age: 20,
    quote: 'תהליך מקצועי עם תוצאות ברורות. הליווי התאים בדיוק ללוח הזמנים שלי.',
    goals: ['בניית שריר', 'שיפור בכושר', 'הרגלי תזונה'],
    duration: 4,
    commitment: 100,
    image: 'result9.webp',
    imageAlt: 'תוצאות לפני ואחרי - בן',
    stats: {
      weight: '-6 ק"ג',
      muscleMass: '+4 ק"ג',
      strength: '+250%'
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
        <p>כן. אם יישמת את התוכנית ולא הגעת למה שסיכמנו – אני ממשיך ללוות אותך בחינם עד שזה קורה, או שאתה מקבל החזר כספי מלא.</p>
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
        <p>האתר נבנה במטרה לעמוד בהנחיות WCAG 2.1 ברמה AA ככל הניתן. אנו ממשיכים לעבוד על שיפור הנגישות של האתר ומבצעים בדיקות נגישות שוטפות.</p>
        <p><strong>מה אנחנו עושים כדי להבטיח נגישות:</strong></p>
        <ul className="list-disc pr-6 space-y-2">
          <li>ניווט מלא באמצעות המקלדת – כל הפונקציות נגישות ללא עכבר</li>
          <li>היררכיית כותרות ברורה ותקינה – מבנה לוגי של התוכן</li>
          <li>טקסטים חלופיים (Alt-text) לתמונות משמעותיות – תמיכה בקוראי מסך</li>
          <li>ניגודיות צבעים המותאמת לקריאה נוחה – עמידה בתקני WCAG AA</li>
          <li>תמיכה במצב העדפת תנועה מופחתת (Reduced Motion) – כיבוד העדפות המשתמש</li>
          <li>תמיכה בעברית RTL – ממשק מותאם לקריאה מימין לשמאל</li>
          <li>מצבי מיקוד נראים – אינדיקטורים ברורים לניווט במקלדת</li>
        </ul>
        <p>האתר עבר בדיקת נגישות ראשונית בינואר 2026. אנו ממשיכים לשפר את הנגישות באמצעות בדיקות שוטפות ומשוב מהמשתמשים.</p>
        <p className="text-sm text-gray-400">אם נתקלתם בבעיית נגישות או אם יש לכם הצעות לשיפור, נשמח לשמוע מכם.</p>
        <div className="pt-4 border-t border-white/10">
          <p className="font-bold text-white mb-2">נתקלתם בבעיה? נשמח לעזור:</p>
          <p>רכז/ת נגישות: גילעד דורון</p>
          <p>טלפון: 052-8765992</p>
          <p>אימייל: gilad042@gmail.com</p>
          <p className="text-sm mt-2 text-gray-400">אנא צרו קשר ונשתדל לפתור את הבעיה בהקדם האפשרי.</p>
        </div>
      </div>
    )
  },
  privacy: {
    title: 'מדיניות פרטיות',
    content: (
      <div className="space-y-4 text-gray-300">
        <p className="font-bold text-white text-lg">1. מבוא</p>
        <p>הפרטיות שלך חשובה לנו מאוד. מדיניות פרטיות זו מסבירה איזה מידע אנו אוספים, כיצד אנו משתמשים בו, עם מי אנו חולקים אותו, ומה הן הזכויות שלך ביחס למידע זה.</p>
        <p>על ידי שימוש באתר זה והגשת טופס יצירת קשר, אתה מסכים לאיסוף ושימוש במידע בהתאם למדיניות זו.</p>

        <p className="font-bold text-white text-lg mt-6">2. איזה מידע אנו אוספים</p>
        <p>אנו אוספים את המידע הבא באמצעות טופס יצירת קשר:</p>
        <ul className="list-disc pr-6 space-y-2">
          <li><strong>שם מלא</strong> – לצורך יצירת קשר אישי</li>
          <li><strong>מספר טלפון</strong> – לצורך יצירת קשר</li>
          <li><strong>כתובת אימייל</strong> – לצורך יצירת קשר ותקשורת</li>
          <li><strong>העדפת התקשרות</strong> – דרך העדפתך ליצירת קשר (טלפון או וואטסאפ)</li>
        </ul>
        <p>אנו גם אוספים מידע טכני מסוים באופן אוטומטי כאשר אתה מבקר באתר:</p>
        <ul className="list-disc pr-6 space-y-2">
          <li>כתובת IP</li>
          <li>סוג דפדפן ומכשיר</li>
          <li>דפים שביקרת בהם באתר</li>
          <li>זמן ומשך הביקור</li>
        </ul>

        <p className="font-bold text-white text-lg mt-6">3. בסיס חוקי לאיסוף המידע</p>
        <p>אנו אוספים את המידע שלך על בסיס הסכמתך המפורשת. על ידי סימון תיבת ההסכמה בטופס, אתה מסכים לאיסוף ושימוש במידע שלך בהתאם למדיניות פרטיות זו.</p>

        <p className="font-bold text-white text-lg mt-6">4. מטרת איסוף המידע</p>
        <p>אנו משתמשים במידע שלך למטרות הבאות בלבד:</p>
        <ul className="list-disc pr-6 space-y-2">
          <li>יצירת קשר ראשוני ובדיקת התאמה לליווי</li>
          <li>מתן השירות המקצועי שסוכם עליו (תוכנית אימונים ותזונה מותאמת אישית)</li>
          <li>תקשורת שוטפת במהלך תקופת הליווי</li>
          <li>שיפור חוויית השימוש באתר</li>
          <li>עמידה בחובות משפטיות (אם נדרש)</li>
        </ul>

        <p className="font-bold text-white text-lg mt-6">5. שיתוף מידע עם צדדים שלישיים</p>
        <p>אנו <strong>לא מוכרים ולא משכירים</strong> את המידע האישי שלך לצדדים שלישיים למטרות שיווק או פרסום.</p>
        <p>אנו משתפים מידע עם ספקי שירותים צד שלישי הבאים, הנדרשים לפעילות האתר והשירותים:</p>
        <ul className="list-disc pr-6 space-y-2">
          <li><strong>EmailJS</strong> – משמש לשליחת הודעות אימייל. המידע מועבר דרך שרתי EmailJS לכתובת האימייל שלנו. קרא את <a href="https://www.emailjs.com/legal/privacy-policy/" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent">מדיניות הפרטיות של EmailJS</a>.</li>
          <li><strong>Vimeo</strong> – וידאו מוטמע באתר דרך Vimeo. Vimeo עשויה להשתמש בעוגיות וכלי מעקב למטרות אנליטיקה ושיפור השירות. קרא את <a href="https://vimeo.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent">מדיניות הפרטיות של Vimeo</a>.</li>
          <li><strong>Google Fonts</strong> – גופנים נטענים דרך Google Fonts. Google עשויה לאסוף מידע על גישה לאתר (כתובת IP, סוג דפדפן). קרא את <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent">מדיניות הפרטיות של Google</a>.</li>
        </ul>
        <p>ספקי שירותים אלה מחויבים להגן על המידע שלך ולהשתמש בו רק למטרות שנמסרו להם.</p>

        <p className="font-bold text-white text-lg mt-6">6. עוגיות ואחסון בדפדפן</p>
        <p>האתר משתמש ב:</p>
        <ul className="list-disc pr-6 space-y-2">
          <li><strong>localStorage</strong> – לאחסון העדפות משתמש (למשל, האם הרחבת צעד בהדרכה). מידע זה אינו מידע אישי מזוהה.</li>
          <li><strong>sessionStorage</strong> – לאחסון מידע זמני במהלך הפעלת הדפדפן (למשל, האם הוצג חלון קופץ). מידע זה נמחק כאשר סוגרים את הדפדפן.</li>
        </ul>
        <p>צדדים שלישיים (Vimeo, Google Fonts) עשויים להשתמש בעוגיות למטרות אנליטיקה. איננו שולטים בעוגיות אלה. אתה יכול לנהל עוגיות בהגדרות הדפדפן שלך.</p>

        <p className="font-bold text-white text-lg mt-6">7. תקופת שמירת המידע</p>
        <p>אנו שומרים את המידע שלך למשך הזמן הנדרש למטרות שפורטו במדיניות זו:</p>
        <ul className="list-disc pr-6 space-y-2">
          <li><strong>מידע מטפס יצירת קשר:</strong> נשמר עד לביטול ההסכמה שלך או עד שנתיים של חוסר פעילות, לפי המוקדם מביניהם.</li>
          <li><strong>מידע מתקופת הליווי:</strong> נשמר למשך תקופת הליווי ועד שנתיים לאחר סיום הליווי, למטרות מעקב ותמיכה.</li>
        </ul>
        <p>בסיום תקופת השמירה, המידע יימחק או יעבור אנונימיזציה באופן בטוח.</p>

        <p className="font-bold text-white text-lg mt-6">8. אבטחת המידע</p>
        <p>אנו נוקטים באמצעי אבטחה סבירים כדי להגן על המידע שלך:</p>
        <ul className="list-disc pr-6 space-y-2">
          <li>העברת מידע מוצפנת באמצעות HTTPS</li>
          <li>שימוש בשירותי צד שלישי מאובטחים (EmailJS) עם תקני אבטחה תעשייתיים</li>
          <li>גישה מוגבלת למידע – רק לאנשים הזקוקים לו למתן השירות</li>
        </ul>
        <p>למרות מאמצינו להגן על המידע, אין אמצעי אבטחה מושלמים. אנו לא יכולים להבטיח אבטחה מוחלטת של המידע במעבר באינטרנט.</p>

        <p className="font-bold text-white text-lg mt-6">9. הזכויות שלך</p>
        <p>לפי חוק הגנת הפרטיות הישראלי ו-GDPR (אם ישים), יש לך הזכויות הבאות:</p>
        <ul className="list-disc pr-6 space-y-2">
          <li><strong>זכות גישה</strong> – אתה רשאי לבקש לקבל עותק של המידע האישי שאנו מחזיקים עליך</li>
          <li><strong>זכות תיקון</strong> – אתה רשאי לבקש לתקן מידע לא מדויק או לא מעודכן</li>
          <li><strong>זכות מחיקה</strong> – אתה רשאי לבקש למחוק את המידע שלך ("הזכות להישכח")</li>
          <li><strong>זכות התנגדות</strong> – אתה רשאי להתנגד לעיבוד המידע שלך למטרות מסוימות</li>
          <li><strong>זכות הגבלה</strong> – אתה רשאי לבקש להגביל את עיבוד המידע שלך</li>
          <li><strong>זכות ניידות נתונים</strong> – אתה רשאי לקבל את המידע שלך בפורמט מובנה ולהעבירו לספק אחר</li>
          <li><strong>זכות ביטול הסכמה</strong> – אתה רשאי לבטל את הסכמתך בכל עת</li>
        </ul>
        <p>למימוש הזכויות שלך, פנה אלינו בכתובת gilad042@gmail.com. נשתדל לענות לבקשה שלך תוך 30 יום.</p>

        <p className="font-bold text-white text-lg mt-6">10. שינויים במדיניות פרטיות</p>
        <p>אנו רשאים לעדכן מדיניות פרטיות זו מעת לעת. שינויים משמעותיים יפורסמו באתר זה, ונציין את תאריך העדכון. המשך השימוש באתר לאחר שינוי במדיניות מהווה הסכמה לעדכון.</p>

        <p className="font-bold text-white text-lg mt-6">11. יצירת קשר</p>
        <p>לכל שאלה, בקשה או תלונה הקשורה לפרטיות, ניתן לפנות אלינו:</p>
        <ul className="list-disc pr-6 space-y-2">
          <li>אימייל: gilad042@gmail.com</li>
          <li>טלפון: 052-8765992</li>
        </ul>
        <p className="text-sm text-gray-400 mt-4">תאריך עדכון אחרון: ינואר 2026</p>
      </div>
    )
  },
  terms: {
    title: 'תקנון שימוש',
    content: (
      <div className="space-y-4 text-gray-300">
        <p className="font-bold text-white text-lg">1. הסכמה לתנאים</p>
        <p>על ידי גישה לשימוש באתר זה ובשירותי הליווי של גילעד דורון, אתה מסכים לתנאי השימוש המפורטים להלן. אם אינך מסכים לתנאים אלה, אנא אל תשתמש באתר או בשירותים.</p>

        <p className="font-bold text-white text-lg mt-6">2. תיאור השירות</p>
        <p>גילעד דורון מספק שירותי ליווי אונליין לאימונים ותזונה בהתאמה אישית. השירות כולל:</p>
        <ul className="list-disc pr-6 space-y-2">
          <li>תוכנית אימונים ותזונה מותאמת אישית</li>
          <li>מעקב וליווי שוטף (באמצעות וואטסאפ או טלפון)</li>
          <li>בדיקות התקדמות והתאמות תקופתיות</li>
          <li>תמיכה ועזרה במהלך תקופת הליווי</li>
        </ul>
        <p>השירות מסופק באופן מקוון בלבד ואינו דורש פגישות פיזיות. המחיר והתנאים מותאמים אישית למטרות ולתוכנית שנבנית עבור כל לקוח.</p>

        <p className="font-bold text-white text-lg mt-6">3. הגבלת גיל</p>
        <p>השירות מיועד לבני 18 ומעלה בלבד. על ידי שימוש באתר, אתה מאשר כי אתה בן 18 לפחות או שיש לך אישור הורה/אפוטרופוס אם אתה קטין.</p>

        <p className="font-bold text-white text-lg mt-6">4. אין ייעוץ רפואי או טיפול</p>
        <p><strong>חשוב ביותר:</strong> השירותים שמספק גילעד דורון אינם מהווים ייעוץ רפואי, אבחון רפואי, או טיפול רפואי מכל סוג שהוא.</p>
        <ul className="list-disc pr-6 space-y-2">
          <li>האתר והשירותים לא מהווים תחליף לייעוץ רפואי, פסיכולוגי, או טיפול מקצועי אחר</li>
          <li>המידע באתר ובליווי אינו מהווה המלצה רפואית או פרוטוקול טיפול</li>
          <li>יש להיוועץ ברופא מוסמך או אנשי מקצוע רפואיים לפני תחילת כל פעילות גופנית או שינוי תזונתי</li>
          <li>חובה לעבור בדיקה רפואית ולהתייעץ עם רופא לפני תחילת כל תוכנית אימונים, במיוחד אם יש לך בעיות רפואיות, פציעות, או מצבים רפואיים קיימים</li>
        </ul>
        <p>אם אתה סובל מכל בעיה רפואית, פציעה, או מצב רפואי, יש לקבל אישור רפואי לפני שימוש בשירותים.</p>

        <p className="font-bold text-white text-lg mt-6">5. אחריות המשתמש</p>
        <p>אתה לוקח אחריות מלאה על:</p>
        <ul className="list-disc pr-6 space-y-2">
          <li>קבלת אישור רפואי לפני תחילת תוכנית אימונים או שינוי תזונתי</li>
          <li>דיווח מדויק על מצבך הבריאותי, פציעות קודמות, ומגבלות פיזיות</li>
          <li>יישום התוכנית בהתאם להוראות ולטווח היכולות והמגבלות שלך</li>
          <li>הפסקת פעילות מיד אם אתה חווה כאב, סחרחורת, קוצר נשימה, או כל תסמין לא תקין</li>
          <li>שימוש בהגיון בריא ושיפוט מקצועי במהלך האימונים</li>
        </ul>
        <p>השימוש באתר ובשירותים הוא על <strong>אחריותך הבלעדית</strong>.</p>

        <p className="font-bold text-white text-lg mt-6">6. אין אחריות לתוצאות</p>
        <p>תוצאות האימונים והשינויים התזונתיים <strong>משתנות מאדם לאדם</strong> ותלויות בגורמים רבים, כולל אך לא רק:</p>
        <ul className="list-disc pr-6 space-y-2">
          <li>מידת היישום וההתמדה בתוכנית</li>
          <li>מצב בריאותי בסיסי וגנטיקה</li>
          <li>גיל, מין, ומטבוליזם</li>
          <li>אורח חיים כולל (שינה, לחץ, פעילות יומית)</li>
          <li>עמידה בהנחיות ושינויים נדרשים</li>
        </ul>
        <p>אנו <strong>לא מבטיחים ולא מתחייבים</strong> לתוצאות ספציפיות, ירידה במשקל, עליה במסת שריר, או כל תוצאה אחרת. תוצאות העבר של לקוחות אחרים אינן מבטיחות תוצאות דומות עבורך.</p>
        <p>תצוגת תוצאות (תמונות לפני/אחרי, הצהרות לקוחות) נועדה למטרות דוגמה בלבד ומייצגת תוצאות אמיתיות של לקוחות שהסכימו לשתף את סיפורם. תוצאות אלה אינן אופייניות ואינן מבטיחות תוצאות דומות.</p>

        <p className="font-bold text-white text-lg mt-6">7. הגבלת אחריות</p>
        <p>במידה המרבית המותרת בחוק:</p>
        <ul className="list-disc pr-6 space-y-2">
          <li>גילעד דורון, האתר, והשירותים מסופקים "כפי שהם" ללא כל הבטחות, הבטחות, או אחריות מכל סוג שהוא</li>
          <li>אנו לא נושאים באחריות לנזק ישיר, עקיף, מקרי, תוצאתי, או מיוחד הנובע משימוש או אי יכולת להשתמש באתר או בשירותים</li>
          <li>אנו לא נושאים באחריות לנזקי גוף, פציעות, או בעיות בריאותיות הנובעות משימוש בשירותים</li>
          <li>אחריותנו מוגבלת לסכום התשלום ששולם עבור השירות (אם ישים)</li>
        </ul>
        <p>למרות האמור לעיל, לא נגביל או נשלול אחריות במקרים בהם אי אפשר להגביל או לשלול אחריות לפי חוק.</p>

        <p className="font-bold text-white text-lg mt-6">8. תשלום והחזר כספי</p>
        <p>המחיר והתנאים מותאמים אישית לכל לקוח ונקבעים לאחר שיחת התאמה. התשלום יכול להיות חד פעמי או במסגרת תכנית תשלום, לפי הסכם שנעשה בינך לבין גילעד דורון.</p>
        <p><strong>החזר כספי:</strong> לפי מדיניות העסק, אם יישמת את התוכנית במלואה ולא הגעת למטרות שנקבעו, אתה זכאי להמשך ליווי בחינם עד להשגת המטרות או להחזר כספי מלא, לפי בחירתך. החזר כספי יחושב על בסיס הזמן שנותר מתקופת הליווי.</p>
        <p>בקשות להחזר כספי יש לשלוח בכתב לכתובת gilad042@gmail.com. ההחזר יבוצע באמצעי התשלום המקורי תוך 14 ימי עסקים.</p>

        <p className="font-bold text-white text-lg mt-6">9. ביטול וסיום שירות</p>
        <p>אתה רשאי לבטל את השירות בכל עת באמצעות הודעה בכתב לכתובת gilad042@gmail.com. ביטול יעמוד בתנאי מדיניות ההחזר המפורטת לעיל.</p>
        <p>גילעד דורון רשאי לסיים או להשעות את השירות במקרים הבאים:</p>
        <ul className="list-disc pr-6 space-y-2">
          <li>הפרת תנאי השימוש</li>
          <li>שימוש לא הולם או התנהגות לא מכבדת</li>
          <li>אי תשלום או הפרת תנאי תשלום</li>
          <li>מצב רפואי המצריך הפסקת השירות (לפי המלצה רפואית)</li>
        </ul>

        <p className="font-bold text-white text-lg mt-6">10. קניין רוחני</p>
        <p>כל התכנים, התוכניות, העיצובים, הלוגו, והחומרים באתר שייכים בלעדית לגילעד דורון או לבעלי הזכויות שלו ומוגנים בזכויות יוצרים ובחוקי הקניין הרוחני.</p>
        <p>אין להעתיק, לשכפל, להפיץ, או להשתמש בכל חומר מהאתר או מהשירותים ללא אישור מפורש בכתב.</p>
        <p>תוכניות האימונים והתזונה הן רכוש פרטי ומוגנות בזכויות יוצרים. אסור לשתף, להפיץ, או למכור את התוכניות לאחרים.</p>

        <p className="font-bold text-white text-lg mt-6">11. קישורים לאתרים אחרים</p>
        <p>האתר עשוי לכלול קישורים לאתרים של צדדים שלישיים (כמו וואטסאפ, אינסטגרם). איננו שולטים בתוכן של אתרים אלה ולא נושאים באחריות להם. שימוש בקישורים אלה הוא על אחריותך.</p>

        <p className="font-bold text-white text-lg mt-6">12. שינויים בתנאים</p>
        <p>אנו רשאים לעדכן תנאי שימוש אלה מעת לעת. שינויים משמעותיים יפורסמו באתר, ונציין את תאריך העדכון. המשך השימוש באתר לאחר שינוי בתנאים מהווה הסכמה לעדכון.</p>

        <p className="font-bold text-white text-lg mt-6">13. דין שיפוט ומקום השיפוט</p>
        <p>תנאי שימוש אלה כפופים לחוקי מדינת ישראל. כל מחלוקת הנובעת מתנאים אלה או הקשורה בהם תידון בבתי המשפט המוסמכים בישראל בלבד.</p>

        <p className="font-bold text-white text-lg mt-6">14. יצירת קשר</p>
        <p>לכל שאלה או בקשה הקשורה לתנאי השימוש, ניתן לפנות אלינו:</p>
        <ul className="list-disc pr-6 space-y-2">
          <li>אימייל: gilad042@gmail.com</li>
          <li>טלפון: 052-8765992</li>
        </ul>

        <p className="text-sm text-gray-400 mt-4">תאריך עדכון אחרון: ינואר 2026</p>
      </div>
    )
  }
};

// --- Modal Component ---

const LegalModal: React.FC<{ type: ModalType; onClose: () => void; returnFocusRef?: React.RefObject<HTMLElement | null> }> = ({ type, onClose, returnFocusRef }) => {
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
      <button
        className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-default focus:outline-none focus:ring-2 focus:ring-accent focus:ring-inset"
        onClick={onClose}
        aria-label="סגור חלון"
        tabIndex={-1}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            onClose();
          }
        }}
      />
      <FocusTrap
        focusTrapOptions={{
          returnFocusOnDeactivate: true,
          returnFocus: () => (returnFocusRef?.current ?? false) as HTMLElement,
        }}
      >
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
const ClientStoryModal: React.FC<{ clientIndex: number | null; onClose: () => void; returnFocusRef?: React.RefObject<HTMLElement | null> }> = ({ clientIndex, onClose, returnFocusRef }) => {
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
      <button
        className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-default focus:outline-none focus:ring-2 focus:ring-accent focus:ring-inset"
        onClick={onClose}
        aria-label="סגור חלון"
        tabIndex={-1}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            onClose();
          }
        }}
      />
      <FocusTrap
        focusTrapOptions={{
          returnFocusOnDeactivate: true,
          returnFocus: () => (returnFocusRef?.current ?? false) as HTMLElement,
        }}
      >
        <div className="bg-brandGray/60 backdrop-blur-md border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 p-6 md:p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
          <div className="flex justify-between items-center mb-6 sticky top-0 bg-brandGray/50 backdrop-blur-md py-2">
            <div>
              <h2 id="client-story-title" className="text-2xl font-bold heading-font text-white mb-1">{client.name}</h2>
              <p className="text-gray-400 text-sm">{client.profession}, {client.age}</p>
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
    <div className="mobile-progress-container" role="progressbar" aria-label="התקדמות בדף" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
      <div className="mobile-progress-fill" style={{ width: `${progress}%` }} />
    </div>
  );
};

const StoryHeader: React.FC<{ text: string }> = ({ text }) => (
  <div className="text-center mb-6 mt-3 flex flex-col items-center gap-y-3">
    <span className="story-header-text text-gray-400 text-sm md:text-lg lg:text-xl font-medium tracking-wide">
      {text}
    </span>
    <div className="w-16 h-0.5 bg-accent" aria-hidden="true" />
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
      className="fixed bottom-6 right-6 md:right-auto md:left-6 z-40 bg-[#25D366] text-white p-3 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 group flex items-center gap-2 max-w-fit md:max-w-none opacity-95 hover:opacity-100"
      aria-label="צור קשר בוואטסאפ"
      style={isMobile ? {
        bottom: '1.5rem',
        right: '1.5rem'
      } : undefined}
    >
      <span className="hidden group-hover:block font-bold pr-2 whitespace-nowrap">דברו איתי בוואטסאפ</span>
      <MessageCircle size={28} aria-hidden="true" />
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

        // Show after scrolling 50% of page height OR 300px (whichever is smaller), hide before action section
        const pageHeight = document.documentElement.scrollHeight;
        const scrollThreshold = Math.min(pageHeight * 0.5, 300);

        if (scrollY >= scrollThreshold && !newHasReachedAction) {
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
  const returnFocusRef = useRef<HTMLElement | null>(null);

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
        returnFocusRef.current = document.activeElement as HTMLElement | null;
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="exit-intent-title" aria-describedby="exit-intent-description">
      <button
        className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-default focus:outline-none focus:ring-2 focus:ring-accent focus:ring-inset"
        onClick={handleClose}
        aria-label="סגור חלון"
        tabIndex={-1}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            handleClose();
          }
        }}
      />
      <FocusTrap
        focusTrapOptions={{
          returnFocusOnDeactivate: true,
          returnFocus: () => (returnFocusRef.current ?? false) as HTMLElement,
        }}
      >
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
            <p id="exit-intent-description" className="text-gray-300 text-lg">
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
    <div className="flex items-center gap-3 shrink-0">
      <div className="text-lg md:text-2xl font-black heading-font tracking-tighter text-white">
        גילעד <span className="text-accent">דורון</span>
      </div>
      <a
        href="https://www.instagram.com/gilad_doron?igsh=MWx3dmRlNXFzdzd4bQ=="
        target="_blank"
        rel="noopener noreferrer"
        className="text-white hover:text-accent transition-colors duration-300 flex items-center mt-0.5"
        aria-label="Instagram של גילעד דורון"
      >
        <Instagram size={20} strokeWidth={1.5} />
      </a>
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

const LeadForm: React.FC<{ isFooter?: boolean; onPrivacyClick?: () => void }> = ({ isFooter = false, onPrivacyClick }) => {
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

      // Check if EmailJS public key is configured
      if (!EMAILJS_PUBLIC_KEY) {
        throw new Error('תצורת EmailJS חסרה. אנא פנה לתמיכה.');
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
          <h3 className={`text-xl md:text-2xl font-bold mb-8 text-center ${isFooter ? 'text-white' : 'text-brandDark'}`}>השאר פרטים לבדיקת התאמה לליווי</h3>
          {error && (
            <div id="form-error" className={`mb-4 p-4 rounded-lg border ${isFooter ? 'bg-red-900/20 border-red-500/30' : 'bg-red-50 border-red-200'}`} role="alert" aria-live="assertive">
              <div className={`flex items-center gap-2 ${isFooter ? 'text-red-300' : 'text-red-800'}`}>
                <XCircle size={20} aria-hidden="true" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            <div>
              <label htmlFor="fullName" className={`block text-[10px] md:text-xs font-medium mb-1.5 md:mb-2 ${isFooter ? 'text-gray-300' : 'text-gray-700'}`}>שם מלא</label>
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
                className={`w-full px-3 py-2.5 md:px-4 md:py-3 rounded-lg border text-sm md:text-base focus:ring-2 focus:ring-accent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isFooter ? 'bg-white/5 border-white/10 text-white/90 placeholder:text-white/40' : 'bg-gray-50 border-gray-200 text-brandDark'}`}
                placeholder="הזן שם מלא"
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="phone" className={`block text-[10px] md:text-xs font-medium mb-1.5 md:mb-2 ${isFooter ? 'text-gray-300' : 'text-gray-700'}`}>טלפון</label>
              <input
                id="phone"
                name="tel"
                type="tel"
                dir="rtl"
                required
                aria-required="true"
                autoComplete="tel"
                disabled={isSubmitting}
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? "form-error" : undefined}
                className={`w-full px-3 py-2.5 md:px-4 md:py-3 rounded-lg border text-sm md:text-base focus:ring-2 focus:ring-accent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isFooter ? 'bg-white/5 border-white/10 text-white/90 placeholder:text-white/40' : 'bg-gray-50 border-gray-200 text-brandDark'}`}
                placeholder="הזן טלפון נייד"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="email" className={`block text-[10px] md:text-xs font-medium mb-1.5 md:mb-2 ${isFooter ? 'text-gray-300' : 'text-gray-700'}`}>אימייל</label>
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
                className={`w-full px-3 py-2.5 md:px-4 md:py-3 rounded-lg border text-sm md:text-base focus:ring-2 focus:ring-accent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isFooter ? 'bg-white/5 border-white/10 text-white/90 placeholder:text-white/40' : 'bg-gray-50 border-gray-200 text-brandDark'}`}
                placeholder="הזן כתובת מייל"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <fieldset className="flex gap-4 py-1">
              <legend className="sr-only">העדפת התקשרות</legend>
              <label htmlFor="contactPref-phone" className={`flex items-center gap-2 cursor-pointer ${isFooter ? 'text-white/80' : 'text-brandDark'} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <input
                  id="contactPref-phone"
                  type="radio"
                  name="contactPref"
                  className="accent-accent"
                  disabled={isSubmitting}
                  checked={formData.contactPref === 'phone'}
                  onChange={() => setFormData({ ...formData, contactPref: 'phone' })}
                />
                <span className="text-sm">טלפון</span>
              </label>
              <label htmlFor="contactPref-whatsapp" className={`flex items-center gap-2 cursor-pointer ${isFooter ? 'text-white/80' : 'text-brandDark'} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <input
                  id="contactPref-whatsapp"
                  type="radio"
                  name="contactPref"
                  className="accent-accent"
                  disabled={isSubmitting}
                  checked={formData.contactPref === 'whatsapp'}
                  onChange={() => setFormData({ ...formData, contactPref: 'whatsapp' })}
                />
                <span className="text-sm">וואטסאפ</span>
              </label>
            </fieldset>
            <div className="flex items-start gap-2 pt-1">
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
                onChange={e => setFormData({ ...formData, consent: e.target.checked })}
              />
              <label htmlFor="consent" className={`text-xs opacity-60 cursor-pointer ${isFooter ? 'text-gray-300' : 'text-gray-700'} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                אני מאשר/ת יצירת קשר בהתאם ל{' '}
                {onPrivacyClick ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      onPrivacyClick();
                    }}
                    className="underline hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 rounded"
                    aria-label="קרא מדיניות פרטיות"
                  >
                    מדיניות פרטיות
                  </button>
                ) : (
                  <span className="underline">מדיניות פרטיות</span>
                )}
              </label>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-accent text-white py-4 md:py-5 rounded-xl font-bold text-lg hover:brightness-110 shadow-lg shadow-accent/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2 mt-2"
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
  const [isMuted, setIsMuted] = useState(isIOS()); // On iOS, default muted so button matches actual state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false); // Track scroll state to prevent accidental interactions
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<any>(null);
  const hasInitializedRef = useRef(false);
  const volumeChangeHandlerRef = useRef<(() => Promise<void>) | null>(null);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isVisibleRef = useRef(false); // Track visibility in ref to avoid stale closures
  const playTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayingRef = useRef(false); // Track if we've started playing to prevent rapid toggles
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Track scroll end timeout

  useEffect(() => {
    setIsIOSDevice(isIOS());
  }, []);

  // Sync refs when state changes
  useEffect(() => {
    isVisibleRef.current = isVisible;
  }, [isVisible]);

  // Vimeo URL with controls enabled for interactivity (controls=1 to make video clickable, we use custom button for mute)
  const vimeoUrl = `https://player.vimeo.com/video/${videoId}?autoplay=0&muted=0&loop=1&controls=1&background=0&playsinline=1&responsive=1&byline=0&title=0&portrait=0`;

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

          // Check initial mute state and play state
          try {
            await new Promise(resolve => setTimeout(resolve, 200));
            const initialMuted = await playerRef.current.getMuted();
            if (!isIOS()) {
              setIsMuted(initialMuted);
            }
            const paused = await playerRef.current.getPaused();
            setIsPlaying(!paused);
            playerRef.current.on('play', () => setIsPlaying(true));
            playerRef.current.on('pause', () => setIsPlaying(false));

            // Volume change listener to keep button in sync
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
            volumeChangeHandlerRef.current = volumeChangeHandler;
            playerRef.current.on('volumechange', volumeChangeHandler);
          } catch (err) {
            // Ignore errors if player not fully ready yet
          }

          // Note: Testimonial video does NOT autoplay - user must click play button

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
      if (playerRef.current && volumeChangeHandlerRef.current) {
        try {
          playerRef.current.off('volumechange', volumeChangeHandlerRef.current);
        } catch (err) {
          // Ignore cleanup errors
        }
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
      // On iOS, re-sync after a short delay in case platform overrides
      if (isIOS()) {
        setTimeout(async () => {
          try {
            if (playerRef.current) {
              const muted = await playerRef.current.getMuted();
              setIsMuted(muted);
            }
          } catch (err) {
            // Ignore
          }
        }, 150);
      }
    } catch (err) {
      // Failed to toggle mute - non-critical, continue silently
    }
  };

  // Toggle play/pause handler. On iOS, unmute then play in same gesture so first tap plays with sound.
  const handleTogglePlay = async () => {
    if (!playerRef.current) return;
    try {
      const paused = await playerRef.current.getPaused();
      if (paused) {
        await playerRef.current.setMuted(false);
        setIsMuted(false);
        await playerRef.current.play();
      } else {
        await playerRef.current.pause();
      }
    } catch (err) {
      // Non-critical, continue silently
    }
  };

  // Pause video when scrolling out of view (but do NOT autoplay - user must click play)
  useEffect(() => {
    if (!playerRef.current) return;

    // Only handle pausing when out of view - NO autoplay logic
    if (!isVisible) {
      // Clear any pending pause timeouts
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }

      // Add delay before pausing to allow scroll snap to complete
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
    } else {
      // When visible, clear any pending pause timeouts but do NOT play
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
        pauseTimeoutRef.current = null;
      }
    }

    return () => {
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
        pauseTimeoutRef.current = null;
      }
    };
  }, [isVisible]);

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

  // Scroll detection to prevent accidental video interactions during scroll (mobile 2x speed issue)
  useEffect(() => {
    const handleScroll = () => {
      // Mark as scrolling
      setIsScrolling(true);

      // Clear any existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Set scroll end detection with debounce (300ms after scroll stops)
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
        scrollTimeoutRef.current = null;
      }, 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchmove', handleScroll, { passive: true }); // Also detect touch scrolling

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchmove', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
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
        overflowX: 'hidden', // Always hide horizontal overflow
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: '0'
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
          left: 0,
          bottom: 0,
          pointerEvents: isScrolling ? 'none' : 'auto', // Disable interactions during scroll to prevent 2x speed issue
          zIndex: 1 // Ensure iframe is above container but below button
        }}
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        playsInline
        loading="eager"
        title="תעודת לקוח - גיא, גיל 25, מספר על התוצאות שהשיג בליווי של גילעד דורון"
      />
      {/* Play/Pause Button - centered, only when paused */}
      {!isPlaying && (
        <button
          onClick={handleTogglePlay}
          aria-label="נגן"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20 hover:border-white/40 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-black"
          style={{
            minWidth: '48px',
            minHeight: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 30
          }}
        >
          <Play size={24} aria-hidden="true" />
        </button>
      )}
      {/* Custom Mute/Unmute Button Overlay */}
      <button
        onClick={handleToggleMute}
        aria-label={isMuted ? 'הפעל קול' : 'השתק קול'}
        className="absolute bottom-4 right-4 md:bottom-6 md:right-6 z-30 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20 hover:border-white/40 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-black"
        style={{
          minWidth: '48px',
          minHeight: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 30 // Ensure button is above iframe and all overlays
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
  const [isMuted, setIsMuted] = useState(isIOS()); // On iOS, default muted so button matches actual state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false); // Track scroll state to prevent accidental interactions
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<any>(null);
  const hasInitializedRef = useRef(false);
  const volumeChangeHandlerRef = useRef<(() => Promise<void>) | null>(null);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isVisibleRef = useRef(false); // Track visibility in ref to avoid stale closures
  const playTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayingRef = useRef(false); // Track if we've started playing to prevent rapid toggles
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Track scroll end timeout

  // Detect iOS device
  useEffect(() => {
    setIsIOSDevice(isIOS());
  }, []);

  // Vimeo embed URL - single URL that won't change
  // Added playsinline and responsive for better mobile support
  const baseUrl = "https://player.vimeo.com/video/1152174898?context=Vimeo%5CController%5CApi%5CResources%5CVideoController.&h=6e172adfe8&s=e8675d0eb6c47f57274868162088cbf80f997c1c_1767884558";
  const vimeoUrl = `${baseUrl}&autoplay=0&muted=0&loop=1&controls=1&background=0&playsinline=1&responsive=1&byline=0&title=0&portrait=0`;

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

            // Check initial mute state (on iOS keep default so we don't show unmuted before first play)
            const initialMuted = await playerRef.current.getMuted();
            if (!isIOS()) {
              setIsMuted(initialMuted);
            }

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

            // Sync play/pause state and listen for changes
            const paused = await playerRef.current.getPaused();
            setIsPlaying(!paused);
            playerRef.current.on('play', () => setIsPlaying(true));
            playerRef.current.on('pause', () => setIsPlaying(false));

            // Mark player as ready
            setIsPlayerReady(true);

            // If section is already visible when player initializes, sync mute state (non-iOS only; iOS keeps default until first play)
            if (isVisibleRef.current && !isIOS()) {
              setTimeout(async () => {
                try {
                  if (playerRef.current && isVisibleRef.current) {
                    const muted = await playerRef.current.getMuted();
                    setIsMuted(muted);
                  }
                } catch (err) {
                  // Ignore
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
        // Auto-play disabled for accessibility
        // But we can check mute state
        try {
          if (playerRef.current) {
            const muted = await playerRef.current.getMuted();
            setIsMuted(muted);
          }
        } catch (e) { /* ignore */ }

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
    // On iOS, re-sync after a short delay in case platform overrides
    if (isIOS()) {
      setTimeout(async () => {
        try {
          if (playerRef.current) {
            const muted = await playerRef.current.getMuted();
            setIsMuted(muted);
          }
        } catch (err) {
          // Ignore
        }
      }, 150);
    }
  } catch (err) {
    // Failed to toggle mute - non-critical, continue silently
  }
};

// Toggle play/pause handler. On iOS, unmute then play in same gesture so first tap plays with sound.
const handleTogglePlay = async () => {
  if (!playerRef.current) return;
  try {
    const paused = await playerRef.current.getPaused();
    if (paused) {
      await playerRef.current.setMuted(false);
      setIsMuted(false);
      await playerRef.current.play();
    } else {
      await playerRef.current.pause();
    }
  } catch (err) {
    // Non-critical, continue silently
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
      overflowX: 'hidden', // Always hide horizontal overflow
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: '0'
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
        left: 0,
        bottom: 0,
        pointerEvents: isScrolling ? 'none' : 'auto', // Disable interactions during scroll to prevent 2x speed issue
        zIndex: 1 // Ensure iframe is above container but below button
      }}
      frameBorder="0"
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
      playsInline
      loading="eager"
      title="גילעד דורון - וידאו אימון והסבר על התהליך והשיטה"
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
    {/* Play/Pause Button - centered, only when paused */}
    {!isPlaying && (
      <button
        onClick={handleTogglePlay}
        aria-label="נגן"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20 hover:border-white/40 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-black"
        style={{
          minWidth: '48px',
          minHeight: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 30
        }}
      >
        <Play size={24} aria-hidden="true" />
      </button>
    )}
    {/* Custom Mute/Unmute Button Overlay */}
    <button
      onClick={handleToggleMute}
      aria-label={isMuted ? 'הפעל קול' : 'השתק קול'}
      className="absolute bottom-8 right-6 md:bottom-6 md:right-6 z-30 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20 hover:border-white/40 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-black"
      style={{
        minWidth: '48px',
        minHeight: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 30, // Ensure button is above iframe and all overlays
        marginBottom: '0', // Ensure button is within bounds
        marginRight: '0' // Ensure button is within bounds
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
  const [expandedAboutSection, setExpandedAboutSection] = useState<number | null>(null);
  const legalModalTriggerRef = useRef<HTMLElement | null>(null);
  const clientStoryTriggerRef = useRef<HTMLElement | null>(null);
  const [hasExpandedAnyStep, setHasExpandedAnyStep] = useState(() => {
    // Check localStorage on mount
    if (typeof window !== 'undefined') {
      return localStorage.getItem('hasExpandedStep') === 'true';
    }
    return false;
  });

  // Stop animation after 4 seconds
  useEffect(() => {
    if (!hasExpandedAnyStep) {
      const timeout = setTimeout(() => {
        setHasExpandedAnyStep(true);
        if (typeof window !== 'undefined') {
          localStorage.setItem('hasExpandedStep', 'true');
        }
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [hasExpandedAnyStep]);

  const toggleFAQ = (index: number) => {
    setExpandedFAQIndex(expandedFAQIndex === index ? null : index);
  };

  const toggleStep = (index: number) => {
    const willExpand = expandedStepIndex !== index;
    setExpandedStepIndex(expandedStepIndex === index ? null : index);

    if (willExpand && !hasExpandedAnyStep) {
      setHasExpandedAnyStep(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('hasExpandedStep', 'true');
      }
    }
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

    // Option C (touch/Android): momentum state machine — skip active-section updates until scroll idle after release
    const isCoarsePointer = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
    const SCROLL_IDLE_MS = 350;
    const MOMENTUM_IDLE_MS = 250;
    const inMomentumRef = { current: false };
    let lastScrollTime = Date.now();
    let scrollTick: ReturnType<typeof requestAnimationFrame> | null = null;
    let scrollIdleApplyTimeout: ReturnType<typeof setTimeout> | null = null;
    let momentumEndTimeout: ReturnType<typeof setTimeout> | null = null;

    const updateScrollTime = () => {
      lastScrollTime = Date.now();
    };
    const handleScrollForIdle = () => {
      if (scrollTick !== null) cancelAnimationFrame(scrollTick);
      scrollTick = requestAnimationFrame(updateScrollTime);
      if (momentumEndTimeout) clearTimeout(momentumEndTimeout);
      momentumEndTimeout = setTimeout(() => {
        momentumEndTimeout = null;
        inMomentumRef.current = false;
      }, MOMENTUM_IDLE_MS);
    };
    const handleTouchEnd = () => {
      inMomentumRef.current = true;
    };

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
        const stageId = mostVisibleElement?.getAttribute('data-stage') ?? null;

        // Option C: on touch, skip active-section updates during momentum (from touchend until scroll idle 250ms)
        if (isCoarsePointer && inMomentumRef.current) {
          stageUpdateTimeout = null;
          if (scrollIdleApplyTimeout) clearTimeout(scrollIdleApplyTimeout);
          scrollIdleApplyTimeout = setTimeout(() => {
            scrollIdleApplyTimeout = null;
            if (mostVisibleElement) {
              const sid = mostVisibleElement.getAttribute('data-stage');
              if (sid) {
                setActiveStage(sid);
                snapElements.forEach(s => s.classList.remove('active-section'));
                mostVisibleElement.classList.add('active-section');
                if (sid === 'guarantee') mostVisibleElement.classList.add('guarantee-revealed');
              }
            }
          }, SCROLL_IDLE_MS);
          return;
        }
        // Also skip if last scroll was very recent (backup for timing edge cases)
        if (isCoarsePointer && (Date.now() - lastScrollTime) < SCROLL_IDLE_MS) {
          stageUpdateTimeout = null;
          if (scrollIdleApplyTimeout) clearTimeout(scrollIdleApplyTimeout);
          scrollIdleApplyTimeout = setTimeout(() => {
            scrollIdleApplyTimeout = null;
            if (mostVisibleElement) {
              const sid = mostVisibleElement.getAttribute('data-stage');
              if (sid) {
                setActiveStage(sid);
                snapElements.forEach(s => s.classList.remove('active-section'));
                mostVisibleElement.classList.add('active-section');
                if (sid === 'guarantee') mostVisibleElement.classList.add('guarantee-revealed');
              }
            }
          }, SCROLL_IDLE_MS);
          return;
        }
        // Only update if we found a visible section
        if (mostVisibleElement && stageId) {
          setActiveStage(stageId);
          // Use cached querySelectorAll result
          snapElements.forEach(s => s.classList.remove('active-section'));
          mostVisibleElement.classList.add('active-section');

          if (stageId === 'guarantee') {
            mostVisibleElement.classList.add('guarantee-revealed');
          }
        }
        stageUpdateTimeout = null;
      }, DEBOUNCE_DELAY);
    }, stageOptions);

    if (isCoarsePointer) {
      window.addEventListener('scroll', handleScrollForIdle, { passive: true });
      window.addEventListener('touchmove', handleScrollForIdle, { passive: true });
      document.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

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
      if (isCoarsePointer) {
        window.removeEventListener('scroll', handleScrollForIdle);
        window.removeEventListener('touchmove', handleScrollForIdle);
        document.removeEventListener('touchend', handleTouchEnd);
        if (scrollTick !== null) cancelAnimationFrame(scrollTick);
        if (scrollIdleApplyTimeout) clearTimeout(scrollIdleApplyTimeout);
        if (momentumEndTimeout) clearTimeout(momentumEndTimeout);
      }
      stageObserver.disconnect();
      if (stageUpdateTimeout) {
        clearTimeout(stageUpdateTimeout);
      }
    };
  }, []);

  return (
    <div className="min-h-screen selection:bg-accent selection:text-white">
      <div className="global-parallax-bg" aria-hidden="true" />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 focus:z-[9999] focus:bg-accent focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-brandDark">
        דלג לתוכן הראשי
      </a>
      <MobileProgressBar activeStageIndex={activeStageIndex} />

      <JourneyRail activeStage={activeStage} />

      <main id="main-content">
        {/* STAGE 1: HERO */}
        <section id="hero" data-stage="hero" data-snap="true" className="stage">
          <div className="absolute inset-0 z-0 hero-overlay" aria-hidden="true"></div>
          <Navbar />

          <div className="container mx-auto px-4 md:px-12 relative z-10 py-4 md:py-6 h-full flex flex-col justify-center pt-24 md:pt-20 lg:pt-24 mobile-hero-spacing">
            <StoryHeader text="החלום שלך מתחיל כאן" />
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mt-0">
              <div className="space-y-6 md:space-y-8 text-center md:text-right order-1">
                <h1 className="hero-headline text-2xl md:text-4xl lg:text-5xl font-bold heading-font leading-tight tracking-tight"><span className="font-normal text-white">מתאמן</span> <span className="text-accent">אבל מרגיש שאתה דורך במקום?</span></h1>
                <p className="hero-subheadline text-lg md:text-xl lg:text-2xl text-white leading-loose font-bold">אתה מנסה, משקיע,<br />אבל משהו בדרך לא מתחבר<br />והתוצאות פשוט לא מגיעות.</p>
                <div className="mt-10 md:mt-14 max-w-2xl space-y-4 flex flex-col items-center md:items-start" style={{ lineHeight: '78px' }}>
                  <p className="text-lg text-white leading-loose font-normal" style={{ marginTop: '-5px', marginBottom: '0px', lineHeight: '24px' }}>
                    <span className="text-accent font-bold -mt-[5px] -mb-[5px]">פה לא מנסים שוב</span> פה נכנסים לתהליך ומגיעים לתוצאה.
                  </p>
                  <p className="text-lg text-white leading-loose font-normal mt-0" style={{ marginTop: '0px', lineHeight: '24px' }}>
                    אם תעבוד לפי מה שאני אומר לאורך הדרך יש שתי אפשרויות בלבד:
                  </p>
                  <p className="text-sm md:text-base text-white leading-loose font-normal mt-0" style={{ marginTop: '-5px', marginBottom: '-5px', fontSize: '18px' }}>
                    או שזה התהליך שמביא אותך לתוצאה שאתה מחפש, או שלא תשלם עליו.
                  </p>
                  <p className="text-lg md:text-base text-white leading-loose font-bold" style={{ marginTop: '10px' }}>
                    עוד רגע אסביר בדיוק למה אני מתכוון.
                  </p>
                </div>
              </div>
              <div className="delay-100 w-full flex-1 flex flex-col justify-center md:justify-end pb-2 md:pb-0 order-2">
                <div className="mobile-form-container">
                  <LeadForm isFooter={true} onPrivacyClick={() => setModalType('privacy')} />
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
              <h2 className="text-xl md:text-3xl lg:text-5xl font-black heading-font leading-tight compact-heading">
                אתה עובד 'קשה' <span className="text-accent">במקום לעבוד 'נכון'</span>
              </h2>
              <p className="text-sm md:text-xl text-gray-300 leading-relaxed compact-text">
                זה לא כי אתה לא משקיע. <br className="md:hidden hidden" />
                זה כי בלי התהליך הנכון גם עבודה קשה לא מביאה תוצאות.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-2 md:gap-8 flex-1 min-h-0">
              <div className="bg-brandGray/20 backdrop-blur-sm border-r-2 border-white/10 p-3 md:p-10 rounded-xl relative group transition-all flex flex-col justify-center hover:border-white/20">
                <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-6 text-gray-300 flex items-center gap-2 md:gap-3 compact-heading">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-600/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <MinusCircle className="text-gray-500 opacity-70" size={20} aria-hidden="true" />
                  </div>
                  ככה זה מרגיש בלי הליווי
                </h3>
                <ul className="space-y-1.5 md:space-y-4">
                  {[
                    "אתה מחליף תוכנית כל חודש ומתפלל שמשהו יעבוד",
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

              <div className="bg-brandGray/20 backdrop-blur-sm border-r-2 border-accent/30 p-3 md:p-10 rounded-xl relative group transition-all flex flex-col justify-center hover:border-accent/40 shadow-[0_0_20px_rgba(255,107,53,0.1)]">
                <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-8 text-white flex items-center gap-2 md:gap-3 compact-heading">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <PlusCircle className="text-accent opacity-90" size={20} aria-hidden="true" />
                  </div>
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

            <div className="text-center mt-2 md:mt-8 max-w-2xl mx-auto">
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
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black heading-font leading-tight mb-4">התוצאות מדברות</h2>
              <div className="text-lg md:text-2xl text-accent font-black max-w-3xl mx-auto leading-relaxed mb-2">
                התוצאה שלך – האחריות שלי.
              </div>
              <p className="text-sm md:text-base lg:text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
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
              <div className="embla overflow-hidden" ref={emblaRef} aria-live="polite" aria-atomic="false">
                <div className="embla__container flex gap-6 md:gap-8 py-8">
                  {CLIENT_RESULTS.map((client, index) => {
                    const isActive = index === selectedIndex;

                    return (
                      <div
                        key={`${client.name}-${client.age}-${index}`}
                        className={`embla__slide flex-shrink-0 w-[80vw] sm:w-[70vw] md:w-[35%] lg:w-[38%] md:max-w-[500px] transition-all duration-500 ${isActive
                            ? 'opacity-100 z-10 scale-[1.03] md:scale-105'
                            : 'opacity-40 scale-95 blur-[1px]'
                          }`}
                        style={{
                          perspective: '1000px'
                        }}
                        role="article"
                        aria-label={`תוצאות לקוח: ${client.name}, ${client.profession}, ${client.age}`}
                      >
                        <div className={`bg-brandGray/50 border rounded-2xl pt-2 md:pt-2.5 px-2 md:px-2.5 pb-2 md:pb-2.5 flex flex-col transition-all duration-500 shadow-[0_10px_40px_rgba(0,0,0,0.6)] ${isActive
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
                                <p className="text-gray-400 text-xs md:text-sm">{client.profession}, {client.age}</p>
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
                                className="w-full h-full object-contain"
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
                    className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${index === selectedIndex
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

            <div className="flex flex-col md:grid md:grid-cols-2 gap-2 md:gap-8 items-center mt-0">
              {/* Testimonial Text - First on mobile, secondary on desktop */}
              <div className="space-y-4 md:space-y-6 text-center md:text-right w-full md:w-auto">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                    גיא · גיל 25
                  </h3>
                  <div className="bg-brandGray/60 backdrop-blur-sm border-r-4 border-accent rounded-lg p-4 md:p-5">
                    <p className="text-gray-200 text-base md:text-lg leading-relaxed italic line-clamp-2 pr-1">
                      "הגעתי למצב שאני הרבה יותר חטוב, יותר אוהב את עצמי ויותר נוח לי להסתובב בלי חולצה"
                    </p>
                  </div>
                </div>
              </div>

              {/* Video - Second on mobile, primary on desktop */}
              <div className="relative w-full flex-1 min-h-0 flex items-center justify-center flex-col gap-4 md:gap-6">
                {/* Video container with floating shadow */}
                <div
                  className={`w-full rounded-2xl md:rounded-3xl ${isIOS() ? '' : 'overflow-hidden'} relative z-10 border border-white/10`}
                  style={{
                    aspectRatio: '9/16', // Match actual video format (portrait)
                    maxHeight: isIOS() ? '85dvh' : '75dvh', // More space for controls on iOS
                    minHeight: '400px',
                    maxWidth: '100%',
                    margin: '0 auto',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 40px rgba(255, 107, 53, 0.15)'
                  }}
                >
                  <div style={{ height: '100%', width: '100%', position: 'relative' }}>
                    <ClientTestimonialVideo videoId="1155670515" />
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
            {/* Full-width headline container */}
            <div className="w-full max-w-5xl mx-auto mt-0 mb-8 md:mb-12">
              <div className="space-y-1 text-center md:text-right">
                <p className="text-accent font-bold tracking-[0.2em] uppercase text-xs compact-text">המאמן שלך</p>
                <h2 className="w-full text-center md:text-right space-y-4 md:space-y-5">
                  <div className="text-4xl md:text-6xl lg:text-7xl font-black heading-font leading-tight tracking-tight">גילעד דורון</div>
                  <div className="text-2xl md:text-4xl lg:text-5xl font-semibold heading-font leading-tight tracking-tight w-full">כמה מילים עליי, על הדרך שלי ואיך אני חוסך ממך <span className="text-accent">טעויות מיותרות</span></div>
                </h2>
              </div>
            </div>
            <div className={`flex flex-col md:grid md:grid-cols-2 gap-2 md:gap-8 items-center mt-2 md:mt-4 h-full min-h-0 ${isIOS() ? '' : 'overflow-hidden'}`}>
              <div className="space-y-3 text-center md:text-right shrink-0">
                {/* Mobile: Accordion structure, Desktop: Full text */}
                <div className="md:hidden space-y-3">
                  {[
                    {
                      title: 'המאבק',
                      content: [
                        { text: 'שרפתי שעות בחדר כושר.', isAnchor: false },
                        { text: 'עשיתי כל תרגיל שמצאתי באינטרנט.', isAnchor: false, className: '!mt-0' },
                        { text: 'אכלתי חלבונים כאילו זה אמור לפתור הכול.', isAnchor: false, className: '!mt-0' },
                        { text: 'ושום דבר לא זז.', isAnchor: false, className: '!mt-0' },
                        { text: 'יותר מזה, התחלתי לפקפק בעצמי.', isAnchor: false, className: '!mt-0' },
                        { text: 'הרגשתי שאני עושה הכול נכון, ובכל זאת התחלתי להאמין שאולי הבעיה בי.', isAnchor: true, className: 'font-bold mt-2.5 mb-5 md:mb-6', style: { marginTop: '10px' } }
                      ]
                    },
                    {
                      title: 'ההבנה',
                      content: [
                        { text: 'רק כשעצרתי הבנתי משהו שאף אחד לא אמר לי אז:', isAnchor: false },
                        { text: 'הבעיה לא הייתה בכמה עבדתי, אלא באיך שזה היה בנוי.', isAnchor: true, className: 'font-bold mt-0 mb-2.5' },
                        { text: 'ברגע שהבנתי את זה, לא השתנה רק הגוף,', isAnchor: false },
                        { text: 'השתנתה גם התחושה שאני שולט בתהליך, ולא נגרר אחריו.', isAnchor: false }
                      ]
                    },
                    {
                      title: 'התוצאה',
                      content: [
                        { text: 'ברגע שבניתי לעצמי מערכת נכונה, הדברים התחילו להתחבר.', isAnchor: false },
                        { text: 'עליתי 25 קילו של מסת שריר טהורה (מ־55 ל־80 ק״ג) ובניתי גוף שלא חלמתי שאוכל להגיע אליו,', isAnchor: false },
                        { text: 'אבל לא פחות חשוב מזה, בניתי ביטחון וערך עצמי שלא היו שם קודם,', isAnchor: true, className: 'font-bold mt-2.5 mb-2.5', style: { marginBottom: '10px' } },
                        { text: 'בלי להשתעבד לחדר כושר, ובלי לוותר על החיים מסביב.', isAnchor: false, className: 'text-xl md:text-2xl lg:text-3xl font-medium text-white mt-0', style: { lineHeight: '28px' } }
                      ]
                    }
                  ].map((section, idx) => {
                    const isExpanded = expandedAboutSection === idx;
                    return (
                      <div
                        key={idx}
                        className="bg-brandGray/20 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden transition-all"
                      >
                        <button
                          onClick={() => setExpandedAboutSection(expandedAboutSection === idx ? null : idx)}
                          className="w-full flex items-center justify-between p-3 text-right hover:bg-white/5 transition-colors"
                          aria-expanded={isExpanded}
                          aria-controls={`about-section-${idx}`}
                          aria-label={isExpanded ? `סגור ${section.title}` : `פתח ${section.title}`}
                        >
                          <h3 className="text-base font-semibold text-white pl-3 flex-1 text-right">
                            {section.title}
                          </h3>
                          <ChevronDown
                            className={`text-white flex-shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                            size={20}
                            aria-hidden="true"
                          />
                        </button>
                        <div
                          id={`about-section-${idx}`}
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                            }`}
                          aria-live={isExpanded ? "polite" : "off"}
                        >
                          <div className="px-3 pb-3 pt-3 text-gray-300 text-sm leading-loose space-y-3">
                            {section.content.map((item, pIdx) => {
                              const c = item as { className?: string; style?: React.CSSProperties };
                              return item.isAnchor ? (
                                <p key={pIdx} className={"text-accent " + (c.className ?? "my-4")} style={c.style}>{item.text}</p>
                              ) : (
                                <p key={pIdx} className={c.className ?? ''} style={c.style}>{item.text}</p>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* Desktop: Full text visible */}
                <div className="hidden md:block space-y-12 md:space-y-16">
                  {/* Block 1: המאבק */}
                  <div className="space-y-4 md:space-y-5">
                    <h3 className="text-lg md:text-xl font-semibold text-white -mb-2.5">המאבק שלי</h3>
                    <div className="text-sm md:text-xl text-gray-300 leading-loose compact-text space-y-3 md:space-y-4">
                      <p>שרפתי שעות בחדר כושר.</p>
                      <p className="!mt-0">עשיתי כל תרגיל שמצאתי באינטרנט.</p>
                      <p className="!mt-0">אכלתי חלבונים כאילו זה אמור לפתור הכול.</p>
                      <p className="!mt-0">ושום דבר לא זז.</p>
                      <p className="!mt-0">יותר מזה, התחלתי לפקפק בעצמי.</p>
                      <p className="text-accent font-bold mt-2.5 mb-5 md:mb-6" style={{ marginTop: '10px' }}>הרגשתי שאני עושה הכול נכון, ובכל זאת התחלתי להאמין שאולי הבעיה בי.</p>
                    </div>
                  </div>

                  {/* Block 2: ההבנה */}
                  <div className="space-y-4 md:space-y-5">
                    <h3 className="text-lg md:text-xl font-semibold text-white -mb-2.5">ההבנה המכרעת</h3>
                    <div className="text-sm md:text-xl text-gray-300 leading-loose compact-text space-y-3 md:space-y-4">
                      <p>רק כשעצרתי הבנתי משהו שאף אחד לא אמר לי אז:</p>
                      <p className="text-accent font-bold mt-0 mb-2.5">הבעיה לא הייתה בכמה עבדתי, אלא באיך שזה היה בנוי.</p>
                      <p className="mt-2.5" style={{ marginTop: '10px' }}>ברגע שהבנתי את זה, לא השתנה רק הגוף,</p>
                      <p className="!mt-0">השתנתה גם התחושה שאני שולט בתהליך, ולא נגרר אחריו.</p>
                    </div>
                  </div>

                  {/* Block 3: התוצאה */}
                  <div className="space-y-4 md:space-y-5">
                    <h3 className="text-lg md:text-xl font-semibold text-white -mb-2.5">התוצאה הסופית</h3>
                    <div className="text-sm md:text-xl text-gray-300 leading-loose compact-text space-y-3 md:space-y-4">
                      <p>ברגע שבניתי לעצמי מערכת נכונה, הדברים התחילו להתחבר.</p>
                      <p className="!mt-0">עליתי 25 קילו של מסת שריר טהורה (מ־55 ל־80 ק״ג) ובניתי גוף שלא חלמתי שאוכל להגיע אליו,</p>
                      <p className="text-accent font-bold mt-2.5 mb-2.5" style={{ marginTop: '10px', marginBottom: '10px' }}>אבל לא פחות חשוב מזה, בניתי ביטחון וערך עצמי שלא היו שם קודם,</p>
                      <p className="text-xl md:text-2xl lg:text-3xl font-medium text-white mt-0" style={{ lineHeight: '28px', marginTop: 0 }}>בלי להשתעבד לחדר כושר, ובלי לוותר על החיים מסביב.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative w-full flex-1 min-h-0 flex items-center justify-center flex-col gap-4 md:gap-6">
                {/* Video container with floating shadow */}
                <div
                  className={`w-full rounded-2xl md:rounded-3xl ${isIOS() ? '' : 'overflow-hidden'} relative z-10 border border-white/10`}
                  style={{
                    aspectRatio: '9/16', // Match actual video format (portrait)
                    maxHeight: isIOS() ? '90dvh' : '75dvh', // Even more space for controls on iOS
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
            <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-center mt-0">
              <div className="relative w-full aspect-[3/4] md:aspect-auto md:h-[700px] rounded-3xl overflow-hidden shadow-2xl bg-brandGray/20 backdrop-blur-sm flex items-center justify-center">
                <img 
                  src="/assets/about/whynoprogress.webp" 
                  alt="אדם מרוכז באימון" 
                  className="w-full h-full object-contain" 
                  loading="lazy"
                />
              </div>
              <div className="space-y-6">
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-black heading-font leading-tight">למה אתה עומד במקום?</h2>
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

            <div className="space-y-3 md:space-y-4">
              <h2 className="text-2xl md:text-5xl lg:text-6xl font-black heading-font leading-tight text-white mb-2">
                אני מתחייב לתוצאה<br />כשעובדים יחד כמו שצריך.
              </h2>

              <div className="space-y-4 md:space-y-5 text-lg md:text-xl text-gray-300 font-normal leading-relaxed max-w-3xl mx-auto">
                {/* Detailed explanation */}
                <div>
                  <p className="mb-2">כשאתה נכנס לליווי, אנחנו מגדירים יחד תוצאה ברורה מראש.</p>
                  <p className="mb-6">זה תהליך עם דרך ברורה, ועם נקודות בדיקה ידועות מראש.</p>
                  <p className="mb-2">אם עמדת בכל מה שסיכמנו עליו, ובנקודת הבדיקה שהגדרנו מראש היעד עדיין לא הושג —</p>

                  <p className="text-gray-300 font-medium text-lg md:text-xl tracking-wide mt-[18px] mb-3">האחריות עוברת אליי.</p>

                  <p className="font-bold text-white text-[25px] mt-3">במקרה כזה, יש שתי אפשרויות בלבד:</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-4xl mx-auto mt-6 md:mt-8">
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
                בלי אותיות קטנות. בלי משחקים. ובלי לגלגל אחריות.
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
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-black heading-font text-center mb-6 md:mb-8">מה אתה מקבל בליווי?</h2>
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
            <h2 className="text-xl md:text-3xl lg:text-5xl font-black heading-font text-center mb-4 md:mb-10 compact-heading">4 צעדים לתוצאה</h2>
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
                      <div className="flex-1 md:flex-none flex flex-col">
                        <div className="flex-1 min-h-[4.5rem]">
                          <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-3 compact-text">
                            <span className="sr-only">שלב {item.s}: </span>
                            {item.t}
                          </h3>
                          <p className="text-gray-400 text-xs md:text-sm leading-relaxed px-1 md:px-2 compact-text line-clamp-3 md:line-clamp-none">{item.d}</p>
                        </div>

                        {/* קרא עוד: text + arrow — one control for desktop and mobile */}
                        <button
                          type="button"
                          onClick={() => toggleStep(idx)}
                          className={`inline-flex flex-col items-center justify-center gap-0.5 mt-3 text-accent transition-all duration-250 ease-out motion-safe:transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brandGray hover:opacity-90 active:opacity-80 ${!isExpanded && !hasExpandedAnyStep ? 'step-chevron-invite relative' : ''}`}
                          aria-expanded={isExpanded}
                          aria-controls={`step-content-${idx}`}
                          aria-label={isExpanded ? 'סגור הסבר' : 'קרא עוד על שלב זה'}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              toggleStep(idx);
                            }
                          }}
                        >
                          <span className="text-sm font-medium">קרא עוד</span>
                          <ChevronDown
                            className={`text-accent transition-transform duration-250 ease-out motion-safe:transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            size={16}
                            aria-hidden="true"
                          />
                        </button>

                        {/* Expanded explanation */}
                        <div
                          id={`step-content-${idx}`}
                          className={`overflow-hidden transition-all duration-300 ease-out motion-safe:transition-all ${isExpanded
                              ? 'max-h-[500px] opacity-100 mt-3 border-t border-white/8 pt-3'
                              : 'max-h-0 opacity-0'
                            }`}
                          aria-live={isExpanded ? "polite" : "off"}
                        >
                          <p className="text-gray-300 text-xs md:text-sm leading-relaxed px-2">{item.explanation}</p>
                        </div>
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
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-black heading-font leading-tight mb-4">שאלות נפוצות</h2>
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                כל מה שרצית לדעת על הליווי והתהליך
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
                      aria-label={isExpanded ? `סגור שאלה: ${item.question}` : `פתח שאלה: ${item.question}`}
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
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      aria-live={isExpanded ? "polite" : "off"}
                    >
                      <div className="px-4 md:px-6 pb-4 md:pb-6 pt-3 md:pt-4 text-gray-300">
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
            <div className="grid md:grid-cols-2 gap-6 items-center mt-0">
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
                <LeadForm isFooter={true} onPrivacyClick={() => setModalType('privacy')} />
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
            <button onClick={(e) => { legalModalTriggerRef.current = e.currentTarget; setModalType('accessibility'); }} className="hover:text-white hover:underline transition-all whitespace-nowrap">הצהרת נגישות</button>
            <button onClick={(e) => { legalModalTriggerRef.current = e.currentTarget; setModalType('privacy'); }} className="hover:text-white hover:underline transition-all whitespace-nowrap">מדיניות פרטיות</button>
            <button onClick={(e) => { legalModalTriggerRef.current = e.currentTarget; setModalType('terms'); }} className="hover:text-white hover:underline transition-all whitespace-nowrap">תקנון שימוש</button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LegalModal type={modalType} onClose={() => setModalType(null)} returnFocusRef={legalModalTriggerRef} />
      <ClientStoryModal clientIndex={selectedClientIndex} onClose={closeClientStory} returnFocusRef={clientStoryTriggerRef} />
      <ExitIntentPopup />

      <WhatsAppButton />
      <FloatingCTA />
    </div>
  );
}


