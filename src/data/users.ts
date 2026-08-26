// Static credential list for internal demo-hub access control.
// This is NOT a security boundary for sensitive data — anyone with access to the
// built JS bundle can read these values. It only gates access to the internal
// UI for a shared/projected demo environment. See services/auth.ts.
export interface DemoUser {
  username: string;
  password: string;
  displayName: string;
}

export const users: DemoUser[] = [
  { username: 'ae1', password: 'cognigy2024', displayName: 'Account Executive' },
  { username: 'se1', password: 'cognigy2024', displayName: 'Solutions Engineer' },
  { username: 'admin', password: 'cognigy2024', displayName: 'Demo Admin' },
];
