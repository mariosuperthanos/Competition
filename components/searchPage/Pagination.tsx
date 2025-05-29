"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

interface PaginationButtonsProps {
  initialPage?: number
  onPageChange?: (page: number) => void
  maxPage?: number
  isLoading?: boolean
  nextServer?: boolean
}

export default function PaginationButtons({
  initialPage = 1,
  onPageChange,
  maxPage = -1,
  isLoading = false,
  nextServer
}: PaginationButtonsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Ia pagina curentă din URL, fallback la initialPage
  const currentPageParam = searchParams.get("page")
  const currentPage = currentPageParam ? parseInt(currentPageParam, 10) : initialPage

  function updatePage(newPage: number) {
    // Construiește noii parametri URL cu page actualizat
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", newPage.toString())

    // Navighează la noul URL cu parametrii actualizați
    router.push(`?${params.toString()}`)

    // Dacă există callback, îl apelează
    if (onPageChange) {
      onPageChange(newPage)
    }
  }

  function handlePrevious() {
    if (currentPage > 1) {
      updatePage(currentPage - 1)
    }
  }

  function handleNext() {
    if (maxPage === -1 || currentPage < maxPage) {
      updatePage(currentPage + 1)
    }
  }

  return (
    <div className="flex items-center justify-center space-x-2 mt-2">
      {currentPage > 1 && (
        <button
          onClick={handlePrevious}
          className="flex items-center justify-center p-2 rounded-md border border-gray-300 hover:bg-gray-50 bg-gray-100"
          aria-label="Previous page"
          disabled={isLoading}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      <button
        className="flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 bg-gray-100 font-medium"
        aria-current="page"
        aria-label={`Page ${currentPage}`}
        disabled={isLoading}
      >
        {currentPage}
      </button>

      {nextServer && (
        <button
          onClick={handleNext}
          className="flex items-center justify-center p-2 rounded-md border border-gray-300 hover:bg-gray-50 bg-gray-100"
          aria-label="Next page"
          disabled={isLoading}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}
