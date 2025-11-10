"use client";

import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-light dark:bg-dark">
      {children}
    </div>
  );
};

export default AuthLayout;
