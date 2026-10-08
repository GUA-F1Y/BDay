// ============================================================
// BIRTHDAY CONTENT — edit everything here.
// Do NOT touch component files for content changes.
// ============================================================

export const birthdayContent = {
  // ── Identity ──────────────────────────────────────────────
  recipient: "Caca",
  sender: "J",
  age: 20,

  // ── Opening Screen ────────────────────────────────────────
  opening: {
    text: "just a little thing, made for you.",
    buttonLabel: "!",
  },

  // ── Home Screen ───────────────────────────────────────────
  home: {
    headline: "today is yours.",
    supportingText: "take your time, have a look around.",
    cards: {
      memories: {
        title: "memories",
        subtitle: "a few favorite moments",
      },
      letter: {
        title: "a little letter",
        subtitle: "something I wanted to say",
      },
      wish: {
        title: "make a wish",
        subtitle: "three candles for you",
      },
      oneMoreThing: {
        title: "one more thing",
        subtitleLocked: "not yet...",
        subtitleUnlocked: "okay, now you can.",
      },
    },
  },

  // ── Memories ──────────────────────────────────────────────
  memories: {
    images: [
      "/images/memory-01.jpg",
      "/images/memory-02.jpg",
      "/images/memory-03.jpg",
      "/images/memory-04.jpg",
      "/images/memory-05.jpg",
    ],
    captions: [
      "one of those little moments worth keeping.",
      "time moves fast, but this one stuck around.",
      "this one always brings a smile.",
      "genuinely glad this moment happened.",
      "definitely one of my favorite memories.",
    ],
  },

  // ── Letter ────────────────────────────────────────────────
  letter: {
    preText: "there's something\nI wanted to say.",
    buttonLabel: "read it",
    // Paragraphs are rendered individually for animated reveal.
    paragraphs: [
      "For Caca,",
      "Happy 20th Birthday.",
      "I'm usually not the best at writing long sentimental speeches, so I'll keep it simple and honest.",
      "Turning 20 is a big milestone, but you really don't have to have everything figured out right now. Just take things at your own pace, enjoy the small quiet moments, and keep being unapologetically you.",
      "I hope this year brings you fewer things to worry about, more genuine laughs, good food, peace of mind, and days that make you glad to be alive.",
      "This is just a small little gesture, but I hope it brings a smile to your face today.",
      "Have the happiest birthday, Caca.",
      "— J",
    ],
  },

  // ── Make A Wish ───────────────────────────────────────────
  wish: {
    headline: "make a wish.",
    supportingText: "close your eyes. take your time.",
    grantedText: "wish granted.",
    candleCount: 3,
  },

  // ── Final Surprise ────────────────────────────────────────
  final: {
    preText: "one last thing.",
    openLabel: "open",
    image: "/images/final.jpg",
    greeting: "Happy 20th Birthday, Caca.",
    message:
      "May this chapter be gentle with you, bring good surprises, and give you plenty of quiet, happy days worth remembering.\n\nNever forget to be proud of how far you've come.",
    finalLine: "You deserve a genuinely beautiful year.",
    signature: "— J",
  },

  // ── Ending ────────────────────────────────────────────────
  ending: {
    line1: "made just for you.",
    signature: "— J",
    replayLabel: "start over",
  },

  // ── Music ─────────────────────────────────────────────────
  music: {
    src: "/audio/birthday-song.mp3",
    // Set to false if you want music off by default even when the file exists.
    defaultEnabled: false,
  },
};

export type BirthdayContent = typeof birthdayContent;
