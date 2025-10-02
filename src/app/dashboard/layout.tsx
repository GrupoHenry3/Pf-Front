import DashboardShell from "@/components/DashboardShell/DashboardShell";
import { AdoptionProvider } from "@/context/AdoptionContext";
import { BreedProvider } from "@/context/BreedContext";
import { DonationProvider } from "@/context/DonationContext";
import { PetProvider } from "@/context/PetContext";
import { ShelterProvider } from "@/context/ShelterContext";
import { SpeciesProvider } from "@/context/SpeciesContext";
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
            <SpeciesProvider>
              <BreedProvider>
            <AdoptionProvider>
              <DonationProvider>
              <DashboardShell>{children}</DashboardShell>
              </DonationProvider>
            </AdoptionProvider>
            </BreedProvider>
            </SpeciesProvider>
          </PetProvider>
        </ShelterProvider>
    </UserProvider>
  );
}
