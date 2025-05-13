"use client"
import { cn } from "@/lib/utils"

interface TagSelectorProps {
  tags: string[]
  selectedTags: string[]
  onChange: (selectedTags: string[]) => void
  maxSelection?: number
  error?: string
}

export default function TagSelector({ tags, selectedTags, onChange, maxSelection = 5, error }: TagSelectorProps) {
  const handleTagClick = (tag: string) => {
    const isSelected = selectedTags.includes(tag)
    let newSelection: string[]

    if (isSelected) {
      // Remove tag if already selected
      newSelection = selectedTags.filter((t) => t !== tag)
    } else {
      // Add tag if not at max selection
      if (selectedTags.length < maxSelection) {
        newSelection = [...selectedTags, tag]
      } else {
        // At max selection, don't add
        return
      }
    }

    // Call onChange callback
    onChange(newSelection)
  }

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const isSelected = selectedTags.includes(tag)
          return (
            <button
              key={tag}
              type="button" // Important to prevent form submission
              onClick={() => handleTagClick(tag)}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-full transition-all",
                "border border-gray-300 hover:border-gray-500",
                "focus:outline-none focus:ring-2 focus:ring-gray-200 focus-visible:ring-2",
                isSelected ? "bg-black text-white" : "bg-white hover:bg-gray-50",
              )}
            >
              {tag}
            </button>
          )
        })}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      <p className="mt-2 text-sm text-gray-500">
        Selected: {selectedTags.length}/{maxSelection}
      </p>
    </div>
  )
}
