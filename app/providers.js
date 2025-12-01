
'use client';

import React from 'react';
import { UserProvider } from './components/UserProvider';

export default function Providers({ children }) {
  return <UserProvider>{children}</UserProvider>;
}
