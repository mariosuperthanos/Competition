import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Zap, Timer } from "lucide-react"

interface CreativeMiniSearchFormProps {
  selectedRange: number // exemplu: 1 pentru 1h
}

const timeRanges: TimeRange[] = [
  { value: 30, label: "30 min" },
  { value: 60, label: "1 hour" },
  { value: 120, label: "2 hours" },
  { value: 240, label: "4 hours" },
  { value: 480, label: "8 hours" },
  { value: 1440, label: "24 hours" },
]

const CreativeMiniSearchForm = ({ selectedRange }: CreativeMiniSearchFormProps) => {
  console.log("Selected time range in minutes:", typeof selectedRange)
  return (
    <div className="relative w-full max-w-6xl mx-auto mb-8 sm:mb-12">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse" />
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-20 animate-bounce" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-15 animate-ping" />
      </div>

      <Card className="relative bg-gradient-to-br from-white via-purple-50/50 to-blue-50/50 backdrop-blur-sm border-2 border-gradient-to-r from-purple-200 to-blue-200 shadow-2xl shadow-purple-500/20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-20 animate-pulse" />
        <div className="absolute inset-[2px] bg-white rounded-lg" />

        <CardContent className="relative p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
              <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl opacity-30" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-1">
                ⚡ Lightning Search
              </h2>
              <p className="text-sm sm:text-base text-gray-600 font-medium">
                Find events happening in the next few moments
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6 p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl border border-purple-200">
            <Timer className="w-5 h-5 text-purple-600 animate-pulse" />
            <span className="text-sm font-semibold text-purple-800">
              Events starting within:{" "}
              <span className="text-purple-600">
                {timeRanges.find((r) => r.value / 60 === selectedRange)?.label}
              </span>
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {timeRanges.map((range, index) => {
              const hours = range.value / 60
              const isSelected = selectedRange === hours
              console.log(isSelected);
              const icons = ["⚡", "🔥", "⭐", "🚀", "💫", "🌟"]

              return (
                <Link
                  key={range.value}
                  href={`/fast-events?timeRange=${hours}`}
                  className="no-underline group"
                >
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    className={`w-full justify-start transition-all duration-300 transform hover:scale-105 ${isSelected
                      ? "bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 text-white shadow-2xl shadow-purple-500/50 border-0"
                      : "bg-white/80 backdrop-blur-sm border-2 border-purple-200 hover:border-purple-400 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50"
                      }`}
                  >
                    <span className="mr-2 text-lg group-hover:animate-bounce">{icons[index]}</span>
                    {range.label}
                  </Button>
                </Link>
              )
            })}
          </div>
          {/* Creative tip section */}
          <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 border-2 border-yellow-200 rounded-xl relative overflow-hidden">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center animate-bounce">
                💡
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-1">Pro Tip!</p>
                <p className="text-xs text-gray-600">
                  Select shorter time ranges for urgent events, or longer ones to plan ahead. The page updates in
                  real-time! ⏰
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CreativeMiniSearchForm
