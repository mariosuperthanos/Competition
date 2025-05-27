"use client"

import { useState } from "react"
import TagSelectorModal from "./TagSelectorHome"


interface ModalTagsProps {
  userId: string;
}

const ModalTags = ({ userId }: ModalTagsProps) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const availableTags = [
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

  return (
    <>
        <TagSelectorModal
          title="Select Tags"
          description="Choose up to 5 tags that best match your interests to receive personalized event recommendations."
          tags={availableTags}
          initialSelectedTags={selectedTags}
          onSave={setSelectedTags}
          userId={userId}
        />
    </>
  )
}

export default ModalTags;