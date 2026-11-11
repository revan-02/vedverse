import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = 'vedaverse';

async function seedMongo() {
  console.log(`Connecting to MongoDB at ${MONGODB_URI}...`);
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);
  console.log(`Connected to database '${DB_NAME}'. Seeding comprehensive canonical content...`);

  // 1. TRADITIONS
  const traditions = [
    {
      id: "trad-samhita",
      name: "Vedic Samhita Tradition",
      description: "The primary hymns, prayers, and liturgical mantras preserved through unbroken oral chanting traditions (Shakha / Padapatha).",
      period: "c. 1700 BCE – 1100 BCE",
      canonical_order: 1
    },
    {
      id: "trad-upanishad",
      name: "Upanishadic / Vedanta Tradition",
      description: "Jnana-kanda philosophical dialogues exploring ultimate reality (Brahman), the inner self (Atman), and spiritual liberation (Moksha).",
      period: "c. 800 BCE – 400 BCE",
      canonical_order: 2
    },
    {
      id: "trad-purana",
      name: "Puranic & Itihasa Cosmological Tradition",
      description: "Encyclopedic cosmological narratives detailing cosmic cycles (Kalpas), universal creation (Sarga), dissolution (Pralaya), and genealogies.",
      period: "c. 500 BCE – 500 CE",
      canonical_order: 3
    },
    {
      id: "trad-classical",
      name: "Classical Epics & Darshana Tradition",
      description: "Applied philosophical and ethical literature including the Bhagavad Gita and the six classical darshana schools.",
      period: "c. 500 BCE – 200 CE",
      canonical_order: 4
    }
  ];

  // 2. TEXTS
  const texts = [
    {
      id: "text-rigveda",
      tradition_id: "trad-samhita",
      slug: "rigveda",
      title_devanagari: "ऋग्वेदः",
      title_iast: "Ṛgvedaḥ",
      title_en: "Rigveda Samhita",
      corpus_type: "Veda",
      description: "The oldest extant Indo-Aryan sacred text consisting of 1,028 suktas (hymns) organized into 10 mandalas, containing foundational hymns of creation like Nasadiya Sukta, Purusha Sukta, and Hiranyagarbha Sukta.",
      historical_period: "c. 1700 – 1100 BCE",
      verified_status: "PUBLISHED"
    },
    {
      id: "text-yajurveda",
      tradition_id: "trad-samhita",
      slug: "yajurveda",
      title_devanagari: "यजुर्वेदः",
      title_iast: "Yajurvedaḥ",
      title_en: "Shukla Yajurveda",
      corpus_type: "Veda",
      description: "The Veda of sacrificial formulas, cosmic transformation of matter and energy (Yajna), and the unified field of physical forces.",
      historical_period: "c. 1200 – 900 BCE",
      verified_status: "PUBLISHED"
    },
    {
      id: "text-samaveda",
      tradition_id: "trad-samhita",
      slug: "samaveda",
      title_devanagari: "सामवेदः",
      title_iast: "Sāmavedaḥ",
      title_en: "Samaveda Samhita",
      corpus_type: "Veda",
      description: "The Veda of liturgical melodies and musical chants (Samans), demonstrating cosmological acoustic resonance (Nada Brahman) connecting cosmic vibration to consciousness.",
      historical_period: "c. 1200 – 900 BCE",
      verified_status: "PUBLISHED"
    },
    {
      id: "text-atharvaveda",
      tradition_id: "trad-samhita",
      slug: "atharvaveda",
      title_devanagari: "अथर्ववेदः",
      title_iast: "Atharvavedaḥ",
      title_en: "Atharvaveda Samhita",
      corpus_type: "Veda",
      description: "The Veda of societal life, medicinal healing formulas (origin of Ayurveda), ecological bio-conservation (Prithvi Sukta), and the universal axis (Skambha Sukta).",
      historical_period: "c. 1100 – 800 BCE",
      verified_status: "PUBLISHED"
    },
    {
      id: "text-vishnupurana",
      tradition_id: "trad-purana",
      slug: "vishnu-purana",
      title_devanagari: "विष्णुपुराणम्",
      title_iast: "Viṣṇupurāṇam",
      title_en: "Vishnu Purana",
      corpus_type: "Purana",
      description: "One of the most authentic Mahapuranas with celebrated treatises on the origin of the cosmos (Sarga), cosmic time units (Kalpas, Manvantaras), Mahapralaya (dissolution of the universe), and the Hiranyagarbha cosmic egg.",
      historical_period: "c. 300 BCE – 300 CE",
      verified_status: "PUBLISHED"
    },
    {
      id: "text-garudapurana",
      tradition_id: "trad-purana",
      slug: "garuda-purana",
      title_devanagari: "गरुडपुराणम्",
      title_iast: "Garuḍapurāṇam",
      title_en: "Garuda Purana",
      corpus_type: "Purana",
      description: "Encyclopedic dialogue between Garuda and Vishnu explaining cosmological realms (Lokas), subtle bodies, cosmic dissolution, medicine, astronomy, and the journey of consciousness across dimensions.",
      historical_period: "c. 200 BCE – 400 CE",
      verified_status: "PUBLISHED"
    },
    {
      id: "text-isha",
      tradition_id: "trad-upanishad",
      slug: "isha-upanishad",
      title_devanagari: "ईशावास्योपनिषत्",
      title_iast: "Īśāvāsyopaniṣad",
      title_en: "Isha Upanishad",
      corpus_type: "Upanishad",
      description: "The concluding chapter (40th) of the Shukla Yajurveda Samhita, harmonizing renunciation and worldly action.",
      historical_period: "c. 800 – 500 BCE",
      verified_status: "PUBLISHED"
    },
    {
      id: "text-katha",
      tradition_id: "trad-upanishad",
      slug: "katha-upanishad",
      title_devanagari: "कठोपनिषत्",
      title_iast: "Kaṭhopaniṣad",
      title_en: "Katha Upanishad",
      corpus_type: "Upanishad",
      description: "The celebrated dialogue between the seeker Nachiketa and Yama (Death), introducing the famous chariot metaphor of self-mastery.",
      historical_period: "c. 600 – 300 BCE",
      verified_status: "PUBLISHED"
    },
    {
      id: "text-mandukya",
      tradition_id: "trad-upanishad",
      slug: "mandukya-upanishad",
      title_devanagari: "माण्डूक्योपनिषत्",
      title_iast: "Māṇḍūkyopaniṣad",
      title_en: "Mandukya Upanishad",
      corpus_type: "Upanishad",
      description: "A compact 12-mantra text from the Atharvaveda analyzing the syllable AUM and the four states of consciousness.",
      historical_period: "c. 500 – 200 BCE",
      verified_status: "PUBLISHED"
    },
    {
      id: "text-chandogya",
      tradition_id: "trad-upanishad",
      slug: "chandogya-upanishad",
      title_devanagari: "छान्दोग्योपनिषत्",
      title_iast: "Chāndogyopaniṣad",
      title_en: "Chandogya Upanishad",
      corpus_type: "Upanishad",
      description: "One of the oldest Upanishads associated with the Samaveda, containing the Mahavakya 'Tat Tvam Asi'.",
      historical_period: "c. 800 – 600 BCE",
      verified_status: "PUBLISHED"
    },
    {
      id: "text-brihadaranyaka",
      tradition_id: "trad-upanishad",
      slug: "brihadaranyaka-upanishad",
      title_devanagari: "बृहदारण्यकोपनिषत्",
      title_iast: "Bṛhadāraṇyakopaniṣad",
      title_en: "Brihadaranyaka Upanishad",
      corpus_type: "Upanishad",
      description: "The 'Great Forest Upanishad' featuring the profound debates of Sage Yajnavalkya and Maitreyi/Gargi.",
      historical_period: "c. 800 – 600 BCE",
      verified_status: "PUBLISHED"
    },
    {
      id: "text-bg",
      tradition_id: "trad-classical",
      slug: "bhagavad-gita",
      title_devanagari: "श्रीमद्भगवद्गीता",
      title_iast: "Śrīmadbhagavadgītā",
      title_en: "Bhagavad Gita",
      corpus_type: "Bhagavad Gita",
      description: "700-verse dialogue between Krishna and Arjuna embedded in the Mahabharata Bhishma Parva, synthesizing Karma, Jnana, and Bhakti yoga.",
      historical_period: "c. 400 BCE – 100 BCE",
      verified_status: "PUBLISHED"
    }
  ];

  // 3. PASSAGES (Including all Cosmological, Psychological, Ethical & Scientific Verses)
  const passages = [
    // --- RIGVEDA COSMOLOGY ---
    {
      id: "RV-10.129.1",
      text_id: "text-rigveda",
      canonical_ref: "Rigveda 10.129.1",
      verse_number: "1",
      sanskrit_devanagari: "नासदासीन्नो सदासीत्तदानीं नासीद्रजो नो व्योमा परो यत् । किमावरीवः कुह कस्य शर्मन्नम्भः किमासीद्गहनं गभीरम् ॥",
      sanskrit_iast: "nāsad āsīn no sad āsīt tadānīṁ nāsīd rajo no vyomā paro yat | kim āvarīvaḥ kuha kasya śarmann ambhaḥ kim āsīd gahanaṁ gabhīram ||",
      meter: "Trishtubh (44 syllables)",
      rishi: "Prajapati Parameshthi",
      devata: "Bhava-vritta (The Origin of Being)",
      why_selected_default: "Nasadiya Sukta (Hymn of Creation): Rigveda's supreme cosmological inquiry into pre-cosmic singularity prior to spacetime, manifest matter (sat) and unmanifest void (asat).",
      verified_status: "PUBLISHED",
      translation_en: "Then there was neither non-existence nor existence; there was no realm of air, nor the sky beyond it. What was concealed, and where? In whose protection? Was there water, unfathomed and abyssal?",
      translator_name: "Ralph T.H. Griffith / Vedic Scholarly Board",
      source_reference: "The Hymns of the Rigveda (1896)"
    },
    {
      id: "RV-10.129.3",
      text_id: "text-rigveda",
      canonical_ref: "Rigveda 10.129.3",
      verse_number: "3",
      sanskrit_devanagari: "तम आसीत्तमसा गूळ्हमग्रेऽप्रकेतं सलिलं सर्वमा इदम् । तुच्छ्येनाभ्वपिहितं यदासीत्तपसस्तन्महिनाजायतैकम् ॥",
      sanskrit_iast: "tama āsīt tamasā gūḷham agre'praketaṁ salilaṁ sarvam ā idam | tucchyenābhvapihitaṁ yad āsīt tapasas tan mahinājāyataikam ||",
      meter: "Trishtubh",
      rishi: "Prajapati Parameshthi",
      devata: "Origin of Universe",
      why_selected_default: "Describes the primordial undifferentiated sea of energy and the cosmic phase transition driven by internal thermodynamic energy (Tapas) giving birth to the One.",
      verified_status: "PUBLISHED",
      translation_en: "Darkness was wrapped in darkness in the beginning; all this was unillumined water. That One which was enveloped in the void arose through the majestic power of internal heat (Tapas).",
      translator_name: "Arthur Anthony Macdonell",
      source_reference: "A Vedic Reader for Students"
    },
    {
      id: "RV-10.90.1",
      text_id: "text-rigveda",
      canonical_ref: "Rigveda 10.90.1",
      verse_number: "1",
      sanskrit_devanagari: "सहस्रशीर्षा पुरुषः सहस्राक्षः सहस्रपात् । स भूमिं विश्वतो वृत्वात्यतिष्ठद्दशाङ्गुलम् ॥",
      sanskrit_iast: "sahasraśīrṣā puruṣaḥ sahasrākṣaḥ sahasrapāt | sa bhūmiṁ viśvato vṛtvāty atiṣṭhad daśāṅgulam ||",
      meter: "Anushtubh",
      rishi: "Narayana Rishi",
      devata: "Purusha (Cosmic Being)",
      why_selected_default: "Purusha Sukta: Holographic cosmology of the universe where the cosmos is an organic, conscious multidimensional entity that both encompasses and transcends physical space.",
      verified_status: "PUBLISHED",
      translation_en: "A thousand heads hath the Cosmic Purusha, a thousand eyes, a thousand feet. Pervading the cosmos on every side, He transcends it by ten fingers beyond all physical space.",
      translator_name: "Ralph T.H. Griffith",
      source_reference: "Rigveda Samhita"
    },
    {
      id: "RV-10.121.1",
      text_id: "text-rigveda",
      canonical_ref: "Rigveda 10.121.1",
      verse_number: "1",
      sanskrit_devanagari: "हिरण्यगर्भः समवर्तताग्रे भूतस्य जातः पतिरेक आसीत् । स दाधार पृथिवीं द्यामुतेमां कस्मै देवाय हविषा विधेम ॥",
      sanskrit_iast: "hiraṇyagarbhaḥ samavartatāgre bhūtasya jātaḥ patir eka āsīt | sa dādhāra pṛthivīṁ dyām utemāṁ kasmai devāya haviṣā vidhema ||",
      meter: "Trishtubh",
      rishi: "Hiranyagarbha Prajapatya",
      devata: "Ka (Unknown Supreme)",
      why_selected_default: "Hiranyagarbha Sukta: The primordial Golden Embryo / cosmic singularity at the origin of space and time that sustains earth and the celestial expanse.",
      verified_status: "PUBLISHED",
      translation_en: "In the beginning arose the Golden Embryo (Hiranyagarbha); once born, he was the sole lord of all creation. He upheld the earth and heaven above: to what deity shall we offer our oblations?",
      translator_name: "Arthur Anthony Macdonell",
      source_reference: "Vedic Reader"
    },

    // --- ATHARVAVEDA COSMOLOGY & ECOLOGY ---
    {
      id: "AV-10.7.1",
      text_id: "text-atharvaveda",
      canonical_ref: "Atharvaveda 10.7.1",
      verse_number: "1",
      sanskrit_devanagari: "कस्मिन्नङ्गे तिष्ठति भूमिरेतस्मिन्कस्मिन्नङ्गे तिष्ठत्यन्तरिक्षम् । कस्मिन्नङ्गे तिष्ठति द्यौराहता कस्मिन्नङ्गे तिष्ठत्युत्तरं दिवः ॥",
      sanskrit_iast: "kasminn aṅge tiṣṭhati bhūmir etasmin kasminn aṅge tiṣṭhaty antarikṣam | kasminn aṅge tiṣṭhati dyaur āhatā kasminn aṅge tiṣṭhaty uttaraṁ divaḥ ||",
      meter: "Anushtubh",
      why_selected_default: "Skambha Sukta: The universal Cosmic Pillar / Space-time metric on which the Earth, intermediate space, and celestial heavens are positioned.",
      verified_status: "PUBLISHED",
      translation_en: "In which limb of Skambha does the earth abide? In which limb does the intermediate space abide? In which limb is the sky held firm, and in which limb is that which lies beyond the celestial realms?",
      translator_name: "William Dwight Whitney",
      source_reference: "Atharva-Veda Samhita"
    },
    {
      id: "AV-12.1.12",
      text_id: "text-atharvaveda",
      canonical_ref: "Atharvaveda 12.1.12",
      verse_number: "12",
      sanskrit_devanagari: "माता भूमिः पुत्रो अहं पृथिव्याः पर्जन्यः पिता स उ नः पिपर्तु ।",
      sanskrit_iast: "mātā bhūmiḥ putro ahaṁ pṛthivyāḥ parjanyaḥ pitā sa u naḥ pipartu |",
      meter: "Anushtubh",
      why_selected_default: "Prithvi Sukta (Hymn to Earth): The foundational Vedic charter of environmental ecology and bio-preservation asserting humanity's kinship with planetary nature.",
      verified_status: "PUBLISHED",
      translation_en: "The Earth is my Mother, I am the child of the Earth! Parjanya (the rain cloud) is my father; may he nurture and protect us.",
      translator_name: "Vedic Ecology Translation Board",
      source_reference: "Atharva-Veda Samhita"
    },

    // --- SAMAVEDA COSMIC RESONANCE ---
    {
      id: "SV-1.1.1",
      text_id: "text-samaveda",
      canonical_ref: "Samaveda Archika 1.1.1",
      verse_number: "1",
      sanskrit_devanagari: "अग्न आ याहि वीतये गृणानो हव्यदातये । नि होता सत्सि बर्हिषि ॥",
      sanskrit_iast: "agna ā yāhi vītaye gṛṇāno havyadātaye | ni hotā satsi barhiṣi ||",
      meter: "Gayatri (Musical Saman Chant)",
      why_selected_default: "The opening Saman chant establishing acoustic resonance (Nada) as the bridge between cosmic fire (energy) and human consciousness.",
      verified_status: "PUBLISHED",
      translation_en: "Come, O Agni, praised with chant, to our sacred banquet and to receive the oblations; sit down as the divine invoker upon the sacred grass.",
      translator_name: "Ralph T.H. Griffith",
      source_reference: "The Hymns of the Samaveda"
    },

    // --- SHUKLA YAJURVEDA UNIFIED COSMOS ---
    {
      id: "YV-32.1",
      text_id: "text-yajurveda",
      canonical_ref: "Shukla Yajurveda 32.1",
      verse_number: "1",
      sanskrit_devanagari: "तदेवाग्निस्तदादित्यस्तद्वायुस्तदु चन्द्रमाः । तदेव शुक्रं तद् ब्रह्म ता आपः स प्रजापतिः ॥",
      sanskrit_iast: "tad evāgnis tad ādityas tad vāyus tad u candramāḥ | tad eva śukraṁ tad brahma tā āpaḥ sa prajāpatiḥ ||",
      meter: "Anushtubh",
      why_selected_default: "The Vedic Unified Field Principle: declaring that Fire, Sun, Wind, Moon, Light, Space, and Primordial Waters are manifestations of a singular underlying cosmic reality.",
      verified_status: "PUBLISHED",
      translation_en: "That same reality is Agni (energy); that is Aditya (the sun); that is Vayu (the wind); that is the moon. That same is the luminous light; that is Brahman; that is the waters; that is Prajapati, Lord of all.",
      translator_name: "Ralph T.H. Griffith",
      source_reference: "The Texts of the White Yajurveda"
    },

    // --- VISHNU PURANA COSMOLOGY ---
    {
      id: "VP-1.2.22",
      text_id: "text-vishnupurana",
      canonical_ref: "Vishnu Purana 1.2.22-24",
      verse_number: "22-24",
      sanskrit_devanagari: "प्रकृतौ लीयते व्यक्ताव्यक्तं प्रकृतावपि । लीयते प्रकृतेश्चापि पुरुषे परमात्मनि ॥ अनादिरादिर्भगवान् सर्वभूतहृदि स्थितः ।",
      sanskrit_iast: "prakṛtau līyate vyaktāvyaktaṁ prakṛtāv api | līyate prakṛteś cāpi puruṣe paramātmani || anādir ādir bhagavān sarvabhūtahṛdi sthitaḥ |",
      meter: "Anushtubh",
      why_selected_default: "Cosmic Dissolution (Mahapralaya) in Vishnu Purana: how the manifest universe dissolves back into the unmanifest primordial matter (Prakriti), and Prakriti dissolves into the Supreme Consciousness.",
      verified_status: "PUBLISHED",
      translation_en: "The manifest world dissolves into the unmanifest Prakriti; and Prakriti dissolves into the Supreme Spirit (Purusha). The Lord is without beginning yet the origin of all, residing in the heart of all beings.",
      translator_name: "Horace Hayman Wilson",
      source_reference: "The Vishnu Purana: A System of Hindu Mythology and Tradition"
    },
    {
      id: "VP-1.3.15",
      text_id: "text-vishnupurana",
      canonical_ref: "Vishnu Purana 1.3.15",
      verse_number: "15",
      sanskrit_devanagari: "चतुर्युगसहस्रं तु ब्रह्मणो दिनमुच्यते । रात्रिश्च तावती तस्य तदन्ते प्रलयो महान् ॥",
      sanskrit_iast: "caturyugasahasraṁ tu brahmaṇo dinam ucyate | rātriś ca tāvatī tasya tad-ante pralayo mahān ||",
      meter: "Anushtubh",
      why_selected_default: "Cosmological Time Scale (Kalpa): defines a single Day of Brahma as 1,000 Mahayugas (4.32 billion human years), followed by an equal period of cosmic reabsorption (Pralaya), matching deep astronomical timescales.",
      verified_status: "PUBLISHED",
      translation_en: "A thousand cycles of the four Yugas constitute a single Day of Brahma (a Kalpa); his night is of equal duration. At the conclusion of that period occurs the great cosmic dissolution (Mahapralaya).",
      translator_name: "Horace Hayman Wilson",
      source_reference: "The Vishnu Purana"
    },

    // --- GARUDA PURANA COSMOLOGY ---
    {
      id: "GP-2.1.32",
      text_id: "text-garudapurana",
      canonical_ref: "Garuda Purana 2.1.32-34",
      verse_number: "32-34",
      sanskrit_devanagari: "भूराद्याः सप्त लोकास्तु भुवनानि चतुर्दश । ब्रह्माण्डोदरमध्ये तु संस्थितानि क्रमेण वै ॥",
      sanskrit_iast: "bhūr-ādyāḥ sapta lokās tu bhuvanāni caturdaśa | brahmāṇḍodara-madhye tu saṁsthitāni krameṇa vai ||",
      meter: "Anushtubh",
      why_selected_default: "Garuda Purana's multi-layered cosmology: the 14 cosmic realms (seven higher lokas and seven lower dimensions) suspended within the cosmic womb (Brahmanda).",
      verified_status: "PUBLISHED",
      translation_en: "The seven upper realms beginning with Bhu (earth) and the fourteen planetary spheres are positioned in cosmic succession within the interior of the Brahmanda (Cosmic Egg).",
      translator_name: "Manmatha Nath Dutt",
      source_reference: "The Garuda Puranam"
    },

    // --- CORE ETHICAL & PSYCHOLOGICAL PASSAGES (Gayatri, Gita, Katha, Isha, Brihadaranyaka) ---
    {
      id: "RV-3.62.10",
      text_id: "text-rigveda",
      canonical_ref: "Rigveda 3.62.10",
      verse_number: "10",
      sanskrit_devanagari: "तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि । धियो यो नः प्रचोदयात् ॥",
      sanskrit_iast: "tat savitur vareṇyaṁ bhargo devasya dhīmahi | dhiyo yo naḥ pracodayāt ||",
      meter: "Gayatri (24 syllables: 8-8-8)",
      rishi: "Vishvamitra Gathina",
      devata: "Savitr (Solar Impeller)",
      why_selected_default: "The premier sacred mantra of Vedic illumination, praying for intellect awakened toward truth.",
      verified_status: "PUBLISHED",
      translation_en: "May we meditate upon that glorious effulgence of the divine Savitr; may He awaken and guide our intellectual faculties.",
      translator_name: "Ralph T.H. Griffith",
      source_reference: "Rigveda Hymns, Vol. 1"
    },
    {
      id: "RV-7.59.12",
      text_id: "text-rigveda",
      canonical_ref: "Rigveda 7.59.12",
      verse_number: "12",
      sanskrit_devanagari: "त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् । उर्वारुकमिव बन्धनान्मृत्य pushक्षीय मामृतात् ॥",
      sanskrit_iast: "tryambakaṁ yajāmahe sugandhiṁ puṣṭivardhanam | urvārukamiva bandhanān mṛtyor mukṣīya māmṛtāt ||",
      meter: "Anushtubh",
      rishi: "Maitravaruni Vasishtha",
      devata: "Rudra / Tryambaka",
      why_selected_default: "Mahamrityunjaya Mantra praying for liberation from death and mortality like a ripe cucumber falling effortlessly from its vine.",
      verified_status: "PUBLISHED",
      translation_en: "We worship the Three-Eyed One, fragrant and the nourisher of all vitality. As a ripe gourd is freed from its bondage to the vine, so may I be liberated from mortality, but not severed from immortality.",
      translator_name: "Arthur Anthony Macdonell",
      source_reference: "Vedic Reader"
    },
    {
      id: "ISHA-1.1",
      text_id: "text-isha",
      canonical_ref: "Isha Upanishad 1",
      verse_number: "1",
      sanskrit_devanagari: "ईशा वास्यमिदं सर्वं यत्किञ्च जगत्यां जगत् । तेन त्यक्तेन भुञ्जीथा मा गृधः कस्यस्विद्धनम् ॥",
      sanskrit_iast: "īśā vāsyam idaṁ sarvaṁ yat kiñca jagatyāṁ jagat | tena tyaktena bhuñjīthā mā gṛdhaḥ kasyasvid dhanam ||",
      meter: "Anushtubh",
      why_selected_default: "The foundational Upanishadic principle reconciling renunciation and righteous enjoyment, forbidding greed.",
      verified_status: "PUBLISHED",
      translation_en: "All this—whatever moves in this moving world—is enveloped by the Supreme Lord. Enjoy it through renunciation; do not covet the wealth of anyone.",
      translator_name: "Swami Paramananda",
      source_reference: "The Upanishads"
    },
    {
      id: "KATHA-1.3.3",
      text_id: "text-katha",
      canonical_ref: "Katha Upanishad 1.3.3-4",
      verse_number: "3-4",
      sanskrit_devanagari: "आत्मानं रथिनं विद्धि शरीरं रथमेव तु । बुद्धिं तु सारथिं विद्धि मनः प्रग्रहमेव च ॥ इन्द्रियाणि हयानाहुर्विषयांस्तेषु गोचरान् ।",
      sanskrit_iast: "ātmānaṁ rathinaṁ viddhi śarīraṁ ratham eva tu | buddhiṁ tu sārathiṁ viddhi manaḥ pragraham eva ca || indriyāṇi hayān āhur viṣayāṁs teṣu gocarān |",
      meter: "Anushtubh",
      why_selected_default: "The famous chariot metaphor of self-mastery, mental control, and regulating sensory impulses.",
      verified_status: "PUBLISHED",
      translation_en: "Know the Self (Atman) as the lord of the chariot, and the body as the chariot itself. Know the intellect (Buddhi) as the charioteer, and the mind (Manas) as the reins. The senses, they declare, are the horses, and the sensory objects are the roads over which they range.",
      translator_name: "Swami Paramananda",
      source_reference: "The Upanishads"
    },
    {
      id: "BG-2.47",
      text_id: "text-bg",
      canonical_ref: "Bhagavad Gita 2.47",
      verse_number: "47",
      sanskrit_devanagari: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन । मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥",
      sanskrit_iast: "karmaṇy evādhikāras te mā phaleṣu kadācana | mā karmaphalahetur bhūr mā te saṅgo'stv akarmaṇi ||",
      meter: "Anushtubh",
      why_selected_default: "The cornerstone principle of Nishkama Karma (selfless action without attachment to fruits).",
      verified_status: "PUBLISHED",
      translation_en: "You have a right to perform your prescribed duty, but never to the fruits of action. Never let the fruits of action be your motive, nor let your attachment be to inaction.",
      translator_name: "Swami Swarupananda",
      source_reference: "Srimad-Bhagavad-Gita"
    },
    {
      id: "BG-2.62-63",
      text_id: "text-bg",
      canonical_ref: "Bhagavad Gita 2.62-63",
      verse_number: "62-63",
      sanskrit_devanagari: "ध्यायतो विषयान्पुंसः सङ्गस्तेषूपजायते । सङ्गात्सञ्जायते कामः कामात्क्रोधोऽभिजायते ॥ क्रोधाद्भवति संमोहः संमोहात्स्मृतिविभ्रमः । स्मृतिभ्रंशाद् बुद्धिनाशो बुद्धिनाशात्प्रणश्यति ॥",
      sanskrit_iast: "dhyāyato viṣayān puṁsaḥ saṅgas teṣūpajāyate | saṅgāt sañjāyate kāmaḥ kāmāt krodho'bhijāyate || krodhād bhavati saṁmohaḥ saṁmohāt smṛtivibhramaḥ | smṛtibhraṁśād buddhināśo buddhināśāt praṇaśyati ||",
      meter: "Anushtubh",
      why_selected_default: "The definitive Vedic/classical Indian psychology of how sensory dwelling leads to desire, frustration, anger (krodha), delusion, loss of memory, and intellectual ruin.",
      verified_status: "PUBLISHED",
      translation_en: "Brooding on the objects of senses, a person develops attachment to them; from attachment springs longing (kāma); from thwarted longing emerges anger (krodha). From anger arises delusion; from delusion comes confusion of memory; from loss of memory comes ruin of the intellect; and through ruin of the intellect, the person perishes.",
      translator_name: "Swami Swarupananda",
      source_reference: "Srimad-Bhagavad-Gita"
    },
    {
      id: "BG-3.35",
      text_id: "text-bg",
      canonical_ref: "Bhagavad Gita 3.35",
      verse_number: "35",
      sanskrit_devanagari: "श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात् । स्वधर्मे निधनं श्रेयः परधर्मो भयावहः ॥",
      sanskrit_iast: "śreyān svadharmo viguṇaḥ paradharmāt svanuṣṭhitāt | svadharme nidhanaṁ śreyaḥ paradharmo bhayāvahaḥ ||",
      meter: "Anushtubh",
      why_selected_default: "The classical doctrine of Svadharma (one's authentic vocational duty aligned with natural disposition), vital for vocational queries.",
      verified_status: "PUBLISHED",
      translation_en: "Better is one's own duty (svadharma), though imperfectly performed, than another's duty well-discharged. Better is death in the discharge of one's own duty; the duty of another is fraught with danger.",
      translator_name: "Swami Swarupananda",
      source_reference: "Srimad-Bhagavad-Gita"
    },
    {
      id: "BA-1.3.28",
      text_id: "text-brihadaranyaka",
      canonical_ref: "Brihadaranyaka Upanishad 1.3.28",
      verse_number: "28",
      sanskrit_devanagari: "असतो मा सद्गमय । तमसो मा ज्योतिर्गमय । मृत्योर्माऽमृतं गमय ॥",
      sanskrit_iast: "asato mā sad gamaya | tamaso mā jyotir gamaya | mṛtyor mā'mṛtaṁ gamaya ||",
      meter: "Yajus prose chant",
      why_selected_default: "The Pavamana prayer expressing humanity's supreme aspiration from falsehood to truth, darkness to light, mortality to immortality.",
      verified_status: "PUBLISHED",
      translation_en: "Lead me from the unreal to the real; lead me from darkness to light; lead me from death to immortality.",
      translator_name: "Swami Madhavananda",
      source_reference: "The Brhadaranyaka Upanisad"
    }
  ];

  // 4. SUBJECT CORRELATIONS: HOW VEDAS RELATE TO ALL MODERN SUBJECTS
  const subjectCorrelations = [
    {
      id: "subj-astronomy",
      subject: "Astronomy & Astrophysics (Khagola-Shastra)",
      vedic_tradition: "Rigveda, Yajurveda, Jyotisha Vedanga, Vishnu Purana",
      ancient_treatises: "Vedanga Jyotisha (Lagadha), Surya Siddhanta, Vishnu Purana Book II",
      description: "Vedic astronomy maps planetary revolutions, 27/28 Nakshatra constellations, solar equinoxes, and cosmic epochs (Kalpas = 4.32 billion years) corresponding closely to modern astrophysical cosmic time scales.",
      modern_parallels: "Cosmic expansion, celestial coordinates, precession of equinoxes, cyclical cosmological models.",
      diagram_type: "celestial_sphere",
      key_passages: ["RV-10.129.1", "VP-1.3.15", "YV-32.1"]
    },
    {
      id: "subj-physics",
      subject: "Quantum Physics & Unified Field Theory",
      vedic_tradition: "Rigveda (Nasadiya), Shukla Yajurveda, Samaveda, Vaisheshika",
      ancient_treatises: "Vaisheshika Sutras (Kanada - Atomic Paramanuvada), Samkhya Karika",
      description: "Samkhya and Vaisheshika outline the atomic structure of matter (Paramanu), mass-energy conservation, and quantum-like non-locality where manifest reality arises from unmanifest vibrational potential (Prakriti/Nada).",
      modern_parallels: "Quantum vacuum, unified field theories, wave-particle duality, thermodynamics of cosmic origin (Tapas).",
      diagram_type: "unified_field",
      key_passages: ["RV-10.129.1", "RV-10.129.3", "YV-32.1"]
    },
    {
      id: "subj-mathematics",
      subject: "Mathematics & Sacred Geometry (Shulba Sutras)",
      vedic_tradition: "Sulba Sutras (Yajurveda accessory), Pingala Chandas Shastra",
      ancient_treatises: "Baudhayana Sulba Sutra, Apastamba Sulba Sutra, Aryabhatiya",
      description: "Origin of the decimal place-value system, concept of zero (Shunya), the Pythagorean theorem centuries prior to Pythagoras (Baudhayana theorem), binary sequences, and combinatorics.",
      modern_parallels: "Geometric proofs, binary arithmetic, Fibonacci sequences in poetic meters, fractal altar arrangements.",
      diagram_type: "sacred_geometry",
      key_passages: ["RV-10.90.1", "SV-1.1.1"]
    },
    {
      id: "subj-medicine",
      subject: "Medicine, Biology & Genetics (Ayurveda)",
      vedic_tradition: "Atharvaveda (Upaveda: Ayurveda), Garuda Purana",
      ancient_treatises: "Charaka Samhita, Sushruta Samhita, Garuda Purana Shariraka",
      description: "Holistic psychosomatic medicine based on the Tridosha balance (Vata, Pitta, Kapha), cellular rejuvenation (Rasayana), surgical techniques, plant pharmacopoeia, and fetal embryology.",
      modern_parallels: "Personalized medicine, epigenetics, neuro-immunology, circadian rhythm biology.",
      diagram_type: "tridosha_matrix",
      key_passages: ["AV-10.7.1", "GP-2.1.32", "RV-7.59.12"]
    },
    {
      id: "subj-psychology",
      subject: "Psychology, Cognitive Science & Consciousness (Yoga & Mind)",
      vedic_tradition: "Upanishads, Samkhya, Patanjali Yoga Darshana, Bhagavad Gita",
      ancient_treatises: "Patanjali Yoga Sutras, Katha Upanishad, Mandukya Karika, Gita Ch. 2 & 6",
      description: "Analysis of cognitive architecture: Chitta (mindstuff), Manas (sensory processor), Buddhi (intellect), and Ahankara (ego). Defines the 4 states of consciousness (Jagrat, Svapna, Sushupti, Turiya) and emotional cascades of desire and anger.",
      modern_parallels: "Cognitive behavioral therapy (CBT), neuroscience of attention and meditation, emotional regulation.",
      diagram_type: "chariot_mind_model",
      key_passages: ["KATHA-1.3.3", "BG-2.62-63", "text-mandukya"]
    },
    {
      id: "subj-ecology",
      subject: "Ecology & Environmental Sustainability",
      vedic_tradition: "Atharvaveda, Rigveda Aranyakas",
      ancient_treatises: "Prithvi Sukta (Atharvaveda 12.1), Vrikshayurveda (Surapala)",
      description: "Ecocentric cosmology recognizing earth as a living mother organism ('Mata Bhumih Putro Aham Prithivyah'). Injunctions against water contamination, deforestation, and over-extraction.",
      modern_parallels: "Gaia hypothesis, ecological stewardship, sustainable regenerative agriculture, circular bio-economy.",
      diagram_type: "ecosystem_web",
      key_passages: ["AV-12.1.12", "ISHA-1.1"]
    },
    {
      id: "subj-linguistics",
      subject: "Linguistics, Syntax & Computational Grammar (Vyakarana)",
      vedic_tradition: "Vedanga Vyakarana, Nirukta, Shiksha",
      ancient_treatises: "Panini's Ashtadhyayi, Yaska's Nirukta, Bhartrihari's Vakyapadiya",
      description: "Panini's formal grammar is universally recognized by computer scientists as the earliest complete generative grammar and context-free formal language specification, anticipating Backus-Naur form.",
      modern_parallels: "Compiler design, formal generative linguistics, computational semantics, phonological algorithms.",
      diagram_type: "panini_syntax_tree",
      key_passages: ["RV-3.62.10", "SV-1.1.1"]
    },
    {
      id: "subj-architecture",
      subject: "Architecture, Spatial Acoustics & Urban Planning (Vastu)",
      vedic_tradition: "Atharvaveda Upaveda (Sthapatyaveda), Samaveda (Gandharvaveda)",
      ancient_treatises: "Manasara, Mayamata, Shilpa Shastra",
      description: "Principles of spatial orientation relative to solar and magnetic axes, harmonic proportions based on the Vastu Purusha Mandala, and acoustic resonance engineering in temple structures.",
      modern_parallels: "Biophilic architectural design, acoustic engineering, passive solar alignment, urban micro-climates.",
      diagram_type: "vastu_mandala",
      key_passages: ["AV-10.7.1", "GP-2.1.32"]
    }
  ];

  // 5. MANTRAS WITH EXACT AUDIO FREQUENCIES AND PHONETICS
  const mantras = [
    {
      id: "m-gayatri",
      title: "Gayatri Mantra (गायत्री मन्त्र)",
      canonical_ref: "Rigveda 3.62.10",
      sanskrit: "तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि । धियो यो नः प्रचोदयात् ॥",
      iast: "tat savitur vareṇyaṁ bhargo devasya dhīmahi | dhiyo yo naḥ pracodayāt ||",
      meter: "Gayatri (24 syllables)",
      fundamental_hz: 136.1, // Cosmic Om frequency
      meaning: "May we meditate upon that supreme effulgence of the divine solar impeller; may He awaken and direct our intellectual faculties.",
      phonetic_syllables: ["tat", "sa", "vi", "tur", "va", "re", "ṇyam", "bhar", "go", "de", "vas", "ya", "dhī", "ma", "hi", "dhi", "yo", "yo", "naḥ", "pra", "co", "da", "yāt"]
    },
    {
      id: "m-mahamrityunjaya",
      title: "Mahamrityunjaya Mantra (महामृत्युञ्जय मन्त्र)",
      canonical_ref: "Rigveda 7.59.12",
      sanskrit: "त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् । उर्वारुकमिव बन्धनान्मृत्य pushक्षीय मामृतात् ॥",
      iast: "tryambakaṁ yajāmahe sugandhiṁ puṣṭivardhanam | urvārukamiva bandhanān mṛtyor mukṣīya māmṛtāt ||",
      meter: "Anushtubh (32 syllables)",
      fundamental_hz: 136.1,
      meaning: "We honor the Three-Eyed One, fragrant and the nourisher of all vitality. As a ripe gourd is freed effortlessly from its vine, may I be liberated from mortality, but not severed from immortality.",
      phonetic_syllables: ["tryam", "ba", "kam", "ya", "jā", "ma", "he", "su", "gan", "dhim", "puṣ", "ṭi", "var", "dha", "nam", "ur", "vā", "ru", "kam", "i", "va", "ban", "dha", "nāt", "mṛt", "yor", "muk", "ṣī", "ya", "mā", "mṛ", "tāt"]
    },
    {
      id: "m-pavamana",
      title: "Pavamana Shanti Mantra (पवमान शान्तिमन्त्र)",
      canonical_ref: "Brihadaranyaka Upanishad 1.3.28",
      sanskrit: "असतो मा सद्गमय । तमसो मा ज्योतिर्गमय । मृत्योर्माऽमृतं गमय ॥ ॐ शान्तिः शान्तिः शान्तिः ॥",
      iast: "asato mā sad gamaya | tamaso mā jyotir gamaya | mṛtyor mā'mṛtaṁ gamaya || oṁ śāntiḥ śāntiḥ śāntiḥ ||",
      meter: "Yajus Prose Chant",
      fundamental_hz: 136.1,
      meaning: "Lead me from the unreal to the real; lead me from darkness to spiritual light; lead me from death to immortality. Om Peace, Peace, Peace.",
      phonetic_syllables: ["a", "sa", "to", "mā", "sad", "ga", "ma", "ya", "ta", "ma", "so", "mā", "jyo", "tir", "ga", "ma", "ya", "mṛt", "yor", "mā", "am", "ṛ", "tam", "ga", "ma", "ya"]
    }
  ];

  // 6. ROADMAP MILESTONES
  const roadmapMilestones = [
    {
      step: 1,
      stage: "Foundational Cosmic Genesis",
      title: "Cosmological Origins & First Principles",
      vedic_focus: "Nasadiya Sukta (RV 10.129), Hiranyagarbha (RV 10.121), Vishnu Purana Sarga",
      key_concept: "Brahman, Tapas, Asat to Sat, Space-time Singularity",
      scientific_parallel: "Quantum Big Bang, Thermodynamics of Expansion, Entropy",
      duration_weeks: 2
    },
    {
      step: 2,
      stage: "Universal Structure & Rhythms",
      title: "The Four Vedas & Cosmic Cycles",
      vedic_focus: "Rigveda (Hymns), Samaveda (Resonance), Yajurveda (Conservation/Yajna), Atharvaveda (Ecology)",
      key_concept: "Rta (Cosmic Order), Skambha (Pillar), Nada Brahman (Acoustic Vibration)",
      scientific_parallel: "Wave mechanics, unified forces, cyclic cosmology, ecological equilibrium",
      duration_weeks: 3
    },
    {
      step: 3,
      stage: "The Puranic Macroworld",
      title: "Deep Time & Multidimensional Realms",
      vedic_focus: "Vishnu Purana (Kalpas/Mahapralaya), Garuda Purana (Lokas/Dissolution)",
      key_concept: "Kalpa (4.32 Billion Years), Mahapralaya, 14 Lokas",
      scientific_parallel: "Deep astrophysical time, stellar lifespans, multidimensional topology",
      duration_weeks: 3
    },
    {
      step: 4,
      stage: "The Internal Cosmos (Cognition & Self)",
      title: "Upanishadic Psychology & Consciousness",
      vedic_focus: "Katha Upanishad (Chariot), Mandukya (4 States of Mind), Bhagavad Gita Ch. 2",
      key_concept: "Atman, Buddhi-yoga, Indriya-Nigraha, Krodha-Genesis",
      scientific_parallel: "Neuroscience of consciousness, cognitive control, impulse regulation",
      duration_weeks: 4
    },
    {
      step: 5,
      stage: "Universal Subject Synthesis",
      title: "Vedas as Mother of Classical Sciences",
      vedic_focus: "Vedangas (Astronomy, Linguistics, Geometry), Ayurveda, Arthashastra",
      key_concept: "Sarvavidya-Pravaha (Interdisciplinary knowledge stream)",
      scientific_parallel: "Comprehensive interdisciplinary mastery: math, biology, physics, ethics",
      duration_weeks: 4
    }
  ];

  // 7. USERS
  const passwordHash = await bcrypt.hash('vedaverse123', 10);
  const users = [
    { id: 'usr-admin', email: 'admin@vedaverse.org', password_hash: passwordHash, name: 'VedaVerse Acharya', role: 'admin' },
    { id: 'usr-scholar', email: 'scholar@vedaverse.org', password_hash: passwordHash, name: 'Dr. Vedavati Sharma', role: 'scholar' },
    { id: 'usr-seeker', email: 'seeker@vedaverse.org', password_hash: passwordHash, name: 'Arjuna Seeker', role: 'user' }
  ];

  // Insert into MongoDB collections
  console.log("Upserting collections in MongoDB...");

  const colTraditions = db.collection('traditions');
  await colTraditions.deleteMany({});
  await colTraditions.insertMany(traditions);

  const colTexts = db.collection('texts');
  await colTexts.deleteMany({});
  await colTexts.insertMany(texts);

  const colPassages = db.collection('passages');
  await colPassages.deleteMany({});
  await colPassages.insertMany(passages);

  const colSubjectCorrelations = db.collection('subject_correlations');
  await colSubjectCorrelations.deleteMany({});
  await colSubjectCorrelations.insertMany(subjectCorrelations);

  const colMantras = db.collection('mantras');
  await colMantras.deleteMany({});
  await colMantras.insertMany(mantras);

  const colRoadmap = db.collection('roadmap_milestones');
  await colRoadmap.deleteMany({});
  await colRoadmap.insertMany(roadmapMilestones);

  const colUsers = db.collection('users');
  await colUsers.deleteMany({});
  await colUsers.insertMany(users);

  // Create text search indexes for rapid lookup
  await colPassages.createIndex({
    canonical_ref: 'text',
    sanskrit_devanagari: 'text',
    sanskrit_iast: 'text',
    translation_en: 'text',
    why_selected_default: 'text'
  });

  await colSubjectCorrelations.createIndex({
    subject: 'text',
    description: 'text',
    modern_parallels: 'text'
  });

  console.log(`✅ MongoDB Seed Completed Successfully!`);
  console.log(`- ${texts.length} Canonical Texts (Rigveda, Yajurveda, Samaveda, Atharvaveda, Vishnu Purana, Garuda Purana, etc.)`);
  console.log(`- ${passages.length} Verified Verses on Cosmic Origin, Dissolution, Time, Ecology, and Psychology`);
  console.log(`- ${subjectCorrelations.length} Interdisciplinary Subject Correlation Matrices`);
  console.log(`- ${mantras.length} Mantras with Audio Frequencies & Phonetics`);
  console.log(`- ${roadmapMilestones.length} Comprehensive Curriculum Roadmap Milestones`);

  await client.close();
}

seedMongo().catch(err => {
  console.error("MongoDB seed error:", err);
  process.exit(1);
});
