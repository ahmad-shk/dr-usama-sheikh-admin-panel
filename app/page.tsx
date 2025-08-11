import { AppointmentList } from "@/components/appointment-list"
import { Header } from "@/components/header"
import { ProtectedRoute } from "@/components/protected-route"

export default function Home() {
  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header />
        <div className="max-w-6xl mx-auto p-4">
          <AppointmentList />
        </div>
      </main>
    </ProtectedRoute>
  )
}
