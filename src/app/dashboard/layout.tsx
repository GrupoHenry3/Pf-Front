import DashboardShell from "@/components/DashboardShell/DashboardShell";
import { AdoptionProvider } from "@/context/AdoptionContext";
import { PetProvider } from "@/context/PetContext";
import { ShelterProvider } from "@/context/ShelterContext";
import { UserProvider } from "@/context/UserContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <ShelterProvider>
        <PetProvider>
          <AdoptionProvider>  
            <DashboardShell>{children}</DashboardShell>
          </AdoptionProvider>
        </PetProvider>
      </ShelterProvider>
    </UserProvider>
  );
}
