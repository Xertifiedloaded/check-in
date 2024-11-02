import React from "react"
import Head from "next/head"
import { CheckCircle, Users, Zap, Bell, TrendingUp, Shield } from "lucide-react"
import Link from "next/link"

const Features = () => {
  const featuresList = [
    {
      icon: CheckCircle,
      title: "Daily Check-ins",
      description:
        "Build habits with easy daily check-ins and streak tracking.",
    },
    {
      icon: Users,
      title: "Community Support",
      description:
        "Connect with others, share experiences, and motivate each other.",
    },
    {
      icon: Zap,
      title: "Personalized Insights",
      description:
        "Gain valuable insights into your habits and progress over time.",
    },
    {
      icon: Bell,
      title: "Smart Reminders",
      description: "Set customized reminders to stay on track with your goals.",
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description:
        "Visualize your progress with intuitive charts and statistics.",
    },
    {
      icon: Shield,
      title: "Privacy-Focused",
      description: "Your data is secure and private, giving you peace of mind.",
    },
  ]

  return (
    <>
      <Head>
        <title>Features - Daily Check-in</title>
        <meta
          name="description"
          content="Discover the features that make Daily Check-in the best platform for building habits and staying motivated."
        />
      </Head>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Daily Check-in Features
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuresList.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <feature.icon className="text-blue-500 dark:text-blue-400 mb-4" size={32} />
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Ready to start your journey?
            </h2>
            <Link href="/auth/signup">
              <button className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm transition duration-300">
                Sign Up Now
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Features