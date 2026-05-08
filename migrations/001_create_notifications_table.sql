-- Migration: Add notifications table
-- Run this in your PostgreSQL database

CREATE TABLE IF NOT EXISTS gamification.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL DEFAULT 'info',
    title VARCHAR(255) NOT NULL,
    message TEXT,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for efficient queries by user_id and is_read status
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON gamification.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON gamification.notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON gamification.notifications(created_at DESC);