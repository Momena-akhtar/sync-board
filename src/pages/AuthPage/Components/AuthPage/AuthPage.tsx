import { signInAsGuest, signInWithGoogle, signInWithGitHub } from "../../../../backend/auth/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";
import { authService } from "../../../../services/authService";
import { useState } from "react";

interface AuthPageProps {
    closeModal: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ closeModal }) => {
    const { setUser } = useAuth();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRegister = async () => {
        try {
            await authService.register(formData);
            setMessage({ text: 'Registration successful! Please login.', type: 'success' });
            setIsLogin(true);
            setFormData(prev => ({ ...prev, username: '' }));
        } catch (error) {
            setMessage({ text: 'Registration failed. Please try again.', type: 'error' });
            console.error('Registration error:', error);
        }
    };

    const handleLogin = async () => {
        try {
            const data = await authService.login({
                email: formData.email,
                password: formData.password
            });
            setMessage({ text: 'Login successful!', type: 'success' });
            setUser(data.user);
            setTimeout(() => {
                closeModal();
                navigate("/dashboard");
            }, 1000);
        } catch (error) {
            setMessage({ text: 'Login failed. Please check your credentials.', type: 'error' });
            console.error('Login error:', error);
        }
    };

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

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-lg z-50">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-[400px] relative">
              {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 cursor-pointer text-gray-600 hover:text-gray-900 text-xl"
          >
            ✖
          </button>
          <h2 className="text-2xl font-bold mb-4 text-center">Sign in to Sync</h2>
          {message && (
            <div className={`text-center mb-4 p-2 rounded ${
              message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {message.text}
            </div>
          )}
          <div className="flex flex-col items-center w-full">
            {isLogin ? (
              <>
                <input 
                  className="border border-[#383838] rounded-full p-2 m-2 w-[75%] text-sm"
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email" 
                />
                <input 
                  className="border border-[#383838] rounded-full p-2 m-2 w-[75%] text-sm"
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password" 
                />
              </>
            ) : (
              <>
                <input 
                  className="border border-[#383838] rounded-full p-2 m-2 w-[75%] text-sm"
                  type="text" 
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Username" 
                />
                <input 
                  className="border border-[#383838] rounded-full p-2 m-2 w-[75%] text-sm"
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email" 
                />
                <input 
                  className="border border-[#383838] rounded-full p-2 m-2 w-[75%] text-sm"
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password" 
                />
              </>
            )}
            <div className="flex justify-center m-2 w-full">
              <button 
                onClick={isLogin ? handleLogin : handleRegister}
                className="flex items-center justify-center w-[50%] text-center cursor-pointer p-2.5 rounded-full transition duration-300 hover:scale-105 bg-yellow-400 shadow-lg text-md">
                <span className="font-medium">{isLogin ? "Login" : "Register"}</span>
              </button>
            </div>
            <div className="text-sm text-center mt-2"> 
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:underline cursor-pointer">
                {isLogin ? "New user? Sign up" : "Already have an account? Login"}
              </button>
            </div>
            <div className="text-sm text-center text-gray-500 m-2">Or</div>
          </div>
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
        
        </div>
      </div>
    );
  };
  
  export default AuthPage;
  