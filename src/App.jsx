import { AuthProvider, useAuth } from './features/auth/AuthContext';
import TaskDashboard from './features/tasks/TaskDashboard';

function AppContent() {
  const { user, loginWithGoogle } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-10 rounded-2xl shadow-xl max-w-sm w-full text-center">
          <h1 className="text-3xl font-bold mb-2">TaskHub</h1>
          <p className="text-gray-500 mb-8">DevSecOps Edition</p>
          <button
            onClick={loginWithGoogle}
            className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition font-medium"
          >
            Continuar con Google
          </button>
        </div>
      </div>
    );
  }

  return <TaskDashboard />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}