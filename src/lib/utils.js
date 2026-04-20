import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price) {
  return `₹${price.toLocaleString('en-IN')}`
}

export function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function getMonthAbbr(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { month: 'short' })
}

export function getDay(dateStr) {
  const d = new Date(dateStr)
  return d.getDate()
}
