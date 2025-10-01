import ProtectedRoute from "@/components/ProtectedRouter/ProtectedRoute";

function userLayout({ children }: { children: React.ReactNode }) {
  return(
    <ProtectedRoute allowedUserTypes={["User"]}>
      {children}
    </ProtectedRoute>
  )
}

export default userLayout;