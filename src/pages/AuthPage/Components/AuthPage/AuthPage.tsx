import { signInAsGuest, signInWithGoogle, signInWithGitHub } from "../../../../backend/auth/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";
import { authService } from "../../../../services/authService";

interface AuthPageProps {
    closeModal: () => void;
  }
  
  const AuthPage: React.FC<AuthPageProps> = ({ closeModal }) => {
    const { setUser } = useAuth();
    const navigate = useNavigate();

    const handleBackendAuth = async (user: any) => {
      try {
        const token = await user.getIdToken();
        await authService.loginWithFirebase(token);
        setUser(user);
        closeModal();
        navigate("/dashboard");
      } catch (error) {
        console.error("Backend authentication failed:", error);
      }
    };

    const handleGoogleLogin = async () => {
      const user = await signInWithGoogle();
      if (user) {
        await handleBackendAuth(user);
      }
    };
    const handleGitHubLogin = async () => {
      const user = await signInWithGitHub();
      if (user) {
        await handleBackendAuth(user);
      }
    };
    const handleGuestLogin = async () => {
      const user = await signInAsGuest();
      if (user) {
        await handleBackendAuth(user);
      }
    };
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-lg z-50">
            <div className="bg-[#f5ebd3] p-8 rounded-2xl shadow-xl w-[400px] relative">
              {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 cursor-pointer text-gray-600 hover:text-gray-900 text-xl"
          >
            ✖
          </button>
          <h2 className="text-2xl font-bold mb-4 text-center">Sign in to Sync</h2>
              {/* Google Button */}        
            <div className="flex justify-center items-grid w-full">
        <button 
         onClick={handleGoogleLogin}
        className="flex items-center cursor-pointer p-3 border rounded-full transition duration-300 hover:scale-105">
            <img 
            src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" 
            alt="Google icon" 
            className="w-6 h-6 mr-2" 
            />
            <span className="font-semibold">Continue with Google</span>
        </button>
        </div>
        {/* Github button */}
        <div className="flex justify-center items-grid w-full mt-4 mb-4">
        <button 
         onClick={handleGitHubLogin}
        className="flex items-center cursor-pointer p-3 border rounded-full transition duration-300 hover:scale-105">
            <img 
            src="https://cdn-icons-png.flaticon.com/512/733/733609.png" 
            alt="Github icon" 
            className="w-6 h-6 mr-2" 
            />
            <span className="font-semibold">Continue with GitHub</span>
        </button>
        </div>
        {/*Microsoft Button */}
        <div className="flex justify-center items-grid w-full">
        <button 
        onClick={handleGuestLogin}
        className="flex items-center cursor-pointer p-3 rounded-full transition duration-300 hover:scale-105 bg-yellow-400 shadow-lg">
           <img 
            src="https://cdn-icons-png.flaticon.com/512/847/847969.png" 
            alt="Guest icon" 
            className="w-6 h-6 mr-2" />
            <span className="font-semibold">Continue as Guest</span>
        </button>
              
        </div>
        </div>
      </div>
    );
  };
  
  export default AuthPage;
  