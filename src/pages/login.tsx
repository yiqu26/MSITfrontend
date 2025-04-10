// login.js
import { LoginForm } from '@/components/login-form';
export default function LoginPage() {


  return (
    <div
    className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 dark:from-gray-800 dark:via-gray-900 dark:to-black overflow-hidden font-sans"
  >
      <div className="w-full max-w-sm md:max-w-3xl"> 
        <LoginForm />
      </div>
    </div>
  )
}