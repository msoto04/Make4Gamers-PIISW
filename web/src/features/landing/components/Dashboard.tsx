import { NewsCarousel } from "./NewsCarousel";
import { useAuthStatus } from '../../auth/hooks/useAuthStatus';

export default function Dashboard() {
  const { user } = useAuthStatus();

  return (
    <>
        <div className="flex mt-8 items-center justify-center">
            <h1 className="text-4xl font-bold">
              Welcome {user?.user_metadata?.fullName || user?.email || 'User'}!
            </h1>
        </div>
        <NewsCarousel />
    </>
    
    
  );
}