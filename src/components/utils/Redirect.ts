import { UserInterface } from "@/interfaces/User";

export const getRedirectUrl = (user: UserInterface) => {
    
    if (user.siteAdmin) {
      return '/dashboard/admin';
    }
    switch (user.userType) {
      case 'adopter':
        return '/dashboard/adopter';
      case 'shelter':
        return '/dashboard/shelter';
      case 'admin':
        return '/dashboard/admin';
      default:
        return '/dashboard/adopter';
    }
  };