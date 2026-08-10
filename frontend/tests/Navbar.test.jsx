import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from '../src/components/Navbar/Navbar'

beforeEach(() => {
  localStorage.clear()
  vi.resetAllMocks()
})

describe('Navbar', () => {
  it('renders navigation menu items', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Products')).toBeInTheDocument()
    expect(screen.getByText('Kids Wear')).toBeInTheDocument()
    expect(screen.getByText('Mens Wear')).toBeInTheDocument()
    expect(screen.getByText('Female Wear')).toBeInTheDocument()
    expect(screen.getByText('Electronics')).toBeInTheDocument()
  })

  it('shows login and register links when not authenticated', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )
    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.getByText('Register')).toBeInTheDocument()
  })

  it('shows account links and logout when authenticated', () => {
    localStorage.setItem('user', JSON.stringify({ name: 'Test User' }))
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )
    expect(screen.getByText('My Account')).toBeInTheDocument()
    expect(screen.getByText('Orders')).toBeInTheDocument()
    expect(screen.getByText('Checkout')).toBeInTheDocument()
    expect(screen.getByText('Logout')).toBeInTheDocument()
  })

  it('clears auth data and updates state on logout', () => {
    localStorage.setItem('token', 'fake-token')
    localStorage.setItem('user', JSON.stringify({ name: 'Test User' }))
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )
    expect(screen.getByText('Logout')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Logout'))

    expect(localStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('user')).toBeNull()
    expect(screen.queryByText('Logout')).not.toBeInTheDocument()
    expect(screen.getByText('Login')).toBeInTheDocument()
  })
})
