import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function ForgetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Reset password for:", email);
    alert("如果信箱存在,將會發送一封重置密碼的信件。");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div
        className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 dark:from-gray-800 dark:via-gray-900 dark:to-black overflow-hidden font-sans"
      >
        {/* 忘記密碼卡片 */}
        <Card
          className="w-full max-w-md shadow-lg bg-white dark:bg-gray-800 relative transition-transform transform hover:scale-105 hover:shadow-2xl"
        >
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
          </button>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-gray-900 dark:text-gray-100">
              忘記密碼
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                  Email
                </Label>
                <input
                  id="email"
                  type="email"
                  placeholder="輸入您的Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-md border border-gray-700 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg transition-all"
              >
                發送重置密碼連結
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
              想起你的密碼了?{" "}
              <a href="/login" className="font-medium text-primary dark:text-blue-400 hover:underline">
                登入
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}