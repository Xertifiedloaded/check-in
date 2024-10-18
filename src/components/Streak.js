
import { Reward, StreakProgress } from "./Card"

export default function StreakPage({ currentStreak, streakEnded }) {
  return (
    <div className="streak-page">
      <h1 className="md:text-2xl text-lg font-bold text-center">
        Your Current Streak
      </h1>
      <p className="text-center text-gray-600 mt-2">
        {streakEnded
          ? "Your streak has ended. Start a new streak!"
          : currentStreak === 0
          ? "No streak yet, start your first check-in!"
          : `${currentStreak} Day${currentStreak > 1 ? "s" : ""}`}
      </p>
      {currentStreak > 0 && !streakEnded && (
        <>
          <Reward currentStreak={currentStreak} />
          <StreakProgress currentStreak={currentStreak} />
        </>
      )}
    </div>
  )
}
