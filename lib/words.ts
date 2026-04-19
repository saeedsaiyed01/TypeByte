const commonWords = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "it",
  "for", "not", "on", "with", "he", "as", "you", "do", "at", "this",
  "but", "his", "by", "from", "they", "we", "say", "her", "she", "or",
  "an", "will", "my", "one", "all", "would", "there", "their", "what", "so",
  "up", "out", "if", "about", "who", "get", "which", "go", "me", "when",
  "make", "can", "like", "time", "no", "just", "him", "know", "take", "come",
  "could", "now", "than", "look", "only", "its", "over", "think", "also", "back",
  "after", "use", "two", "how", "our", "work", "first", "well", "way", "even",
  "new", "want", "day", "most", "us", "good", "give", "some", "them", "very",
  "need", "has", "tell", "high", "keep", "try", "same", "ask", "men", "run",
  "own", "help", "line", "turn", "move", "live", "find", "long", "part", "made",
  "old", "here", "many", "sit", "end", "did", "call", "home", "hand", "show",
  "big", "set", "put", "read", "next", "few", "head", "land", "add", "name",
  "play", "must", "lot", "kind", "food", "year", "last", "let", "may", "eye",
  "far", "real", "life", "why", "man", "any", "both", "see", "off", "down",
  "still", "more", "then", "had", "was", "are", "been", "left", "open", "side",
  "seem", "each", "got", "too", "small", "top", "much", "door", "best", "soon",
  "room", "knew", "love", "sure", "yet", "done", "full", "air", "less", "dark",
  "car", "cut", "low", "face", "idea", "city", "once", "felt", "boy", "girl"
];

const hardWords = [
  "algorithm", "asynchronous", "deployment", "infrastructure", "repository", 
  "encapsulation", "polymorphism", "inheritance", "concurrency", "optimization",
  "architecture", "authentication", "authorization", "middleware", "framework",
  "parameter", "dependency", "injection", "abstraction", "interface", "protocol",
  "vulnerability", "encryption", "throughput", "bandwidth", "latency", "recursion",
  "iteration", "validation", "verification", "scalability", "redundancy", "cluster",
  "paradigm", "synthetic", "comprehensive", "utilization", "continuous", "integration",
  "continuous", "delivery", "pipeline", "orchestration", "containerization", "virtualization",
  "microservices", "monolithic", "repository", "immutable", "declarative", "imperative",
  "deterministic", "stochastic", "heuristic", "algorithmic", "complexity", "computational",
  "cryptography", "distributed", "consensus", "idempotent", "middleware", "refactoring",
  "specification", "telemetry", "observability", "instrumentation", "biodiversity",
  "phenomenon", "philosophy", "quintessential", "reverberation", "serendipity",
  "ubiquitous", "vicarious", "whimsical", "xenophobia", "yesteryear", "zealousness"
];

export function generateWords(count: number, difficulty: "easy" | "hard" = "easy"): string[] {
  const result: string[] = [];
  const sourceDeck = difficulty === "hard" ? hardWords : commonWords;
  const deck = [...sourceDeck];
  
  // Basic Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j]!, deck[i]!];
  }

  // Draw exactly `count` words
  for (let i = 0; i < count; i++) {
    if (i < deck.length) {
      result.push(deck[i]!);
    } else {
      // Allow duplicates if user wants more words than available in deck
      result.push(sourceDeck[Math.floor(Math.random() * sourceDeck.length)]!);
    }
  }

  return result;
}
