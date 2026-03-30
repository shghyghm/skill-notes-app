import React from "react";
import { BookOpen, ArrowRight } from "lucide-react";

export default function LandingPage({
  isLoginMode,
  setIsLoginMode,
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  loading,
  onSubmit,
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-white rounded-full p-4">
              <BookOpen className="text-gradient text-4xl" size={40} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Skill Notes</h1>
          <p className="text-blue-100">یادگیری مهارت‌ها را سازمان‌دهی کنید</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-lg bg-opacity-95">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            {isLoginMode ? "ورود" : "ثبت‌نام"}
          </h2>

          <form onSubmit={onSubmit} className="space-y-4">
            {!isLoginMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نام‌کاربری
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="نام‌کاربری خود را وارد کنید"
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ایمیل
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ایمیل خود را وارد کنید"
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رمز عبور
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="رمز عبور خود را وارد کنید"
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? "در حال بارگذاری..." : isLoginMode ? "ورود" : "ثبت‌نام"}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLoginMode ? "حساب ندارید؟" : "قبلاً ثبت‌نام کردید؟"}
              <button
                onClick={() => {
                  setIsLoginMode(!isLoginMode);
                  setEmail("");
                  setPassword("");
                  setUsername("");
                }}
                className="ml-2 text-blue-500 font-bold hover:text-blue-700 transition"
              >
                {isLoginMode ? "ثبت‌نام" : "ورود"}
              </button>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-3 gap-4 text-center text-white">
          <div>
            <div className="text-2xl mb-2">📚</div>
            <p className="text-sm">مهارت‌های متعدد</p>
          </div>
          <div>
            <div className="text-2xl mb-2">📝</div>
            <p className="text-sm">یادداشت‌های سازمان‌یافته</p>
          </div>
          <div>
            <div className="text-2xl mb-2">🔒</div>
            <p className="text-sm">محفوظ و خصوصی</p>
          </div>
        </div>
      </div>
    </div>
  );
}
