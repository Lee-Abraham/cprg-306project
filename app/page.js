
'use client';

import { useUser } from './components/UserProvider';
import LogInScreen from './screens/LogInScreen/page';
import HomeScreen from './screens/HomeScreen/page';

export default function Home() {
  const { authUser, loading } = useUser();

  if (loading) return <div>Loading...</div>;

  return authUser ? <HomeScreen /> : <LogInScreen />;
}
