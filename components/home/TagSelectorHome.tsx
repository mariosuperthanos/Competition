"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"

interface TagSelectorProps {
  tags: string[]
  selectedTags: string[]
  onChange: (tags: string[]) => void
  maxSelection?: number
  error?: string
}

function TagSelector({ tags, selectedTags, onChange, maxSelection = 5, error }: TagSelectorProps) {
  const handleTagClick = (tag: string) => {
    const isSelected = selectedTags.includes(tag)
    let newSelection: string[]

    if (isSelected) {
      newSelection = selectedTags.filter((t) => t !== tag)
    } else {
      if (selectedTags.length < maxSelection) {
        newSelection = [...selectedTags, tag]
      } else {
        return
      }
    }

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
              type="button"
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

interface TagSelectorModalProps {
  title?: string
  description?: string
  tags: string[]
  initialSelectedTags?: string[]
  maxSelection?: number
  onSave: (selectedTags: string[]) => void
  userId: string
}

export default function TagSelectorModal({
  title = "Select Tags",
  description = "Choose up to 5 tags that best describe your content.",
  tags,
  initialSelectedTags = [],
  maxSelection = 6,
  onSave,
  userId
}: TagSelectorModalProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>(initialSelectedTags)
  const [error, setError] = useState<string | undefined>(undefined)

  const mutation = useMutation({
    mutationFn: async () => {
      try {
        const data = await axios.put('http://localhost:3000/api/addTagsToUser', {
          userId,
          tags: selectedTags
        })
      } catch (err) {
        console.error(err);
      }
    }
  })

  const handleTagChange = (newTags: string[]) => {
    setSelectedTags(newTags)
    setError(undefined)
  }

  const handleSave = () => {
    if (selectedTags.length < 6) {
      setError("Please select 6 tags")
      return
    }
    mutation.mutate();
    onSave(selectedTags)
  }

  return (
    <Dialog open={!mutation.isSuccess}>
      <DialogContent className="sm:max-w-md bg-white [&_.lucide-x]:hidden">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <TagSelector
            tags={tags}
            selectedTags={selectedTags}
            onChange={handleTagChange}
            maxSelection={maxSelection}
            error={error}
          />
        </div>
        <DialogFooter>
          <Button
            disabled={selectedTags.length !== 6}
            onClick={handleSave}
            className="bg-black hover:bg-gray-800 text-white font-semibold px-4 py-2 rounded-md shadow"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
