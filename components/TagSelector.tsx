"use client"

import { useState } from "react"
import { Search, X, Check, Hash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useMutation } from "@tanstack/react-query"
import { getCsrfToken, useSession } from "next-auth/react"
import axios from "axios"

const interestTags = [
  "Cycling",
  "Music",
  "Reading",
  "Fitness",
  "Art",
  "Networking",
  "Technology",
  "Gaming",
  "Photography",
  "Cooking",
  "Volunteering",
  "Dance",
  "Outdoor",
  "Startup",
  "Workshop",
  "Meditation",
  "Hiking",
  "Coding",
  "Film",
  "Theater",
  "Language Exchange",
  "Travel",
  "Food Tasting",
  "Debate",
]

interface TagSelectorProps {
  onSelectionChange?: (selectedTags: string[]) => void
  maxSelections?: number
  initialSelected?: string[]
}

export default function TagSelectorPageComp({ onSelectionChange, maxSelections = 10, initialSelected = [] }: TagSelectorProps) {
  const { data: session } = useSession();
  const [selectedTags, setSelectedTags] = useState<string[]>(initialSelected)
  const [searchTerm, setSearchTerm] = useState("")

  const mutation = useMutation({
    mutationFn: async () => {
      try {
        const csrfToken = await getCsrfToken();
        console.log("CSRF Token:", csrfToken);
        console.log("Selected Tags:", selectedTags);
        console.log("User ID:", session?.token.id);
        const data = await axios.post('http://localhost:3000/api/addTagsToUser', {
          tags: selectedTags
        }, {
          headers: {
            "Content-Type": "application/json",
            "csrf-token": csrfToken,
          },
          withCredentials: true,
        })
      } catch (err) {
        console.error(err);
      }
    },
    onSuccess: () => {
      window.location.href = "/";
    },
  })

  const filteredTags = interestTags.filter((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleTagToggle = (tag: string) => {
    let newSelectedTags: string[]

    if (selectedTags.includes(tag)) {
      newSelectedTags = selectedTags.filter((t) => t !== tag)
    } else {
      if (selectedTags.length > maxSelections) {
        return // Don't add if max reached
      }
      newSelectedTags = [...selectedTags, tag]
    }

    setSelectedTags(newSelectedTags)
    onSelectionChange?.(newSelectedTags)
  }

  const handleClearAll = () => {
    setSelectedTags([])
    onSelectionChange?.([])
  }

  const getTagColor = (tag: string) => {
    const colors = [
      "bg-blue-100 text-blue-800 hover:bg-blue-200",
      "bg-green-100 text-green-800 hover:bg-green-200",
      "bg-purple-100 text-purple-800 hover:bg-purple-200",
      "bg-pink-100 text-pink-800 hover:bg-pink-200",
      "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
      "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
      "bg-red-100 text-red-800 hover:bg-red-200",
      "bg-orange-100 text-orange-800 hover:bg-orange-200",
    ]

    const index = tag.length % colors.length
    return colors[index]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Hash className="h-8 w-8 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-900">Interest Tags</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select up to {maxSelections} tags that represent your interests. These will help us recommend events that
            match your preferences.
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-6 border-0 shadow-none" style={{ border: 'none' }}>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search interests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Selected Tags Summary */}
        {selectedTags.length > 0 && (
          <Card className="mb-6 shadow-lg border-0 bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-gray-900">
                  Selected Interests ({selectedTags.length}/{maxSelections})
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Clear All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <Badge
                    key={tag}
                    className="px-3 py-2 text-sm font-medium bg-indigo-100 text-indigo-800 hover:bg-indigo-200 cursor-pointer transition-colors"
                    onClick={() => handleTagToggle(tag)}
                  >
                    <Check className="h-3 w-3 mr-1" />
                    {tag}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6 justify-center">
          <Button
            variant="outline"
            onClick={handleClearAll}
            disabled={selectedTags.length === 0}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 bg-white"
          >
            <X className="h-4 w-4" />
            Clear Selection
          </Button>
        </div>

        {/* Tags Grid */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-gray-900">
              Available Interests
              {searchTerm && (
                <span className="text-sm font-normal text-gray-500 ml-2">({filteredTags.length} found)</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTags.length === 0 ? (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No interests found matching "{searchTerm}"</p>
                <Button variant="outline" onClick={() => setSearchTerm("")} className="mt-4">
                  Clear Search
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {filteredTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag)
                  const isMaxReached = selectedTags.length >= maxSelections && !isSelected

                  return (
                    <button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      disabled={isMaxReached}
                      className={`
                        relative p-3 rounded-xl border-2 transition-all duration-200 text-sm font-medium
                        ${isSelected
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md scale-105"
                          : isMaxReached
                            ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                            : `border-gray-200 ${getTagColor(tag)} hover:scale-105 hover:shadow-md`
                        }
                      `}
                    >
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 bg-indigo-500 text-white rounded-full p-1">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                      <div className="flex items-center justify-center gap-1">
                        <Hash className="h-3 w-3" />
                        {tag}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Selection Limit Warning */}
        {selectedTags.length > maxSelections && (
          <Card className="mt-6 border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-yellow-800">
                <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                <p className="text-sm font-medium">
                  You've reached the maximum of {maxSelections} selections. Remove some tags to select others.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Save Button */}
        <div className="mt-8 text-center">
          <Button
            size="lg"
            className="px-8 py-3 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            disabled={selectedTags.length === 0}
            onClick={() => {
              mutation.mutate();
              // window.location.href = "/";
            }}
          >
            Save Interests ({selectedTags.length})
          </Button>
        </div>

      </div>
    </div>
  )
}
