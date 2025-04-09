import ProtectedRoute from "@/app/components/auth/ProtectedRoute";
import ProfileForm from "@/app/components/profile/ProfileForm";
import OrderHistory from "@/app/components/profile/OrderHistory";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            <ProfileForm />

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">
                Historique des commandes
              </h2>
              <OrderHistory />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
