"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import axios from "axios";

const Share = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const handleStartSession = async () => {
    setLoading(true);
    setError("");

    try {
      const sessionId = crypto.randomUUID();
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Sign in required!");

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/room/`,
        { slug: sessionId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const slug = res.data?.room?.slug ?? sessionId;
      const link = `${window.location.origin}/board/${slug}`;
      setShareLink(link);
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Failed to create room";
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!shareLink) return;

    navigator.clipboard.writeText(shareLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    });
  };

  return (
    <>
      {/* Share button */}
      <Button
        variant="primary"
        size="md"
        text="Share"
        onClick={() => setIsOpen(true)}
      />

      {/* Popup overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-dark/50 flex items-center justify-center z-50">
          <div className="bg-light dark:bg-dark p-6 rounded-2xl shadow-xl w-[360px]">
            <h3 className="text-lg font-semibold mb-4 text-center dark:text-light">
              {token ? "Start Collaboration" : "Sign in Required"}
            </h3>

            {/* Not signed in */}
            {!token && (
              <div className="flex flex-col items-center gap-3">
                <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                  You need to sign in to start a collaborative session.
                </p>
                <div className="flex gap-2">
                  <a
                    href="/signin"
                    className="text-indigo-500 hover:underline text-sm"
                  >
                    Sign In
                  </a>
                  <span className="text-gray-400">•</span>
                  <a
                    href="/signup"
                    className="text-indigo-500 hover:underline text-sm"
                  >
                    Sign Up
                  </a>
                </div>
              </div>
            )}

            {/* Signed in view */}
            {token && !shareLink && (
              <div className="flex flex-col items-center gap-3">
                <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                  Start a real-time collaboration session for this board.
                </p>
                <Button
                  variant="primary"
                  size="md"
                  text={loading ? "Starting..." : "Start Session"}
                  onClick={handleStartSession}
                  disabled={loading}
                />
              </div>
            )}

            {/* Share link view */}
            {shareLink && (
              <div className="flex flex-col gap-3 items-center">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Share this link with others:
                </p>
                <div className="flex items-center justify-between gap-1 bg-gray-100 dark:bg-gray-700 px-1 py-1 mb-4 rounded-xl w-full">
                  <input
                    readOnly
                    value={shareLink}
                    className="bg-transparent text-sm text-gray-800 dark:text-gray-200 flex-1 outline-none"
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    text={copied ? "Copied!" : "Copy"}
                    onClick={handleCopy}
                  />
                </div>
                <Button
                  variant="primary"
                  size="md"
                  text="Close"
                  onClick={() => setIsOpen(false)}
                />
              </div>
            )}

            {/* Error */}
            {error && (
              <p className="text-red-500 text-sm text-center mt-2">{error}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Share;
