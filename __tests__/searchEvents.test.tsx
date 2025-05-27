import { render, screen } from "@testing-library/react"
import Events from "../components/searchPage/Events"
import useStore from "../zustand/store"
import { act } from "react"
import '@testing-library/jest-dom';


// Mock EventCard ca să nu ne încurce
jest.mock("../components/searchPage/EventCard", () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <div data-testid="event-card">{title}</div>,
}))

// Resetăm store-ul între teste
beforeEach(() => {
  useStore.setState({ events: [], isNextPage: false })
})

const mockEvents = Array.from({ length: 5 }, (_, i) => ({
  title: `Event ${i + 1}`,
  image: "/image.jpg",
  country: "USA",
  city: "New York",
  description: "Description here",
  startHour: new Date().toISOString(),
  slug: `event-${i + 1}`,
  timezone: "America/New_York",
  tags: ["Tech", "Music"],
}))

test("renders events correctly from store", () => {
  act(() => {
    render(<Events eventsArray={mockEvents} />)
  })
  const cards = screen.getAllByTestId("event-card")
  expect(cards).toHaveLength(5)
})

test("sets store.events and isNextPage correctly (length = 11)", () => {
  const elevenEvents = [...mockEvents, ...mockEvents.slice(0, 6)]
  act(() => {
    render(<Events eventsArray={elevenEvents} />)
  })
  const { events, isNextPage } = useStore.getState()
  expect(events).toHaveLength(10)
  expect(isNextPage).toBe(false)
})

test("sets isNextPage to false when less than 11 events", () => {
  act(() => {
    render(<Events eventsArray={mockEvents} />)
  })
  const { isNextPage } = useStore.getState()
  expect(isNextPage).toBe(false)
})

test("renders loading message if no events in store", () => {
  act(() => {
    render(<Events eventsArray={[]} />)
  })
  expect(screen.getByText("Loading...")).toBeInTheDocument()
})

test("renders correct number of EventCard components", () => {
  act(() => {
    render(<Events eventsArray={mockEvents} />)
  })
  const eventCards = screen.getAllByTestId("event-card")
  expect(eventCards.length).toBe(mockEvents.length)
})
