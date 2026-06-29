import { pgTable, uuid, varchar, text, timestamp, integer, real, jsonb, boolean, customType } from 'drizzle-orm/pg-core';

// Custom type for tsvector since Drizzle doesn't have it built-in natively yet
const tsvector = customType<{ data: string }>({
  dataType() {
    return 'tsvector';
  },
});

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  displayName: varchar('display_name', { length: 255 }),
  avatarUrl: varchar('avatar_url', { length: 1024 }),
  level: varchar('level', { enum: ['beginner', 'intermediate', 'advanced'] }).default('beginner'),
  xpPoints: integer('xp_points').default(0),
  streakDays: integer('streak_days').default(0),
  lastActiveAt: timestamp('last_active_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const series = pgTable('series', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  titleEn: varchar('title_en', { length: 255 }),
  genre: varchar('genre', { length: 100 }),
  difficultyLevel: varchar('difficulty_level', { enum: ['beginner', 'intermediate', 'advanced'] }),
  thumbnailUrl: varchar('thumbnail_url', { length: 1024 }),
  youtubeChannelId: varchar('youtube_channel_id', { length: 255 }),
  description: text('description'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const episodes = pgTable('episodes', {
  id: uuid('id').defaultRandom().primaryKey(),
  seriesId: uuid('series_id').references(() => series.id),
  youtubeVideoId: varchar('youtube_video_id', { length: 50 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  seasonNumber: integer('season_number'),
  episodeNumber: integer('episode_number'),
  durationSeconds: integer('duration_seconds'),
  thumbnailUrl: varchar('thumbnail_url', { length: 1024 }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const subtitles = pgTable('subtitles', {
  id: uuid('id').defaultRandom().primaryKey(),
  episodeId: uuid('episode_id').references(() => episodes.id),
  language: varchar('language', { length: 10 }), // e.g., 'en', 'pt'
  segments: jsonb('segments'), // Array of { start, end, text }
  searchVector: tsvector('search_vector'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const scenes = pgTable('scenes', {
  id: uuid('id').defaultRandom().primaryKey(),
  episodeId: uuid('episode_id').references(() => episodes.id),
  subtitleId: uuid('subtitle_id').references(() => subtitles.id),
  startTime: real('start_time').notNull(),
  endTime: real('end_time').notNull(),
  textEn: text('text_en').notNull(),
  textPt: text('text_pt'),
  difficultyLevel: varchar('difficulty_level', { enum: ['beginner', 'intermediate', 'advanced'] }),
  searchVector: tsvector('search_vector'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const vocabulary = pgTable('vocabulary', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  sceneId: uuid('scene_id').references(() => scenes.id),
  word: varchar('word', { length: 255 }).notNull(),
  definition: varchar('definition', { length: 500 }),
  phoneticIpa: varchar('phonetic_ipa', { length: 100 }),
  exampleSentence: varchar('example_sentence', { length: 1024 }),
  repetitionCount: integer('repetition_count').default(0),
  easeFactor: real('ease_factor').default(2.5), // SM-2 algorithm
  nextReviewAt: timestamp('next_review_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const pronunciationAttempts = pgTable('pronunciation_attempts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  sceneId: uuid('scene_id').references(() => scenes.id),
  expectedText: text('expected_text').notNull(),
  recognizedText: text('recognized_text'),
  accuracyScore: real('accuracy_score'), // 0.0 - 1.0
  wordScores: jsonb('word_scores'), // Per-word breakdown
  durationMs: integer('duration_ms'),
  createdAt: timestamp('created_at').defaultNow(),
});
