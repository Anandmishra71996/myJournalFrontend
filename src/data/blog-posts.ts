import { BlogPost } from "@/types/blog.types";

/**
 * Blog content lives here as plain data. To publish a new post, add an object
 * to this array — no CMS, no rebuild pipeline. Posts are rendered from
 * markdown in `content` via react-markdown.
 */
export const blogPosts: BlogPost[] = [
  {
    slug: "what-are-behavioral-metrics",
    title:
      "What Are Behavioral Metrics? A Guide to Measuring Mindset, Procrastination, and Burnout From Your Own Writing",
    description:
      "Mood trackers tell you how you felt. Behavioral metrics tell you why. Here's what they are, which ones actually matter, and how to start measuring your own from a plain journal.",
    publishedAt: "2026-07-15",
    tags: ["behavioral metrics", "self-knowledge", "journaling"],
    readingTimeMinutes: 8,
    content: `
Most self-tracking apps ask you to rate your day on a 1-to-5 scale and call it data. A mood score tells you *that* Tuesday was rough. It doesn't tell you *why* — and why is the only part you can actually act on.

Behavioral metrics are a different layer of measurement. Instead of a subjective rating, they're patterns extracted from what you actually did and wrote, over time, with evidence attached. They answer questions like: when do I actually procrastinate, and on what kind of task? Is my mindset trending toward growth or toward avoidance this month? What are the early signals before I burn out, and did they show up last week?

## Why mood scores aren't enough

A 1-5 mood rating is a snapshot with no memory. It can't tell you that your low-energy days cluster around Mondays, or that every time you write "I'll deal with it tomorrow" you're describing the same three kinds of tasks. It flattens weeks of nuance into a single number and discards the context that would have made the number useful.

Behavioral metrics solve this by looking *across* entries instead of within a single one. The unit of analysis isn't "how did today feel" — it's "what does the pattern across the last 20 days say about how I operate."

## Four behavioral metrics worth tracking

**1. Mindset ratio (growth vs. fixed).** Do you talk about setbacks as things that happened *to* you, or as information you can use? Tracked over weeks, this ratio shifts — usually in response to specific events you can identify if you look for them. See our [deep dive on measuring growth vs. fixed mindset](/blog/growth-vs-fixed-mindset-how-to-measure-it) for a concrete framework.

**2. Procrastination triggers.** Not "I procrastinate," but *which conditions* precede it. Vague next steps, ambiguous ownership, and tasks with no deadline are the three most common triggers we see across real journal entries — [full breakdown here](/blog/procrastination-triggers-how-to-spot-them).

**3. Execution ratio.** Of the things you said you'd do, what fraction actually got done — and does that ratio move with your stated energy level, or independently of it? A dropping execution ratio alongside stable energy is a different problem (planning) than a dropping ratio alongside dropping energy (capacity).

**4. Resilience trend.** After a bad day, how many days does it take before your tone and output return to baseline? This number is more diagnostic than any single mood entry, because it measures recovery speed rather than the dip itself.

## How to start measuring these from a plain journal

You don't need special software to begin. Behavioral metrics start with raw material: honest, specific writing.

1. **Write what happened, not just how you felt.** "Anxious" is a mood. "Pushed the client email to tomorrow because I didn't know how to open it" is behavioral data — it contains a trigger, a task type, and an avoidance pattern.
2. **Re-read weekly, not daily.** Patterns are invisible entry-by-entry and obvious in aggregate. Set aside 10 minutes once a week to read the last 7 days back-to-back.
3. **Look for repeats, not one-offs.** One late night doesn't mean anything. The same excuse showing up four Fridays in a row does.
4. **Quote yourself.** When you notice a pattern, find the sentence that proves it. Evidence-backed observations ("I wrote this exact thing three weeks ago too") change behavior faster than vague self-diagnosis ever does.

## Where this gets hard to do by hand

The honest limitation of manual tracking is volume. Spotting that you used the phrase "I'll deal with it tomorrow" in six entries over two months is easy for software and genuinely tedious for a human re-reading a notebook. This is the gap tools like [AIGoalReflect](/signup) are built for — reading across your entries automatically and surfacing the pattern along with the exact excerpt that supports it, so you're not relying on memory or willpower to notice what you've already written down.

Whether you track behavioral metrics with software or with a weekly reread of a paper notebook, the principle is the same: the goal isn't to score how you felt. It's to find out what you actually do, under what conditions, and to have the receipts when you spot a pattern worth changing.
`,
  },
  {
    slug: "growth-vs-fixed-mindset-how-to-measure-it",
    title:
      "Growth vs. Fixed Mindset: How to Actually Measure Which One You're In",
    description:
      "\"Growth mindset\" gets thrown around as a personality trait. It's not — it's a ratio that shifts week to week, and you can measure it from your own writing. Here's how.",
    publishedAt: "2026-07-18",
    tags: ["growth mindset", "behavioral metrics", "self-reflection"],
    readingTimeMinutes: 7,
    content: `
Carol Dweck's research on growth vs. fixed mindset gets cited constantly and measured rarely. Most people treat it as a fixed personality label — "I'm a growth mindset person" — when the research actually describes something more useful: a ratio that moves depending on the week, the domain, and the specific setback you're facing.

You are not "a growth mindset person" any more than you are "a well-rested person." You have a growth-to-fixed ratio, and it's trackable if you know what to look for in your own language.

## What actually distinguishes the two, in real sentences

Fixed-mindset framing treats ability as static and setbacks as verdicts:
- "I'm just not a numbers person."
- "I always mess this up."
- "Some people are naturally good at this and I'm not."

Growth-mindset framing treats ability as a trajectory and setbacks as information:
- "I haven't figured out the numbers side yet."
- "I messed this up the same way as last time — what's the actual cause?"
- "I'm behind on this skill, so I need more reps."

The tell isn't optimism. A growth-framed sentence can still be frustrated or tired. The tell is whether the sentence treats the outcome as fixed ("I am") or as a current state with a cause ("I haven't yet," "here's why," "here's what I'll change").

## A simple way to score your own entries

Over a week, flag every sentence in your journal that touches on a setback, a skill, or a comparison to someone else. For each one, ask:

1. Does this sentence describe the setback as permanent, or as current?
2. Does it name a specific, changeable cause — or does it generalize to identity ("I'm just...")?
3. Does it include any next action, even a small one?

Sentences that score "permanent, identity-level, no next action" are fixed-mindset. Sentences that score "current, specific cause, some next step" are growth-mindset. Count both. The ratio between them — not the absence of one — is your actual metric.

Most people are surprised the ratio isn't stable across their own life. You might run 70% growth-framed on work topics and 30% on fitness, because one domain has taken enough repeated hits that your language has calcified around "I'm just not built for this."

## Why the ratio moves — and what moves it

In practice, three things reliably shift someone's ratio in the short term:

- **Public failure.** A setback witnessed by others tends to produce more fixed-mindset language than a private one, even when the failure itself is identical.
- **Sleep and workload.** Under-slept, over-loaded weeks produce more identity-level language ("I'm just bad at this") because there's less cognitive bandwidth to unpack a specific cause.
- **Recent evidence of improvement.** If you've seen yourself get measurably better at something recently, setbacks in that domain get framed as temporary far more often.

This is why "just think more positively" doesn't work as advice — the ratio is downstream of conditions, not willpower. Tracking it tells you which conditions to change.

## Turning this into a habit

You don't need a scoring rubric every day. A lighter version: once a week, reread your entries and circle any sentence that starts with "I'm just" or "I always" or "I never." Those three phrases are a near-perfect proxy for fixed-mindset framing. Rewrite each one as a current-state sentence with a cause. The rewriting exercise alone tends to shift the ratio, because it forces you to locate a specific, changeable reason instead of resting on an identity claim.

If you'd rather not do this manually every week, this is exactly the kind of pattern [AIGoalReflect's behavioral pattern detection](/) is built to surface automatically — it reads your entries, tracks your growth-vs-fixed ratio over time, and shows you the specific sentences behind the trend so you can see the shift instead of just being told about it.

Related reading: [What Are Behavioral Metrics?](/blog/what-are-behavioral-metrics) and [Procrastination Triggers: How to Spot Them](/blog/procrastination-triggers-how-to-spot-them).
`,
  },
  {
    slug: "procrastination-triggers-how-to-spot-them",
    title: "Procrastination Triggers: How to Spot Them Before They Cost You a Week",
    description:
      "\"I procrastinate\" isn't specific enough to fix. Here are the three most common procrastination triggers found in real journal entries, and how to catch them early.",
    publishedAt: "2026-07-21",
    tags: ["procrastination", "productivity", "behavioral metrics"],
    readingTimeMinutes: 7,
    content: `
"I'm a procrastinator" is a diagnosis with no treatment. It describes a symptom without a cause, which is why advice aimed at procrastination in general — "just start," "use a timer," "break it into steps" — works for a week and then stops working. The fix that actually holds isn't aimed at procrastination. It's aimed at the specific trigger behind a specific instance of it.

Across real journal entries, three triggers show up far more often than any others.

## Trigger 1: The undefined next step

This is the single most common trigger. It's not that the task is hard — it's that the very first action is unclear. "Work on the portfolio site" has no obvious first move, so the brain treats it the same as a blocked task, even though nothing is actually blocking it.

**How to spot it in your own writing:** look for tasks described at the project level rather than the action level — "deal with taxes," "sort out the apartment," "figure out the presentation." If a task doesn't have a verb-plus-object first step ("open the folder and rename the file," "draft the first slide's bullet points"), it's a candidate for this trigger.

**The fix isn't motivation, it's specificity.** Before a task sits on your list for more than a day, rewrite it as the literal next physical action. "Figure out the presentation" becomes "open a blank slide and write three bullet points for the intro." The second version gets started because there's nothing left to figure out.

## Trigger 2: Ambiguous ownership

The second most common trigger shows up on tasks that depend on someone else, or that could plausibly be someone else's job. Journal entries around these tasks often contain hedging language: "I guess I should," "someone needs to," "I'm supposed to but I'm not sure if."

**How to spot it:** search your own entries for "I guess," "supposed to," or "not sure if it's my job." These phrases cluster around tasks where responsibility is genuinely unclear — and unclear ownership produces the same avoidance as an undefined next step, just from a different source.

**The fix is a one-sentence ownership decision.** Not a meeting, not a discussion — just deciding, in writing, "this is mine" or "this is not mine, and here's who I'm handing it to." The task itself doesn't need to be easier. It needs to stop being ambiguous.

## Trigger 3: No real deadline

Tasks with a soft or self-imposed deadline get pushed at a dramatically higher rate than tasks with an externally enforced one. This isn't a willpower failure — it's a rational response to the fact that a deadline with no consequence isn't actually a deadline.

**How to spot it:** look at how many of your recurring "pushed to tomorrow" items have a date attached to them at all. If the honest answer is "no, I just keep meaning to get to it," the trigger isn't the task's difficulty — it's the absence of a forcing function.

**The fix is borrowing a consequence.** Tell someone else the date. Put it on a shared calendar. Attach it to something that already has a hard deadline. The task doesn't change; the cost of missing it does.

## Why "just track that you procrastinate" doesn't help

The reason generic procrastination advice fails is that all three triggers above require a completely different fix, and a single tactic ("use a timer") only addresses one of them well. Timers help with vague, low-stakes avoidance. They do nothing for ambiguous ownership. Breaking tasks into steps helps with undefined next steps but does nothing if the real issue is a missing deadline.

This is the case for tracking triggers specifically rather than tracking "did I procrastinate today" as a yes/no. Once you can see which trigger shows up most in your own writing, you can pick the one fix that actually addresses it — instead of cycling through generic productivity advice that was aimed at someone else's version of the problem.

If manually re-reading your own entries for these three patterns sounds like more work than you want to do weekly, [AIGoalReflect](/signup) detects procrastination triggers automatically from your journal and shows you the exact entry each detection is based on — see [what behavioral metrics are](/blog/what-are-behavioral-metrics) for how that detection works under the hood.
`,
  },
];

export function getAllPosts(): BlogPost[] {
  return [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getAllSlugs(): string[] {
  return blogPosts.map((post) => post.slug);
}
