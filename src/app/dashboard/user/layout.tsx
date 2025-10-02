import ProtectedRoute from "@/components/ProtectedRouter/ProtectedRoute";

function userLayout({ children }: { children: React.ReactNode }) {
  return(
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  )
}

export default userLayout;