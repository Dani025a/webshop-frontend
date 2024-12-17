import { useState } from "react";
import Link from 'next/link';

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">EMAIL ADDRESS</label>
          <input required type="email" placeholder="Enter your email address" className="w-full p-2 border rounded" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">PASSWORD</label>
          <div className="relative">
            <input
              required
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full p-2 border rounded"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-sm text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          LOGIN
        </button>
      </div>
    </form>
  );
}

