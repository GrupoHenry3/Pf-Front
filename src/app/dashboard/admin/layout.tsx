import ProtectedRoute from "@/components/ProtectedRouter/ProtectedRoute";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return(
    <ProtectedRoute requireSiteAdmin={true}>
      {children}
    </ProtectedRoute>
  )
}  

export default AdminLayout;