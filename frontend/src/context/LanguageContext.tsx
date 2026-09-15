import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { publicApi } from '../services/api';

// Default static Greek translations fallback dictionary
export const DEFAULT_GREEK_DICTIONARY: Record<string, string> = {
  // 1. Header
  'header.slogan': 'ΓΕΦΥΡΕΣ ΠΟΥ ΔΗΜΙΟΥΡΓΟΥΝ ΕΥΚΑΙΡΙΕΣ',
  'header.official_recognition': 'Επίσημη Αναγνώριση: Αργεντινή 1989 • Ελλάδα 1998',
  'header.memberships': 'Μέλος EUROCAMARA • Κόμβος EEN Ευρωπαϊκής Ένωσης • UCCEB (32 Επιμελητήρια)',

  // 2. Presentación
  'presentacion.badge': 'Θεσμική Παρουσίαση',
  'presentacion.title': 'Ελληνοαργεντινό Εμπορικό και Βιομηχανικό Επιμελητήριο',
  'presentacion.subtitle': 'Προέλευση, Επίσημες Αναγνωρίσεις και Στρατηγικά Δίκτυα του CICHA',
  'presentacion.history_title': 'Προέλευση & Ίδρυση του C.I.C.H.A.',
  'presentacion.history_p1': 'Το Ελληνοαργεντινό Εμπορικό και Βιομηχανικό Επιμελητήριο – C.I.C.H.A. ιδρύθηκε στις αρχές της δεκαετίας του 1940 από τον Αριστοτέλη Ωνάση και τους τότε διακεκριμένους Έλληνες επιχειρηματίες της Αργεντινής. Το 1988 απέκτησε νέα δυναμική και επίσημη αναγνώριση και από τις δύο χώρες. Έκτοτε παραμένει ενεργό με αυξανόμενη συμμετοχή σε εμπορικά γεγονότα.',
  'presentacion.history_p2': 'Το Ελληνοαργεντινό Εμπορικό και Βιομηχανικό Επιμελητήριο αναγνωρίζεται με Προεδρικό Διάταγμα της Ελληνικής Κυβέρνησης της 18ης Σεπτεμβρίου 1998 και με διάταγμα της Κυβέρνησης της Αργεντινής της 1ης Νοεμβρίου 1989.',
  'presentacion.mission_p1': 'Το Ελληνοαργεντινό Εμπορικό και Βιομηχανικό Επιμελητήριο (C.I.C.H.A.) αποκτά καθημερινά μεγαλύτερη σημασία και η αποστολή του ορίζεται ως εξής:',
  'presentacion.mission_p2': 'Η αποστολή του Επιμελητηρίου είναι να αποτελέσει μια δημιουργική δύναμη μεταξύ Ελλάδας και Αργεντινής - σε ένα επιχειρηματικό περιβάλλον που συμβάλλει στην ανάπτυξη της κοινωνίας μας, με γνώμονα τη δικαιοσύνη και την ισότητα ευκαιριών. Προώθηση της βιώσιμης επιχειρηματικής ανάπτυξης, του διμερούς εμπορίου, των παραγωγικών επενδύσεων, της ιδιωτικής πρωτοβουλίας και της οικονομίας της αγοράς, με υπευθυνότητα, ήθος και διαφάνεια.',

  // 3. La Cámara
  'la_camara.headline': 'ΑΡΓΕΝΤΙΝΗ ΚΑΙ ΕΛΛΑΔΑ, ΠΙΟ ΚΟΝΤΑ, ΠΙΟ ΜΑΚΡΙΑ ΜΑΖΙ',
  'la_camara.motto': 'Δύο πολιτισμοί ένα κοινό μέλλον',
  'la_camara.pillar1': 'ΔΙΜΕΡΕΣ ΕΜΠΟΡΙΟ',
  'la_camara.pillar2': 'ΒΙΩΣΙΜΗ ΑΝΑΠΤΥΞΗ',
  'la_camara.pillar3': 'ΚΑΙΝΟΤΟΜΙΑ ΚΑΙ ΓΝΩΣΗ',
  'la_camara.pillar4': 'ΔΙΕΘΝΗ ΔΙΚΤΥΑ',
  'la_camara.authorities_title': 'ΔΙΟΙΚΗΤΙΚΟ ΣΥΜΒΟΥΛΙΟ & ΕΛΕΓΚΤΙΚΗ ΕΠΙΤΡΟΠΗ',
  'la_camara.authorities_subtitle': 'Επίσημος κατάλογος στελεχών και επιχειρηματιών δεσμευμένων στη διμερή ελληνοαργεντινή ανταλλαγή.',

  // 4. Inicio / Home
  'home.hero_welcome': 'ΕΛΛΗΝΟΑΡΓΕΝΤΙΝΟ ΕΜΠΟΡΙΚΟ ΚΑΙ ΒΙΟΜΗΧΑΝΙΚΟ ΕΠΙΜΕΛΗΤΗΡΙΟ',
  'home.hero_tagline': 'Προώθηση του εμπορίου, των επενδύσεων και των πολιτιστικών και επιχειρηματικών δεσμών μεταξύ της Δημοκρατίας της Αργεντινής και της Ελληνικής Δημοκρατίας από το 1940.',

  // 5. Contacto
  'contacto.title': 'Θεσμική Επικοινωνία',
  'contacto.subtitle': 'Είμαστε στη διάθεσή σας για εμπορικές πληροφορίες, θεσμικές σχέσεις και διμερή υποστήριξη.',
};

// Default static English translations fallback dictionary
export const DEFAULT_ENGLISH_DICTIONARY: Record<string, string> = {
  // 1. Header
  'header.slogan': 'BRIDGES THAT CREATE OPPORTUNITIES',
  'header.official_recognition': 'Official Recognition: Argentina 1989 • Greece 1998',
  'header.memberships': 'Member of EUROCAMARA • EEN Node European Union • UCCEB (32 Chambers)',

  // 2. Presentación
  'presentacion.badge': 'Institutional Presentation',
  'presentacion.title': 'Hellenic-Argentine Chamber of Commerce and Industry',
  'presentacion.subtitle': 'Origins, Official Recognitions and Strategic Networks of CICHA',
  'presentacion.history_title': 'Origins & Foundation of C.I.C.H.A.',
  'presentacion.history_p1': 'The Hellenic-Argentine Chamber of Commerce and Industry – C.I.C.H.A. was founded in the early 1940s by Aristotle Onassis and distinguished Greek entrepreneurs of Argentina at the time. In 1988 it gained new momentum and official recognition from both nations. Since then, it has maintained an active presence with increasing participation in commercial events.',
  'presentacion.history_p2': 'The Hellenic-Argentine Chamber of Commerce and Industry is recognized by Presidential Decree of the Hellenic Government dated September 18, 1998, and by Decree of the Argentine Government dated November 1, 1989.',
  'presentacion.mission_p1': 'The Hellenic-Argentine Chamber of Commerce and Industry (C.I.C.H.A.) grows in relevance every day, defining its mission as follows:',
  'presentacion.mission_p2': 'The Chamber’s mission is to be a creative force between Greece and Argentina – within a business ecosystem that fosters the development of our community with equity and equal opportunity. Promoting sustainable business growth, bilateral trade, productive investment, private initiative, and the market economy with responsibility, integrity, and transparency.',

  // 3. La Cámara
  'la_camara.headline': 'ARGENTINA AND GREECE, CLOSER, FURTHER TOGETHER',
  'la_camara.motto': 'Two cultures, one shared future',
  'la_camara.pillar1': 'BILATERAL TRADE',
  'la_camara.pillar2': 'SUSTAINABLE DEVELOPMENT',
  'la_camara.pillar3': 'INNOVATION AND KNOWLEDGE',
  'la_camara.pillar4': 'INTERNATIONAL NETWORKS',
  'la_camara.authorities_title': 'BOARD OF DIRECTORS & AUDIT COMMITTEE',
  'la_camara.authorities_subtitle': 'Official roster of executives and business leaders committed to Hellenic-Argentine bilateral exchange.',

  // 4. Inicio / Home
  'home.hero_welcome': 'HELLENIC-ARGENTINE CHAMBER OF COMMERCE AND INDUSTRY',
  'home.hero_tagline': 'Promoting trade, investments, and cultural and business ties between the Argentine Republic and the Hellenic Republic since 1940.',

  // 5. Contacto
  'contacto.title': 'Institutional Contact',
  'contacto.subtitle': 'We are at your disposal for commercial inquiries, institutional relations, and bilateral support.',
};

export type LanguageCode = 'es' | 'el' | 'en';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  isGreek: boolean;
  isEnglish: boolean;
  t: (key: string, fallback?: string) => string;
  refreshTranslations: () => Promise<void>;
  greekDictionary: Record<string, string>;
  englishDictionary: Record<string, string>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    // Check saved language
    const saved = localStorage.getItem('cicha_lang');
    if (saved && ['es', 'el', 'en'].includes(saved)) {
      return saved as LanguageCode;
    }
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };
    const googtrans = getCookie('googtrans');
    if (googtrans) {
      const lang = googtrans.split('/')[2];
      if (lang && ['es', 'el', 'en'].includes(lang)) {
        return lang as LanguageCode;
      }
    }
    return 'es';
  });

  const [greekDictionary, setGreekDictionary] = useState<Record<string, string>>(DEFAULT_GREEK_DICTIONARY);
  const [englishDictionary, setEnglishDictionary] = useState<Record<string, string>>(DEFAULT_ENGLISH_DICTIONARY);

  const fetchTranslations = async () => {
    try {
      const [resEl, resEn] = await Promise.allSettled([
        publicApi.getGreekTranslations(),
        publicApi.getEnglishTranslations(),
      ]);

      if (resEl.status === 'fulfilled' && resEl.value?.dictionary && Object.keys(resEl.value.dictionary).length > 0) {
        setGreekDictionary((prev) => ({
          ...prev,
          ...resEl.value.dictionary,
        }));
      }

      if (resEn.status === 'fulfilled' && resEn.value?.dictionary && Object.keys(resEn.value.dictionary).length > 0) {
        setEnglishDictionary((prev) => ({
          ...prev,
          ...resEn.value.dictionary,
        }));
      }
    } catch (err) {
      console.warn('Could not load dynamic translations, using default bundle:', err);
    }
  };

  useEffect(() => {
    fetchTranslations();
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('cicha_lang', lang);

    // Sync with custom event
    window.dispatchEvent(new CustomEvent('cicha_language_change', { detail: { language: lang } }));
  };

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'cicha_lang' && e.newValue && ['es', 'el', 'en'].includes(e.newValue)) {
        setLanguageState(e.newValue as LanguageCode);
      }
    };
    const handleCustomChange = (e: any) => {
      if (e.detail?.language && ['es', 'el', 'en'].includes(e.detail.language)) {
        setLanguageState(e.detail.language);
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('cicha_language_change', handleCustomChange);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('cicha_language_change', handleCustomChange);
    };
  }, []);

  const isGreek = language === 'el';
  const isEnglish = language === 'en';

  const t = (key: string, fallback: string = ''): string => {
    if (language === 'el') {
      return greekDictionary[key] || fallback;
    }
    if (language === 'en') {
      return englishDictionary[key] || fallback;
    }
    return fallback;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        isGreek,
        isEnglish,
        t,
        refreshTranslations: fetchTranslations,
        greekDictionary,
        englishDictionary,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
