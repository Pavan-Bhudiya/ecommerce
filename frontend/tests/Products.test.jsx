import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Products from '../src/pages/Products'

beforeEach(() => {
  localStorage.clear()
  vi.resetAllMocks()
  window.alert = vi.fn()
})

describe('Products', () => {
  it('fetches products from the API on mount', async () => {
    const mockProducts = [
      { _id: '1', title: 'Test Product', price: 29.99, image: '/img.jpg' },
    ]
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProducts),
      })
    )

    render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    )

    expect(screen.getByText('Loading products...')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument()
    })

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:5000/api/products'
    )
  })

  it('shows error message when product fetch fails', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Server error' }),
      })
    )

    render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Unable to load products')).toBeInTheDocument()
    })
  })

  it('shows empty state when no products are returned', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    )

    render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('No products available yet.')).toBeInTheDocument()
    })
  })

  it('adds product to cart by calling the cart API with correct payload', async () => {
    const mockProducts = [
      { _id: '1', title: 'Test Product', price: 29.99, image: '/img.jpg' },
    ]
    let fetchCount = 0
    global.fetch = vi.fn(() => {
      fetchCount += 1
      if (fetchCount === 1) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockProducts),
        })
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Added' }),
      })
    })

    localStorage.setItem('token', 'fake-token')

    render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument()
    })

    const addButtons = screen.getAllByRole('button', { name: /add to cart/i })
    fireEvent.click(addButtons[0])

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2)
      const secondCall = fetch.mock.calls[1]
      expect(secondCall[0]).toBe('http://localhost:5000/api/cart/add')
      expect(secondCall[1].method).toBe('POST')
      expect(secondCall[1].headers['Content-Type']).toBe('application/json')
      expect(secondCall[1].headers.Authorization).toBe('Bearer fake-token')
      expect(JSON.parse(secondCall[1].body)).toEqual({
        productId: '1',
        quantity: 1,
      })
    })
  })

  it('alerts when adding to cart without being logged in', async () => {
    const mockProducts = [
      { _id: '1', title: 'Test Product', price: 29.99, image: '/img.jpg' },
    ]
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProducts),
      })
    )

    render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }))

    expect(window.alert).toHaveBeenCalledWith('Please login first')
    expect(fetch).toHaveBeenCalledTimes(1)
  })
})
