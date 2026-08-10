import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Checkout from '../src/pages/Checkout'

beforeEach(() => {
  localStorage.clear()
  vi.resetAllMocks()
  window.alert = vi.fn()
})

describe('Checkout', () => {
  it('shows login prompt when user is not authenticated', () => {
    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    )
    expect(screen.getByText('Login required')).toBeInTheDocument()
  })

  it('fetches cart data from the API on mount when authenticated', async () => {
    localStorage.setItem('token', 'fake-token')
    const mockCart = {
      items: [
        {
          _id: 'item1',
          product: { _id: '1', title: 'Test Product', price: 29.99 },
          quantity: 2,
        },
      ],
    }

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockCart),
      })
    )

    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/cart', {
        headers: {
          Authorization: 'Bearer fake-token',
        },
      })
    })
  })

  it('removes item from cart by calling the remove API', async () => {
    localStorage.setItem('token', 'fake-token')
    const mockCart = {
      items: [
        {
          _id: 'item1',
          product: { _id: '1', title: 'Test Product', price: 29.99 },
          quantity: 2,
        },
      ],
    }

    const updatedCart = {
      items: [],
    }

    let fetchCount = 0
    global.fetch = vi.fn(() => {
      fetchCount += 1
      if (fetchCount === 1) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCart),
        })
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(updatedCart),
      })
    })

    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/cart', {
        headers: {
          Authorization: 'Bearer fake-token',
        },
      })
    })

    fireEvent.click(screen.getByRole('button', { name: 'Remove' }))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/cart/remove/1', {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer fake-token',
        },
      })
    })
  })

  it('clears cart by calling the clear API', async () => {
    localStorage.setItem('token', 'fake-token')
    const mockCart = {
      items: [
        {
          _id: 'item1',
          product: { _id: '1', title: 'Test Product', price: 29.99 },
          quantity: 2,
        },
      ],
    }

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockCart),
      })
    )

    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/cart', {
        headers: {
          Authorization: 'Bearer fake-token',
        },
      })
    })

    fireEvent.click(screen.getByRole('button', { name: 'Clear Cart' }))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/cart/clear', {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer fake-token',
        },
      })
    })
  })

  it('places order by calling checkout and payment APIs with correct payloads', async () => {
    localStorage.setItem('token', 'fake-token')
    const mockCart = {
      items: [
        {
          _id: 'item1',
          product: { _id: '1', title: 'Test Product', price: 29.99 },
          quantity: 2,
        },
      ],
    }

    const mockOrder = {
      _id: 'order123',
      status: 'pending',
      total: 59.98,
    }

    let fetchCount = 0
    global.fetch = vi.fn(() => {
      fetchCount += 1
      if (fetchCount === 1) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCart),
        })
      }
      if (fetchCount === 2) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockOrder),
        })
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Payment initiated' }),
      })
    })

    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/cart', {
        headers: {
          Authorization: 'Bearer fake-token',
        },
      })
    })

    const phoneInput = screen.getByPlaceholderText('0712345678')
    fireEvent.change(phoneInput, { target: { value: '0712345678' } })

    fireEvent.click(screen.getByRole('button', { name: 'Place Order' }))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(3)
      const checkoutCall = fetch.mock.calls[1]
      expect(checkoutCall[0]).toBe('/api/checkout')
      expect(checkoutCall[1].method).toBe('POST')
      expect(checkoutCall[1].headers.Authorization).toBe('Bearer fake-token')
      expect(JSON.parse(checkoutCall[1].body)).toEqual({
        items: [{ product: '1', quantity: 2 }],
        total: 59.98,
      })
    })

    await waitFor(() => {
      const paymentCall = fetch.mock.calls[2]
      expect(paymentCall[0]).toBe('/api/payments/stkpush')
      expect(paymentCall[1].method).toBe('POST')
      expect(JSON.parse(paymentCall[1].body)).toEqual({
        phone: '0712345678',
        orderId: 'order123',
      })
    })
  })
})
