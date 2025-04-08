import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from 'react-router-dom'; // 引入 useNavigate
import { AlertCircle } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { motion } from "framer-motion";

//for facebook login
declare global {
  interface Window {
    FB: any;
  }
}

//for default user account
const defaultUser = {
  email: 'test@example.com',
  password: 'test123',
};

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  //驗證預設的user account
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate(); // 使用 useNavigate 鉤子

  //驗證預設的user account
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === defaultUser.email && password === defaultUser.password) {
      navigate('/'); // 登入成功後導航到 home 頁面
    } else {
      setShowAlert(true);
    }
  };

  //google login
  const loginGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log('登入成功', tokenResponse);
      navigate('/'); // 模擬登入成功後跳轉首頁
    },
    onError: (error) => {
      console.error('登入失敗', error);
    }
  });

  //facebook login
  const loginFacebook = () => {
    window.FB.login(function (response: any) {
      if (response.authResponse) {
        console.log('Facebook 登入成功 ✅', response);
        navigate("/");
      } else {
        console.log('Facebook 登入取消或失敗 ❌', response);
      }
    }, { scope: 'public_profile,email' });
  };

  // Apple login
  const loginTwitter = () => {
    const clientId = "your-twitter-client-id"; // 替換為你的 Twitter Client ID
    const redirectUri = "https://your-app.com/callback"; // 替換為你的回調 URL
    const state = "random_state_string"; // 用於防止 CSRF 攻擊

    const twitterAuthUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&state=${state}&scope=tweet.read%20users.read%20offline.access`;

    // 導向 Twitter 登入頁面
    window.location.href = twitterAuthUrl;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="overflow-hidden">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form className="p-6 md:p-8" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">

                <div className="relative">
                  <div className="flex flex-col items-center text-center">
                    {/* 標題 */}
                    {/* 返回按鈕 */}
                    <button
                      onClick={() => navigate("/")} // 返回上一頁
                      className="absolute top-0 left-0 text-sm text-primary dark:text-blue-400 hover:underline"
                    >
                      <motion.svg
                        whileHover={{ scale: 1.2, rotate: 15 }}
                        whileTap={{ scale: 0.9 }}
                        width="16"
                        height="16"
                        clip-rule="evenodd"
                        fill="currentColor"
                        stroke-linejoin="round"
                        stroke-miterlimit="2"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="m10.978 14.999v3.251c0 .412-.335.75-.752.75-.188 0-.375-.071-.518-.206-1.775-1.685-4.945-4.692-6.396-6.069-.2-.189-.312-.452-.312-.725 0-.274.112-.536.312-.725 1.451-1.377 4.621-4.385 6.396-6.068.143-.136.33-.207.518-.207.417 0 .752.337.752.75v3.251h9.02c.531 0 1.002.47 1.002 1v3.998c0 .53-.471 1-1.002 1z" />
                      </motion.svg>
                    </button>
                    <h1 className="text-2xl font-bold">Welcome back</h1>
                    <p className="text-balance text-muted-foreground">
                      登入以繼續
                    </p>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="/forgetpassword"
                      className="ml-auto text-sm underline-offset-2 hover:underline"
                    >
                      忘記密碼?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required />
                </div>
                <Button type="submit" className="w-full">
                  登入
                </Button>

                {showAlert && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      帳號或密碼錯誤，請重新輸入。
                    </AlertDescription>
                  </Alert>
                )}
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 bg-background px-2 text-muted-foreground">
                    或者用下列方式登入
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <Button onClick={() => loginTwitter()} variant="outline" className="w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 16 16">
                      <path
                        d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="sr-only">Login with X</span>
                  </Button>
                  <Button onClick={() => loginGoogle()} >
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%"
                      height="100%" viewBox="0 0 24 24">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="sr-only">Login with Google</span>
                  </Button>
                  <Button onClick={() => loginFacebook()} variant="outline" className="w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%"
                      height="100%" viewBox="0 0 24 24">
                      <path
                        d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="sr-only">Login with Meta</span>
                  </Button>
                </div>
                <div className="text-center text-sm">
                  還沒有帳號嗎?{" "}
                  <a href="/signup" className="underline underline-offset-4">
                    註冊
                  </a>
                </div>
              </div>
            </form>
            {/* 右側圖片 + 煙霧效果 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative hidden bg-muted md:block"
            >
              {/* 背景圖片 */}
              <img
                src="https://images4.alphacoders.com/121/1219190.jpg"
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover dark:opacity-80 dark:brightness-75 dark:contrast-125 dark:saturate-150 z-0"
              />

              {/* 煙霧效果 */}
              <div className="absolute bottom-0 left-0 right-0 h-full overflow-hidden z-10">
                {/* 黑色煙霧效果 */}
                {[...Array(30)].map((_, i) => (
                  <motion.div
                    key={`black-${i}`}
                    className="absolute rounded-full bg-gradient-to-t from-gray-900/80 to-transparent blur-3xl"
                    style={{
                      width: `${Math.random() * 60 + 40}px`,
                      height: `${Math.random() * 60 + 40}px`,
                      left: `${Math.random() * 100}%`,
                      opacity: Math.random() * 0.4 + 0.6,
                    }}
                    initial={{
                      y: 300,
                      x: 0,
                      rotate: 0,
                    }}
                    animate={{
                      y: -200,
                      x: Math.random() * 100 - 50,
                      opacity: 0,
                      rotate: Math.random() * 360,
                    }}
                    transition={{
                      duration: Math.random() * 5 + 3,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}

                {/* 白色煙霧效果 */}
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={`white-${i}`}
                    className="absolute rounded-full bg-gradient-to-t from-white/70 to-transparent blur-2xl"
                    style={{
                      width: `${Math.random() * 50 + 30}px`,
                      height: `${Math.random() * 50 + 30}px`,
                      left: `${Math.random() * 100}%`,
                      opacity: Math.random() * 0.3 + 0.5,
                    }}
                    initial={{
                      y: 300,
                      x: 0,
                      rotate: 0,
                    }}
                    animate={{
                      y: -250,
                      x: Math.random() * 100 - 50,
                      opacity: 0,
                      rotate: Math.random() * 360,
                    }}
                    transition={{
                      duration: Math.random() * 6 + 4,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </CardContent>
        </Card >
        <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
          By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
          and <a href="#">Privacy Policy</a>.
        </div>
      </div >
    </motion.div>
  )
}