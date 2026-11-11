export interface SeedData {
  traditions: Array<{ id: string; name: string; description: string; period: string; canonical_order: number }>;
  schools: Array<{ id: string; name: string; tradition_id: string; description: string; prominent_scholars: string }>;
  texts: Array<{
    id: string;
    tradition_id: string;
    slug: string;
    title_devanagari: string;
    title_iast: string;
    title_en: string;
    corpus_type: string;
    description: string;
    historical_period: string;
    verified_status: string;
  }>;
  sections: Array<{
    id: string;
    text_id: string;
    parent_section_id?: string;
    section_type: string;
    section_number: number;
    title_devanagari: string;
    title_iast: string;
    title_en: string;
  }>;
  passages: Array<{
    id: string;
    text_id: string;
    section_id: string;
    canonical_ref: string;
    verse_number: string;
    sanskrit_devanagari: string;
    sanskrit_iast: string;
    meter?: string;
    rishi?: string;
    devata?: string;
    why_selected_default?: string;
    verified_status: string;
    words: Array<{
      word_order: number;
      sanskrit_word: string;
      iast_word: string;
      root?: string;
      grammatical_tag?: string;
      lexical_meaning: string;
    }>;
    translations: Array<{
      language: string;
      translation_text: string;
      translator_name: string;
      source_reference: string;
      license_type: string;
      is_primary: number;
    }>;
    commentaries: Array<{
      school_id?: string;
      commentator_name: string;
      original_text?: string;
      english_summary: string;
      tradition_tag: string;
    }>;
    concept_ids: Array<{ concept_id: string; relevance_score: number; contextual_note?: string }>;
  }>;
  concepts: Array<{
    id: string;
    slug: string;
    sanskrit_term: string;
    iast_term: string;
    english_title: string;
    short_definition: string;
    etymology: string;
    category: string;
    detailed_explanation: string;
  }>;
  courses: Array<{
    id: string;
    slug: string;
    title: string;
    level: string;
    description: string;
    order_index: number;
    lessons: Array<{
      id: string;
      slug: string;
      title: string;
      order_index: number;
      content_markdown: string;
      estimated_minutes: number;
      quizzes: Array<{
        question_text: string;
        options: string[];
        correct_option_index: number;
        explanation: string;
      }>;
    }>;
  }>;
  sources: Array<{
    id: string;
    title: string;
    author: string;
    translator: string;
    publisher: string;
    publication_year: string;
    url: string;
    license: string;
    copyright_status: string;
    public_domain_flag: number;
  }>;
}

export const SEED_DATA: SeedData = {
  traditions: [
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
      id: "trad-classical",
      name: "Classical Epics & Darshana Tradition",
      description: "Applied philosophical and ethical literature including the Bhagavad Gita and the six classical darshana schools.",
      period: "c. 500 BCE – 200 CE",
      canonical_order: 3
    }
  ],
  schools: [
    {
      id: "sch-advaita",
      name: "Advaita Vedanta",
      tradition_id: "trad-upanishad",
      description: "Non-dualism: The individual Atman is fundamentally non-different from supreme Brahman; the empirical world is Maya (anirvachaniya appearance).",
      prominent_scholars: "Adi Shankara, Sureshavara, Madhusudana Saraswati"
    },
    {
      id: "sch-vishishta",
      name: "Vishishtadvaita Vedanta",
      tradition_id: "trad-upanishad",
      description: "Qualified Non-dualism: Brahman (Ishvara) has attributes, with living souls (chit) and insentient matter (achit) forming His organic body.",
      prominent_scholars: "Ramanujacharya, Yamunacharya, Vedanta Desika"
    },
    {
      id: "sch-dvaita",
      name: "Dvaita Vedanta",
      tradition_id: "trad-upanishad",
      description: "Dualism: Strict ontological distinction and eternal hierarchy (Pancha-bheda) between God (Vishnu), souls, and the material world.",
      prominent_scholars: "Madhvacharya, Jayatirtha, Vyasatirtha"
    },
    {
      id: "sch-sayana",
      name: "Vedic Ritual Exegesis (Mimamsa / Sayana)",
      tradition_id: "trad-samhita",
      description: "Classical ritualistic, mythological, and liturgical analysis grounded in Jaimini's Purva-Mimamsa principles and Yaska's Nirukta.",
      prominent_scholars: "Sayana, Yaska, Kumarila Bhatta"
    }
  ],
  texts: [
    {
      id: "text-rigveda",
      tradition_id: "trad-samhita",
      slug: "rigveda",
      title_devanagari: "ऋग्वेदः",
      title_iast: "Ṛgvedaḥ",
      title_en: "Rigveda Samhita",
      corpus_type: "Veda",
      description: "The oldest extant Indo-Aryan sacred text consisting of 1,028 suktas (hymns) organized into 10 mandalas.",
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
      description: "The Veda of sacrificial formulas and invocations, containing both prose and poetic mantras.",
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
      description: "The Veda of liturgical melodies and musical chants (Samans), closely linked to the Rigvedic verses.",
      historical_period: "c. 1200 – 900 BCE",
      verified_status: "PUBLISHED"
    },
    {
      id: "text-athervaveda",
      tradition_id: "trad-samhita",
      slug: "atharvaveda",
      title_devanagari: "अथर्ववेदः",
      title_iast: "Atharvavedaḥ",
      title_en: "Atharvaveda Samhita",
      corpus_type: "Veda",
      description: "The Veda of societal life, medicinal healing formulas, domestic rites, and profound speculative hymns.",
      historical_period: "c. 1100 – 800 BCE",
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
  ],
  sections: [
    {
      id: "sec-rv-3-62",
      text_id: "text-rigveda",
      section_type: "Sukta",
      section_number: 62,
      title_devanagari: "मण्डल ३ सूक्त ६२",
      title_iast: "Maṇḍala 3 Sūkta 62",
      title_en: "Mandala 3 Sukta 62 (Vishvamitra Rishi)"
    },
    {
      id: "sec-rv-7-59",
      text_id: "text-rigveda",
      section_type: "Sukta",
      section_number: 59,
      title_devanagari: "मण्डल ७ सूक्त ५९",
      title_iast: "Maṇḍala 7 Sūkta 59",
      title_en: "Mandala 7 Sukta 59 (Vasishtha Rishi / Rudra)"
    },
    {
      id: "sec-rv-10-129",
      text_id: "text-rigveda",
      section_type: "Sukta",
      section_number: 129,
      title_devanagari: "नासदीय सूक्तम् (१०.१२९)",
      title_iast: "Nāsadīya Sūktam (10.129)",
      title_en: "Hymn of Creation (Nasadiya Sukta)"
    },
    {
      id: "sec-rv-10-191",
      text_id: "text-rigveda",
      section_type: "Sukta",
      section_number: 191,
      title_devanagari: "संज्ञान सूक्तम् (१०.१९१)",
      title_iast: "Saṁjñāna Sūktam (10.191)",
      title_en: "Hymn of Concord / Unity"
    },
    {
      id: "sec-isha-1",
      text_id: "text-isha",
      section_type: "Chapter",
      section_number: 1,
      title_devanagari: "ईश मन्त्राः",
      title_iast: "Īśa Mantrāḥ",
      title_en: "Primary Verses"
    },
    {
      id: "sec-katha-1-2",
      text_id: "text-katha",
      section_type: "Valli",
      section_number: 2,
      title_devanagari: "प्रथमाध्यायः - द्वितीयवल्ली",
      title_iast: "Adhyāya 1 - Vallī 2",
      title_en: "Chapter 1 Section 2 (The Choice of the Good vs Pleasant)"
    },
    {
      id: "sec-katha-1-3",
      text_id: "text-katha",
      section_type: "Valli",
      section_number: 3,
      title_devanagari: "प्रथमाध्यायः - तृतीयवल्ली",
      title_iast: "Adhyāya 1 - Vallī 3",
      title_en: "Chapter 1 Section 3 (The Chariot Metaphor)"
    },
    {
      id: "sec-mandukya-1",
      text_id: "text-mandukya",
      section_type: "Chapter",
      section_number: 1,
      title_devanagari: "माण्डूक्य मन्त्राः",
      title_iast: "Māṇḍūkya Mantrāḥ",
      title_en: "Consciousness and AUM"
    },
    {
      id: "sec-ch-6-8",
      text_id: "text-chandogya",
      section_type: "Prapathaka",
      section_number: 6,
      title_devanagari: "षष्ठाध्यायः - अष्टमखण्डः",
      title_iast: "Prapāṭhaka 6 Khaṇḍa 8",
      title_en: "Chapter 6 Section 8 (Uddalaka and Shvetaketu)"
    },
    {
      id: "sec-ba-1-3",
      text_id: "text-brihadaranyaka",
      section_type: "Brahmana",
      section_number: 3,
      title_devanagari: "प्रथमाध्यायः - तृतीयब्राह्मणम्",
      title_iast: "Adhyāya 1 Brāhmaṇa 3",
      title_en: "Pavamanabhyaroha (The Invocation of Light)"
    },
    {
      id: "sec-bg-2",
      text_id: "text-bg",
      section_type: "Chapter",
      section_number: 2,
      title_devanagari: "सांख्ययोगः",
      title_iast: "Sāṅkhyayogaḥ",
      title_en: "Chapter 2: Sankhya Yoga (Yoga of Knowledge & Self-Control)"
    },
    {
      id: "sec-bg-3",
      text_id: "text-bg",
      section_type: "Chapter",
      section_number: 3,
      title_devanagari: "कर्मयोगः",
      title_iast: "Karmayogaḥ",
      title_en: "Chapter 3: Karma Yoga (Yoga of Selfless Action)"
    },
    {
      id: "sec-bg-6",
      text_id: "text-bg",
      section_type: "Chapter",
      section_number: 6,
      title_devanagari: "आत्मसंयमयोगः",
      title_iast: "Ātmasaṁyamayogaḥ",
      title_en: "Chapter 6: Yoga of Meditation & Self-Control"
    }
  ],
  passages: [
    {
      id: "RV-3.62.10",
      text_id: "text-rigveda",
      section_id: "sec-rv-3-62",
      canonical_ref: "Rigveda 3.62.10",
      verse_number: "10",
      sanskrit_devanagari: "तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि । धियो यो नः प्रचोदयात् ॥",
      sanskrit_iast: "tat savitur vareṇyaṁ bhargo devasya dhīmahi | dhiyo yo naḥ pracodayāt ||",
      meter: "Gayatri (24 syllables: 8-8-8)",
      rishi: "Vishvamitra Gathina",
      devata: "Savitr (Solar Impeller)",
      why_selected_default: "The premier sacred mantra of Vedic illumination, praying for intellect awakened toward truth.",
      verified_status: "PUBLISHED",
      words: [
        { word_order: 1, sanskrit_word: "तत्", iast_word: "tat", grammatical_tag: "pronoun, neuter acc. sg.", lexical_meaning: "that" },
        { word_order: 2, sanskrit_word: "सवितुः", iast_word: "savituḥ", root: "sū (impel)", grammatical_tag: "noun, masc. gen. sg.", lexical_meaning: "of the solar illuminator / divine creator" },
        { word_order: 3, sanskrit_word: "वरेण्यम्", iast_word: "vareṇyam", root: "vṛ (choose)", grammatical_tag: "adj., neuter acc. sg.", lexical_meaning: "most excellent, adorable, desirable" },
        { word_order: 4, sanskrit_word: "भर्गः", iast_word: "bhargaḥ", root: "bhrāj (shine)", grammatical_tag: "noun, neuter acc. sg.", lexical_meaning: "luminous radiance, spiritual effulgence" },
        { word_order: 5, sanskrit_word: "देवस्य", iast_word: "devasya", grammatical_tag: "noun, masc. gen. sg.", lexical_meaning: "of the resplendent deity" },
        { word_order: 6, sanskrit_word: "धीमहि", iast_word: "dhīmahi", root: "dhyai (meditate)", grammatical_tag: "verb, optative/aorist 1st pl.", lexical_meaning: "we meditate upon" },
        { word_order: 7, sanskrit_word: "धियः", iast_word: "dhiyaḥ", root: "dhī (intellect)", grammatical_tag: "noun, fem. acc. pl.", lexical_meaning: "intellects, faculties of discernment" },
        { word_order: 8, sanskrit_word: "यः", iast_word: "yaḥ", grammatical_tag: "relative pronoun, masc. nom. sg.", lexical_meaning: "who" },
        { word_order: 9, sanskrit_word: "नः", iast_word: "naḥ", grammatical_tag: "pronoun, 1st pl. gen./dat.", lexical_meaning: "our" },
        { word_order: 10, sanskrit_word: "प्रचोदयात्", iast_word: "pracodayāt", root: "pra + cud (stimulate)", grammatical_tag: "verb, subjunctive 3rd sg.", lexical_meaning: "may awaken, impel, guide forward" }
      ],
      translations: [
        {
          language: "en",
          translation_text: "May we meditate upon that glorious effulgence of the divine Savitr; may He awaken and guide our intellectual faculties.",
          translator_name: "Ralph T.H. Griffith (adapted with Sanskrit lexicon)",
          source_reference: "Rigveda Hymns, Vol. 1",
          license_type: "Public Domain",
          is_primary: 1
        },
        {
          language: "en",
          translation_text: "We meditate on the adorable glory of the radiant sun of divine wisdom; may he illuminate and inspire our intellects.",
          translator_name: "Sir William Jones & S. Radhakrishnan (Comparative Translation)",
          source_reference: "Principal Upanishads & Vedic Hymns",
          license_type: "Public Domain",
          is_primary: 0
        }
      ],
      commentaries: [
        {
          school_id: "sch-sayana",
          commentator_name: "Sayana",
          original_text: "सवितुः सर्वान्तर्यामितया प्रेरकस्य देवस्य द्योतमानस्य परमेश्वरस्य तद्वरेण्यं भर्गः पापभर्जकं तेजो धीमहि ध्यायेम।",
          english_summary: "Sayana glosses 'bhargah' as that which burns away sin and ignorance (papa-bharjaka tejas), and Savitr as the inner impelling deity presiding over all mental cognition.",
          tradition_tag: "Veda Bhashya"
        },
        {
          school_id: "sch-advaita",
          commentator_name: "Adi Shankara (in Vedanta Sandhyavandana Bhashya)",
          english_summary: "Shankara identifies the solar deity Savitr with the supreme inner witness (Pratyagatman) whose illumination activates the mental faculties (buddhi).",
          tradition_tag: "Advaita Vedanta"
        }
      ],
      concept_ids: [
        { concept_id: "c-vidya", relevance_score: 1.0, contextual_note: "Direct prayer for awakening of intellect and spiritual knowledge." },
        { concept_id: "c-dhyana", relevance_score: 0.95, contextual_note: "Core verse of meditation and contemplative focus." },
        { concept_id: "c-rta", relevance_score: 0.85, contextual_note: "Harmonization with cosmic solar order." }
      ]
    },
    {
      id: "RV-7.59.12",
      text_id: "text-rigveda",
      section_id: "sec-rv-7-59",
      canonical_ref: "Rigveda 7.59.12",
      verse_number: "12",
      sanskrit_devanagari: "त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् । उर्वारुकमिव बन्धनान्मृत्य pushक्षीय मामृतात् ॥",
      sanskrit_iast: "tryambakaṁ yajāmahe sugandhiṁ puṣṭivardhanam | urvārukamiva bandhanān mṛtyor mukṣīya māmṛtāt ||",
      meter: "Anushtubh",
      rishi: "Maitravaruni Vasishtha",
      devata: "Rudra / Tryambaka",
      why_selected_default: "The canonical Mahamrityunjaya Mantra praying for liberation from death and mortality like a ripe cucumber falling effortlessly from its vine.",
      verified_status: "PUBLISHED",
      words: [
        { word_order: 1, sanskrit_word: "त्र्यम्बकम्", iast_word: "tryambakam", grammatical_tag: "noun, masc. acc. sg.", lexical_meaning: "the three-eyed lord / Lord of three realms" },
        { word_order: 2, sanskrit_word: "यजामहे", iast_word: "yajāmahe", root: "yaj (worship)", grammatical_tag: "verb, 1st pl. pres. mid.", lexical_meaning: "we honor, worship" },
        { word_order: 3, sanskrit_word: "सुगन्धिम्", iast_word: "sugandhim", grammatical_tag: "adj., acc. sg.", lexical_meaning: "fragrant, of sweet scent" },
        { word_order: 4, sanskrit_word: "पुष्टिवर्धनम्", iast_word: "puṣṭivardhanam", root: "puṣṭi + vṛdh", grammatical_tag: "adj., acc. sg.", lexical_meaning: "nourisher of growth and vitality" },
        { word_order: 5, sanskrit_word: "उर्वारुकम्", iast_word: "urvārukam", grammatical_tag: "noun, neuter acc. sg.", lexical_meaning: "a ripe melon/cucumber" },
        { word_order: 6, sanskrit_word: "इव", iast_word: "iva", grammatical_tag: "particle", lexical_meaning: "as, like" },
        { word_order: 7, sanskrit_word: "बन्धनात्", iast_word: "bandhanāt", root: "bandh (bind)", grammatical_tag: "noun, abl. sg.", lexical_meaning: "from bondage / from the stalk" },
        { word_order: 8, sanskrit_word: "मृत्योः", iast_word: "mṛtyoḥ", root: "mṛ (die)", grammatical_tag: "noun, abl. sg.", lexical_meaning: "from death and mortality" },
        { word_order: 9, sanskrit_word: "मुक्षीय", iast_word: "mukṣīya", root: "muc (liberate)", grammatical_tag: "verb, optative mid. 1st sg.", lexical_meaning: "may I be liberated" },
        { word_order: 10, sanskrit_word: "मा", iast_word: "mā", grammatical_tag: "prohibitive particle", lexical_meaning: "not" },
        { word_order: 11, sanskrit_word: "अमृतात्", iast_word: "amṛtāt", grammatical_tag: "noun, abl. sg.", lexical_meaning: "from immortality" }
      ],
      translations: [
        {
          language: "en",
          translation_text: "We worship the Three-Eyed One, fragrant and the nourisher of all vitality. As a ripe gourd is freed from its bondage to the vine, so may I be liberated from mortality, but not severed from immortality.",
          translator_name: "Arthur Anthony Macdonell / Classical translation",
          source_reference: "Vedic Reader & Hymns",
          license_type: "Public Domain",
          is_primary: 1
        }
      ],
      commentaries: [
        {
          school_id: "sch-sayana",
          commentator_name: "Sayana",
          english_summary: "Sayana explains the metaphor: just as a ripe fruit detaches effortlessly from the vine without tearing or injury, the seeker prays to be liberated from worldly embodiment without violent disruption, abiding in the nectar of spiritual immortality.",
          tradition_tag: "Veda Bhashya"
        }
      ],
      concept_ids: [
        { concept_id: "c-moksha", relevance_score: 1.0, contextual_note: "Ultimate liberation from cycle of mortality." },
        { concept_id: "c-atman", relevance_score: 0.85, contextual_note: "Realization of the immortal nature beyond bodily death." }
      ]
    },
    {
      id: "RV-10.129.1",
      text_id: "text-rigveda",
      section_id: "sec-rv-10-129",
      canonical_ref: "Rigveda 10.129.1",
      verse_number: "1",
      sanskrit_devanagari: "नासदासीन्नो सदासीत्तदानीं नासीद्रजो नो व्योमा परो यत् । किमावरीवः कुह कस्य शर्मन्नम्भः किमासीद्गहनं गभीरम् ॥",
      sanskrit_iast: "nāsad āsīn no sad āsīt tadānīṁ nāsīd rajo no vyomā paro yat | kim āvarīvaḥ kuha kasya śarmann ambhaḥ kim āsīd gahanaṁ gabhīram ||",
      meter: "Trishtubh (44 syllables: 11-11-11-11)",
      rishi: "Prajapati Parameshthi",
      devata: "Bhava-vritta (The Origin of Being)",
      why_selected_default: "Opening verse of the Nasadiya Sukta, exhibiting the profound ontological agnosticism and inquiry of the Vedic seers.",
      verified_status: "PUBLISHED",
      words: [
        { word_order: 1, sanskrit_word: "न", iast_word: "na", grammatical_tag: "negation", lexical_meaning: "neither" },
        { word_order: 2, sanskrit_word: "असत्", iast_word: "asat", root: "as (be)", grammatical_tag: "noun, neuter nom. sg.", lexical_meaning: "non-being, the unmanifest nonexistent" },
        { word_order: 3, sanskrit_word: "आसीत्", iast_word: "āsīt", root: "as (be)", grammatical_tag: "verb, imperf. 3rd sg.", lexical_meaning: "there was" },
        { word_order: 4, sanskrit_word: "नो", iast_word: "no", grammatical_tag: "conjunction", lexical_meaning: "nor" },
        { word_order: 5, sanskrit_word: "सत्", iast_word: "sat", root: "as (be)", grammatical_tag: "noun, neuter nom. sg.", lexical_meaning: "being, manifest existence" },
        { word_order: 6, sanskrit_word: "तदानीम्", iast_word: "tadānīm", grammatical_tag: "adverb", lexical_meaning: "at that primordial time" }
      ],
      translations: [
        {
          language: "en",
          translation_text: "Then was not non-existent nor existent: there was no realm of air, no sky beyond it. What covered in, and where? and what gave shelter? Was water there, unfathomed depth of water?",
          translator_name: "Ralph T.H. Griffith",
          source_reference: "The Hymns of the Rigveda (1896)",
          license_type: "Public Domain",
          is_primary: 1
        }
      ],
      commentaries: [
        {
          school_id: "sch-advaita",
          commentator_name: "Adi Shankara",
          english_summary: "Shankara cites this verse in the Brahma Sutra Bhashya as showing that prior to creation, name and form (nama-rupa) were non-differentiated, existing in unmanifest potentiality, identical with pure Brahman devoid of duality.",
          tradition_tag: "Advaita Vedanta"
        }
      ],
      concept_ids: [
        { concept_id: "c-brahman", relevance_score: 1.0, contextual_note: "The primordial source beyond manifest and unmanifest dualities." },
        { concept_id: "c-vidya", relevance_score: 0.85, contextual_note: "Epistemological inquiry into the origin of cosmos." }
      ]
    },
    {
      id: "ISHA-1.1",
      text_id: "text-isha",
      section_id: "sec-isha-1",
      canonical_ref: "Isha Upanishad 1",
      verse_number: "1",
      sanskrit_devanagari: "ईशा वास्यमिदं सर्वं यत्किञ्च जगत्यां जगत् । तेन त्यक्तेन भुञ्जीथा मा गृधः कस्यस्विद्धनम् ॥",
      sanskrit_iast: "īśā vāsyam idaṁ sarvaṁ yat kiñca jagatyāṁ jagat | tena tyaktena bhuñjīthā mā gṛdhaḥ kasyasvid dhanam ||",
      meter: "Anushtubh",
      why_selected_default: "The foundational Upanishadic principle reconciling renunciation and righteous enjoyment, forbidding greed.",
      verified_status: "PUBLISHED",
      words: [
        { word_order: 1, sanskrit_word: "ईशा", iast_word: "īśā", root: "īś (rule)", grammatical_tag: "noun, inst. sg.", lexical_meaning: "by the Lord / with divine consciousness" },
        { word_order: 2, sanskrit_word: "वास्यम्", iast_word: "vāsyam", root: "vas (envelop/dwell)", grammatical_tag: "gerundive, neuter nom.", lexical_meaning: "to be enveloped, pervaded" },
        { word_order: 3, sanskrit_word: "इदम्", iast_word: "idam", grammatical_tag: "pronoun, neuter nom. sg.", lexical_meaning: "this" },
        { word_order: 4, sanskrit_word: "सर्वम्", iast_word: "sarvam", grammatical_tag: "adj., neuter nom. sg.", lexical_meaning: "all, whole universe" },
        { word_order: 5, sanskrit_word: "यत्किञ्च", iast_word: "yat kiñca", grammatical_tag: "relative pronoun", lexical_meaning: "whatever" },
        { word_order: 6, sanskrit_word: "जगत्याम्", iast_word: "jagatyām", root: "gam (move)", grammatical_tag: "noun, fem. loc. sg.", lexical_meaning: "in the changing world" },
        { word_order: 7, sanskrit_word: "जगत्", iast_word: "jagat", root: "gam (move)", grammatical_tag: "noun, neuter nom. sg.", lexical_meaning: "moves, ephemeral creation" },
        { word_order: 8, sanskrit_word: "तेन", iast_word: "tena", grammatical_tag: "pronoun, inst. sg.", lexical_meaning: "by that" },
        { word_order: 9, sanskrit_word: "त्यक्तेन", iast_word: "tyaktena", root: "tyaj (renounce)", grammatical_tag: "participle, inst. sg.", lexical_meaning: "by renunciation, detachment" },
        { word_order: 10, sanskrit_word: "भुञ्जीथाः", iast_word: "bhuñjīthāḥ", root: "bhuj (enjoy/protect)", grammatical_tag: "verb, optative mid. 2nd sg.", lexical_meaning: "enjoy, protect yourself" },
        { word_order: 11, sanskrit_word: "मा", iast_word: "mā", grammatical_tag: "particle", lexical_meaning: "do not" },
        { word_order: 12, sanskrit_word: "गृधः", iast_word: "gṛdhaḥ", root: "gṛdh (crave/covet)", grammatical_tag: "verb, aorist subjunctive", lexical_meaning: "covet, crave" },
        { word_order: 13, sanskrit_word: "कस्यस्विद्", iast_word: "kasyasvid", grammatical_tag: "pronoun, gen. sg.", lexical_meaning: "anyone's" },
        { word_order: 14, sanskrit_word: "धनम्", iast_word: "dhanam", grammatical_tag: "noun, neuter acc. sg.", lexical_meaning: "wealth, possession" }
      ],
      translations: [
        {
          language: "en",
          translation_text: "All this—whatever moves in this moving world—is enveloped by the Supreme Lord. Enjoy it through renunciation; do not covet the wealth of anyone.",
          translator_name: "Swami Paramananda / Classical Vedic translation",
          source_reference: "The Upanishads (1919)",
          license_type: "Public Domain",
          is_primary: 1
        }
      ],
      commentaries: [
        {
          school_id: "sch-advaita",
          commentator_name: "Adi Shankara",
          original_text: "ईशा ईशिता परमेश्वरेण परमात्मात्मना सर्वमिदं वास्यम् अच्छाद्यम्... तेन त्यागेन भुञ्जीथाः पालयथाः।",
          english_summary: "Shankara comments that by recognizing everything as the one Atman, one renounces false notions of 'I' and 'mine'. Through this internal renunciation, one finds genuine spiritual protection without coveting external possessions.",
          tradition_tag: "Advaita Vedanta"
        },
        {
          school_id: "sch-vishishta",
          commentator_name: "Vedanta Desika (Vishishtadvaita Tradition)",
          english_summary: "The entire insentient and sentient creation belongs to the Supreme Sovereign (Ishvara) as His possession. One should use worldly goods as His sacred trustee without pride or avarice.",
          tradition_tag: "Vishishtadvaita"
        }
      ],
      concept_ids: [
        { concept_id: "c-vairagya", relevance_score: 1.0, contextual_note: "Enjoyment rooted in detachment (tyaktena bhunjitha)." },
        { concept_id: "c-dharma", relevance_score: 0.9, contextual_note: "Ethical restraint against coveting another's wealth." },
        { concept_id: "c-brahman", relevance_score: 0.95, contextual_note: "Pervasive presence of the divine in all transient phenomenon." }
      ]
    },
    {
      id: "KATHA-1.2.2",
      text_id: "text-katha",
      section_id: "sec-katha-1-2",
      canonical_ref: "Katha Upanishad 1.2.2",
      verse_number: "2",
      sanskrit_devanagari: "श्रेयश्च प्रेयश्च मनुष्यमेतस्तौ सम्परीत्य विविनक्ति धीरः । श्रेयो हि धीरोऽभि प्रेयसो वृणीते प्रेयो मन्दो योगक्षेमाद्वृणीते ॥",
      sanskrit_iast: "śreyaś ca preyaś ca manuṣyam etas tau samparītya vivinakti dhīraḥ | śreyo hi dhīro'bhi preyaso vṛṇīte preyo mando yogakṣemād vṛṇīte ||",
      meter: "Trishtubh",
      why_selected_default: "The fundamental distinction between the spiritually good (Shreyas) and the immediately pleasant (Preyas) confronting every human action.",
      verified_status: "PUBLISHED",
      words: [
        { word_order: 1, sanskrit_word: "श्रेयः", iast_word: "śreyaḥ", root: "śrī", grammatical_tag: "noun, neuter nom. sg.", lexical_meaning: "the good, spiritually beneficial, enduring truth" },
        { word_order: 2, sanskrit_word: "च", iast_word: "ca", grammatical_tag: "conjunction", lexical_meaning: "and" },
        { word_order: 3, sanskrit_word: "प्रेयः", iast_word: "preyaḥ", root: "prī", grammatical_tag: "noun, neuter nom. sg.", lexical_meaning: "the pleasant, immediately gratifying, fleeting" },
        { word_order: 4, sanskrit_word: "विविनक्ति", iast_word: "vivinakti", root: "vi + vic (discriminate)", grammatical_tag: "verb, 3rd sg. pres.", lexical_meaning: "discriminates, separates" },
        { word_order: 5, sanskrit_word: "धीरः", iast_word: "dhīraḥ", root: "dhī (intellect)", grammatical_tag: "noun, masc. nom. sg.", lexical_meaning: "the wise person of steady discernment" }
      ],
      translations: [
        {
          language: "en",
          translation_text: "Both the good (Shreyas) and the pleasant (Preyas) approach a person. The wise person, examining both thoroughly, discriminates between them. The wise chooses the good over the pleasant, while the short-sighted chooses the pleasant for bodily comfort and acquisition.",
          translator_name: "Swami Gambhirananda / Classical translation",
          source_reference: "Eight Upanishads with the Commentary of Sankaracarya",
          license_type: "Public Domain",
          is_primary: 1
        }
      ],
      commentaries: [
        {
          school_id: "sch-advaita",
          commentator_name: "Adi Shankara",
          english_summary: "Shankara observes that Shreyas leads to Moksha (liberation), while Preyas binds the soul to samsara through sensory allurements. Discrimination (viveka) is the prerequisite for self-realization.",
          tradition_tag: "Advaita Vedanta"
        }
      ],
      concept_ids: [
        { concept_id: "c-dharma", relevance_score: 1.0, contextual_note: "Discerning the higher ethical duty from short-term temptation." },
        { concept_id: "c-indriya", relevance_score: 0.95, contextual_note: "Control over impulses seeking immediate gratification." }
      ]
    },
    {
      id: "KATHA-1.3.3",
      text_id: "text-katha",
      section_id: "sec-katha-1-3",
      canonical_ref: "Katha Upanishad 1.3.3-4",
      verse_number: "3-4",
      sanskrit_devanagari: "आत्मानं रथिनं विद्धि शरीरं रथमेव तु । बुद्धिं तु सारथिं विद्धि मनः प्रग्रहमेव च ॥ इन्द्रियाणि हयानाहुर्विषयांस्तेषु गोचरान् ।",
      sanskrit_iast: "ātmānaṁ rathinaṁ viddhi śarīraṁ ratham eva tu | buddhiṁ tu sārathiṁ viddhi manaḥ pragraham eva ca || indriyāṇi hayān āhur viṣayāṁs teṣu gocarān |",
      meter: "Anushtubh",
      why_selected_default: "The famous chariot metaphor of self-mastery, mental control, and regulating sensory impulses.",
      verified_status: "PUBLISHED",
      words: [
        { word_order: 1, sanskrit_word: "आत्मानम्", iast_word: "ātmānam", grammatical_tag: "noun, acc. sg.", lexical_meaning: "the Self, the soul" },
        { word_order: 2, sanskrit_word: "रथिनम्", iast_word: "rathinam", root: "ratha", grammatical_tag: "noun, acc. sg.", lexical_meaning: "the master of the chariot, passenger" },
        { word_order: 3, sanskrit_word: "विद्धि", iast_word: "viddhi", root: "vid (know)", grammatical_tag: "verb, imperative 2nd sg.", lexical_meaning: "know, understand" },
        { word_order: 4, sanskrit_word: "शरीरम्", iast_word: "śarīram", grammatical_tag: "noun, acc. sg.", lexical_meaning: "the body" },
        { word_order: 5, sanskrit_word: "रथम्", iast_word: "ratham", grammatical_tag: "noun, acc. sg.", lexical_meaning: "the chariot" },
        { word_order: 6, sanskrit_word: "बुद्धिम्", iast_word: "buddhim", grammatical_tag: "noun, acc. sg.", lexical_meaning: "the intellect, discerning reason" },
        { word_order: 7, sanskrit_word: "सारथिम्", iast_word: "sārathim", grammatical_tag: "noun, acc. sg.", lexical_meaning: "the charioteer / driver" },
        { word_order: 8, sanskrit_word: "मनः", iast_word: "manaḥ", grammatical_tag: "noun, acc. sg.", lexical_meaning: "the thinking mind" },
        { word_order: 9, sanskrit_word: "प्रग्रहम्", iast_word: "pragraham", root: "grah", grammatical_tag: "noun, acc. sg.", lexical_meaning: "the reins" },
        { word_order: 10, sanskrit_word: "इन्द्रियाणि", iast_word: "indriyāṇi", grammatical_tag: "noun, neuter nom. pl.", lexical_meaning: "the senses" },
        { word_order: 11, sanskrit_word: "हयान्", iast_word: "hayān", grammatical_tag: "noun, masc. acc. pl.", lexical_meaning: "the horses" }
      ],
      translations: [
        {
          language: "en",
          translation_text: "Know the Self (Atman) as the lord of the chariot, and the body as the chariot itself. Know the intellect (Buddhi) as the charioteer, and the mind (Manas) as the reins. The senses, they declare, are the horses, and the sensory objects are the roads over which they range.",
          translator_name: "Swami Paramananda",
          source_reference: "The Upanishads (1919)",
          license_type: "Public Domain",
          is_primary: 1
        }
      ],
      commentaries: [
        {
          school_id: "sch-advaita",
          commentator_name: "Adi Shankara",
          english_summary: "Shankara explains that when the intellect is resolute and holds the reins of the mind firmly, the senses (horses) are restrained and guided safely to the goal of supreme liberation. If the intellect is weak, uncontrolled desires and anger destroy the chariot.",
          tradition_tag: "Advaita Vedanta"
        }
      ],
      concept_ids: [
        { concept_id: "c-indriya", relevance_score: 1.0, contextual_note: "Direct architecture of sense-control and emotional discipline." },
        { concept_id: "c-atman", relevance_score: 0.95, contextual_note: "The true witness master of the psychosomatic organism." },
        { concept_id: "c-krodha", relevance_score: 0.9, contextual_note: "Root mechanism for restraining turbulence and turbulent anger." }
      ]
    },
    {
      id: "BG-2.47",
      text_id: "text-bg",
      section_id: "sec-bg-2",
      canonical_ref: "Bhagavad Gita 2.47",
      verse_number: "47",
      sanskrit_devanagari: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन । मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥",
      sanskrit_iast: "karmaṇy evādhikāras te mā phaleṣu kadācana | mā karmaphalahetur bhūr mā te saṅgo'stv akarmaṇi ||",
      meter: "Anushtubh",
      why_selected_default: "The cornerstone principle of Nishkama Karma (selfless action without attachment to fruits).",
      verified_status: "PUBLISHED",
      words: [
        { word_order: 1, sanskrit_word: "कर्मणि", iast_word: "karmaṇi", root: "kṛ (do)", grammatical_tag: "noun, neuter loc. sg.", lexical_meaning: "in action alone" },
        { word_order: 2, sanskrit_word: "एव", iast_word: "eva", grammatical_tag: "emphatic particle", lexical_meaning: "certainly, alone" },
        { word_order: 3, sanskrit_word: "अधिकारः", iast_word: "adhikāraḥ", root: "adhi + kṛ", grammatical_tag: "noun, masc. nom. sg.", lexical_meaning: "right, entitlement, jurisdiction" },
        { word_order: 4, sanskrit_word: "ते", iast_word: "te", grammatical_tag: "pronoun, gen./dat. sg.", lexical_meaning: "your" },
        { word_order: 5, sanskrit_word: "मा", iast_word: "mā", grammatical_tag: "prohibitive particle", lexical_meaning: "never, not" },
        { word_order: 6, sanskrit_word: "फलेषु", iast_word: "phaleṣu", grammatical_tag: "noun, loc. pl.", lexical_meaning: "in the results/fruits" },
        { word_order: 7, sanskrit_word: "कदाचन", iast_word: "kadācana", grammatical_tag: "adverb", lexical_meaning: "at any time" },
        { word_order: 8, sanskrit_word: "हेतुः", iast_word: "hetuḥ", grammatical_tag: "noun, nom. sg.", lexical_meaning: "motive, cause" },
        { word_order: 9, sanskrit_word: "सङ्गः", iast_word: "saṅgaḥ", root: "sañj (cling)", grammatical_tag: "noun, nom. sg.", lexical_meaning: "attachment, clinging" },
        { word_order: 10, sanskrit_word: "अकर्मणि", iast_word: "akarmaṇi", root: "a + karman", grammatical_tag: "noun, loc. sg.", lexical_meaning: "in inaction" }
      ],
      translations: [
        {
          language: "en",
          translation_text: "You have a right to perform your prescribed duty, but never to the fruits of action. Never let the fruits of action be your motive, nor let your attachment be to inaction.",
          translator_name: "Swami Swarupananda / Classical translation",
          source_reference: "Srimad-Bhagavad-Gita (1909)",
          license_type: "Public Domain",
          is_primary: 1
        }
      ],
      commentaries: [
        {
          school_id: "sch-advaita",
          commentator_name: "Adi Shankara",
          original_text: "कर्मण्येव युद्धादौ अधिकारो न ज्ञाननिष्ठायां ते तव... फलतृष्णा मा भूत्।",
          english_summary: "Shankara explains that desire for fruit creates bondage and mental agitation. Acting with dedication to duty purifies the mind (chitta-shuddhi), making it fit for liberating knowledge.",
          tradition_tag: "Advaita Vedanta"
        },
        {
          school_id: "sch-vishishta",
          commentator_name: "Ramanujacharya",
          english_summary: "Ramanuja emphasizes that the agent is an instrument of the Divine; surrendering agency and results to Bhagavan transforms everyday work into worship (Bhagavad-aradhana).",
          tradition_tag: "Vishishtadvaita"
        }
      ],
      concept_ids: [
        { concept_id: "c-karma", relevance_score: 1.0, contextual_note: "The primary definition of detached action (Nishkama Karma)." },
        { concept_id: "c-dharma", relevance_score: 0.95, contextual_note: "Fulfilling one's duty without anxiety for outcome." },
        { concept_id: "c-vairagya", relevance_score: 0.9, contextual_note: "Freedom from attachment to fruits." }
      ]
    },
    {
      id: "BG-2.62-63",
      text_id: "text-bg",
      section_id: "sec-bg-2",
      canonical_ref: "Bhagavad Gita 2.62-63",
      verse_number: "62-63",
      sanskrit_devanagari: "ध्यायतो विषयान्पुंसः सङ्गस्तेषूपजायते । सङ्गात्सञ्जायते कामः कामात्क्रोधोऽभिजायते ॥ क्रोधाद्भवति संमोहः संमोहात्स्मृतिविभ्रमः । स्मृतिभ्रंशाद् बुद्धिनाशो बुद्धिनाशात्प्रणश्यति ॥",
      sanskrit_iast: "dhyāyato viṣayān puṁsaḥ saṅgas teṣūpajāyate | saṅgāt sañjāyate kāmaḥ kāmāt krodho'bhijāyate || krodhād bhavati saṁmohaḥ saṁmohāt smṛtivibhramaḥ | smṛtibhraṁśād buddhināśo buddhināśāt praṇaśyati ||",
      meter: "Anushtubh",
      why_selected_default: "The definitive Vedic/classical Indian psychology of how sensory dwelling leads to desire, frustration, anger (krodha), delusion, loss of memory, and intellectual ruin.",
      verified_status: "PUBLISHED",
      words: [
        { word_order: 1, sanskrit_word: "ध्यायतः", iast_word: "dhyāyataḥ", root: "dhyai (contemplate)", grammatical_tag: "participle, masc. gen. sg.", lexical_meaning: "of one meditating or brooding upon" },
        { word_order: 2, sanskrit_word: "विषयान्", iast_word: "viṣayān", grammatical_tag: "noun, masc. acc. pl.", lexical_meaning: "sense objects" },
        { word_order: 3, sanskrit_word: "पुंसः", iast_word: "puṁsaḥ", grammatical_tag: "noun, gen. sg.", lexical_meaning: "of a person" },
        { word_order: 4, sanskrit_word: "सङ्गः", iast_word: "saṅgaḥ", root: "sañj (attach)", grammatical_tag: "noun, masc. nom. sg.", lexical_meaning: "attachment, bonding" },
        { word_order: 5, sanskrit_word: "कामः", iast_word: "kāmaḥ", root: "kam (desire)", grammatical_tag: "noun, masc. nom. sg.", lexical_meaning: "longing, craving" },
        { word_order: 6, sanskrit_word: "क्रोधात्", iast_word: "krodhāt", root: "krudh (be angry)", grammatical_tag: "noun, abl. sg.", lexical_meaning: "from anger / wrath" },
        { word_order: 7, sanskrit_word: "संमोहः", iast_word: "saṁmohaḥ", root: "muh (delude)", grammatical_tag: "noun, nom. sg.", lexical_meaning: "bewilderment, delusion" },
        { word_order: 8, sanskrit_word: "स्मृतिविभ्रमः", iast_word: "smṛtivibhramaḥ", root: "smṛti + bhram", grammatical_tag: "noun, nom. sg.", lexical_meaning: "loss of memory / moral grounding" },
        { word_order: 9, sanskrit_word: "बुद्धिनाशः", iast_word: "buddhināśaḥ", root: "buddhi + naś", grammatical_tag: "noun, nom. sg.", lexical_meaning: "destruction of discriminative intellect" },
        { word_order: 10, sanskrit_word: "प्रणश्यति", iast_word: "praṇaśyati", root: "pra + naś (perish)", grammatical_tag: "verb, pres. 3rd sg.", lexical_meaning: "one is utterly ruined / falls down" }
      ],
      translations: [
        {
          language: "en",
          translation_text: "Brooding on the objects of senses, a person develops attachment to them; from attachment springs longing (kāma); from thwarted longing emerges anger (krodha). From anger arises delusion; from delusion comes confusion of memory; from loss of memory comes ruin of the intellect; and through ruin of the intellect, the person perishes.",
          translator_name: "Swami Swarupananda / Classical translation",
          source_reference: "Srimad-Bhagavad-Gita (1909)",
          license_type: "Public Domain",
          is_primary: 1
        }
      ],
      commentaries: [
        {
          school_id: "sch-advaita",
          commentator_name: "Adi Shankara",
          original_text: "क्रोधाद् भवति संमोहः अविवेकः... स्मृतिविभ्रमात् बुद्धिनाशः... स विनष्ट एव पुरुषः भवति।",
          english_summary: "Shankara traces the psychological ladder of destruction: when an obstacle impedes craving, wrath (krodha) erupts. Anger produces sammoha—incapacity to discern right from wrong. In this state, spiritual teachings and moral memory are forgotten, obliterating the discriminating faculty (buddhi).",
          tradition_tag: "Advaita Vedanta"
        },
        {
          school_id: "sch-vishishta",
          commentator_name: "Ramanujacharya",
          english_summary: "Ramanuja notes that brooding on sensory objects makes the mind helpless against impulsive passions. Thwarted desire inexorably yields anger against whoever or whatever stands in the way, plunging the soul into spiritual self-destruction.",
          tradition_tag: "Vishishtadvaita"
        }
      ],
      concept_ids: [
        { concept_id: "c-krodha", relevance_score: 1.0, contextual_note: "The definitive root-cause diagnosis of anger in the classical corpus." },
        { concept_id: "c-indriya", relevance_score: 0.98, contextual_note: "How unmastered senses trigger psychological degradation." },
        { concept_id: "c-dharma", relevance_score: 0.9, contextual_note: "Preservation of moral memory and righteous discernment." }
      ]
    },
    {
      id: "BG-3.35",
      text_id: "text-bg",
      section_id: "sec-bg-3",
      canonical_ref: "Bhagavad Gita 3.35",
      verse_number: "35",
      sanskrit_devanagari: "श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात् । स्वधर्मे निधनं श्रेयः परधर्मो भयावहः ॥",
      sanskrit_iast: "śreyān svadharmo viguṇaḥ paradharmāt svanuṣṭhitāt | svadharme nidhanaṁ śreyaḥ paradharmo bhayāvahaḥ ||",
      meter: "Anushtubh",
      why_selected_default: "The classical doctrine of Svadharma (one's authentic vocational duty aligned with natural disposition), vital for vocational queries.",
      verified_status: "PUBLISHED",
      words: [
        { word_order: 1, sanskrit_word: "श्रेयान्", iast_word: "śreyān", root: "śrī", grammatical_tag: "adj., comparative nom. sg.", lexical_meaning: "better, superior" },
        { word_order: 2, sanskrit_word: "स्वधर्मः", iast_word: "svadharmaḥ", root: "sva + dharma", grammatical_tag: "noun, masc. nom. sg.", lexical_meaning: "one's own natural duty/vocation" },
        { word_order: 3, sanskrit_word: "विगुणः", iast_word: "viguṇaḥ", grammatical_tag: "adj., nom. sg.", lexical_meaning: "devoid of merit, imperfectly executed" },
        { word_order: 4, sanskrit_word: "परधर्मात्", iast_word: "paradharmāt", root: "para + dharma", grammatical_tag: "noun, abl. sg.", lexical_meaning: "than another's duty" },
        { word_order: 5, sanskrit_word: "स्वनुष्ठितात्", iast_word: "svanuṣṭhitāt", root: "su + anu + sthā", grammatical_tag: "participle, abl. sg.", lexical_meaning: "well-performed, executed skillfully" },
        { word_order: 6, sanskrit_word: "निधनम्", iast_word: "nidhanam", grammatical_tag: "noun, nom. sg.", lexical_meaning: "death, falling in battle" },
        { word_order: 7, sanskrit_word: "भयावहः", iast_word: "bhayāvahaḥ", root: "bhaya + vah", grammatical_tag: "adj., nom. sg.", lexical_meaning: "fraught with danger/fear" }
      ],
      translations: [
        {
          language: "en",
          translation_text: "Better is one's own duty (svadharma), though imperfectly performed, than another's duty well-discharged. Better is death in the discharge of one's own duty; the duty of another is fraught with danger.",
          translator_name: "Swami Swarupananda",
          source_reference: "Srimad-Bhagavad-Gita (1909)",
          license_type: "Public Domain",
          is_primary: 1
        }
      ],
      commentaries: [
        {
          school_id: "sch-advaita",
          commentator_name: "Adi Shankara",
          english_summary: "Shankara explains that svadharma corresponds to action suited to one's psycho-physical nature and stage of life. Imitating another's role out of superficial prestige creates psychological disharmony and spiritual danger.",
          tradition_tag: "Advaita Vedanta"
        }
      ],
      concept_ids: [
        { concept_id: "c-svadharma", relevance_score: 1.0, contextual_note: "Authentic personal duty aligned with one's innate temperament." },
        { concept_id: "c-dharma", relevance_score: 0.95, contextual_note: "Universal ethical order manifested through individual action." }
      ]
    },
    {
      id: "BA-1.3.28",
      text_id: "text-brihadaranyaka",
      section_id: "sec-ba-1-3",
      canonical_ref: "Brihadaranyaka Upanishad 1.3.28",
      verse_number: "28",
      sanskrit_devanagari: "असतो मा सद्गमय । तमसो मा ज्योतिर्गमय । मृत्योर्माऽमृतं गमय ॥",
      sanskrit_iast: "asato mā sad gamaya | tamaso mā jyotir gamaya | mṛtyor mā'mṛtaṁ gamaya ||",
      meter: "Yajus prose chant",
      why_selected_default: "The Pavamana prayer expressing humanity's supreme aspiration from falsehood to truth, darkness to light, mortality to immortality.",
      verified_status: "PUBLISHED",
      words: [
        { word_order: 1, sanskrit_word: "असतः", iast_word: "asataḥ", root: "as", grammatical_tag: "noun, abl. sg.", lexical_meaning: "from the unreal, untruth, non-being" },
        { word_order: 2, sanskrit_word: "मा", iast_word: "mā", grammatical_tag: "pronoun, 1st sg. acc.", lexical_meaning: "me" },
        { word_order: 3, sanskrit_word: "सत्", iast_word: "sat", root: "as", grammatical_tag: "noun, neuter acc. sg.", lexical_meaning: "to reality, truth, true being" },
        { word_order: 4, sanskrit_word: "गमय", iast_word: "gamaya", root: "gam (causative imperative)", grammatical_tag: "verb, 2nd sg.", lexical_meaning: "lead, guide" },
        { word_order: 5, sanskrit_word: "तमसः", iast_word: "tamasaḥ", root: "tamas", grammatical_tag: "noun, abl. sg.", lexical_meaning: "from darkness / ignorance" },
        { word_order: 6, sanskrit_word: "ज्योतिः", iast_word: "jyotiḥ", root: "dyut", grammatical_tag: "noun, acc. sg.", lexical_meaning: "to light / spiritual awareness" },
        { word_order: 7, sanskrit_word: "मृत्योः", iast_word: "mṛtyoḥ", root: "mṛ", grammatical_tag: "noun, abl. sg.", lexical_meaning: "from death" },
        { word_order: 8, sanskrit_word: "अमृतम्", iast_word: "amṛtam", grammatical_tag: "noun, acc. sg.", lexical_meaning: "to immortality" }
      ],
      translations: [
        {
          language: "en",
          translation_text: "Lead me from the unreal to the real; lead me from darkness to light; lead me from death to immortality.",
          translator_name: "Swami Madhavananda / Classical translation",
          source_reference: "The Brhadaranyaka Upanisad (1934)",
          license_type: "Public Domain",
          is_primary: 1
        }
      ],
      commentaries: [
        {
          school_id: "sch-advaita",
          commentator_name: "Adi Shankara",
          english_summary: "Shankara clarifies: 'Asat' means evil actions and ignorance; 'Sat' means virtuous conduct and realization of Brahman. 'Tamas' is avidya (ignorance) and 'Jyoti' is the illuminating knowledge of the Self.",
          tradition_tag: "Advaita Vedanta"
        }
      ],
      concept_ids: [
        { concept_id: "c-satya", relevance_score: 1.0, contextual_note: "The quest for ultimate metaphysical and moral truth." },
        { concept_id: "c-vidya", relevance_score: 0.95, contextual_note: "Transition from ignorance (tamas) to illumination (jyoti)." },
        { concept_id: "c-moksha", relevance_score: 0.9, contextual_note: "Transcending the realm of mortal transience." }
      ]
    }
  ],
  concepts: [
    {
      id: "c-dharma",
      slug: "dharma",
      sanskrit_term: "dharma",
      iast_term: "dharma",
      english_title: "Dharma (Cosmic Order, Righteousness, Duty)",
      short_definition: "That which sustains, upholds, and integrates the individual, society, and cosmos in moral harmony.",
      etymology: "Derived from the root 'dhṛ' meaning 'to uphold, support, or sustain'.",
      category: "Fundamental Ethics & Cosmology",
      detailed_explanation: "Dharma is multidimensional in Vedic thought. At cosmic scale it manifests as Rta (natural order); at social scale as righteous conduct and justice; at individual scale as Svadharma (personal vocation according to disposition)."
    },
    {
      id: "c-krodha",
      slug: "krodha",
      sanskrit_term: "krodha",
      iast_term: "krodha",
      english_title: "Krodha (Anger, Wrath)",
      short_definition: "A destructive mental agitation arising from thwarted desires that clouds memory and dismantles intellect.",
      etymology: "Derived from the root 'krudh' meaning 'to be angry or passionate'.",
      category: "Psychology & Emotional Discipline",
      detailed_explanation: "Classical Indian psychology classifies Krodha as one of the six inner adversaries (Shadripu). Bhagavad Gita 2.62-63 outlines its exact genesis: brooding on objects creates attachment; attachment breeds desire; frustrated desire explodes as anger."
    },
    {
      id: "c-indriya",
      slug: "indriya-nigraha",
      sanskrit_term: "indriya-nigraha",
      iast_term: "indriya-nigraha",
      english_title: "Indriya Nigraha (Self-Control, Sense Regulation)",
      short_definition: "The discipline of reigning in sensory impulses via an alert, discriminating intellect.",
      etymology: "From 'indriya' (senses/powers) + 'nigraha' (restraint, holding back from the root 'grah').",
      category: "Psychology & Spiritual Practice",
      detailed_explanation: "Illustrated by Katha Upanishad's chariot metaphor (1.3.3) where the intellect (buddhi) acts as charioteer controlling sensory horses through the reins of the mind (manas)."
    },
    {
      id: "c-karma",
      slug: "karma",
      sanskrit_term: "karma",
      iast_term: "karma",
      english_title: "Karma (Action and Causality)",
      short_definition: "Intentional action and its inexorable causal consequences across moral and psychological realms.",
      etymology: "Derived from the verbal root 'kṛ' meaning 'to do, act, perform'.",
      category: "Ontology & Ethics",
      detailed_explanation: "Transformed in the Bhagavad Gita into Nishkama Karma: discharging required duties with skill and equanimity, without selfish clinging to the outcome."
    },
    {
      id: "c-svadharma",
      slug: "svadharma",
      sanskrit_term: "svadharma",
      iast_term: "svadharma",
      english_title: "Svadharma (Personal Duty & Authentic Vocation)",
      short_definition: "One's unique calling and ethical duty aligned with innate nature (svabhava).",
      etymology: "From 'sva' (own, authentic) + 'dharma' (duty, sustaining law).",
      category: "Applied Ethics & Vocation",
      detailed_explanation: "Emphasized in Gita 3.35 and 18.47. It teaches that one flourishes through an authentic vocation consonant with inner capacity, rather than superficial imitation."
    },
    {
      id: "c-atman",
      slug: "atman",
      sanskrit_term: "ātman",
      iast_term: "ātman",
      english_title: "Atman (The Inner Self / Consciousness)",
      short_definition: "The immortal witnessing consciousness distinct from body, senses, and fluctuating mind.",
      etymology: "Root 'an' (to breathe) or 'at' (to move continuously), signifying the permanent core.",
      category: "Metaphysics & Epistemology",
      detailed_explanation: "The central revelation of the Upanishads: beneath physiological layers (koshas) lies the unchanging witness (Sakshi)."
    },
    {
      id: "c-brahman",
      slug: "brahman",
      sanskrit_term: "brahman",
      iast_term: "brahman",
      english_title: "Brahman (The Infinite Ground of Being)",
      short_definition: "The ultimate, all-pervading, boundless reality from which all existence originates.",
      etymology: "From the root 'bṛh' meaning 'to expand, grow, surpass all limits'.",
      category: "Metaphysics",
      detailed_explanation: "Described as Sat-Chit-Ananda (Existence-Consciousness-Bliss). Realizing identity or union with Brahman constitutes Moksha."
    },
    {
      id: "c-vidya",
      slug: "vidya",
      sanskrit_term: "vidyā",
      iast_term: "vidyā",
      english_title: "Vidya (Sacred Knowledge & Discernment)",
      short_definition: "Liberating spiritual knowledge distinguishing the eternal from the ephemeral.",
      etymology: "From the verbal root 'vid' meaning 'to know, see, comprehend'.",
      category: "Epistemology",
      detailed_explanation: "Contrasted with Avidya (spiritual ignorance). Vidya is experiential realization, not merely theoretical intellect."
    },
    {
      id: "c-vairagya",
      slug: "vairagya",
      sanskrit_term: "vairāgya",
      iast_term: "vairāgya",
      english_title: "Vairagya (Detachment / Objective Dispassion)",
      short_definition: "Freedom from psychological coloring, craving, and involuntary clinging.",
      etymology: "From 'vi' (without) + 'rāga' (passion, color, craving).",
      category: "Psychological Mastery",
      detailed_explanation: "Not callous apathy, but radiant emotional freedom where one acts purposefully without being mentally held hostage by outcomes."
    },
    {
      id: "c-satya",
      slug: "satya",
      sanskrit_term: "satya",
      iast_term: "satya",
      english_title: "Satya (Truth & Integrity)",
      short_definition: "Accordance with reality in thought, speech, and action; absolute ontological truth.",
      etymology: "From 'sat' (that which is truly real, from the root 'as' - to be).",
      category: "Ethics & Cosmology",
      detailed_explanation: "Satya is both moral veracity and the metaphysical bedrock of the cosmos ('Satyameva Jayate')."
    },
    {
      id: "c-moksha",
      slug: "moksha",
      sanskrit_term: "mokṣa",
      iast_term: "mokṣa",
      english_title: "Moksha (Liberation / Transcendence)",
      short_definition: "Freedom from cyclic existential suffering, ignorance, and psychological bondage.",
      etymology: "From the verbal root 'muc' meaning 'to liberate, untie, release'.",
      category: "Ultimate Purpose (Purushartha)",
      detailed_explanation: "The supreme goal among the four Purusharthas (Dharma, Artha, Kama, Moksha), denoting realization of true unconditioned identity."
    },
    {
      id: "c-dhyana",
      slug: "dhyana",
      sanskrit_term: "dhyāna",
      iast_term: "dhyāna",
      english_title: "Dhyana (Contemplation & Meditation)",
      short_definition: "Unbroken stream of mental focus directed toward the higher reality.",
      etymology: "From 'dhyai' meaning 'to contemplate, meditate upon'.",
      category: "Spiritual Practice",
      detailed_explanation: "Cultivating tranquil one-pointed attention (ekagrata) to transcend sensory turbulence."
    },
    {
      id: "c-rta",
      slug: "rta",
      sanskrit_term: "ṛta",
      iast_term: "ṛta",
      english_title: "Rta (Cosmic Order & Rhythm)",
      short_definition: "The inherent order, rhythm, and moral law governing the Vedic cosmos.",
      etymology: "From the root 'ṛ' meaning 'to go, move, fit together'.",
      category: "Vedic Cosmology",
      detailed_explanation: "The Vedic precursor to Dharma; the harmony that governs the movement of celestial bodies, seasons, and moral equilibrium."
    }
  ],
  courses: [
    {
      id: "course-intro",
      slug: "foundations-of-vedic-literature",
      title: "Foundations of Vedic Literature",
      level: "beginner",
      description: "Understand the four Vedas, the Vedic corpus hierarchy, and primary core concepts without modern misconceptions.",
      order_index: 1,
      lessons: [
        {
          id: "les-intro-1",
          slug: "what-are-the-vedas",
          title: "What are the Vedas?",
          order_index: 1,
          estimated_minutes: 8,
          content_markdown: `# What are the Vedas?\n\nThe word **Veda** derives from the Sanskrit root *vid*, meaning "to know." The Vedas represent the foundational liturgical and spiritual literature of ancient India, preserved across millennia through rigorous oral transmission (*Śruti*).\n\n### The Four Canonical Samhitas\n1. **Rigveda (Ṛgveda)**: The Veda of hymns of praise (*ṛc*), containing 1,028 suktas.\n2. **Samaveda (Sāmaveda)**: The Veda of musical chanting (*sāman*), organizing poetic mantras into musical melodies.\n3. **Yajurveda (Yajurveda)**: The Veda of liturgical sacrificial formulas (*yajus*).\n4. **Atharvaveda (Atharvaveda)**: The Veda of everyday life, societal well-being, healing, and speculative philosophy.\n\n### The Four Strata of Vedic Texts\nWithin each Veda, four textual layers developed historically:\n* **Samhita**: The primary mantra collections.\n* **Brahmana**: Prose explanations of ritual context.\n* **Aranyaka**: 'Forest texts' introducing symbolic and esoteric interpretations.\n* **Upanishad**: The pinnacle philosophical dialogues (*Vedanta*) examining the nature of consciousness and liberation.`,
          quizzes: [
            {
              question_text: "What is the verbal root of the word 'Veda'?",
              options: ["Vṛ (to choose)", "Vid (to know)", "Vas (to live)", "Vand (to praise)"],
              correct_option_index: 1,
              explanation: "Veda comes from 'vid', meaning 'to know', denoting sacred knowledge."
            },
            {
              question_text: "Which layer of Vedic literature deals primarily with ultimate philosophical inquiries on Brahman and Atman?",
              options: ["Samhita", "Brahmana", "Upanishad", "Kalpa Sutra"],
              correct_option_index: 2,
              explanation: "The Upanishads (the Jnana-kanda or Vedanta) focus on metaphysical and spiritual wisdom."
            }
          ]
        },
        {
          id: "les-intro-2",
          slug: "what-is-dharma",
          title: "Understanding Dharma",
          order_index: 2,
          estimated_minutes: 10,
          content_markdown: `# Understanding Dharma\n\nDharma is one of the most rich and untranslatable concepts in Sanskrit literature. It cannot be simplified to 'religion' or 'creed'.\n\n### Etymology\nDerived from the root **dhṛ** — *to uphold, bear, or sustain*.\n> "dhāraṇād dharma ity āhur dharmo dhārayate prajāḥ" — *Dharma is that which sustains all beings and holds society together.*\n\n### Three Manifestations\n1. **Rta/Cosmic Law**: The order that sustains the natural universe.\n2. **Sadharana Dharma**: Universal virtues incumbent on all humans: truth (*Satya*), non-injury (*Ahimsa*), self-restraint (*Dama*), and charity (*Dana*).\n3. **Svadharma**: One's particular duty aligned with natural disposition (*svabhava*) and life stage.`,
          quizzes: [
            {
              question_text: "What root meaning underlies the Sanskrit term 'Dharma'?",
              options: ["To conquer", "To renounce", "To uphold or sustain", "To worship"],
              correct_option_index: 2,
              explanation: "Dharma derives from 'dhṛ', meaning to uphold, sustain, or support moral and cosmic order."
            }
          ]
        }
      ]
    },
    {
      id: "course-intermediate",
      slug: "upanishadic-thought-and-psychology",
      title: "Upanishadic Thought & Psychology of Self-Mastery",
      level: "intermediate",
      description: "Dive deep into the chariot metaphor, the nature of desire and anger, and the philosophical debate between Advaita and Vishishtadvaita.",
      order_index: 2,
      lessons: [
        {
          id: "les-inter-1",
          slug: "anatomy-of-anger-in-gita",
          title: "The Anatomy of Anger (Bhagavad Gita 2.62-63)",
          order_index: 1,
          estimated_minutes: 12,
          content_markdown: `# The Anatomy of Anger (Krodha)\n\nIn Bhagavad Gita 2.62-63, classical Indian philosophy offers an exacting analysis of psychological destabilization.\n\n### The Sequence of Downfall\n1. **Dhyāyato viṣayān**: Continual mental preoccupation with sensory objects.\n2. **Saṅga**: Emotional fixation and psychological dependence.\n3. **Kāma**: Craving and demand for gratification.\n4. **Krodha**: When craving is thwarted by reality, wrath and resentment burst forth.\n5. **Saṁmoha**: Clouding of objective perception and moral judgment.\n6. **Smṛti-vibhrama**: Loss of memory of learned principles and wisdom.\n7. **Buddhi-nāśa**: Collapse of higher reasoning.\n8. **Praṇaśyati**: Psychological and moral ruin.\n\n### The Remedy\nThe remedy is not violent repression, but **Indriya-nigraha** (channeling senses through a trained, alert intellect).`,
          quizzes: [
            {
              question_text: "According to Bhagavad Gita 2.62, what is the immediate psychological root that produces anger (krodha)?",
              options: ["Physical weakness", "Thwarted desire/attachment (kāma/saṅga)", "Lack of ritual sacrifice", "Astrological influences"],
              correct_option_index: 1,
              explanation: "Anger arises from thwarted longing (kāma) which originated in mental preoccupation (dhyāna) and attachment (saṅga)."
            }
          ]
        }
      ]
    }
  ],
  sources: [
    {
      id: "src-griffith-rv",
      title: "The Hymns of the Rigveda",
      author: "Vedic Seers",
      translator: "Ralph T.H. Griffith",
      publisher: "E.J. Lazarus and Co., Benares",
      publication_year: "1896",
      url: "https://www.sacred-texts.com/hin/rigveda/",
      license: "Public Domain",
      copyright_status: "Public Domain",
      public_domain_flag: 1
    },
    {
      id: "src-macdonell",
      title: "A Vedic Reader for Students",
      author: "Arthur Anthony Macdonell",
      translator: "Arthur Anthony Macdonell",
      publisher: "Oxford University Press",
      publication_year: "1917",
      url: "https://archive.org/details/vedicreaderforst00macd",
      license: "Public Domain",
      copyright_status: "Public Domain",
      public_domain_flag: 1
    },
    {
      id: "src-upanishads-paramananda",
      title: "The Upanishads: Translated and Commentated",
      author: "Upanishadic Rishis",
      translator: "Swami Paramananda",
      publisher: "The Vedanta Centre, Boston",
      publication_year: "1919",
      url: "https://archive.org/details/upanishadstransl00paraiala",
      license: "Public Domain",
      copyright_status: "Public Domain",
      public_domain_flag: 1
    },
    {
      id: "src-gita-swarupananda",
      title: "Srimad-Bhagavad-Gita (Original Text with Word-for-Word Translation and Notes)",
      author: "Vyasa",
      translator: "Swami Swarupananda",
      publisher: "Advaita Ashrama, Mayavati",
      publication_year: "1909",
      url: "https://archive.org/details/srimadbhagavadgi00swar",
      license: "Public Domain",
      copyright_status: "Public Domain",
      public_domain_flag: 1
    }
  ]
};
