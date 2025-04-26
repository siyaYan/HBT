const habitList = [
  // Morning Kickstart
  "Smooth your bedsheets with one flourish – make your bed look neat in 20 seconds",
  "Stay screen-free for 10 minutes after waking – breathe, stretch, or sip water",
  "Sip water with a twist – add a mint leaf or a quick ‘today’s gonna rock’ thought",
  "Step outside for 10 seconds – listen for one sound, like birds or wind",
  "Wiggle your body for 60 seconds – shimmy, twist, or march in place",
  "Play a song that sparks joy – pick one that feels like your day’s anthem",
  "Slip on a favorite accessory – a bracelet, scarf, or cozy socks, even at home",
  "Pull back curtains or crack a window – let morning light wake your space",
  "Delay coffee for 30 minutes – notice your natural energy first",
  "Name one micro-win for today – e.g., ‘say hi to a neighbor’ or ‘eat a veggie’",

  // Productivity Boosters
  "Clear one small work area – stack papers or wipe a desk in 2 minutes",
  "Put on ‘focus socks’ – a specific pair to signal it’s work time",
  "Tidy one thing for 3 minutes – a shelf, bag, or email inbox",
  "List 2 tasks for tomorrow – keep it short to end your day with clarity",
  "Hide your phone in a bag for 25 minutes – dive into one task uninterrupted",
  "Ban one app for the morning – e.g., no social media until lunch",
  "Play nature sounds for focus – waves, forest, or wind to stay calm",
  "Stand or stretch every 45 minutes – reset your body and brain",
  "Trash one old note or file – clear a tiny bit of digital chaos",
  "Use a paper timer – jot ‘20 min’ on a note and cross it off when done",

  // Mental Wellbeing
  "Jot one happy moment – e.g., ‘laughed at a meme’ on a sticky note",
  "Savor one meal distraction-free – focus on flavors for 2 minutes",
  "Keep a ‘spark’ list – note tiny joys, like ‘sunset glow’ or ‘good chat’",
  "Choose tomorrow’s shirt tonight – free up morning mental space",
  "Notice one detail for 20 seconds – a flower’s color or coffee’s warmth",
  "Send yourself a pep-talk text – e.g., ‘You’ve got this!’",
  "Do one chore mindfully – sweep or wash a cup with total focus",
  "Skip self-doubt talk for 2 hours – redirect to something neutral",
  "Read one feel-good sentence before bed – from a book or saved quote",
  "Embrace 2 minutes of boredom – stare out a window, no phone",

  // Things to Stop Doing
  "Avoid social media until after breakfast – start your day with you, not feeds",
  "Skip snooze entirely – set your alarm 5 feet away",
  "Eat lunch away from screens – even if it’s just at a table nearby",
  "Try a ‘no grumbling’ challenge for 2 hours – find humor instead",
  "Keep your phone out of the bathroom – make it a sacred tech-free zone",
  "Decline one draining request – politely save your energy",
  "Wait 3 minutes before texting back – give yourself breathing room",
  "Avoid replaying old movies or posts – seek a fresh story instead",
  "Unfollow one account that bums you out – curate a happier feed",
  "Cap your to-do list today – no new tasks, just finish one",

  // Night-Time Reset
  "Switch your phone to silent 30 minutes before bed – wind down fully",
  "Use a soft light 15 minutes before sleep – a candle or dim lamp works",
  "Scrawl one worry to let it go – rip it up or tuck it away",
  "Set out tomorrow’s shoes – make mornings feel ready-to-go",
  "Straighten one corner – fold a towel or clear a bedside table",
  "Stretch one body part – roll your wrists or loosen your shoulders",
  "Listen to a mellow audio – a short story or calming music, no screens",
  "Put your alarm out of arm’s reach – force a proper wake-up",
  "Skip alarms one weekend morning – let your body decide when to rise",
  "Note one word for your day’s vibe – e.g., ‘calm,’ ‘rushed,’ or ‘fun’",

  // Social Connection
  "Ping someone with a quick ‘you rock’ note – spread a smile",
  "Give a specific thank-you – e.g., ‘Your joke made my day’",
  "Compliment a non-physical trait – e.g., ‘Your patience is amazing’",
  "Smile at one person you pass – a cashier, neighbor, or stranger",
  "Say hi to a familiar stranger – the dog-walker or store clerk you always see",
  "Ear on, haste off – listen to someone without rushing to respond",
  "Call a friend for 90 seconds – just to hear their voice",
  "Text someone you’ve lost touch with – a simple ‘how’s life?’ works",
  "Ask a curious question – e.g., ‘What’s a random thing you love?’",
  "Share 2 distraction-free minutes – be fully with someone, no devices",

  // Digital Wellbeing
  "Go greyscale for 2 hours – dull your phone’s allure",
  "Mute one chat that’s too noisy – reclaim your mental space",
  "Clear your phone’s home screen – one app or none for simplicity",
  "Kill notifications for one app – pick something that nags you",
  "Lower screen brightness at dusk – ease your eyes into night",
  "No phones during one ritual – e.g., tea, meals, or bedtime prep",
  "Ditch one app you barely use – free up a sliver of space",
  "Unsubscribe from one junk email – hit ‘unsubscribe’ and celebrate",
  "Bury time-suck apps in a folder – make them a hassle to open",
  "Trade 5 minutes of scrolling for a micro-hobby – sketch, hum, or journal",

  // Financial & Lifestyle Wellbeing
  "Peek at your balance for 5 seconds – stay aware, no overthinking",
  "Set a $3 daily ‘fun’ limit – track it for a tiny challenge",
  "Use cash for one small buy – feel the exchange in your hands",
  "Drop one unused subscription – check your apps or card statement",
  "Save a want for tomorrow – snap a pic instead of buying now",
  "Scan one recent purchase – spot a habit, no judgment",
  "Set one money micro-rule – e.g., ‘skip impulse snacks’",
  "Pick one item to rehome – a mug, shirt, or book you don’t need",
  "Cook one meal from pantry staples – cut food waste today",
  "Price-check a wish-list item – but wait a day to decide",

  // Environmental & Physical Wellbeing
  "Ditch one bag item – lighten your load by one thing",
  "Use a reusable cup or bottle all day – skip disposable drinks",
  "Switch off one unused plug – a charger or lamp to save power",
  "Grab one piece of litter – toss it to clean your path",
  "Walk one short distance – to the store or mailbox, if doable",
  "Toss one fruit or veg into a meal – an apple slice or some greens",
  "Gaze at nature for 2 minutes – a tree, cloud, or blade of grass",
  "Take a 3-minute screen break – just sit and soak in your surroundings",
  "Move for fun – hop, sway, or stretch for 90 seconds",
  "Open a window for 3 minutes – let fresh air clear your head"
];

const habitCategory = [
  "Workout 🏋️‍♂️", 
  "Healthy Eating 🥗", 
  "Sleep 😴", 
  "Care for Others ❤️", 
  "Self-Care 🛀", 
  "Mindfulness 🧘‍♂️", 
  "Hydration 💧", 
  "Digital Detox 📵", 
  "Financial Well-being 💰", 
  "Time Management ⏳", 
  "Personal Growth 📚", 
  "Social Connection 🤝", 
  "Nature & Outdoors 🌿", 
  "Gratitude 🙏", 
  "Mental Resilience 💪"
];

export { habitList, habitCategory };