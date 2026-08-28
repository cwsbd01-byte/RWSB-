import { VetClinicBD, DietItem } from '../types';

export const BANGLADESH_VET_CLINICS: VetClinicBD[] = [
  // --- DHAKA DIVISION ---
  {
    id: 'vet-sau-dhaka',
    name: 'Sher-e-Bangla Agricultural University (SAU) Veterinary Teaching Hospital',
    division: 'Dhaka',
    area: 'Agargaon, Sher-e-Bangla Nagar',
    address: 'SAU Campus, Agargaon, Dhaka 1207',
    phone: '01712-882299',
    altPhone: '01819-445566',
    emergency24h: true,
    hasExoticSpecialist: true,
    notes: 'Top tier university teaching hospital with advanced pathology lab, digital X-ray, nebulization & surgery for rabbits.'
  },
  {
    id: 'vet-cvasu-dhaka',
    name: 'Central Veterinary Hospital (CVH) & Disease Investigation Lab',
    division: 'Dhaka',
    area: 'Alauddin Road, Old Dhaka',
    address: '48 Kazi Alauddin Road, Dhaka 1000',
    phone: '02-9556095',
    altPhone: '01711-235890',
    emergency24h: false,
    hasExoticSpecialist: true,
    notes: 'Government Central Veterinary Hospital with experienced senior veterinary surgeons & affordable medicine.'
  },
  {
    id: 'vet-care-dhanmondi',
    name: 'Pet Animal Care & Treatment Clinic (PACT)',
    division: 'Dhaka',
    area: 'Dhanmondi',
    address: 'House 32, Road 7/A, Dhanmondi R/A, Dhaka 1209',
    phone: '01715-123456',
    altPhone: '01912-334455',
    emergency24h: true,
    hasExoticSpecialist: true,
    notes: 'Specialized small animal clinic with dedicated rabbit dental burring, GI stasis intensive supportive care and nebulizer.'
  },
  {
    id: 'vet-gulshan-uttara',
    name: 'Pet Zone & Small Animal Veterinary Care',
    division: 'Dhaka',
    area: 'Uttara Model Town',
    address: 'House 14, Road 18, Sector 4, Uttara, Dhaka 1230',
    phone: '01720-998877',
    altPhone: '01678-112233',
    emergency24h: true,
    hasExoticSpecialist: true,
    notes: '24/7 on-call emergency service for rabbit bloat, hypothermia warming pads & fracture management.'
  },
  {
    id: 'vet-pet-care-mirpur',
    name: 'Mirpur Pet Clinic & Diagnostic Center',
    division: 'Dhaka',
    area: 'Mirpur-10 / Mirpur-2',
    address: 'Plot 12, Block C, Section 10, Mirpur, Dhaka 1216',
    phone: '01733-445566',
    altPhone: '01844-556677',
    emergency24h: false,
    hasExoticSpecialist: true,
    notes: 'Experienced in rabbit respiratory infection, skin mites/mange treatment, deworming & post-operative care.'
  },
  {
    id: 'vet-banani-animal-hospital',
    name: 'Care For Paws & Exotic Pet Clinic',
    division: 'Dhaka',
    area: 'Banani / Gulshan-2',
    address: 'Road 11, Block D, Banani, Dhaka 1213',
    phone: '01711-889900',
    altPhone: '01977-889900',
    emergency24h: true,
    hasExoticSpecialist: true,
    notes: 'Premium small pet care, ultrasound diagnostics, specialized anesthesia protocol for delicate rabbits.'
  },
  {
    id: 'vet-savar-blri',
    name: 'Savar Upazila Livestock Office & BLRI Veterinary Clinic',
    division: 'Dhaka',
    area: 'Savar / Jahangirnagar',
    address: 'Upazila Parishad Compound, Savar, Dhaka',
    phone: '01712-337788',
    emergency24h: false,
    hasExoticSpecialist: false,
    notes: 'Government livestock veterinary surgeon, rapid wound dressing, emergency injections and general checkup.'
  },
  {
    id: 'vet-narayanganj-dist',
    name: 'Narayanganj District Veterinary Hospital',
    division: 'Dhaka',
    area: 'Narayanganj Sadar',
    address: 'Chashara, Narayanganj 1400',
    phone: '01718-445522',
    emergency24h: false,
    hasExoticSpecialist: false,
    notes: 'District veterinary hospital offering basic surgery, injury dressing & anti-parasitic treatment for rabbits.'
  },
  {
    id: 'vet-gazipur-bauf',
    name: 'Gazipur District Veterinary Hospital & BSMRAU Clinical Unit',
    division: 'Dhaka',
    area: 'Salna / Gazipur Sadar',
    address: 'Joydebpur Road, Gazipur 1700',
    phone: '01716-884433',
    emergency24h: false,
    hasExoticSpecialist: true,
    notes: 'Veterinary medical services, subcutaneous fluid administration, parasite eradication & dietary consultation.'
  },

  // --- CHATTOGRAM DIVISION ---
  {
    id: 'vet-cvasu-ctg',
    name: 'Chattogram Veterinary and Animal Sciences University (CVASU) Teaching Hospital',
    division: 'Chattogram',
    area: 'Khulshi, Chattogram',
    address: 'Zakir Hossain Road, Khulshi, Chattogram 4225',
    phone: '031-659093',
    altPhone: '01711-232323',
    emergency24h: true,
    hasExoticSpecialist: true,
    notes: 'Premier university hospital in CTG with specialized exotic animal ward, digital radiography and intensive monitoring.'
  },
  {
    id: 'vet-cvasu-shahed-outdoor',
    name: 'CVASU Shahed Animal Hospital (Clinical Outdoor)',
    division: 'Chattogram',
    area: 'Panchlaish / Nasirabad',
    address: 'Nasirabad Housing Society, Road 3, Chattogram',
    phone: '01819-332211',
    emergency24h: false,
    hasExoticSpecialist: true,
    notes: 'Outpatient treatment for rabbits, teeth trimming, gastrointestinal motility medications and deworming.'
  },
  {
    id: 'vet-ctg-pet-care',
    name: 'Chittagong Pet Clinic & Surgery Center',
    division: 'Chattogram',
    area: 'GEC Circle / Dampara',
    address: 'CDA Avenue, GEC Circle, Chattogram',
    phone: '01817-556677',
    altPhone: '01715-667788',
    emergency24h: true,
    hasExoticSpecialist: true,
    notes: 'Private emergency animal clinic, IV fluid setup, oxygen support, wound repair and surgical intervention.'
  },
  {
    id: 'vet-cumilla-dist',
    name: 'Cumilla District Veterinary Hospital',
    division: 'Chattogram',
    area: 'Kandirpar, Cumilla',
    address: 'Court Compound, Kandirpar, Cumilla 3500',
    phone: '01713-778899',
    emergency24h: false,
    hasExoticSpecialist: false,
    notes: 'District Livestock Office vet doctors offering affordable prescription, wound debridement and vitamin therapies.'
  },
  {
    id: 'vet-coxsbazar-dist',
    name: 'Cox\'s Bazar District Veterinary Hospital',
    division: 'Chattogram',
    area: 'Cox\'s Bazar Sadar',
    address: 'Hospital Road, Jhawtala, Cox\'s Bazar',
    phone: '01714-990011',
    emergency24h: false,
    hasExoticSpecialist: false,
    notes: 'General veterinary care, ear mite eradication, and dietary guidance for pet rabbits.'
  },

  // --- SYLHET DIVISION ---
  {
    id: 'vet-sylhet-sau',
    name: 'Sylhet Agricultural University (SAU) Veterinary Teaching Hospital',
    division: 'Sylhet',
    area: 'Tilagarh, Sylhet',
    address: 'Alurtol Road, Tilagarh, Sylhet 3100',
    phone: '01712-445566',
    altPhone: '01818-990022',
    emergency24h: true,
    hasExoticSpecialist: true,
    notes: 'Specialized university veterinary faculty with full diagnostics, fluid therapy and surgery for pet rabbits.'
  },
  {
    id: 'vet-sylhet-zindabazar',
    name: 'Surma Pet & Exotic Animal Clinic',
    division: 'Sylhet',
    area: 'Zindabazar / Shibgonj',
    address: 'Shibgonj Point, Sylhet Sadar, Sylhet',
    phone: '01716-112233',
    emergency24h: false,
    hasExoticSpecialist: true,
    notes: 'Rabbit GI stasis emergency feeding kit, ear mite clearing, dental checkups and vitamins.'
  },

  // --- MYMENSINGH DIVISION ---
  {
    id: 'vet-bau-mymensingh',
    name: 'Bangladesh Agricultural University (BAU) Veterinary Clinic Complex',
    division: 'Mymensingh',
    area: 'BAU Campus, Mymensingh',
    address: 'Veterinary Clinic Complex, BAU Campus, Mymensingh 2202',
    phone: '01714-556677',
    altPhone: '01911-334455',
    emergency24h: true,
    hasExoticSpecialist: true,
    notes: 'National academic center of veterinary excellence in Bangladesh. Comprehensive rabbit surgery, pathology & ICU.'
  },
  {
    id: 'vet-mymensingh-sadar',
    name: 'Mymensingh District Veterinary Hospital',
    division: 'Mymensingh',
    area: 'Town Hall / Sadar',
    address: 'Kachijhuli, Mymensingh Sadar',
    phone: '01715-668899',
    emergency24h: false,
    hasExoticSpecialist: false,
    notes: 'Government livestock veterinary surgeons providing general checks, medicine prescriptions & injury aid.'
  },

  // --- RAJSHAHI DIVISION ---
  {
    id: 'vet-rajshahi-ru-hospital',
    name: 'Rajshahi University Veterinary Clinic (Faculty of Vet Science)',
    division: 'Rajshahi',
    area: 'RU Campus, Motihar',
    address: 'Department of Veterinary & Animal Sciences, Rajshahi University, Rajshahi 6205',
    phone: '01713-223344',
    altPhone: '01815-667799',
    emergency24h: true,
    hasExoticSpecialist: true,
    notes: 'University clinical professors specializing in internal medicine, infectious disease testing and small animal care.'
  },
  {
    id: 'vet-rajshahi-vet',
    name: 'Rajshahi District Veterinary Hospital (DLO Office)',
    division: 'Rajshahi',
    area: 'Kazihata / Court Road',
    address: 'Court Road, Kazihata, Rajshahi 6000',
    phone: '01715-998800',
    emergency24h: false,
    hasExoticSpecialist: false,
    notes: 'Government veterinary clinic for deworming, wound stitching, subcutaneous saline and antibiotics.'
  },
  {
    id: 'vet-bogra-dist',
    name: 'Bogura District Veterinary Hospital',
    division: 'Rajshahi',
    area: 'Shatmatha / Jaleshwaritola',
    address: 'Sherpur Road, Bogura Sadar, Bogura',
    phone: '01712-990033',
    emergency24h: false,
    hasExoticSpecialist: false,
    notes: 'Veterinary outpatient service, digestive trouble remedies and vitamin supplements.'
  },

  // --- KHULNA DIVISION ---
  {
    id: 'vet-khulna-pet-care',
    name: 'Khulna Pet Hospital & Diagnostic Center',
    division: 'Khulna',
    area: 'Sonadanga / Boyra',
    address: 'Majid Sarani, Sonadanga, Khulna 9100',
    phone: '01718-224466',
    altPhone: '01914-778899',
    emergency24h: true,
    hasExoticSpecialist: true,
    notes: 'Specialist care for rabbits & exotic pets in Khulna. Emergency hydration, critical care syringe feeding & surgery.'
  },
  {
    id: 'vet-khulna-dist',
    name: 'Khulna District Veterinary Hospital',
    division: 'Khulna',
    area: 'Gollamari / Sadar',
    address: 'Gollamari, Khulna 9000',
    phone: '01716-559900',
    emergency24h: false,
    hasExoticSpecialist: false,
    notes: 'District Livestock Office with veterinary surgeons for routine checks, abscess treatment and deworming.'
  },
  {
    id: 'vet-jashore-just',
    name: 'Jashore University of Science & Technology (JUST) Veterinary Clinic',
    division: 'Khulna',
    area: 'Chowgacha Road, Jashore',
    address: 'JUST Campus, Jashore 7408',
    phone: '01711-447788',
    emergency24h: false,
    hasExoticSpecialist: true,
    notes: 'University veterinary training hospital with diagnostic lab, microscopy for parasites and clinical advice.'
  },

  // --- BARISHAL DIVISION ---
  {
    id: 'vet-pstu-barishal',
    name: 'Patuakhali Science and Technology University (PSTU) Vet Clinic & Barishal Center',
    division: 'Barishal',
    area: 'Babuganj / Sadar',
    address: 'Faculty of Animal Science and Vet Medicine, Babuganj, Barishal',
    phone: '01715-332211',
    altPhone: '01817-449900',
    emergency24h: true,
    hasExoticSpecialist: true,
    notes: 'Specialized veterinary doctors experienced in rabbit pathology, digestive disorders and trauma care.'
  },
  {
    id: 'vet-barishal-dist',
    name: 'Barishal District Veterinary Hospital',
    division: 'Barishal',
    area: 'Band Road / Sadar',
    address: 'Band Road, Barishal 8200',
    phone: '01719-880022',
    emergency24h: false,
    hasExoticSpecialist: false,
    notes: 'Government livestock hospital offering routine pet medical checkups, wound cleaning and prescriptions.'
  },

  // --- RANGPUR DIVISION ---
  {
    id: 'vet-hstu-dinajpur',
    name: 'Hajee Mohammad Danesh Science & Technology University (HSTU) Veterinary Teaching Hospital',
    division: 'Rangpur',
    area: 'Basherhat, Dinajpur',
    address: 'HSTU Campus, Dinajpur 5200',
    phone: '01717-665544',
    altPhone: '01912-887766',
    emergency24h: true,
    hasExoticSpecialist: true,
    notes: 'Premier veterinary hospital in Northern Bangladesh with surgery units, digital imaging & rabbit stasis protocol.'
  },
  {
    id: 'vet-rangpur-dist',
    name: 'Rangpur District Veterinary Hospital & Livestock Office',
    division: 'Rangpur',
    area: 'Dhap, Rangpur Sadar',
    address: 'Medical College Road, Dhap, Rangpur 5400',
    phone: '01714-332288',
    emergency24h: false,
    hasExoticSpecialist: false,
    notes: 'Government veterinary clinic providing basic clinical care, skin treatment, vitamin and antibiotic support.'
  }
];

export const RABBIT_DIET_GUIDE: DietItem[] = [
  {
    id: 'diet-hay-timothy',
    nameBn: 'তিমোথি হে / ওট হে (Timothy / Oat Hay)',
    nameEn: 'Timothy / Oat Grass Hay',
    category: 'hay_grass',
    benefitOrRiskBn: 'খরগোশের খাদ্যের ৮০-৮৫% অবশ্যই ঘাস/হে হতে হবে। এটি দাঁতের অতিরিক্ত বৃদ্ধি রোধ করে এবং অন্ত্রের গতি স্বাভাবিক রাখে।',
    benefitOrRiskEn: 'Must constitute 80-85% of total diet. Keeps teeth ground down and digestive tract moving properly.',
    servingAdviceBn: '২৪ ঘণ্টা নিরবচ্ছিন্নভাবে খাঁচায় বা লিটার বক্সে তাজা রাখতে হবে (Unlimited Unlimited)।',
    servingAdviceEn: 'Unlimited 24/7 access in litter box and hay rack.',
    localAvailabilityBD: 'স্থানীয় পেট শপ, অনলাইন হে সেলার বা ইম্পোর্টেড তিমোথি হে।',
    iconName: 'Wheat'
  },
  {
    id: 'diet-durba-grass',
    nameBn: 'তাজা দুর্বা ঘাস / বারমুডা ঘাস (Fresh Durba/Bermuda Grass)',
    nameEn: 'Fresh Durba / Bermuda Grass (Locally Sourced)',
    category: 'hay_grass',
    benefitOrRiskBn: 'বাংলাদেশে অত্যন্ত সহজলভ্য প্রাকৃতিক ফাইবার উৎস। ভালো করে ধুয়ে শুকিয়ে দিলে চমৎকার হজম সহায়ক।',
    benefitOrRiskEn: 'Highly accessible natural fiber in Bangladesh. Must be thoroughly washed and free of pesticides/dog urine.',
    servingAdviceBn: 'কীটনাশকমুক্ত এলাকা থেকে সংগ্রহ করে ভালোমতো ধুয়ে পানি ঝরিয়ে দিন।',
    servingAdviceEn: 'Pick only from clean, pesticide-free lawns. Wash thoroughly and pat dry.',
    localAvailabilityBD: 'বাংলাদেশের যেকোনো মাঠ, পার্ক বা ছাদবাগানে চাষ করা যায়।',
    iconName: 'Sprout'
  },
  {
    id: 'diet-coriander',
    nameBn: 'ধনেপাতা (Fresh Coriander / Cilantro)',
    nameEn: 'Fresh Coriander / Cilantro',
    category: 'safe_greens',
    benefitOrRiskBn: 'ভিটামিন এ ও সি সমৃদ্ধ। গ্যাস্ট্রিক দূর করতে ও ক্ষুধাবর্ধক হিসেবে খরগোশ দারুণ পছন্দ করে।',
    benefitOrRiskEn: 'Rich in Vitamin A & C. Highly appetizing for picky eaters and aids mild digestion.',
    servingAdviceBn: 'প্রতি কেজি ওজনের জন্য প্রতিদিন ১ কাপ তাজা ধোয়া ধনেপাতা দেওয়া নিরাপদ।',
    servingAdviceEn: '1 packed cup per 1 kg body weight daily.',
    localAvailabilityBD: 'বাংলাদেশের যেকোনো কাঁচাবাজারে বারোমাস সহজলভ্য।',
    iconName: 'Leaf'
  },
  {
    id: 'diet-mint',
    nameBn: 'পুদিনা পাতা (Mint / Pudina)',
    nameEn: 'Fresh Mint Leaves',
    category: 'safe_greens',
    benefitOrRiskBn: 'পেটের গ্যাস দূর করতে ও স্ট্রেস কমাতে দারুণ উপকারী। অসুস্থ খরগোশের রুচি ফেরাতে সাহায্য করে।',
    benefitOrRiskEn: 'Calms stomach upset, helps relieve mild gas and stimulates appetite.',
    servingAdviceBn: 'কয়েকটি ডালপালা বা পাতা প্রতিদিনের শাকের মিশ্রণে দিন।',
    servingAdviceEn: 'Few sprigs daily mixed with other safe leafy greens.',
    localAvailabilityBD: 'স্থানীয় কাঁচাবাজারে অথবা ছাদবাগানের টবে খুব সহজে জন্মায়।',
    iconName: 'Leaf'
  },
  {
    id: 'diet-romaine-lettuce',
    nameBn: 'রোমেইন লেটুস (Romaine / Green Leaf Lettuce)',
    nameEn: 'Romaine Lettuce (NOT Iceberg!)',
    category: 'safe_greens',
    benefitOrRiskBn: 'উচ্চ আর্দ্রতা ও ফাইবারযুক্ত। (সতর্কতা: আইসবার্গ লেটুস কখনই দেবেন না, কারণ এতে ল্যাকটুকারিয়াম বিষাক্ত উপাদান থাকে)।',
    benefitOrRiskEn: 'Great hydration & fiber. NEVER feed Iceberg lettuce (contains harmful lactucarium).',
    servingAdviceBn: 'গাঢ় সবুজ রঙের রোমেইন বা বাটারহেড লেটুসের তাজা পাতা দিন।',
    servingAdviceEn: 'Feed dark green Romaine leaves. Wash thoroughly.',
    localAvailabilityBD: 'সুপারশপ (স্বপ্ন, ইউনিমার্ট) এবং বড় কাঁচাবাজার।',
    iconName: 'Salad'
  },
  {
    id: 'diet-carrot-tops',
    nameBn: 'গাজরের পাতা ও শাক (Carrot Tops)',
    nameEn: 'Carrot Tops (Greens)',
    category: 'safe_greens',
    benefitOrRiskBn: 'গাজরের মূলের চেয়ে গাজরের পাতা খরগোশের জন্য বহুগুণে স্বাস্থ্যকর (গাজরের মূলে অতিরিক্ত চিনি থাকে)।',
    benefitOrRiskEn: 'Much healthier than carrot root. High in natural minerals and calcium.',
    servingAdviceBn: 'সপ্তাহে ৩-৪ দিন শাক হিসেবে দিন।',
    servingAdviceEn: '3-4 times weekly as part of mixed green salad.',
    localAvailabilityBD: 'শীতকালে ও কাঁচাবাজারে গাজর কেনার সময় পাতা সংগ্রহ করা যায়।',
    iconName: 'Carrot'
  },
  {
    id: 'diet-pellets',
    nameBn: 'মানসম্মত খরগোশের পিলেটস (Plain Rabbit Pellets)',
    nameEn: 'High-Fiber Plain Pellets (No Seeds/Nuts)',
    category: 'limited_treat',
    benefitOrRiskBn: 'অতিরিক্ত পিলেটস দিলে স্থূলতা এবং দাঁতের ক্ষয় হয়। শুধুমাত্র বয়স অনুযায়ী পরিমিত পুষ্টির জন্য দিন।',
    benefitOrRiskEn: 'Feed strictly measured amounts. Pellets should have minimum 18%+ crude fiber and zero seeds/colorful bits.',
    servingAdviceBn: 'প্রাপ্তবয়স্ক খরগোশের জন্য প্রতিদিন সর্বোচ্চ ১-২ টেবিল চামচ।',
    servingAdviceEn: '1-2 tablespoons per 2 kg body weight daily.',
    localAvailabilityBD: 'বাংলাদেশে মানসম্মত ব্র্যান্ডেড পিলেটস যেমন Versele-Laga Cuni, Oxbow ইত্যাদি।',
    iconName: 'CircleDot'
  },
  {
    id: 'diet-treat-apple-banana',
    nameBn: 'আপেল / কলা / গাজর (Apple/Banana/Carrot - Treat)',
    nameEn: 'Fruit Treats (Apple, Banana, Papaya)',
    category: 'limited_treat',
    benefitOrRiskBn: 'অতিরিক্ত চিনি থাকে যা পেটের উপকারী ব্যাকটেরিয়ার ভারসাম্য নষ্ট করে। শুধুই পুরস্কার বা ওষুধ খাওয়ানোর সময় দিন।',
    benefitOrRiskEn: 'High in natural sugars. Overfeeding disrupts cecal gut flora.',
    servingAdviceBn: 'একটি নখের সাইজের সমান টুকরো (সর্বোচ্চ সপ্তাহে ২ দিন)। আপেলের বীজ অবশ্যই বাদ দিতে হবে।',
    servingAdviceEn: 'Thumb-nail sized piece maximum 1-2 times weekly. Remove all apple seeds (cyanide risk).',
    localAvailabilityBD: 'যেকোনো ফলমূলে পাওয়া যায়।',
    iconName: 'Apple'
  },
  {
    id: 'diet-toxic-potato',
    nameBn: 'গোল আলু ও কাঁচা শিম (Potatoes & Raw Beans)',
    nameEn: 'Potatoes & Raw Beans',
    category: 'toxic_danger',
    benefitOrRiskBn: 'আলুতে প্রচুর স্টার্চ এবং বিষাক্ত সোলাইনিন (Solanine) থাকে যা খরগোশের অন্ত্র স্তব্ধ করে মৃত্যু ঘটাতে পারে।',
    benefitOrRiskEn: 'Extremely high starch and toxic solanine causing fatal GI stasis and toxicity.',
    servingAdviceBn: 'কখনোই ভুলেও দেওয়া যাবে না (Strictly Forbidden)!',
    servingAdviceEn: 'Never feed under any circumstances.',
    localAvailabilityBD: 'গৃহস্থালির রান্নাঘরে থাকে, খরগোশের নাগালের বাইরে রাখুন।',
    iconName: 'AlertTriangle'
  },
  {
    id: 'diet-toxic-onion-garlic',
    nameBn: 'পেঁয়াজ, রসুন ও মসলাযুক্ত খাবার (Onion, Garlic, Cooked Rice)',
    nameEn: 'Onion, Garlic, Leeks, Human Cooked Food',
    category: 'toxic_danger',
    benefitOrRiskBn: 'পেঁয়াজ ও রসুনে থাকা যৌগ খরগোশের রক্তে অ্যানিমিয়া (লোহিত রক্তকণিকা ধ্বংস) ও বিষক্রিয়া তৈরি করে। রান্না করা ভাত বা রুটি পেটে গ্যাস ও ফারমেন্টেশন ঘটায়।',
    benefitOrRiskEn: 'Causes severe hemolytic anemia and fatal toxic shock. Starchy cooked food causes explosive bloat.',
    servingAdviceBn: 'সম্পূর্ণ নিষিদ্ধ। খরগোশকে কখনই মানুষের রান্না করা খাবার দেবেন না।',
    servingAdviceEn: 'Strictly poisonous for rabbits.',
    localAvailabilityBD: 'রান্নাঘরের খাবার থেকে খরগোশকে নিরাপদ দূরত্বে রাখুন।',
    iconName: 'Skull'
  },
  {
    id: 'diet-toxic-chocolate-sweets',
    nameBn: 'চকোলেট, মিষ্টি, বিস্কুট ও চিপস (Chocolate, Biscuits & Sweets)',
    nameEn: 'Chocolate, Sweets, Bakery Biscuits',
    category: 'toxic_danger',
    benefitOrRiskBn: 'থিওব্রোমিন (Theobromine) হৃদরোগ ও খিঁচুনি ঘটায়। চিনি পেট ফাঁপা এবং দ্রুত মৃত্যুর প্রধান কারণ।',
    benefitOrRiskEn: 'Theobromine toxicity + sugar-induced gut stasis is often fatal within 24 hours.',
    servingAdviceBn: 'এক কণা বিস্কুট বা মিষ্টিও দেওয়া যাবে না।',
    servingAdviceEn: 'Zero tolerance - fatal.',
    localAvailabilityBD: 'শিশুদের হাত থেকে খরগোশের খাবার আলাদা রাখুন।',
    iconName: 'Ban'
  }
];

export const GI_STASIS_EMERGENCY_STEPS = [
  {
    step: 1,
    titleBn: 'জরুরি লক্ষণ শনাক্ত করুন (Recognize Red Flags)',
    titleEn: 'Recognize Red Flags',
    descBn: 'খরগোশ যদি ৬-৮ ঘণ্টা ধরে ঘাস বা খাবার না খায়, কোনো মল না ত্যাগ করে, কোণায় পিঠ কুঁজো করে বসে থাকে এবং দাঁত কিড়মিড় করে শব্দ করে—তবে এটি জিআই স্ট্যাসিস (GI Stasis) এর লক্ষণ। এটি একটি জীবনঘাতী জরুরি অবস্থা!',
    descEn: 'If your rabbit hasn’t eaten or pooped in 6-8+ hours, sits hunched in a ball, or grinds teeth loudly in pain, this is an acute life-threatening emergency!',
    severity: 'critical'
  },
  {
    step: 2,
    titleBn: 'পেটের স্ফীতি ও তাপমাত্রা পরীক্ষা করুন (Check Temperature & Belly)',
    titleEn: 'Check Ear Temperature & Abdomen',
    descBn: 'খরগোশের কান হাত দিয়ে অনুভব করুন—যদি কান অস্বাভাবিক বরফের মতো ঠান্ডা মনে হয় তবে হাইপোথার্মিয়ার ঝুঁকি রয়েছে। খরগোশের পেট আলতো করে ছুঁয়ে দেখুন: নরম নাকি শক্ত ফোলা বেলুনের মতো (Bloat)? যদি পেট শক্ত বেলুনের মতো হয়, জোর করে সিরিঞ্জে কিছু খাওয়াবেন না!',
    descEn: 'Feel ears for severe coldness (hypothermia). Gently feel the belly: is it soft like dough, or hard & taut like an inflated balloon (dangerous bloat)? If hard like a balloon, DO NOT force feed!',
    severity: 'high'
  },
  {
    step: 3,
    titleBn: 'শরীর উষ্ণ রাখুন (Warmth & Comfort)',
    titleEn: 'Keep the Rabbit Warm',
    descBn: 'একটি তোয়ালে বা হালকা গরম পানির বোতল তোয়ালেতে পেঁচিয়ে খরগোশের শরীরের পাশে রাখুন (সরাসরি গরম পানি নয়)। উষ্ণতা অন্ত্রের রক্ত চলাচল সচল রাখতে সাহায্য করে।',
    descEn: 'Wrap a warm water bottle in a towel and place it snugly against your rabbit. Hypothermia shuts down gut motility quickly.',
    severity: 'medium'
  },
  {
    step: 4,
    titleBn: 'হালকা পেট ম্যাসাজ (Gentle Abdominal Massage)',
    titleEn: 'Gentle Tummy Massage',
    descBn: 'খরগোশকে কোলে বসিয়ে পেটের নিচ থেকে পেছনের দিকে আলতোভাবে আঙুলের ডগা দিয়ে ম্যাসাজ করুন। এতে পেটে জমে থাকা গ্যাসের বুদ্বুদ বের হতে সাহায্য করে।',
    descEn: 'Place the bunny on your lap and with gentle fingertip strokes, massage from ribs down to pelvis to help gas bubbles move.',
    severity: 'medium'
  },
  {
    step: 5,
    titleBn: 'বেবি গ্যাস ড্রপস / সাইমেথিকোন (Simethicone Baby Drops)',
    titleEn: 'Infant Simethicone Gas Relief',
    descBn: 'ফার্মেসিতে শিশুদের জন্য পাওয়া যাওয়া Simethicone drops (যেমন: Flacol/Pedicon বা সমমানের লিকুইড) ১ মিলি সিরিঞ্জে করে খাইয়ে দিন। এটি ক্ষতিকর নয় এবং গ্যাসের যন্ত্রণা কমাতে নিরাপদ।',
    descEn: 'Give 1ml of Pediatric Simethicone drops (available at human pharmacies in BD) via syringe to break up painful gas bubbles.',
    severity: 'medium'
  },
  {
    step: 6,
    titleBn: 'দ্রুত অভিজ্ঞ ভেটেরিনারি ক্লিনিকে নিয়ে যান (Rush to Vet Clinic)',
    titleEn: 'Immediate Vet Examination & Sub-Q Fluids',
    descBn: 'দেরি না করে খরগোশকে নিকটস্থ ভেটেরিনারি হাসপাতালে নিয়ে যান। চিকিৎসকের দ্বারা ব্যথানাশক (Meloxicam), অন্ত্রের সচলতার ওষুধ (Gut motility drug like Metoclopramide) এবং স্যালাইন (Sub-Q fluids) প্রয়োজন হবে।',
    descEn: 'Do not wait overnight! Seek immediate veterinary care for prescription analgesics (Meloxicam), gut motility drugs, and fluid therapy.',
    severity: 'critical'
  }
];

export const RABBIT_WELFARE_SOCIETY_INFO = {
  nameBn: 'র‌্যাবিট ওয়েলফেয়ার সোসাইটি অফ বাংলাদেশ (RWSB)',
  nameEn: 'Rabbit Welfare Society of Bangladesh',
  taglineBn: 'বাংলাদেশের প্রতিটি খরগোশের সুস্থতা, সঠিক খাদ্য ও নিরাপদ আশ্রয়ের জন্য নিবেদিত',
  taglineEn: 'Dedicated to the health, proper diet, and welfare of pet rabbits across Bangladesh',
  helpline: '+880 1987-580017 (01987580017)',
  emergencyContact: '+880 1987-580017',
  email: 'help@rabbitwelfarebd.org',
  facebookGroup: 'Rabbit Welfare Society of Bangladesh (Official)',
  missionBn: 'খরগোশ কোনো খাঁচাবন্দি খেলনা নয়, এটি অত্যন্ত বুদ্ধিমান ও সংবেদনশীল স্তন্যপায়ী প্রাণী। সঠিক ঘাসভিত্তিক খাদ্য, খোলা বিচরণক্ষেত্র, নিয়মিত টিকাদান এবং ভালোবাসাই এদের দীর্ঘায়ুর চাবিকাঠি।',
  missionEn: 'Rabbits are not caged toys; they are intelligent, gentle, and complex companions. Proper grass hay diet, open exercise, regular veterinary care, and affection ensure they live 8-12 happy years.'
};
