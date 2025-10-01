import ProtectedRoute from "@/components/ProtectedRouter/ProtectedRoute";

function shelterLayout( { children }: { children: React.ReactNode }) {
    return(
        <ProtectedRoute allowedUserTypes={["Shelter"]}>
            {children}
        </ProtectedRoute>   
    )
}

export default shelterLayout;