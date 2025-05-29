"use client"
import CreativeMiniSearchForm from "./FastPageForm"
import CreativeFastEventCard from "./FastPageEventCard"
import { Clock, Zap, Sparkles, TrendingUp, Calendar, Users } from "lucide-react"
import Link from "next/link"

interface CreativeFastEventPageProps {
  events: Event[]
  selectedRange: number
}

const positions = [
  { left: "10%", top: "20%", delay: "0s", duration: "3s" },
  { left: "30%", top: "40%", delay: "0.5s", duration: "4s" },
  { left: "50%", top: "10%", delay: "1s", duration: "5s" },
  { left: "70%", top: "60%", delay: "1.5s", duration: "6s" },
  { left: "90%", top: "30%", delay: "2s", duration: "7s" },
  // adaugă până ai 20
]

const CreativeFastEventPage: React.FC<CreativeFastEventPageProps> = ({ events, selectedRange }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-bounce" />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-full blur-2xl animate-ping" />

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => {
          const { left, top, delay, duration } = positions[i % positions.length];
          return (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
              style={{
                left,
                top,
                animationDelay: delay,
                animationDuration: duration,
              }}
            />
          );
        })}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 sm:py-12">
        {/* Creative header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-3 mb-4 p-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <Zap className="w-6 h-6 text-yellow-400 animate-pulse" />
            <span className="text-white/90 font-semibold">Live Event Discovery</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight">
            ⚡ Events Happening
            <br />
            <span className="bg-gradient-to-r from-yellow-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
              Right Now
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Discover amazing events starting within minutes. Don't miss out on the action! 🚀
          </p>
        </div>



        {/* Search Form */}
        <CreativeMiniSearchForm selectedRange={+selectedRange} />

        {/* Results header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
              {events.length} Events Discovered
            </h2>
          </div>
        </div>

        {/* Event Grid */}
        {events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {events.map((event, index) => (
              <div
                key={`${event.slug}-${index}`}
                className="animate-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CreativeFastEventCard {...event} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 sm:py-24">
            <div className="max-w-md mx-auto">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse opacity-50" />
                <div className="absolute inset-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <Clock className="w-8 h-8 sm:w-12 sm:h-12 text-white animate-bounce" />
                </div>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">No Events Right Now 🌙</h3>
              <p className="text-base sm:text-lg text-white/80 mb-6 leading-relaxed">
                Looks like it's quiet for now. Try expanding your search window or check back soon!
              </p>

              <Link
                href="/search-events?timeRange=24"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/50 no-underline"
              >
                <Calendar className="w-5 h-5" />
                Search Next 24 Hours
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS for floating animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default CreativeFastEventPage
