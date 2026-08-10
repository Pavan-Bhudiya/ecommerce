import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import App from '../src/App'

beforeEach(() => {
  localStorage.clear()
  vi.resetAllMocks()
})

describe('App', () => {
  it('renders the application shell', () => {
    render(<App />)
    expect(document.body).toBeInTheDocument()
  })
})
