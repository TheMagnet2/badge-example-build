export interface Badge {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  category: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  earnedAt?: string;
  progress?: number;
  icon: string;
  color: string;
}

export const badges: Badge[] = [
  {
    id: "1",
    name: "Early Adopter",
    description: "Joined in the first month",
    longDescription: "You were among the pioneers who believed in us from day one. This badge celebrates your trust and early commitment to our community.",
    category: "Membership",
    rarity: "legendary",
    earnedAt: "2024-01-15",
    icon: "rocket",
    color: "from-amber-400 to-orange-500",
  },
  {
    id: "2",
    name: "Code Master",
    description: "Completed 100 coding challenges",
    longDescription: "Your dedication to continuous learning has paid off. You've conquered 100 coding challenges, proving your skills and perseverance.",
    category: "Achievement",
    rarity: "epic",
    earnedAt: "2024-03-22",
    icon: "code",
    color: "from-cyan-400 to-blue-500",
  },
  {
    id: "3",
    name: "Community Hero",
    description: "Helped 50 community members",
    longDescription: "Your generosity knows no bounds. By helping 50 fellow members, you've become an invaluable pillar of our community.",
    category: "Social",
    rarity: "rare",
    earnedAt: "2024-02-10",
    icon: "users",
    color: "from-emerald-400 to-teal-500",
  },
  {
    id: "4",
    name: "Night Owl",
    description: "Active between midnight and 4 AM",
    longDescription: "While the world sleeps, you code. This badge honors your nocturnal dedication and late-night productivity sessions.",
    category: "Activity",
    rarity: "common",
    earnedAt: "2024-04-05",
    icon: "moon",
    color: "from-indigo-400 to-purple-500",
  },
  {
    id: "5",
    name: "Bug Hunter",
    description: "Found and reported 25 bugs",
    longDescription: "Your keen eye for detail has helped improve our platform. 25 bugs discovered and squashed thanks to your vigilance.",
    category: "Achievement",
    rarity: "rare",
    earnedAt: "2024-05-18",
    icon: "bug",
    color: "from-red-400 to-rose-500",
  },
  {
    id: "6",
    name: "Speed Demon",
    description: "Completed a challenge in under 1 minute",
    longDescription: "Lightning fast! Your quick thinking and rapid execution earned you this badge for completing a challenge in record time.",
    category: "Achievement",
    rarity: "epic",
    earnedAt: "2024-06-30",
    icon: "zap",
    color: "from-yellow-400 to-amber-500",
  },
  {
    id: "7",
    name: "Streak Master",
    description: "30-day activity streak",
    longDescription: "Consistency is key, and you've proven it. 30 consecutive days of activity shows your unwavering commitment.",
    category: "Activity",
    rarity: "rare",
    icon: "flame",
    color: "from-orange-400 to-red-500",
    progress: 75,
  },
  {
    id: "8",
    name: "First Steps",
    description: "Completed your profile",
    longDescription: "Every journey begins with a single step. By completing your profile, you've taken the first step toward greatness.",
    category: "Membership",
    rarity: "common",
    earnedAt: "2024-01-01",
    icon: "footprints",
    color: "from-slate-400 to-zinc-500",
  },
  {
    id: "9",
    name: "Polyglot",
    description: "Used 5 different programming languages",
    longDescription: "Versatility is your strength. Mastering 5 programming languages shows your adaptability and broad skill set.",
    category: "Achievement",
    rarity: "epic",
    earnedAt: "2024-07-12",
    icon: "languages",
    color: "from-violet-400 to-fuchsia-500",
  },
  {
    id: "10",
    name: "Mentor",
    description: "Guide 10 new members",
    longDescription: "Your wisdom and guidance have helped shape the next generation. 10 members have grown under your mentorship.",
    category: "Social",
    rarity: "legendary",
    icon: "graduation-cap",
    color: "from-teal-400 to-cyan-500",
    progress: 40,
  },
  {
    id: "11",
    name: "Perfect Score",
    description: "100% on any assessment",
    longDescription: "Perfection achieved! Your flawless performance on an assessment demonstrates true mastery of the subject.",
    category: "Achievement",
    rarity: "legendary",
    earnedAt: "2024-08-25",
    icon: "trophy",
    color: "from-amber-300 to-yellow-500",
  },
  {
    id: "12",
    name: "Team Player",
    description: "Contributed to 5 group projects",
    longDescription: "Collaboration makes the dream work. Your contributions to 5 group projects show you're a true team player.",
    category: "Social",
    rarity: "common",
    earnedAt: "2024-09-10",
    icon: "handshake",
    color: "from-blue-400 to-indigo-500",
  },
];

export const categories = [
  "All", 
  "Membership", 
  "Achievement", 
  "Social", 
  "Activity",
  "Gaming",
  "Streaming",
  "Events",
  "Loyalty",
  "Challenges",
  "Seasonal",
  "Limited Edition"
];

export const rarityConfig = {
  common: { label: "Common", color: "bg-slate-500", textColor: "text-slate-400" },
  rare: { label: "Rare", color: "bg-blue-500", textColor: "text-blue-400" },
  epic: { label: "Epic", color: "bg-purple-500", textColor: "text-purple-400" },
  legendary: { label: "Legendary", color: "bg-amber-500", textColor: "text-amber-400" },
};
