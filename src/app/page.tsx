import Link from 'next/link'
import { ArrowRight, Clock, Users, TrendingUp } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-grenrose-50 via-white to-grenrose-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-grenrose-600">Grenrose</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Manage your work shifts, track your hours, and stay connected with your team.
          </p>

          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 bg-grenrose-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-grenrose-700 transition"
          >
            Get Started <ArrowRight size={20} />
          </Link>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {[
              {
                icon: Clock,
                title: 'Shift Management',
                description: 'View and manage your scheduled shifts with ease.',
              },
              {
                icon: TrendingUp,
                title: 'Track Hours',
                description: 'Monitor your worked hours and productivity.',
              },
              {
                icon: Users,
                title: 'Team Collaboration',
                description: 'Stay connected with your team and managers.',
              },
            ].map((feature, i) => {
              const Icon = feature.icon
              return (
                <div key={i} className="bg-white rounded-lg shadow-md p-6 text-left">
                  <Icon className="text-grenrose-600 mb-3" size={32} />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
