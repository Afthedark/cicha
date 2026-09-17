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
  'presentacion.history_badge': 'Ιστορική Κληρονομιά 1940',
  'presentacion.history_title': 'Προέλευση & Ίδρυση του C.I.C.H.A.',
  'presentacion.history_p1': 'Το Ελληνοαργεντινό Εμπορικό και Βιομηχανικό Επιμελητήριο – C.I.C.H.A. ιδρύθηκε στις αρχές της δεκαετίας του 1940 από τον Αριστοτέλη Ωνάση και τους τότε διακεκριμένους Έλληνες επιχειρηματίες της Αργεντινής.',
  'presentacion.history_p2': 'Το 1988 απέκτησε νέα δυναμική και πλήρη επίσημη αναγνώριση και από τις δύο χώρες, διατηρώντας έκτοτε ενεργό παρουσία με αυξανόμενη συμμετοχή στις ροές διμερούς εμπορίου και επενδύσεων.',
  'presentacion.decree_ar_title': 'Διάταγμα Αργεντινής (1989)',
  'presentacion.decree_ar': 'Αναγνώριση με διάταγμα της κυβέρνησης της Αργεντινής την 1η Νοεμβρίου 1989.',
  'presentacion.decree_gr_title': 'Ελληνικό Προεδρικό Διάταγμα (1998)',
  'presentacion.decree_gr': 'Αναγνώριση με Προεδρικό Διάταγμα της Ελληνικής Κυβέρνησης στις 18 Σεπτεμβρίου 1998.',
  'presentacion.framework_title': 'Θεσμικό Πλαίσιο και Διμερής Πορεία',
  'presentacion.framework_subtitle': 'Έγγραφο Παρουσίασης του Επιμελητηρίου',
  'presentacion.framework_p1': 'Το Ελληνοαργεντινό Εμπορικό και Βιομηχανικό Επιμελητήριο – C.I.C.H.A. ιδρύθηκε στις αρχές της δεκαετίας του 1940 από τον Αριστοτέλη Ωνάση και τους τότε διακεκριμένους Έλληνες επιχειρηματίες της Αργεντινής. Το 1988 απέκτησε νέα δυναμική και επίσημη αναγνώριση και από τις δύο χώρες. Έκτοτε παραμένει ενεργό με αυξανόμενη συμμετοχή σε εμπορικά γεγονότα.',
  'presentacion.framework_p2': 'Το Ελληνοαργεντινό Εμπορικό και Βιομηχανικό Επιμελητήριο αναγνωρίζεται με Προεδρικό Διάταγμα της Ελληνικής Κυβέρνησης της 18ης Σεπτεμβρίου 1998 και με διάταγμα της Κυβέρνησης της Αργεντινής της 1ης Νοεμβρίου 1989.',
  'presentacion.framework_p3': 'Από τον Μάιο του 2017 είναι ενεργό μέλος και τμήμα του Διοικητικού Συμβουλίου του EUROCAMARA Argentina, και αποτελεί κόμβο των δικτύων EEN (Enterprise Europe Network), EBN (European Business and Innovation Centre Network) της Ευρωπαϊκής Ένωσης. Είναι επίσης μέλος της διαπραγματευτικής επιτροπής για τη σύναψη της συμφωνίας ΕΕ-MERCOSUR, της ένταξης της Αργεντινής στον ΟΟΣΑ, της πρωτοβουλίας TEAM EUROPE κ.ά.',
  'presentacion.framework_p4': 'Για περισσότερες από δύο δεκαετίες είναι ενεργό μέλος της UCCEB (Ένωση Διμερών Ξένων Εμπορικών Επιμελητηρίων), η οποία σήμερα αριθμεί 38 μέλη που διακινούν μεταξύ 95% και 97% του εξωτερικού εμπορίου της Αργεντινής.',
  'presentacion.framework_p5': 'Το Ελληνοαργεντινό Εμπορικό και Βιομηχανικό Επιμελητήριο διατηρεί στενούς δεσμούς τόσο με την Πρεσβεία της Ελλάδας στην Αργεντινή όσο και με την Πρεσβεία της Αργεντινής στην Ελλάδα. Συνεργάζεται άμεσα με το Υπουργείο Εξωτερικών της Αργεντινής (Cancillería), το Υπουργείο Εξωτερικών της Ελλάδας και διάφορα Εμπορικά Επιμελητήρια της Ελλάδας. Αριθμεί περίπου 50 εταιρείες-μέλη.',
  'presentacion.framework_p6': 'Το Ελληνοαργεντινό Εμπορικό και Βιομηχανικό Επιμελητήριο (C.I.C.H.A.) αποκτά καθημερινά μεγαλύτερη σημασία: Αποστολή του είναι να αποτελεί δημιουργική δύναμη μεταξύ Ελλάδας και Αργεντινής – σε ένα επιχειρηματικό περιβάλλον που συμβάλλει στην ανάπτυξη της κοινωνίας μας με δικαιοσύνη και ίσες ευκαιρίες. Προώθηση της βιώσιμης ανάπτυξης, του διμερούς εμπορίου, των παραγωγικών επενδύσεων και της διαμόρφωσης φόρουμ διαλόγου.',
  'presentacion.mission_badge': 'Θεσμική Αποστολή',
  'presentacion.mission_title': 'Δημιουργική Δύναμη μεταξύ Ελλάδας και Αργεντινής',
  'presentacion.mission_quote': '«Να αποτελέσουμε μια δημιουργική δύναμη μεταξύ Ελλάδας και Αργεντινής σε ένα επιχειρηματικό περιβάλλον που συμβάλλει στην ανάπτυξη της κοινωνίας μας, με γνώμονα τη δικαιοσύνη και την ισότητα ευκαιριών. Προώθηση της βιώσιμης επιχειρηματικής ανάπτυξης, του διμερούς εμπορίου, των παραγωγικών επενδύσεων, της ιδιωτικής πρωτοβουλίας και της οικονομίας της αγοράς, με υπευθυνότητα, ήθος και διαφάνεια.»',
  'presentacion.check_forums': 'Φόρουμ Γνώσης',
  'presentacion.check_public_private': 'Δημόσια-Ιδιωτική Συνεργασία',
  'presentacion.check_trade': 'Βιώσιμο Διμερές Εμπόριο',

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
  'home.top_title': 'ΕΛΛΗΝΟΑΡΓΕΝΤΙΝΟ ΕΠΙΜΕΛΗΤΗΡΙΟ ΒΙΟΜΗΧΑΝΙΑΣ ΚΑΙ ΕΜΠΟΡΙΟΥ',
  'home.hero_welcome': 'ΕΛΛΗΝΟΑΡΓΕΝΤΙΝΟ ΕΜΠΟΡΙΚΟ ΚΑΙ ΒΙΟΜΗΧΑΝΙΚΟ ΕΠΙΜΕΛΗΤΗΡΙΟ',
  'home.hero_tagline': 'Προώθηση του εμπορίου, των επενδύσεων και των πολιτιστικών και επιχειρηματικών δεσμών μεταξύ της Δημοκρατίας της Αργεντινής και της Ελληνικής Δημοκρατίας από το 1940.',
  'home.recog_title': 'Επίσημες Αναγνωρίσεις',
  'home.recog_arg_label': 'Κυβέρνηση της Αργεντινής:',
  'home.recog_arg_date': '1 Νοεμβρίου 1989',
  'home.recog_gr_label': 'Ελληνική Κυβέρνηση:',
  'home.recog_gr_date': '18 Σεπτεμβρίου 1998',
  'home.hero_title': 'Προώθηση του Διμερούς Εμπορίου και των Επενδύσεων μεταξύ Ελλάδας και Αργεντινής',
  'home.hero_p1': 'Το Ελληνοαργεντινό Επιμελητήριο Βιομηχανίας και Εμπορίου, από τον Μάιο του 2017 είναι ενεργό μέλος του EUROCAMARA Argentina, και αποτελεί κόμβο του δικτύου EEN (Enterprise Europe Network) της Ευρωπαϊκής Ένωσης.',
  'home.hero_p2': 'Για περισσότερο από μια δεκαετία, είναι ενεργό μέλος της UCCEB (Ένωση Διμερών Ξένων Εμπορικών Επιμελητηρίων), η οποία αποτελείται επί του παρόντος από 32 επιμελητήρια.',
  'home.hero_p3': 'Το Ελληνοαργεντινό Επιμελητήριο Βιομηχανίας και Εμπορίου, αναγνωρισμένο από την ελληνική κυβέρνηση στις 18 Σεπτεμβρίου 1998 και από την κυβέρνηση της Αργεντινής την 1η Νοεμβρίου 1989, αποκτά καθημερινά μεγαλύτερη σημασία.',
  'home.check_eurocamara': 'Μέλος EUROCAMARA (2017)',
  'home.check_een': 'Κόμβος EEN Ευρωπαϊκής Ένωσης',
  'home.check_ucceb': 'Μέλος UCCEB (32 Επιμελητήρια)',
  'home.stats_card_title': 'Πορεία & Εκπροσώπηση',
  'home.stats_card_badge': 'Επίσημο',
  'home.stats_years_label': 'Χρόνια Διμερούς Πορείας (1989)',
  'home.stats_chambers_label': 'Διμερή Επιμελητήρια στο UCCEB',
  'home.stats_countries_label': 'Χώρες στο Δίκτυο Enterprise Europe Network',
  'home.stats_public_private_label': 'Δημόσια-Ιδιωτική Συνεργασία',
  'home.agenda_card_title': 'Διμερής Ατζέντα',
  'home.agenda_card_subtitle': 'Προσεχή φόρουμ και επίσημες συναντήσεις',
  'home.mission_title': 'Η Αποστολή μας',
  'home.mission_subtitle': 'Δημιουργική δύναμη για δίκαιη διμερή ανάπτυξη',
  'home.mission_text': 'Το Ελληνοαργεντινό Επιμελητήριο Βιομηχανίας και Εμπορίου αποτελεί δημιουργική και κινητήρια δύναμη που προάγει την κοινωνικοοικονομική ανάπτυξη των μελών του, μέσω της εκπροσώπησης, της παροχής υπηρεσιών αριστείας, της προώθησης επιχειρηματικών ευκαιριών, του εμπορίου και των διμερών επενδύσεων, καθώς και της συνεχούς ενίσχυσης των πολιτιστικών, θεσμικών και εμπορικών δεσμών μεταξύ της Ελληνικής Δημοκρατίας και της Δημοκρατίας της Αργεντινής.',
  'home.object_title': 'Σκοπός του Επιμελητηρίου',
  'home.object_subtitle': 'Εκπροσώπηση και διάρθρωση του ελληνικού και διμερούς επιχειρηματικού κόσμου',
  'home.object_text': 'Συσπειρώνουμε φυσικά και νομικά πρόσωπα, ελληνικής καταγωγής ή συνδεδεμένα με την εμπορική και βιομηχανική δραστηριότητα με την Ελλάδα, για την προάσπιση των νόμιμων συνδικαλιστικών και εμπορικών τους συμφερόντων. Συντονίζουμε ενέργειες ενώπιον δημόσιων και ιδιωτικών φορέων, προωθούμε την εμπορική διαιτησία, διευκολύνουμε την εγκατάσταση επενδύσεων και ενθαρρύνουμε ενεργά την επιστημονική, τεχνική, πολιτιστική και κοινωνική συνεργασία μεταξύ των δύο εθνών.',
  'home.opp_tag': 'Εξωτερικό Εμπόριο & Επενδύσεις Αιγαίου',
  'home.opp_title': 'Διμερείς Εμπορικές Ευκαιρίες',
  'home.opp_subtitle': 'Ενεργές εμπορικές ζητήσεις και προσφορές που διαχειρίζεται το CICHA και ο κόμβος Enterprise Europe Network.',
  'home.news_tag': 'Επικαιρότητα',
  'home.news_title': 'Νέα & Ανακοινώσεις',
  'home.events_tag': 'Ατζέντα',
  'home.events_title': 'Προσεχείς Εκδηλώσεις',
  'home.events_empty': 'Δεν υπάρχουν προγραμματισμένες εκδηλώσεις αυτή τη στιγμή.',
  'home.community_badge': 'Επιχειρηματική Κοινότητα',
  'home.community_title': 'Γίνετε μέλος του Ελληνοαργεντινού Επιχειρηματικού Δικτύου',
  'home.community_subtitle': 'Ενταχθείτε σε μια κοινότητα με επιρροή, με πρόσβαση στο Eurocámara, επιχειρηματικούς γύρους της Ευρωπαϊκής Ένωσης και άμεσους θεσμικούς δεσμούς με την Ελλάδα και τον Νότιο Κώνο.',

  // 5. Beneficios / Benefits
  'benefits.badge': 'Δίκτυο Προνομίων & Συμφωνιών',
  'benefits.title': 'Club Προνομίων και Εμπορικών Συμμαχιών',
  'benefits.subtitle': 'Προνομιακές συμφωνίες, εκπτώσεις στο εξωτερικό εμπόριο, logistics, τεχνικές συμβουλές και αποκλειστικά πλεονεκτήματα που προωθούνται από το δίκτυο των εταιρειών-μελών του CICHA.',

  // 6. Contacto
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
  'presentacion.history_badge': 'Historical Legacy 1940',
  'presentacion.history_title': 'Origins & Foundation of C.I.C.H.A.',
  'presentacion.history_p1': 'The Hellenic-Argentine Chamber of Commerce and Industry – C.I.C.H.A. was founded in the early 1940s by Aristotle Onassis and distinguished Greek entrepreneurs in Argentina at the time.',
  'presentacion.history_p2': 'In 1988 it gained renewed momentum and full official recognition from both nations, maintaining an active presence ever since with growing participation in bilateral trade and investment flows.',
  'presentacion.decree_ar_title': 'Argentine Decree (1989)',
  'presentacion.decree_ar': 'Recognition by decree of the Argentine government on November 1, 1989.',
  'presentacion.decree_gr_title': 'Hellenic Presidential Decree (1998)',
  'presentacion.decree_gr': 'Recognition by Presidential Decree of the Hellenic Government on September 18, 1998.',
  'presentacion.framework_title': 'Institutional Framework and Bilateral Trajectory',
  'presentacion.framework_subtitle': 'Chamber Presentation Document',
  'presentacion.framework_p1': 'The Hellenic-Argentine Chamber of Commerce and Industry – C.I.C.H.A. was founded in the early 1940s by Aristotle Onassis and distinguished Greek entrepreneurs of Argentina at the time. In 1988 it gained new momentum and official recognition from both nations. Since then, it has maintained an active presence with increasing participation in commercial events.',
  'presentacion.framework_p2': 'The Hellenic-Argentine Chamber of Commerce and Industry is recognized by Presidential Decree of the Hellenic Government dated September 18, 1998, and by Decree of the Argentine Government dated November 1, 1989.',
  'presentacion.framework_p3': 'Since May 2017 it is an active member and part of the Board of Directors of EUROCAMARA Argentina, and serves as a node for the EEN (Enterprise Europe Network) and EBN networks of the European Union. It is also a member of the negotiating committee for the EU-MERCOSUR agreement, Argentina\'s accession to the OECD, and the EU Delegation\'s TEAM EUROPE initiative dedicated to facilitating European investment in Argentina.',
  'presentacion.framework_p4': 'For over two decades it has been an active member of UCCEB (Union of Foreign Binational Commercial Chambers), which currently comprises 38 members representing between 95% and 97% of Argentina\'s foreign trade.',
  'presentacion.framework_p5': 'The Hellenic-Argentine Chamber of Commerce and Industry maintains ties with both the Embassy of Greece in Argentina and the Embassy of Argentina in Greece. It also collaborates directly with the Argentine Ministry of Foreign Affairs, the Hellenic Ministry of Foreign Affairs, and various Chambers of Commerce across Greece. It represents approximately 50 member companies from both nations.',
  'presentacion.framework_p6': 'The Hellenic-Argentine Chamber of Commerce and Industry (C.I.C.H.A.) grows in relevance every day: Its mission is to be a creative force between Greece and Argentina – within a business ecosystem that fosters societal development with equity and equal opportunity. Promoting sustainable business growth, bilateral trade, genuine productive investments, and facilitating public-private knowledge forums.',
  'presentacion.mission_badge': 'Institutional Mission',
  'presentacion.mission_title': 'Creative Force between Greece and Argentina',
  'presentacion.mission_quote': '"To constitute a creative force between Greece and Argentina in a business environment that contributes to the development of our society, framed by justice and equal opportunities. Promoting sustainable business growth, bilateral trade, genuinely productive investments, private initiative, and the market economy, all framed with responsibility, ethics, and transparency."',
  'presentacion.check_forums': 'Knowledge Forums',
  'presentacion.check_public_private': 'Public-Private Articulation',
  'presentacion.check_trade': 'Sustainable Bilateral Trade',

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
  'home.top_title': 'HELLENIC ARGENTINE CHAMBER OF INDUSTRY AND COMMERCE',
  'home.hero_welcome': 'HELLENIC-ARGENTINE CHAMBER OF COMMERCE AND INDUSTRY',
  'home.hero_tagline': 'Promoting trade, investments, and cultural and business ties between the Argentine Republic and the Hellenic Republic since 1940.',
  'home.recog_title': 'Official Recognitions',
  'home.recog_arg_label': 'Argentine Government:',
  'home.recog_arg_date': 'November 1, 1989',
  'home.recog_gr_label': 'Greek Government:',
  'home.recog_gr_date': 'September 18, 1998',
  'home.hero_title': 'Promoting Bilateral Trade and Investments between Greece and Argentina',
  'home.hero_p1': 'The Hellenic Argentine Chamber of Industry and Commerce, since May 2017 is an active member of EUROCAMARA Argentina, and serves as a node of the European Union\'s EEN (Enterprise Europe Network).',
  'home.hero_p2': 'For more than a decade, it has been an active member of UCCEB (Union of Foreign Binational Commercial Chambers), currently comprising 32 chambers.',
  'home.hero_p3': 'The Hellenic Argentine Chamber of Industry and Commerce, recognized by the Greek government on September 18, 1998, and by the Argentine government on November 1, 1989, is gaining greater relevance every day.',
  'home.check_eurocamara': 'EUROCAMARA Member (2017)',
  'home.check_een': 'European Union EEN Node',
  'home.check_ucceb': 'UCCEB Member (32 Chambers)',
  'home.stats_card_title': 'Trajectory & Representation',
  'home.stats_card_badge': 'Official',
  'home.stats_years_label': 'Years of Bilateral Trajectory (1989)',
  'home.stats_chambers_label': 'Binational Chambers in UCCEB',
  'home.stats_countries_label': 'Countries in Enterprise Europe Network',
  'home.stats_public_private_label': 'Public-Private Articulation',
  'home.agenda_card_title': 'Bilateral Agenda',
  'home.agenda_card_subtitle': 'Upcoming forums and official meetings',
  'home.mission_title': 'Our Mission',
  'home.mission_subtitle': 'Creative force for equitable bilateral development',
  'home.mission_text': 'The Hellenic Argentine Chamber of Industry and Commerce is a creative and driving force that fosters the socioeconomic development of its members through representation, provision of excellence services, promotion of business opportunities, bilateral trade and investment, and the continuous strengthening of cultural, institutional, and commercial ties between the Hellenic Republic and the Argentine Republic.',
  'home.object_title': 'Chamber\'s Purpose',
  'home.object_subtitle': 'Representation and coordination of Hellenic and bilateral business community',
  'home.object_text': 'We bring together natural and legal persons of Greek origin or linked to commercial and industrial activity with Greece, for the defense of their legitimate trade and business interests. We coordinate actions before public and private bodies, promote commercial arbitration, facilitate investment placement, and actively encourage scientific, technical, cultural, and social cooperation between both nations.',
  'home.opp_tag': 'Foreign Trade & Aegean Investment',
  'home.opp_title': 'Bilateral Commercial Opportunities',
  'home.opp_subtitle': 'Active commercial demands and offers managed through CICHA and the Enterprise Europe Network node.',
  'home.news_tag': 'Latest News',
  'home.news_title': 'News & Press Releases',
  'home.events_tag': 'Agenda',
  'home.events_title': 'Upcoming Events',
  'home.events_empty': 'There are no scheduled events at this time.',
  'home.community_badge': 'Business Community',
  'home.community_title': 'Join the Hellenic Argentine Business Network',
  'home.community_subtitle': 'Join an influential community with access to Eurochamber, European Union trade missions, and direct institutional links with Greece and the Southern Cone.',

  // 5. Beneficios / Benefits
  'benefits.badge': 'Benefits & Agreements Network',
  'benefits.title': 'Benefits Club and Commercial Alliances',
  'benefits.subtitle': 'Preferential agreements, discounts on foreign trade, logistics, technical advice, and exclusive advantages driven by the member companies network of CICHA.',

  // 6. Contacto
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
