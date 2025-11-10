"use client";

import AuthLayout from "@/components/layouts/AuthLayout";
import { Button, Input } from "@/components/ui";
import { apiRequest } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const data = await apiRequest<{ token: string }>("/auth/signup", "POST", {
        name,
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      router.push("/");
    } catch (err: any) {}
  };

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 bg-white rounded-xl shadow-lg w-1/3 p-5"
      >
        <h2 className="text-2xl font-semibold text-center mb-2 text-[#3d2671]">
          Create an account
        </h2>

        <Input
          label="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex justify-center">
          <Button
            variant="primary"
            size="md"
            text="SignUp"
            type="submit"
            className="w-1/5"
          />
        </div>

        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link href="/signin" className="text-indigo-400 hover:underline">
            Signin
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignUp;
