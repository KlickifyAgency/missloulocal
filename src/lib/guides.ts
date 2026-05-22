export type GuideSection = {
  heading: string
  body: string
}

export type GuideFAQ = {
  q: string
  a: string
}

export type Guide = {
  slug: string
  title: string
  h1: string
  metaDescription: string
  intro: string
  sections: GuideSection[]
  faqs: GuideFAQ[]
  categorySlugs: string[]
  maxBusinesses: number
  ctaLabel: string
  ctaHref: string
  keywords: string[]
  publishedDate: string
}

export const GUIDES: Guide[] = [
  {
    slug: 'best-restaurants-natchez-ms',
    title: 'Best Restaurants in Natchez, MS (2026) | MissLouLocal',
    h1: 'Best Restaurants in Natchez, MS',
    metaDescription: 'Discover the best restaurants in Natchez, MS. From Southern soul food to fine dining on the bluff — 70+ local restaurants reviewed and listed. Updated 2026.',
    intro: 'Natchez, Mississippi sits on a bluff above the Mississippi River and has been feeding travelers since 1716. The food scene here punches far above the city\'s size — you\'ll find everything from slow-smoked BBQ and Gulf-fresh catfish to upscale Southern bistros with James Beard-worthy menus. Whether you\'re visiting for the Natchez Pilgrimage, driving the Natchez Trace Parkway, or a longtime resident looking for something new, this guide covers every dining option in town. All listings are pulled directly from the MissLouLocal directory and updated regularly.',
    sections: [
      {
        heading: 'Southern Comfort & Soul Food in Natchez',
        body: 'Natchez is the heart of Mississippi Delta cooking. Local soul food institutions have been serving fried chicken, collard greens, cornbread, and sweet potato pie for generations. Many restaurants source ingredients from the Mississippi Delta and the Gulf Coast — catfish, shrimp, and oysters appear on nearly every menu. Look for daily plate lunch specials, which are how locals eat and represent the best value in town.',
      },
      {
        heading: 'Dining on the Bluff — Fine Dining Natchez MS',
        body: 'Downtown Natchez offers a surprising number of upscale dining options overlooking the Mississippi River. Historic mansion properties like Dunleith and Monmouth have on-site restaurants serving refined Southern cuisine. The Under-the-Hill district on Silver Street, once home to river pirates and gamblers, now hosts some of the most scenic dining spots in the state.',
      },
      {
        heading: 'Breakfast & Brunch in Natchez',
        body: 'Natchez takes breakfast seriously. Local cafes open early to serve working residents and late enough for tourists who slept in after a ghost tour. Biscuits and gravy, shrimp and grits, and eggs Benedict with boudin are breakfast staples you\'ll find throughout the Miss-Lou area.',
      },
    ],
    faqs: [
      { q: 'What is the best restaurant in Natchez MS?', a: 'Natchez has excellent options at every price point. For fine dining, the restaurant at Dunleith Historic Inn is consistently rated among the best in the state. For casual local flavor, look for the daily plate lunch specials at any of the soul food restaurants downtown.' },
      { q: 'Does Natchez MS have good food?', a: 'Yes — Natchez has a food scene that surprises most visitors. With influences from Southern, Creole, and Delta cooking traditions, plus fresh Gulf seafood just a few hours away, the local cuisine is exceptional for a city of its size.' },
      { q: 'What food is Natchez Mississippi known for?', a: 'Natchez is known for Southern soul food, fried catfish, BBQ, and Creole-influenced dishes. The city sits at the crossroads of Mississippi Delta, Louisiana Creole, and Deep South culinary traditions.' },
      { q: 'Are there restaurants open late in Natchez?', a: 'Most Natchez restaurants close by 9-10pm. The Under-the-Hill district on Silver Street tends to have the latest hours, especially on weekends.' },
    ],
    categorySlugs: ['restaurants-food'],
    maxBusinesses: 24,
    ctaLabel: 'Browse All Restaurants in Natchez',
    ctaHref: '/category/restaurants-food',
    keywords: ['restaurants Natchez MS', 'best restaurants Natchez Mississippi', 'where to eat Natchez', 'Natchez food'],
    publishedDate: '2026-05-22',
  },
  {
    slug: 'things-to-do-natchez-ms',
    title: 'Things To Do in Natchez, MS (2026) | MissLouLocal',
    h1: 'Things To Do in Natchez, MS',
    metaDescription: 'Best things to do in Natchez, MS in 2026. Historic tours, antebellum homes, ghost tours, Mississippi River activities, and local events. Complete visitor guide.',
    intro: 'Natchez is the oldest city on the Mississippi River and one of the most historically rich destinations in the American South. Founded by French colonists in 1716, the city has more antebellum mansions than anywhere else in the United States. Before the Civil War, Natchez had more millionaires per capita than any other American city — and the architecture, museums, and stories of that era are remarkably preserved today. Whether you\'re spending a weekend or a full week, this guide covers the best attractions, tours, and local experiences in and around Natchez, MS.',
    sections: [
      {
        heading: 'Historic Homes & Antebellum Mansions',
        body: 'Natchez has over 100 antebellum homes, many open for tours. The Natchez Pilgrimage (held each spring and fall) opens the grandest private mansions to the public — an event that draws visitors from across the country. Stanton Hall, Rosalie, Longwood (the largest unfinished antebellum home in the US), and Melrose are among the most impressive. The Natchez National Historical Park includes several sites and is free to visit.',
      },
      {
        heading: 'Ghost Tours & Haunted Natchez',
        body: 'Natchez has a well-earned reputation as one of the most haunted cities in the South. Little Easy Tours runs the most popular ghost tours, combining the city\'s dark history — from plantation slavery to river pirates and yellow fever epidemics — with genuine paranormal lore. Tours depart from downtown most evenings and book out quickly on weekends.',
      },
      {
        heading: 'Outdoor Activities & the Mississippi River',
        body: 'The Mississippi River bluff gives Natchez dramatic views and access to the river. Rosalie Bluff offers sunset views that rival anything in the state. The Natchez State Park offers hiking, fishing, and camping a short drive from downtown. The Natchez Trace Parkway — a 444-mile scenic highway ending in Natchez — attracts cyclists, motorcyclists, and road trippers year-round.',
      },
    ],
    faqs: [
      { q: 'How many days do you need in Natchez MS?', a: 'Two to three days is ideal for Natchez. Day one covers downtown walking tour and antebellum homes. Day two is for the Natchez Trace, Grand Village archaeological site, and Mississippi River. Day three allows for any remaining mansion tours and the Under-the-Hill district.' },
      { q: 'Is Natchez MS worth visiting?', a: 'Absolutely. Natchez is one of the most underrated destinations in the American South. The concentration of antebellum architecture, the Mississippi River setting, the food scene, and the complex history make it a compelling destination for history buffs, architecture enthusiasts, and culinary travelers.' },
      { q: 'What is Natchez MS famous for?', a: 'Natchez is famous for its antebellum plantation homes, its role in the pre-Civil War cotton economy, the Natchez Trace Parkway, its ghost tours, and its position as the oldest settlement on the Mississippi River.' },
      { q: 'When is the best time to visit Natchez MS?', a: 'Spring (March-May) is ideal — the Natchez Pilgrimage opens private homes to the public and the weather is mild. Fall (September-November) is the second Pilgrimage season and equally pleasant. Summer is hot and humid but all attractions are open.' },
    ],
    categorySlugs: ['tours-attractions', 'walking-downtown'],
    maxBusinesses: 20,
    ctaLabel: 'Browse All Tours & Attractions',
    ctaHref: '/category/tours-attractions',
    keywords: ['things to do Natchez MS', 'Natchez Mississippi attractions', 'visit Natchez', 'Natchez tourism'],
    publishedDate: '2026-05-22',
  },
  {
    slug: 'walking-tour-downtown-natchez',
    title: 'Walking Tour of Historic Downtown Natchez, MS | MissLouLocal',
    h1: 'Walking Tour: Historic Downtown Natchez, MS',
    metaDescription: 'Complete walking tour guide for historic downtown Natchez, MS. Shops, restaurants, galleries, and landmarks all within walking distance. Updated 2026.',
    intro: 'Downtown Natchez is one of the most walkable historic districts in the American South. Within a few square blocks, you\'ll find antebellum architecture, independent boutiques, art galleries, restaurants, and Mississippi River views. This walking tour guide covers everything worth seeing, eating, and doing on foot in the historic downtown district — organized so you can do it in a few hours or stretch it into a full day. All businesses listed are verified local establishments in the MissLouLocal directory.',
    sections: [
      {
        heading: 'Starting Point: Main Street & the Bluff',
        body: 'Begin at Canal Street and walk toward the river bluff. The panoramic view of the Mississippi from Rosalie Bluff is a required stop — on clear days you can see the Louisiana shore and the old Mississippi River Bridge. From here, Main Street takes you through the heart of the commercial district, lined with 19th-century storefronts now housing boutiques, galleries, and cafes.',
      },
      {
        heading: 'Silver Street & Under-the-Hill',
        body: 'Take the steep road down from the bluff to Silver Street, the old riverfront district. Once infamous as the toughest stretch of the Natchez Trace — home to gamblers, river pirates, and flatboatmen — Silver Street today has restaurants, bars, and the Mississippi River as a backdrop. The Natchez Grand Hotel and Isle of Capri Casino anchor the lower end of the district.',
      },
      {
        heading: 'Shopping & Galleries Downtown',
        body: 'Downtown Natchez has an active independent retail scene. Local boutiques carry Mississippi-made goods, antiques, and art. The Jefferson Street corridor has the highest concentration of shops. Several art galleries feature work by Mississippi artists, and the Natchez Museum of African American History and Culture is a must-visit for understanding the city\'s full story.',
      },
    ],
    faqs: [
      { q: 'Is downtown Natchez MS walkable?', a: 'Yes — downtown Natchez is very walkable. The main historic district covers roughly 10-12 square blocks and most major attractions, restaurants, and shops are within a 15-20 minute walk of each other.' },
      { q: 'What is there to do in downtown Natchez?', a: 'Downtown Natchez offers shopping at local boutiques, dining at independent restaurants, galleries, the Mississippi River bluff views, historic architecture tours, ghost tours departing in the evenings, and several museums.' },
      { q: 'Is Natchez MS safe for tourists?', a: 'The historic downtown tourist district is safe and welcoming to visitors. Like any city, it\'s advisable to stay in well-lit areas after dark and be aware of your surroundings. The downtown area has a consistent police presence during tourist season.' },
      { q: 'How long does it take to walk downtown Natchez?', a: 'A leisurely walk of the main historic district takes 1-2 hours. Add time for stops at shops, restaurants, and museums and plan for 3-4 hours for a complete downtown experience.' },
    ],
    categorySlugs: ['walking-downtown'],
    maxBusinesses: 24,
    ctaLabel: 'Browse All Downtown Natchez Businesses',
    ctaHref: '/category/walking-downtown',
    keywords: ['walking tour Natchez MS', 'downtown Natchez', 'historic downtown Natchez', 'Natchez walking district'],
    publishedDate: '2026-05-22',
  },
  {
    slug: 'best-doctors-natchez-ms',
    title: 'Best Doctors & Medical Services in Natchez, MS | MissLouLocal',
    h1: 'Doctors & Medical Services in Natchez, MS',
    metaDescription: 'Find the best doctors, clinics, specialists, and healthcare providers in Natchez, MS and the Miss-Lou area. 200+ medical providers listed. Updated 2026.',
    intro: 'Finding quality healthcare in Natchez and the Miss-Lou area is easier than ever with over 200 verified medical providers in the MissLouLocal directory. Whether you need a primary care physician, a specialist, dental care, mental health services, or urgent care, the Natchez medical community has significantly expanded in recent years. Merit Health Natchez (the region\'s main hospital) and its affiliated clinics anchor the healthcare network, supported by dozens of independent practices. All physicians marked as verified have been checked against the Mississippi State Board of Medical Licensure.',
    sections: [
      {
        heading: 'Primary Care & Family Medicine in Natchez',
        body: 'Primary care in Natchez is anchored by Merit Health Natchez and several independent family medicine practices. Most accept Medicare, Medicaid, and major commercial insurance. New patients are generally accepted, though wait times for new patient appointments have increased regionwide. Telehealth options are increasingly available for follow-up visits.',
      },
      {
        heading: 'Specialists & Specialty Clinics',
        body: 'Natchez has a growing number of specialty practices, including cardiology, orthopedics, dermatology, OB/GYN, and gastroenterology. For complex cases, many specialists have affiliations with larger medical centers in Jackson, MS or New Orleans, LA. MissLouLocal lists verified specialists with their board certifications.',
      },
      {
        heading: 'Dental & Mental Health Services',
        body: 'Dental care in Natchez includes both private practices and community health clinic options. Mental health and behavioral health services have expanded in the Miss-Lou area in recent years, with several practices now offering sliding-scale fees. The Southwest Mississippi Mental Health Complex provides community-based services.',
      },
    ],
    faqs: [
      { q: 'What is the main hospital in Natchez MS?', a: 'Merit Health Natchez (formerly Natchez Community Hospital and Natchez Regional Medical Center) is the primary hospital serving the region. It offers emergency services, surgical services, and a range of specialty care.' },
      { q: 'Are there urgent care clinics in Natchez MS?', a: 'Yes, there are urgent care and walk-in clinic options in Natchez for non-emergency medical needs. These are listed in the MissLouLocal Medical & Health directory.' },
      { q: 'How do I find a doctor accepting new patients in Natchez?', a: 'Browse the Medical & Health category on MissLouLocal, then call directly to confirm new patient availability. Physicians marked with a verified checkmark have been confirmed against the Mississippi State Board of Medical Licensure.' },
      { q: 'Does Natchez MS have specialists?', a: 'Yes, Natchez has specialists in cardiology, orthopedics, dermatology, OB/GYN, gastroenterology, and other fields. Some specialists visit from larger regional centers on a rotating schedule.' },
    ],
    categorySlugs: ['medical-health'],
    maxBusinesses: 20,
    ctaLabel: 'Browse All Medical Providers in Natchez',
    ctaHref: '/category/medical-health',
    keywords: ['doctors Natchez MS', 'medical Natchez Mississippi', 'healthcare Natchez MS', 'physicians Natchez'],
    publishedDate: '2026-05-22',
  },
  {
    slug: 'best-home-services-natchez-ms',
    title: 'Best Home Services in Natchez, MS — Plumbers, Electricians & More | MissLouLocal',
    h1: 'Home Services in Natchez, MS — Plumbers, Electricians, Contractors',
    metaDescription: 'Find trusted plumbers, electricians, HVAC contractors, and home repair services in Natchez, MS. 100+ local home service providers listed and verified. 2026.',
    intro: 'Finding reliable home service contractors in Natchez and the Miss-Lou area can be a challenge without a trusted local resource. MissLouLocal has over 100 verified home service providers covering everything from emergency plumbing and electrical repairs to roofing, HVAC, landscaping, and pest control. The directory is updated continuously as new businesses are added and verified. Whether you own an antebellum home with 19th-century plumbing challenges or a new build in the surrounding parishes, the right contractor is listed here.',
    sections: [
      {
        heading: 'Plumbers in Natchez MS',
        body: 'Natchez and the Adams County area has a solid base of licensed plumbing contractors. For emergencies, several offer 24/7 response. Older homes in the historic district often require plumbers with experience in cast iron and galvanized pipe systems. Always verify licensing through the Mississippi State Board of Contractors before hiring.',
      },
      {
        heading: 'Electricians in Natchez MS',
        body: 'Electrical contractors in Natchez serve both residential and commercial properties. Historic homes frequently require panel upgrades and knob-and-tube rewiring — look for electricians with experience in historic property renovation. New construction in the Natchez area is increasing, and most licensed electricians serve both sectors.',
      },
      {
        heading: 'HVAC, Roofing & General Contractors',
        body: 'Natchez summers are brutally hot and humid — HVAC maintenance and repair are high-demand services year-round. Roofing contractors are active year-round due to the area\'s storm exposure. For larger renovation projects, several licensed general contractors in Natchez specialize in historic preservation work, which is important for properties in the historic district.',
      },
    ],
    faqs: [
      { q: 'How do I find a licensed plumber in Natchez MS?', a: 'Browse the Home Services category on MissLouLocal for verified plumbers in Natchez and Adams County. Always ask for their Mississippi plumbing license number and verify it through the state licensing board before work begins.' },
      { q: 'Are there 24-hour emergency plumbers in Natchez?', a: 'Several plumbing contractors in the Natchez area offer emergency after-hours service. Check the Home Services listings on MissLouLocal and call directly to confirm emergency availability and rates.' },
      { q: 'What home services are hardest to find in Natchez?', a: 'Specialty trades like historic masonry restoration, custom millwork, and knob-and-tube electrical rewiring can require more lead time in Natchez. For these specialized services, book contractors several weeks in advance.' },
      { q: 'Do Natchez contractors serve the Louisiana side (Vidalia)?', a: 'Many Natchez-based contractors regularly serve Vidalia, LA and other communities across the river in Concordia Parish. Confirm service area when you call.' },
    ],
    categorySlugs: ['home-services'],
    maxBusinesses: 20,
    ctaLabel: 'Browse All Home Services in Natchez',
    ctaHref: '/category/home-services',
    keywords: ['plumbers Natchez MS', 'home services Natchez Mississippi', 'contractors Natchez MS', 'electricians Natchez'],
    publishedDate: '2026-05-22',
  },
  {
    slug: 'natchez-farmers-market-guide',
    title: 'Natchez Farmers Market — Guide, Hours & Vendors | MissLouLocal',
    h1: 'Natchez Farmers Market — Complete Guide',
    metaDescription: 'Complete guide to the Natchez Farmers Market. Hours, location, vendors, seasonal produce, and upcoming market dates. Updated weekly by MissLouLocal.',
    intro: 'The Natchez Farmers Market is one of the most beloved community traditions in the Miss-Lou area. Every Saturday morning, local farmers, bakers, artisans, and food vendors gather to sell fresh produce, homemade goods, and Mississippi-grown food directly to the community. The market runs most of the year and serves as a weekly social gathering point for Natchez residents. This guide covers everything you need to know — location, hours, what to expect, and how to get there.',
    sections: [
      {
        heading: 'When & Where: Natchez Farmers Market Location and Hours',
        body: 'The Natchez Farmers Market runs on Saturday mornings in the historic downtown area. Arrive early for the best selection — popular vendors sell out by mid-morning. The market is typically held from around 8am to noon, though vendor hours vary by season. Check the Events section on MissLouLocal for the next confirmed market dates.',
      },
      {
        heading: 'What to Buy at the Natchez Farmers Market',
        body: 'Seasonal produce from Adams County and surrounding parishes is the main draw — tomatoes, sweet corn, okra, greens, sweet potatoes, and muscadine grapes depending on the season. Local bakers bring fresh bread, biscuits, and pastries. Honey, jams, hot sauces, and Mississippi-crafted goods round out the vendor mix. Several vendors accept SNAP/EBT benefits.',
      },
      {
        heading: 'Local Vendors & Artisans',
        body: 'Beyond produce, the Natchez Farmers Market features local artisans selling handmade crafts, Mississippi-themed gifts, photography, and folk art. Food trucks sometimes park nearby on busy market days. The social atmosphere — neighbors catching up, dogs walking by, live music occasionally — is as much a draw as the goods themselves.',
      },
    ],
    faqs: [
      { q: 'When is the Natchez Farmers Market?', a: 'The Natchez Farmers Market runs on Saturday mornings, typically from approximately 8am to noon. Check MissLouLocal\'s Events section for current and upcoming dates, as the schedule can vary seasonally.' },
      { q: 'Where is the Natchez Farmers Market located?', a: 'The Natchez Farmers Market is held in the historic downtown area. Check MissLouLocal Events for the current location — the exact venue has varied between several downtown sites over the years.' },
      { q: 'Does the Natchez Farmers Market run year-round?', a: 'The market runs through most of the year but may take breaks in winter months. Spring and fall are the most active seasons. Check MissLouLocal\'s Events calendar for confirmed upcoming dates.' },
      { q: 'Can you pay with SNAP/EBT at the Natchez Farmers Market?', a: 'Several vendors at the Natchez Farmers Market accept SNAP/EBT benefits. Ask individual vendors at the market — acceptance varies by seller.' },
    ],
    categorySlugs: ['farmers-market'],
    maxBusinesses: 12,
    ctaLabel: 'See Upcoming Farmers Market Events',
    ctaHref: '/farmers-market',
    keywords: ['Natchez farmers market', 'farmers market Natchez MS', 'Natchez Saturday market', 'local produce Natchez'],
    publishedDate: '2026-05-22',
  },
]

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find(g => g.slug === slug)
}
