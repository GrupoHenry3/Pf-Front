import { UserInterface } from "@/interfaces/User";

export const getRedirectUrl = (user: UserInterface) => {
    
    if (user.siteAdmin) {
      return '/dashboard/admin';
    }
    switch (user.userType) {
      case 'User':
        return '/dashboard/user';
      case 'Shelter':
        return '/dashboard/shelter';
      case 'Admin':
        return '/dashboard/admin';
      default:
        return '/dashboard/user';
    }
  };
