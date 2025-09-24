import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedUserTypes: string[];
}

const ProtectedRoute = ({ children, allowedUserTypes }: ProtectedRouteProps) => {
    const { user, isUserLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!isUserLoading) {
            if (!user) {
                router.replace("/auth");
            } else if (!allowedUserTypes.includes(user.userType)) {
                router.replace((`/dashboard/${user.userType}`).toLowerCase());
            }
        }
    }, [user, isUserLoading, allowedUserTypes, router]);

    if (!user || !allowedUserTypes.includes(user.userType)) {
        return null;
    }

    return <>{children}</>;
}

export default ProtectedRoute;