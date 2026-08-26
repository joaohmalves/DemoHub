import { ReactNode } from 'react';
import styles from './Badge.module.css';

interface BadgeProps {
  tone?: 'neutral' | 'success' | 'warning' | 'accent';
  children: ReactNode;
}

// Small "pill" used for capability/status indicators (e.g. "Chat", "Voice"),
// deliberately not a checkbox per the spec's UX decisions.
export function Badge({ tone = 'neutral', children }: BadgeProps) {
  return <span className={[styles.badge, styles[tone]].join(' ')}>{children}</span>;
}
