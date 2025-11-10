"use client";

import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/authbg.svg')" }}
    >
      {children}
    </div>
  );
};

export default AuthLayout;
