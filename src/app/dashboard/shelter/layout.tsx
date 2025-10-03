import ProtectedRoute from "@/components/ProtectedRouter/ProtectedRoute";

function shelterLayout( { children }: { children: React.ReactNode }) {
    return(
        <ProtectedRoute>
            {children}
        </ProtectedRoute>   
    )
}

export default shelterLayout;