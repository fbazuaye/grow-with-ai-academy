INSERT INTO public.programs (slug, title, audience, outcome, duration, hero_headline, problem, learnings, tools, icon, featured, active, sort_order)
VALUES (
  'ai-video-teens',
  'AI Video Bootcamp for Teens',
  'Teens (13–19) ready to create & monetize',
  'Create, post, and grow with AI video — from first video to first earning opportunity.',
  '4 Saturdays · 2–3 hrs per session',
  'Create, Post & Grow with AI Video',
  'Teens love content but get stuck — no idea what to post, low views, no income. AI changes that.',
  ARRAY[
    'AI video workflow: idea → script → video',
    'Trending topic research with YTRadar',
    'Hook engineering & retention tricks',
    'CapCut deep dive + captions & pacing',
    'Posting on TikTok, Instagram & YouTube Shorts',
    'Monetization, portfolio & first client outreach'
  ],
  ARRAY['CapCut','YTRadar','ChatGPT'],
  'sparkles',
  false,
  true,
  6
);