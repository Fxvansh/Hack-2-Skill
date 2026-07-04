const form = document.querySelector("#travelForm");
const destinationSelect = document.querySelector("#destination");
const citySearch = document.querySelector("#citySearch");
const searchStatus = document.querySelector("#searchStatus");
const results = document.querySelector("#results");
const routeTitle = document.querySelector("#routeTitle");
const surpriseButton = document.querySelector("#surpriseButton");
const generatedPrompt = document.querySelector("#generatedPrompt");
const heroImage = document.querySelector(".hero-media img");
const heroPins = [...document.querySelectorAll(".map-pin")];
const placeModal = document.querySelector("#placeModal");
const placeImage = document.querySelector("#placeImage");
const placeType = document.querySelector("#placeType");
const placeTitle = document.querySelector("#placeTitle");
const placeDescription = document.querySelector("#placeDescription");
const placeMeta = document.querySelector("#placeMeta");
const placeWhy = document.querySelector("#placeWhy");
const placeTip = document.querySelector("#placeTip");
const placeNearby = document.querySelector("#placeNearby");
let currentCityKey = destinationSelect.value;

// Groq API Configuration UI Elements
const toggleSettingsBtn = document.querySelector("#toggleSettingsBtn");
const settingsPanel = document.querySelector("#settingsPanel");
const groqApiKeyInput = document.querySelector("#groqApiKey");
const groqModelSelect = document.querySelector("#groqModel");

let currentCityData = null;

const destinations = {
  indore: {
    name: "Indore",
    state: "Madhya Pradesh",
    aliases: ["indore", "mp"],
    image:
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1400&q=85",
    alt: "Historic Indian palace courtyard glowing at sunset",
    vibe: "Maratha-era architecture, temple streets, night markets, and a food culture that becomes most alive after dark.",
    heritage: "Rajwada, the Holkar legacy, Krishnapura Chhatri, hand-pounded namkeen, and Sarafa Bazaar's late-night food ritual.",
    route: [
      place("route", "🏛️", "Rajwada Palace", "Begin with the Holkar-era palace and listen to a short audio story about trade, power, and old Indore's market spine.", ["Iconic", "Heritage"], {
        image: "https://images.unsplash.com/photo-1627894318042-45e05a0d315c?auto=format&fit=crop&w=800&q=80",
        bestTime: "Late afternoon",
        why: "It gives the city a strong historical anchor before you enter the food lanes.",
        tip: "Pause at the facade and then walk slowly into the surrounding bazaar streets.",
        nearby: ["Krishnapura Chhatri", "Sarafa Bazaar", "Old cloth market"],
      }),
      place("route", "🕯️", "Krishnapura Chhatri", "Walk to the cenotaphs near the river for carved stonework, calmer photographs, and a reflective pause.", ["Hidden calm", "Architecture"], {
        image: "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=800&q=80",
        bestTime: "Golden hour",
        why: "The carved memorials show the Holkar legacy in a quieter, more intimate way.",
        tip: "Keep the visit quiet and avoid blocking worshippers or local families using the space.",
        nearby: ["Rajwada Palace", "Kaanch Mandir", "Riverfront corners"],
      }),
      place("route", "🍲", "Sarafa Bazaar", "Return at night for garadu, bhutte ka kees, jalebi, and vendor-led food memories.", ["Food", "Local ritual"], {
        image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=800&q=80",
        bestTime: "After 9 PM",
        why: "Sarafa turns eating into a shared city ritual rather than a normal dinner stop.",
        tip: "Order small portions and ask vendors what their stall is known for.",
        nearby: ["Joshi Dahi Bada", "Vijay Chaat House", "Rajwada night walk"],
      }),
    ],
    gems: [
      place("gem", "💎", "Kaanch Mandir", "A glass-and-mirror Jain temple that turns devotion into a quiet kaleidoscope.", ["Hidden gem", "Temple"], {
        image: "https://images.unsplash.com/photo-1583089892943-e02e5b017b6a?auto=format&fit=crop&w=800&q=80",
        position: "top: 18%; left: 12%;",
        bestTime: "Morning",
        why: "Its mirrored interiors create a very different sacred atmosphere from Indore's larger public monuments.",
        tip: "Dress modestly, keep voices low, and check photography rules before taking pictures.",
        nearby: ["Rajwada Palace", "Bada Ganpati", "Old market lanes"],
      }),
      place("gem", "🛕", "Bada Ganpati Lanes", "Old neighborhoods where sweet shops, flower sellers, and temple rhythms sit close together.", ["Temple street", "Local life"], {
        image: "https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&w=800&q=80",
        position: "top: 58%; left: 52%;",
        bestTime: "Early evening",
        why: "The lanes show daily devotion, snacks, flowers, and neighborhood life in one compact walk.",
        tip: "Walk instead of driving; the cultural texture is in the small details.",
        nearby: ["Bada Ganpati Temple", "Sweet shops", "Flower stalls"],
      }),
      place("gem", "🥣", "Chhappan Backstories", "Go beyond the famous 56 shops by asking vendors about recipes that migrated with families.", ["Food story", "Market"], {
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80",
        position: "top: 72%; left: 18%;",
        bestTime: "Evening",
        why: "It turns a popular food stop into a story about migration, taste, and city identity.",
        tip: "Ask one vendor for their oldest recipe, then follow that clue to your next snack.",
        nearby: ["Johnny Hot Dog", "Madhuram sweets", "Local namkeen shops"],
      }),
      place("gem", "🏰", "Lal Bagh Palace Gardens", "A European-styled palace estate featuring quiet rose gardens, gravel pathways, and massive iron gates.", ["Hidden gem", "Palace"], {
        image: "https://images.unsplash.com/photo-1627894318042-45e05a0d315c?auto=format&fit=crop&w=800&q=80",
        position: "top: 35%; left: 60%;",
        bestTime: "Morning",
        why: "It offers a peaceful, green escape from Indore's bustling markets with gorgeous British-Baroque architecture.",
        tip: "Visit the rose gardens early and check if the interior museum is open for a peak at the Holkar dynasty's lifestyle.",
        nearby: ["Rajwada Palace", "Saraswati riverbank", "Cloth market"],
      }),
    ],
    events: ["Sarafa midnight food walk", "Classical music baithak at a local cultural hall", "Weekend heritage walk around Rajwada"],
    experiences: ["Cook poha-jalebi breakfast with a home chef", "Meet a namkeen maker for a spice-blending demo", "Join a guided Holkar history walk"],
  },
  mumbai: {
    name: "Mumbai",
    state: "Maharashtra",
    aliases: ["mumbai", "bombay", "maharashtra"],
    image:
      "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=1400&q=85",
    alt: "Mumbai skyline and waterfront at golden hour",
    vibe: "Sea-facing promenades, colonial and Art Deco streets, fishing villages, cinema energy, food lanes, and old neighborhoods hiding behind fast city life.",
    heritage: "Gateway of India, CSMT, Koli fishing culture, Buddhist cave networks, textile histories, Irani cafes, and layered migrant food traditions.",
    route: [
      place("route", "🛕", "Gateway Of India And Colaba", "Start with the harbor, then walk into Colaba for buildings, cafes, galleries, and sea-breeze storytelling.", ["Iconic", "Harbor"], {
        image: "https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=800&q=80",
        bestTime: "Morning or sunset",
        why: "It frames Mumbai as a port city before you explore its smaller neighborhoods.",
        tip: "Pair the monument with a slow walk through Colaba's lanes instead of treating it as a photo stop only.",
        nearby: ["Taj Mahal Palace exterior", "Colaba Causeway", "Kala Ghoda galleries"],
      }),
      place("route", "🚉", "CSMT And Fort Heritage Mile", "Trace Mumbai's Gothic, Indo-Saracenic, and Art Deco layers through a compact architecture walk.", ["Architecture", "Heritage"], {
        image: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=800&q=80",
        bestTime: "Early morning",
        why: "The buildings reveal how trade, railways, and empire shaped the modern city.",
        tip: "Look up often; many of the best carvings and details are above eye level.",
        nearby: ["Horniman Circle", "Asiatic Library", "Flora Fountain"],
      }),
      place("route", "🌊", "Bandra Seaface To Koliwada", "Move from promenade views into a fishing-community neighborhood where Mumbai's older coastal identity is still visible.", ["Sea walk", "Living culture"], {
        image: "https://images.unsplash.com/photo-1562979314-bee7453e911c?auto=format&fit=crop&w=800&q=80",
        bestTime: "Late afternoon",
        why: "It connects the glamorous waterfront with the communities that shaped Mumbai before the skyline.",
        tip: "Be respectful with cameras inside residential lanes and ask before photographing people.",
        nearby: ["Bandra Fort", "Mount Mary steps", "Chimbai village lanes"],
      }),
    ],
    gems: [
      place("gem", "🪨", "Kanheri Caves", "A Buddhist rock-cut cave complex inside Sanjay Gandhi National Park, ideal for history, walking, and forest air.", ["Hidden gem", "Ancient caves"], {
        image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80",
        position: "top: 18%; left: 12%;",
        bestTime: "Morning",
        why: "It reveals a much older Mumbai through monastic cells, inscriptions, water systems, and forested basalt hills.",
        tip: "Wear walking shoes, carry water, and give yourself more time than a normal city stop.",
        nearby: ["Sanjay Gandhi National Park", "Borivali forest trails", "Tulsi lake viewpoints"],
      }),
      place("gem", "🏘️", "Khotachiwadi", "A tiny Girgaon heritage village with old-Portuguese style homes, narrow lanes, and a slower neighborhood mood.", ["Hidden gem", "Heritage village"], {
        image: "https://images.unsplash.com/photo-1570168007244-df7a4835617c?auto=format&fit=crop&w=800&q=80",
        position: "top: 42%; left: 58%;",
        bestTime: "Morning",
        why: "It feels like a preserved pocket of older Bombay within the pressure of new towers.",
        tip: "This is a lived-in neighborhood, so walk softly and avoid treating homes like public sets.",
        nearby: ["Girgaon lanes", "Marine Drive", "Local bakeries"],
      }),
      place("gem", "🎣", "Sassoon Docks", "One of Mumbai's oldest docks, with fish-market energy, port history, and changing public art layers.", ["Hidden gem", "Fishing culture"], {
        image: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=800&q=80",
        position: "top: 70%; left: 20%;",
        bestTime: "Very early morning",
        why: "It shows Mumbai as a working harbor, not just a skyline or beach city.",
        tip: "Go with a guide if possible, wear closed footwear, and respect workers moving fast.",
        nearby: ["Colaba", "Sagar Upvan", "Kala Ghoda"],
      }),
      place("gem", "🪔", "Banganga Tank", "A sacred water tank in Walkeshwar surrounded by temples, old homes, and layered legends.", ["Sacred site", "Quiet walk"], {
        image: "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&w=800&q=80",
        position: "top: 30%; left: 32%;",
        bestTime: "Early morning",
        why: "It is one of the city's most atmospheric places for understanding ritual and neighborhood memory.",
        tip: "Keep the visit calm, dress respectfully, and avoid interrupting prayers or ceremonies.",
        nearby: ["Walkeshwar temples", "Malabar Hill", "Hanging Gardens"],
      }),
      place("gem", "⛰️", "Mahakali Caves", "An Andheri cave group that gives the western suburbs their own ancient Buddhist layer.", ["Rock-cut caves", "Suburban history"], {
        image: "https://images.unsplash.com/photo-1503177119275-0aa32b31d468?auto=format&fit=crop&w=800&q=80",
        position: "top: 58%; left: 68%;",
        bestTime: "Morning",
        why: "It expands the story of Mumbai beyond South Bombay and into the older cave networks of Salsette.",
        tip: "Visit in daylight and combine it with a suburb-focused heritage route.",
        nearby: ["Andheri East", "Aarey edge", "Local snack stops"],
      }),
      place("gem", "⛰️", "Gilbert Hill", "A 200-foot-tall volcanic basalt monolith column formed over 66 million years ago in the suburbs.", ["Hidden gem", "Geology"], {
        image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80",
        position: "top: 50%; left: 35%;",
        bestTime: "Sunset",
        why: "It offers an incredible 360-degree viewpoint of the Mumbai suburbs from a structure older than the dinosaurs.",
        tip: "Climb the stairs to the temple on top slowly, especially in hot weather, and catch the sunset views.",
        nearby: ["Andheri lanes", "Shopper stops", "Local snack stalls"],
      }),
    ],
    events: ["Kala Ghoda gallery walk", "Koli seafood trail", "Fort architecture walk", "Dadar flower market morning visit"],
    experiences: ["Eat with a Koli host family", "Join a heritage architecture walk", "Visit an Irani cafe with a food historian", "Explore cinema poster and studio stories"],
  },
  jaipur: {
    name: "Jaipur",
    state: "Rajasthan",
    aliases: ["jaipur", "pink city", "rajasthan"],
    image:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1400&q=85",
    alt: "Pink sandstone palace facade in Rajasthan",
    vibe: "Pink sandstone, royal planning, block printing workshops, old bazaars, and evening folk performance.",
    heritage: "Hawa Mahal, Jantar Mantar, City Palace, blue pottery, lac bangles, and textile-printing traditions.",
    route: [
      place("route", "🏰", "Hawa Mahal", "Start at the honeycomb facade and hear a story about city life viewed through jharokhas.", ["Iconic", "Architecture"], {
        image: "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?auto=format&fit=crop&w=800&q=80",
        bestTime: "Morning",
        why: "It immediately explains Jaipur's relationship between royal life, street life, climate, and design.",
        tip: "Cross carefully for the wider view, then look for the smaller jharokha details.",
        nearby: ["City Palace", "Johari Bazaar", "Tripolia Bazaar"],
      }),
      place("route", "🔭", "Jantar Mantar", "Explore astronomical instruments as a science-and-royalty storytelling stop.", ["UNESCO", "Science"], {
        image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80",
        bestTime: "Late morning",
        why: "The site turns astronomy into architecture at city scale.",
        tip: "Use a guide or audio narration; the instruments become much more meaningful with context.",
        nearby: ["City Palace", "Hawa Mahal", "Govind Dev Ji Temple"],
      }),
      place("route", "🧵", "Kishanpole Craft Lanes", "Visit block-printing and bangle makers to connect monuments with living craft.", ["Craft", "Local maker"], {
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
        bestTime: "Afternoon",
        why: "It shows how Jaipur's color and pattern traditions continue through working hands.",
        tip: "Buy directly from makers when you can and ask about process, not just price.",
        nearby: ["Bapu Bazaar", "Lac bangle shops", "Textile workshops"],
      }),
    ],
    gems: [
      place("gem", "💧", "Panna Meena Ka Kund", "A geometric stepwell that rewards slow looking and early morning light.", ["Hidden gem", "Stepwell"], {
        image: "https://images.unsplash.com/photo-1524226359163-702b62273187?auto=format&fit=crop&w=800&q=80",
        position: "top: 24%; left: 18%;",
        bestTime: "Morning",
        why: "It adds water architecture and geometry to the fort-and-palace route.",
        tip: "Follow local safety rules and avoid climbing restricted steps.",
        nearby: ["Amer Fort", "Anokhi Museum area", "Amer lanes"],
      }),
      place("gem", "🕯️", "Gatore Ki Chhatriyan", "Royal cenotaphs with delicate stonework and a quieter mood than the forts.", ["Cenotaphs", "Quiet heritage"], {
        image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
        position: "top: 54%; left: 62%;",
        bestTime: "Golden hour",
        why: "It offers Jaipur's royal memory without the heaviest crowds.",
        tip: "Move slowly; the carvings are the real experience here.",
        nearby: ["Nahargarh Road", "Old city viewpoints", "Amer route"],
      }),
      place("gem", "🎨", "Blue Pottery Workshop", "Meet makers who keep Jaipur's ceramic color tradition alive through hand-painted forms.", ["Craft", "Workshop"], {
        image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
        position: "top: 72%; left: 24%;",
        bestTime: "Afternoon",
        why: "It connects Jaipur's visual identity to material, labor, and local livelihoods.",
        tip: "Ask before photographing studio work and support the workshop directly.",
        nearby: ["Craft studios", "Textile shops", "Local chai stops"],
      }),
      place("gem", "🛕", "Galta Ji Temple", "An ancient Hindu pilgrimage site in a mountain pass, known for its natural springs.", ["Hidden gem", "Pilgrimage"], {
        image: "https://images.unsplash.com/photo-1526718583451-e877f720d522?auto=format&fit=crop&w=800&q=80",
        position: "top: 40%; left: 45%;",
        bestTime: "Late afternoon",
        why: "The gorge setting, natural water kunds, and monkeys create a very spiritual and photogenic valley atmosphere.",
        tip: "Keep food items hidden from the monkeys and be respectful of devotees bathing in the holy pools.",
        nearby: ["Sisodia Rani Palace", "Ghat Ki Uni", "Amer road"],
      }),
    ],
    events: ["Evening folk music set", "Block-printing workshop", "Old city bazaar walk"],
    experiences: ["Print a scarf with a local artisan", "Taste kachori with a market historian", "Meet a miniature painter in a studio"],
  },
  varanasi: {
    name: "Varanasi",
    state: "Uttar Pradesh",
    aliases: ["varanasi", "banaras", "kashi"],
    image:
      "https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&w=1400&q=85",
    alt: "Boats and ghats beside the Ganga in Varanasi",
    vibe: "River rituals, music, silk weaving, ancient lanes, temple bells, and sunrise conversations on stone steps.",
    heritage: "Ganga ghats, Banarasi silk, morning ragas, Sanskrit learning, akharas, and devotional food traditions.",
    route: [
      place("route", "🌅", "Assi Ghat Sunrise", "Open with a boat ride and a generated narration about light, water, and daily rituals.", ["Sunrise", "Sacred geography"], {
        image: "https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&w=800&q=80",
        bestTime: "Sunrise",
        why: "The riverfront makes the city's rhythm visible before the day becomes crowded.",
        tip: "Keep distance from private rituals and avoid intrusive photography.",
        nearby: ["Tulsi Ghat", "Boat steps", "Morning chai stalls"],
      }),
      place("route", "🧶", "Madanpura Weaving Lane", "Meet silk weavers and trace how motifs move from loom to wedding sari.", ["Craft", "Living heritage"], {
        image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
        bestTime: "Late morning",
        why: "The looms make Banarasi identity tangible through sound, pattern, and labor.",
        tip: "Ask makers about process and pay fairly for guided visits.",
        nearby: ["Loom rooms", "Silk shops", "Neighborhood tea stalls"],
      }),
      place("route", "🪔", "Dashashwamedh Area", "End with evening aarti context, crowd etiquette, and optional quiet viewpoints.", ["Ritual", "Storytelling"], {
        image: "https://images.unsplash.com/photo-1598977123418-45f04b615e0e?auto=format&fit=crop&w=800&q=80",
        bestTime: "Evening",
        why: "The aarti is a major public ritual, but context helps visitors approach it respectfully.",
        tip: "Arrive early, keep belongings close, and do not push into prayer spaces.",
        nearby: ["Vishwanath lanes", "Godowlia", "Quiet ghat viewpoints"],
      }),
    ],
    gems: [
      place("gem", "🏰", "Ramnagar Backstreets", "A slower riverbank world with palace views and old sweet shops.", ["Hidden gem", "River town"], {
        image: "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&w=800&q=80",
        position: "top: 22%; left: 16%;",
        bestTime: "Afternoon",
        why: "It gives a different pace from the central ghats and opens another side of the river.",
        tip: "Check return transport before sunset.",
        nearby: ["Ramnagar Fort", "Sweet shops", "River viewpoints"],
      }),
      place("gem", "🧶", "Madanpura Loom Rooms", "Hear the rhythm of handlooms and learn how silk patterns are planned.", ["Craft", "Looms"], {
        image: "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=800&q=80",
        position: "top: 48%; left: 56%;",
        bestTime: "Late morning",
        why: "It reveals the living craft behind one of India's best-known textile names.",
        tip: "Visit through a responsible host who has maker consent.",
        nearby: ["Silk cooperatives", "Weaver homes", "Tea stalls"],
      }),
      place("gem", "🎶", "Hidden Music Baithaks", "Small classical gatherings where morning ragas feel intimate rather than staged.", ["Music", "Oral culture"], {
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
        position: "top: 72%; left: 28%;",
        bestTime: "Morning or evening",
        why: "Varanasi is not only seen; it is heard through raga, rhythm, and voice.",
        tip: "Listen fully, keep phones away, and support the musicians.",
        nearby: ["Assi area", "Music schools", "Quiet cafes"],
      }),
      place("gem", "🕌", "Lal Khan Tomb", "A beautifully detailed 18th-century sandstone tomb and garden set on a bluff overlooking the Ganga.", ["Hidden gem", "Garden"], {
        image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=800&q=80",
        position: "top: 35%; left: 70%;",
        bestTime: "Morning",
        why: "It provides a highly tranquil, clean garden space to watch the river, far from the central ghat crowds.",
        tip: "Bring a book or sketchbook; this is one of Varanasi's most serene historic parks.",
        nearby: ["Rajghat bridge", "Kashi Railway Station area", "River walks"],
      }),
    ],
    events: ["Morning raga session", "Silk weaving demonstration", "Guided ghat mythology walk"],
    experiences: ["Share chai with a boat family", "Learn a thumri listening guide", "Visit a loom cooperative"],
  },
  kochi: {
    name: "Kochi",
    state: "Kerala",
    aliases: ["kochi", "cochin", "fort kochi", "kerala"],
    image:
      "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1400&q=85",
    alt: "Chinese fishing nets on the waterfront in Fort Kochi",
    vibe: "A coastal mix of spice trade, fishing communities, synagogues, churches, galleries, and Malayalam foodways.",
    heritage: "Chinese fishing nets, Mattancherry, spice warehouses, Jewish heritage, Kathakali, and coastal cuisine.",
    route: [
      place("route", "🎣", "Fort Kochi Nets", "Begin with the mechanics and memory of the cantilever fishing nets at the water's edge.", ["Waterfront", "Living craft"], {
        image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80",
        bestTime: "Sunset",
        why: "The nets turn trade history, fishing skill, and coastal labor into one visual system.",
        tip: "If fishermen invite participation, tip fairly and follow their instructions.",
        nearby: ["Vasco da Gama Square", "Fort Kochi Beach", "St. Francis Church"],
      }),
      place("route", "🌶️", "Mattancherry Spice Streets", "Follow the smell of pepper, cardamom, and old warehouses into trade history.", ["Spice route", "Market"], {
        image: "https://images.unsplash.com/photo-1509354802596-6d6f35b1f13b?auto=format&fit=crop&w=800&q=80",
        bestTime: "Morning",
        why: "The spice streets explain Kochi as a port connected to the wider Indian Ocean.",
        tip: "Ask before entering warehouses; many are still working spaces.",
        nearby: ["Jew Town", "Spice warehouses", "Mattancherry Palace"],
      }),
      place("route", "🎭", "Kathakali Studio", "Close with gesture, makeup, and myth through an artist-led introduction.", ["Performance", "Story"], {
        image: "https://images.unsplash.com/photo-1610444390635-c3f25d99616e?auto=format&fit=crop&w=800&q=80",
        bestTime: "Evening",
        why: "A demonstration helps visitors decode expression, costume, and epic storytelling.",
        tip: "Arrive early for the makeup process; it is part of the performance culture.",
        nearby: ["Fort Kochi theatres", "Art cafes", "Gallery lanes"],
      }),
    ],
    gems: [
      place("gem", "⛪", "Koonankurishu Shrine Lane", "A layered neighborhood where faith histories sit within everyday streets.", ["Hidden gem", "Faith history"], {
        image: "https://images.unsplash.com/photo-1548625361-155de6c7f54d?auto=format&fit=crop&w=800&q=80",
        position: "top: 20%; left: 18%;",
        bestTime: "Morning",
        why: "It shows Kochi's religious layers beyond the most photographed facades.",
        tip: "Keep the visit quiet and observe local prayer etiquette.",
        nearby: ["Mattancherry", "Local bakeries", "Spice lanes"],
      }),
      place("gem", "🌶️", "Pepper Warehouse Corners", "Old storage buildings that reveal Kochi's trade memory beyond postcard views.", ["Trade history", "Market"], {
        image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
        position: "top: 54%; left: 60%;",
        bestTime: "Morning",
        why: "The warehouses make the spice route feel physical and contemporary.",
        tip: "Stay clear of loading work and ask permission before photographing workers.",
        nearby: ["Jew Town", "Spice sellers", "Mattancherry Palace"],
      }),
      place("gem", "⛴️", "Local Ferry Crossings", "Cheap, beautiful, and deeply local transitions across the harbor.", ["Water commute", "Local rhythm"], {
        image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80",
        position: "top: 72%; left: 22%;",
        bestTime: "Late afternoon",
        why: "The ferry gives you the city as residents experience it: through water, work, and crossings.",
        tip: "Keep cash handy and check return timings before you wander too far.",
        nearby: ["Ernakulam jetty", "Fort Kochi jetty", "Harbor views"],
      }),
      place("gem", "🏝️", "Kumbalangi Village", "India's first designated eco-tourism village, featuring crab farming and mangrove walks.", ["Hidden gem", "Eco-tourism"], {
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        position: "top: 38%; left: 50%;",
        bestTime: "Late afternoon",
        why: "It allows you to experience traditional Keralan backwater life and seafood culture in a sustainable, community-run setting.",
        tip: "Book a country boat tour with a local fisherman to navigate the shallow mangrove channels.",
        nearby: ["Cherai beach side", "Fort Kochi waterfront", "Mattancherry spice route"],
      }),
    ],
    events: ["Kathakali makeup demo", "Spice market tasting", "Fort Kochi gallery walk"],
    experiences: ["Cook meen curry with a coastal host", "Help raise a fishing net with a guide", "Cycle through Mattancherry stories"],
  },
};

const lensCopy = {
  food: "Prioritize food rituals, market conversations, family recipes, spice trails, and respectful tasting stops.",
  craft: "Prioritize artisans, material culture, workshops, studio visits, and craft stories connected to place.",
  music: "Prioritize soundscapes, local performance, devotional music, oral histories, and listening etiquette.",
};

const moodCopy = {
  "first-time": "balanced, landmark-friendly, and easy to follow",
  food: "market-led, snack-heavy, and vendor-centered",
  history: "heritage-rich, timeline-driven, and architecture-aware",
  slow: "gentle, reflective, and conversation-first",
};

function place(kind, icon, name, text, tags, details) {
  return {
    kind,
    icon,
    name,
    text,
    tags,
    bestTime: details.bestTime,
    why: details.why,
    tip: details.tip,
    nearby: details.nearby,
    position: details.position || "",
  };
}

function getFormData() {
  return {
    destination: destinationSelect.value,
    mood: document.querySelector("#mood").value,
    time: document.querySelector("#time").value,
    budget: document.querySelector("#budget").value,
    lens: document.querySelector("input[name='lens']:checked").value,
    note: document.querySelector("#note").value.trim(),
    search: citySearch.value.trim(),
  };
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return entities[character];
  });
}

function normalize(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function findDestinationKey(query) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return "";

  const cityMatch = Object.entries(destinations).find(([, city]) => {
    const names = [city.name, city.state, ...city.aliases].map(normalize);
    return names.some((name) => name === normalizedQuery || normalizedQuery.includes(name));
  })?.[0];

  if (cityMatch) return cityMatch;

  return Object.entries(destinations).find(([, city]) => {
    const placeNames = [...city.route, ...city.gems].map((item) => normalize(item.name));
    return placeNames.some((name) => name.includes(normalizedQuery) || normalizedQuery.includes(name));
  })?.[0] || "";
}

function isCityQuery(city, query) {
  if (!query) return false;
  const normalizedQuery = normalize(query);
  return [city.name, city.state, ...city.aliases].map(normalize).some((name) => name === normalizedQuery);
}

function matchesPlace(item, query) {
  if (!query) return true;
  const haystack = normalize(`${item.name} ${item.text} ${item.tags.join(" ")} ${item.nearby.join(" ")}`);
  return haystack.includes(normalize(query));
}

function applySearchToDestination() {
  const query = citySearch.value.trim();
  
  if (getApiKey()) {
    if (query) {
      searchStatus.innerHTML = `✨ AI Active: Click 'Generate' to query dynamic itinerary for <b>"${escapeHtml(query)}"</b>.`;
    } else {
      searchStatus.textContent = "Search any city worldwide or select a destination to generate an AI itinerary.";
    }
    return;
  }

  const key = findDestinationKey(query);
  if (key) {
    destinationSelect.value = key;
    searchStatus.textContent = `Loaded ${destinations[key].name}. Showing places to visit and hidden gems.`;
    return;
  }

  if (query) {
    searchStatus.textContent = `Filtering ${destinations[destinationSelect.value].name} for "${query}".`;
    return;
  }

  searchStatus.textContent = "Search a city or filter places inside the selected destination.";
}

function render(data) {
  const city = currentCityData || destinations[data.destination];
  currentCityKey = data.destination;

  const query = isCityQuery(city, data.search) ? "" : data.search;
  const route = city.route.filter((item) => matchesPlace(item, query));
  const gems = city.gems.filter((item) => matchesPlace(item, query));
  const allPlaces = [...route, ...gems];

  // Show dynamic AI generation prompt if search returned 0 results and API key is present
  if (allPlaces.length === 0 && getApiKey() && data.search) {
    results.innerHTML = `
      <div class="api-loading-state" style="min-height: 280px;">
        <div class="spinner" style="font-size: 2.5rem; animation: none;">🔍</div>
        <h3>Generate AI itinerary for "${escapeHtml(data.search)}"?</h3>
        <p>No local matches found. Press the '✨ Generate Cultural Route' button to dynamically build a brand new itinerary for this location!</p>
      </div>
    `;
    return;
  }
  const personalNote = data.note
    ? ` The traveler also asked for: "${escapeHtml(data.note)}"`
    : "";

  routeTitle.textContent = query
    ? `${city.name} matches for "${query}"`
    : `${city.name} ${data.time.replace("-", " ")} route`;
  heroImage.src = city.image;
  heroImage.alt = city.alt;
  updateHeroPins(city);

  results.innerHTML = `
    <section class="search-summary">
      <div>
        <p class="eyebrow">${query ? "Filtered discovery" : "Destination discovery"}</p>
        <h3>${escapeHtml(city.name)}, ${escapeHtml(city.state)}</h3>
        <p>${escapeHtml(city.vibe)}</p>
      </div>
      <div class="summary-count">
        <strong>${allPlaces.length}</strong>
        <span>${allPlaces.length === 1 ? "place" : "places"} found</span>
      </div>
    </section>

    ${
      allPlaces.length
        ? `
          <div class="route-grid">
            ${route.map((item, index) => routeCard(item, data, `route-${index}`)).join("")}
          </div>

          <div class="culture-grid">
            <article class="card image-card">
              <div class="image-wrap">
                <img src="${city.image}" alt="${city.alt}" />
                ${city.gems
                  .map(
                    (item, index) => `
                      <button class="gem-badge" type="button" data-place-id="gem-all-${index}" style="${item.position}">
                        ${index + 1}. ${escapeHtml(item.name)}
                      </button>
                    `
                  )
                  .join("")}
              </div>
              <div class="image-body">
                <h3>🔎 Clickable hidden gems on the city image</h3>
                <ul class="hidden-list">
                  ${gems.map((item, index) => hiddenGemRow(item, `gem-${index}`, index)).join("")}
                </ul>
              </div>
            </article>

            <article class="card story-card">
              <h3>🎧 Immersive AI story</h3>
              <p>${storyFor(city, data)}${personalNote}</p>
              <div class="story-player">
                <button type="button" id="playStoryButton" class="story-play-btn">
                  <span class="play-icon">▶</span>
                  <span class="play-text">Listen to Story</span>
                </button>
                <div id="playerWave" class="story-wave">
                  <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
                </div>
              </div>
              <div class="tag-line">
                <span class="tag">Narrated route</span>
                <span class="tag">${data.time}</span>
                <span class="tag">${data.budget} budget</span>
              </div>
            </article>
          </div>

          <section class="places-browser">
            <div>
              <p class="eyebrow">Places to visit</p>
              <h3>Open any place for details</h3>
            </div>
            <div class="place-browser-grid">
              ${allPlaces.map((item, index) => compactPlaceCard(item, `all-${index}`)).join("")}
            </div>
          </section>
        `
        : emptySearch(city, query)
    }

    <div class="gem-grid">
      <article class="card event-card">
        <h3>🎭 Local events to check</h3>
        <ul class="hidden-list">
          ${city.events
            .map(
              (eventName) => `
                <li>
                  <span>•</span>
                  <span><b>${escapeHtml(eventName)}</b>${eventReason(eventName, data.lens)}</span>
                </li>
              `
            )
            .join("")}
        </ul>
      </article>

      <article class="card experience-card">
        <h3>🤝 Authentic cultural experiences</h3>
        <ul class="hidden-list">
          ${city.experiences
            .map(
              (experience) => `
                <li>
                  <span>✓</span>
                  <span><b>${escapeHtml(experience)}</b>Book with a verified local host, keep groups small, and compensate knowledge fairly.</span>
                </li>
              `
            )
            .join("")}
        </ul>
      </article>
    </div>
  `;

  registerPlaces(city, route, gems, allPlaces);
  generatedPrompt.textContent = buildPrompt(city, data);
}

function routeCard(item, data, placeId) {
  const cardUrl = item.image || "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=400&q=80";
  return `
    <button class="card route-card interactive-card" type="button" data-place-id="${placeId}">
      <div class="route-card-banner">
        <img src="${cardUrl}" alt="${escapeHtml(item.name)}" />
        <span class="route-card-icon">${item.icon}</span>
      </div>
      <div class="route-card-content">
        <h3>${escapeHtml(item.name)}</h3>
        <p>${escapeHtml(item.text)}</p>
        <div class="tag-line">
          ${item.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
          <span class="tag">${data.lens}</span>
        </div>
      </div>
    </button>
  `;
}

function hiddenGemRow(item, placeId, index) {
  return `
    <li>
      <button class="hidden-gem-button" type="button" data-place-id="${placeId}">
        <span>${index + 1}</span>
        <span><b>${escapeHtml(item.name)}</b>${escapeHtml(item.text)}</span>
      </button>
    </li>
  `;
}

function compactPlaceCard(item, placeId) {
  const thumbUrl = item.image || "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=150&q=80";
  return `
    <button class="compact-place-card" type="button" data-place-id="${placeId}">
      <img class="compact-thumb" src="${thumbUrl}" alt="${escapeHtml(item.name)} thumbnail" />
      <span>
        <b>${escapeHtml(item.name)}</b>
        <small>${item.icon} ${escapeHtml(item.kind === "gem" ? "Hidden gem" : "Place to visit")} · ${escapeHtml(item.bestTime)}</small>
      </span>
    </button>
  `;
}

function emptySearch(city, query) {
  return `
    <section class="empty-search">
      <div class="empty-icon">🔎</div>
      <h3>No exact match in ${escapeHtml(city.name)} for "${escapeHtml(query)}".</h3>
      <p>Try Mumbai, Kanheri, food, craft, heritage, caves, market, music, or clear the search.</p>
    </section>
  `;
}

function registerPlaces(city, route, gems, allPlaces) {
  const placeLookup = new Map();
  route.forEach((item, index) => placeLookup.set(`route-${index}`, item));
  gems.forEach((item, index) => placeLookup.set(`gem-${index}`, item));
  city.gems.forEach((item, index) => placeLookup.set(`gem-all-${index}`, item));
  allPlaces.forEach((item, index) => placeLookup.set(`all-${index}`, item));
  results.placeLookup = placeLookup;
}

function openPlace(item) {
  if (!item) return;

  placeImage.src = item.image || heroImage.src;
  placeImage.alt = `${item.name} destination preview`;
  placeType.textContent = item.kind === "gem" ? "Hidden gem" : "Place to visit";
  placeTitle.textContent = item.name;
  placeDescription.textContent = item.text;
  placeWhy.textContent = item.why;
  placeTip.textContent = item.tip;
  placeMeta.innerHTML = `
    <span>${item.icon} ${escapeHtml(item.kind === "gem" ? "Hidden gem" : "Attraction")}</span>
    <span>🕒 ${escapeHtml(item.bestTime)}</span>
    ${item.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
  `;
  placeNearby.innerHTML = item.nearby.map((nearby) => `<li>${escapeHtml(nearby)}</li>`).join("");
  placeModal.hidden = false;
  document.body.classList.add("modal-open");
}

function closePlace() {
  placeModal.hidden = true;
  document.body.classList.remove("modal-open");
}

function storyFor(city, data) {
  return `Imagine arriving in ${city.name} as the day opens like a local conversation. The guide does not only say where to go; it explains why each place matters. It connects ${city.heritage.toLowerCase()} with today's vendors, artists, worshippers, cooks, and guides. The route is ${moodCopy[data.mood]}, while the cultural lens says: ${lensCopy[data.lens]}`;
}

function eventReason(eventName, lens) {
  const endings = {
    food: "Useful for tasting traditions with context instead of treating food as a checklist.",
    craft: "A good way to understand the people and materials behind the city's visual identity.",
    music: "Adds atmosphere, rhythm, and oral storytelling to the route.",
  };

  return `${eventName.includes("walk") ? " Designed for on-ground discovery. " : " Adds a living-culture layer. "}${endings[lens]}`;
}

function buildPrompt(city, data) {
  return `Act as a GenAI cultural travel planner for ${city.name}, ${city.state}. Create a ${data.time} itinerary for a ${moodCopy[data.mood]} traveler with a ${data.budget} budget. Recommend iconic attractions, uncover hidden gems, generate immersive storytelling for each stop, promote local heritage, suggest timely local events, and connect the visitor with authentic cultural experiences. Use the cultural lens: ${lensCopy[data.lens]} Include a searchable web-app section where users can search cities or places, click hidden gems pinned on a destination image, and open a detailed place view with why to go, best time, cultural etiquette, and nearby experiences.${data.note ? ` Traveler preference: ${data.note}` : ""}`;
}

function updateHeroPins(city) {
  city.gems.slice(0, 3).forEach((item, index) => {
    const pin = heroPins[index];
    const [title, subtitle] = pin.children;
    title.textContent = item.name;
    pin.dataset.placeName = item.name;
    subtitle.textContent = index === 0 ? "Hidden gem" : index === 1 ? "Culture stop" : "Story point";
  });
}

function getApiKey() {
  return localStorage.getItem("groqApiKey") || "backend";
}

function getModel() {
  return localStorage.getItem("groqModel") || "llama-3.3-70b-versatile";
}

// Settings Drawer Toggle and Persist Inputs
if (toggleSettingsBtn) {
  toggleSettingsBtn.addEventListener("click", () => {
    settingsPanel.hidden = !settingsPanel.hidden;
    toggleSettingsBtn.textContent = settingsPanel.hidden ? "Configure Groq" : "Hide Settings";
  });

  // Load Key & Model on startup
  if (localStorage.getItem("groqApiKey")) {
    groqApiKeyInput.value = localStorage.getItem("groqApiKey");
  }
  if (localStorage.getItem("groqModel")) {
    groqModelSelect.value = localStorage.getItem("groqModel");
  }

  // Persist values on input/change
  groqApiKeyInput.addEventListener("input", () => {
    localStorage.setItem("groqApiKey", groqApiKeyInput.value.trim());
  });
  groqModelSelect.addEventListener("change", () => {
    localStorage.setItem("groqModel", groqModelSelect.value);
  });
}

function getImgForPlace(name, city, kind) {
  const norm = name.toLowerCase();
  const cNorm = (city || "").toLowerCase();
  
  // Specific city matching (for main hero images)
  if (kind === "hero") {
    if (cNorm.includes("delhi")) return "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80";
    if (cNorm.includes("agra")) return "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80";
    if (cNorm.includes("goa")) return "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80";
    if (cNorm.includes("udaipur")) return "https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=800&q=80";
    if (cNorm.includes("bengaluru") || cNorm.includes("bangalore")) return "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80";
    if (cNorm.includes("chennai")) return "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80";
    if (cNorm.includes("kolkata")) return "https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=800&q=80";
  }

  // Location landmark specific matching
  if (norm.includes("rajwada")) return "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80";
  if (norm.includes("sarafa")) return "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=800&q=80";
  if (norm.includes("chhatri")) return "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=800&q=80";
  if (norm.includes("gateway")) return "https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=800&q=80";
  if (norm.includes("csmt") || norm.includes("terminus")) return "https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=800&q=80";
  if (norm.includes("bandra") || norm.includes("seaface")) return "https://images.unsplash.com/photo-1562979314-bee7453e911c?auto=format&fit=crop&w=800&q=80";
  if (norm.includes("caves") || norm.includes("cave")) return "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80";
  if (norm.includes("hawa")) return "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?auto=format&fit=crop&w=800&q=80";
  if (norm.includes("jantar")) return "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80";
  if (norm.includes("stepwell") || norm.includes("kund")) return "https://images.unsplash.com/photo-1524226359163-702b62273187?auto=format&fit=crop&w=800&q=80";
  if (norm.includes("ghat") || norm.includes("sunrise")) return "https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&w=800&q=80";
  if (norm.includes("nets") || norm.includes("fishing")) return "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80";
  if (norm.includes("pottery") || norm.includes("craft")) return "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80";
  
  // Categorical fallbacks
  if (norm.includes("food") || norm.includes("bazaar") || norm.includes("eat") || norm.includes("market") || norm.includes("restaurant") || norm.includes("dine")) {
    return "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=800&q=80";
  }
  if (norm.includes("temple") || norm.includes("mandir") || norm.includes("shrine") || norm.includes("tomb") || norm.includes("church") || norm.includes("mosque") || norm.includes("basilica")) {
    return "https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&w=800&q=80";
  }
  if (norm.includes("garden") || norm.includes("park") || norm.includes("forest") || norm.includes("lake") || norm.includes("river") || norm.includes("beach") || norm.includes("hill")) {
    return "https://images.unsplash.com/photo-1627894318042-45e05a0d315c?auto=format&fit=crop&w=800&q=80";
  }
  if (norm.includes("music") || norm.includes("dance") || norm.includes("performance") || norm.includes("show") || norm.includes("theater") || norm.includes("theatre")) {
    return "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80";
  }
  
  // Generic beautiful travel fallbacks
  return "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80";
}

async function generateWithGroq(data) {
  // Show Loading Visualizer in results panel
  results.innerHTML = `
    <div class="api-loading-state">
      <div class="spinner">🧭</div>
      <h3>Querying Groq AI cultural engine...</h3>
      <p>Composing a unique route based on your parameters. This takes about 2-3 seconds.</p>
    </div>
  `;
  
  const cityQuery = data.search || destinationSelect.options[destinationSelect.selectedIndex].text.split(",")[0].trim();
  const promptText = `
    Generate a cultural travel itinerary for the city of "${cityQuery}". 
    Traveler mood: ${data.mood} (context: ${moodCopy[data.mood]}).
    Time duration: ${data.time}.
    Budget level: ${data.budget}.
    Cultural focus lens: ${data.lens} (context: ${lensCopy[data.lens]}).
    Personal preferences: ${data.note || "None"}.
    
    You MUST return a JSON object with this exact structure:
    {
      "name": "${cityQuery}",
      "state": "State Name",
      "vibe": "Vibe description...",
      "heritage": "Key heritage/history keywords...",
      "route": [
        {
          "name": "Stop Name 1",
          "text": "Detailed history/context...",
          "icon": "emoji",
          "tags": ["Tag1", "Tag2"],
          "bestTime": "Time slot",
          "why": "Why go context...",
          "tip": "Etiquette tip...",
          "nearby": ["Nearby Stop A", "Nearby Stop B"]
        }
      ],
      "gems": [
        {
          "name": "Hidden Gem Stop 1",
          "text": "Detailed history/context...",
          "icon": "emoji",
          "tags": ["Hidden gem", "Tag"],
          "bestTime": "Time slot",
          "why": "Why go context...",
          "tip": "Etiquette tip...",
          "nearby": ["Nearby Stop C"],
          "position": "top: 20%; left: 30%;"
        }
      ],
      "events": [
        "Local event description 1",
        "Local event description 2"
      ],
      "experiences": [
        "Local experience 1",
        "Local experience 2"
      ],
      "story": "Narrated story matching the traveler request..."
    }
  `;

  try {
    const clientKey = localStorage.getItem("groqApiKey") || "";
    const headers = {
      "Content-Type": "application/json"
    };
    if (clientKey) {
      headers["X-Groq-API-Key"] = clientKey;
    }

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        model: getModel(),
        prompt: promptText
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    
    const resData = await response.json();
    const resultJson = JSON.parse(resData.choices[0].message.content);
    renderGeneratedItinerary(resultJson, data);
  } catch (error) {
    console.error("Groq Generation Error:", error);
    results.innerHTML = `
      <div class="api-error-card">
        <h3>⚠️ Live Generation Failed</h3>
        <p>${error.message}. Please verify your Groq API Key is correct in settings and that you have internet access.</p>
        <button type="button" class="primary-button" id="fallbackBtn">Run Hardcoded Fallback</button>
      </div>
    `;
    
    const fallbackBtn = document.querySelector("#fallbackBtn");
    if (fallbackBtn) {
      fallbackBtn.addEventListener("click", () => {
        currentCityData = null; // Clear cached dynamic city
        render(getFormData());
      });
    }
  }
}

function renderGeneratedItinerary(resultJson, data) {
  const city = {
    name: resultJson.name || data.search || "AI Travel Destination",
    state: resultJson.state || "",
    vibe: resultJson.vibe || "AI generated cultural trail.",
    heritage: resultJson.heritage || "Cultural heritage, local stories",
    route: (resultJson.route || []).map((item) => {
      return {
        ...item,
        kind: "route",
        image: getImgForPlace(item.name, resultJson.name, "route"),
        position: ""
      };
    }),
    gems: (resultJson.gems || []).map((item, idx) => {
      const positions = [
        "top: 22%; left: 16%;",
        "top: 48%; left: 56%;",
        "top: 72%; left: 28%;",
        "top: 35%; left: 70%;"
      ];
      return {
        ...item,
        kind: "gem",
        image: getImgForPlace(item.name, resultJson.name, "gem"),
        position: item.position || positions[idx % positions.length]
      };
    }),
    events: resultJson.events || [],
    experiences: resultJson.experiences || [],
    image: getImgForPlace(resultJson.name, resultJson.name, "hero"),
    alt: `Immersive view of ${resultJson.name}`
  };
  
  currentCityData = city;
  render(data);
}

async function surprise() {
  const destinationKeys = Object.keys(destinations);
  const moods = ["first-time", "food", "history", "slow"];
  const times = ["half", "full", "weekend"];
  const budgets = ["low", "medium", "premium"];
  const lenses = ["food", "craft", "music"];

  destinationSelect.value = sample(destinationKeys);
  citySearch.value = "";
  document.querySelector("#mood").value = sample(moods);
  document.querySelector("#time").value = sample(times);
  document.querySelector("#budget").value = sample(budgets);
  document.querySelector(`input[name='lens'][value='${sample(lenses)}']`).checked = true;
  applySearchToDestination();
  
  if (getApiKey()) {
    await generateWithGroq(getFormData());
  } else {
    currentCityData = null;
    render(getFormData());
  }
}

function sample(items) {
  return items[Math.floor(Math.random() * items.length)];
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  applySearchToDestination();
  if (getApiKey()) {
    await generateWithGroq(getFormData());
  } else {
    currentCityData = null;
    render(getFormData());
  }
});

destinationSelect.addEventListener("change", async () => {
  citySearch.value = "";
  currentCityData = null;
  applySearchToDestination();
  if (getApiKey()) {
    await generateWithGroq(getFormData());
  } else {
    render(getFormData());
  }
});

citySearch.addEventListener("input", () => {
  applySearchToDestination();
  render(getFormData());
});

results.addEventListener("click", (event) => {
  const playBtn = event.target.closest("#playStoryButton");
  if (playBtn) {
    const wave = document.querySelector("#playerWave");
    const playIcon = playBtn.querySelector(".play-icon");
    const playText = playBtn.querySelector(".play-text");
    
    if (wave.classList.contains("playing")) {
      wave.classList.remove("playing");
      playIcon.textContent = "▶";
      playText.textContent = "Listen to Story";
    } else {
      wave.classList.add("playing");
      playIcon.textContent = "⏸";
      playText.textContent = "Pause Story";
    }
    return;
  }

  const trigger = event.target.closest("[data-place-id]");
  if (!trigger) return;
  openPlace(results.placeLookup.get(trigger.dataset.placeId));
});

heroPins.forEach((pin, index) => {
  pin.addEventListener("click", () => {
    const city = destinations[currentCityKey];
    openPlace(city.gems[index]);
  });
});

placeModal.addEventListener("click", (event) => {
  if (event.target.closest("[data-close-place]")) closePlace();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !placeModal.hidden) closePlace();
});

surpriseButton.addEventListener("click", surprise);

// Theme Toggle Script
const themeToggle = document.querySelector("#themeToggle");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    themeToggle.textContent = document.body.classList.contains("dark-theme") ? "☀️ Light Mode" : "🌙 Dark Mode";
    localStorage.setItem("theme", document.body.classList.contains("dark-theme") ? "dark" : "light");
  });

  // Initial check
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-theme");
    themeToggle.textContent = "☀️ Light Mode";
  }
}

applySearchToDestination();
render(getFormData());
