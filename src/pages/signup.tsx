import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Email:", email, "Password:", password);
    navigate("/login"); // 跳轉到登入頁面
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-100 via-pink-200 to-red-300 dark:from-gray-800 dark:via-gray-900 dark:to-black overflow-hidden"
    >
      <Card className="w-full max-w-md shadow-lg bg-white dark:bg-gray-800 relative">
        {/* 返回按鈕 */}
        <button
          onClick={() => navigate(-1)} // 返回上一頁
          className="absolute top-4 left-4 text-sm text-primary dark:text-blue-400 hover:underline"
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
          <span className="sr-only">返回</span>
        </button>

        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-900 dark:text-gray-100">
            創建帳號
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                信箱
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="輸入您的信箱"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                密碼
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="輸入密碼"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password" className="text-gray-700 dark:text-gray-300">
                確認密碼
              </Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="確認您的密碼"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <Button type="submit" className="w-full bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg transition-all">
              註冊
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            已經有帳號?{" "}
            <a
              href="/login"
              className="font-medium text-primary dark:text-blue-400 hover:underline"
            >
              登入
            </a>
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}