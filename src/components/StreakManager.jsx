import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRestoreStreak } from "../hooks/usePost";

const StreakManager = () => {
  const { isStreakLoader, message, currentStreak, handleRestoreStreak } = useRestoreStreak();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Restore Streak
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="text-center mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-blue-500 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Lost Your Streak?
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Don't worry! You can restore your previous streak if you missed a
            check-in by accident.
          </p>
        </div>

        {message && (
          <div
            className={`mb-4 px-4 py-3 rounded-lg text-sm ${
              message.toLowerCase().includes("success")
                ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            }`}
          >
            {message}
          </div>
        )}

        {currentStreak && (
          <div className="mb-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-sm">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-400">
                Current Streak
              </span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {currentStreak.currentStreak} days
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Last Active
              </span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {new Date(currentStreak.lastCheckIn).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}

        <Button
          onClick={handleRestoreStreak}
          disabled={isStreakLoader}
          className="w-full md:text-base text-xs"
        >
          {isStreakLoader ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Restoring...
            </span>
          ) : (
            "Restore Streak"
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default StreakManager;
