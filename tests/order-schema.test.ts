import { describe, expect, it } from 'vitest'
import { createOrderSchema } from '@/lib/orders/schema'

const validInput = {
  collectionSlug: 'chefs-garden',
  buyerName: 'Maria Santos',
  buyerEmail: 'Maria@Example.COM',
  buyerPhone: '09171234567',
  recipientName: 'Ana Reyes',
  senderName: 'Maria',
  giftMessage: 'Happy birthday!',
  deliveryAddress: '123 Mabini Street, Barangay Poblacion, Makati City',
  deliveryNotes: 'Green gate',
  deliveryDateWanted: '2026-09-01',
  quantity: 2,
}

describe('createOrderSchema', () => {
  it('accepts a complete order', () => {
    const result = createOrderSchema.safeParse(validInput)

    expect(result.success).toBe(true)
  })

  it('lowercases the email so duplicates cannot differ by case', () => {
    const result = createOrderSchema.parse(validInput)

    expect(result.buyerEmail).toBe('maria@example.com')
  })

  it('accepts an order with only the required fields', () => {
    const result = createOrderSchema.safeParse({
      collectionSlug: 'chefs-garden',
      buyerName: 'Maria Santos',
      buyerEmail: 'maria@example.com',
      recipientName: 'Ana Reyes',
      senderName: 'Maria',
      deliveryAddress: '123 Mabini Street, Barangay Poblacion, Makati City',
    })

    expect(result.success).toBe(true)
    expect(result.success && result.data.quantity).toBe(1)
  })

  it('turns blank optional fields into undefined rather than empty strings', () => {
    const result = createOrderSchema.parse({
      ...validInput,
      buyerPhone: '',
      giftMessage: '',
      deliveryNotes: '',
      deliveryDateWanted: '',
    })

    expect(result.buyerPhone).toBeUndefined()
    expect(result.giftMessage).toBeUndefined()
    expect(result.deliveryNotes).toBeUndefined()
    expect(result.deliveryDateWanted).toBeUndefined()
  })

  it('rejects an invalid email', () => {
    const result = createOrderSchema.safeParse({
      ...validInput,
      buyerEmail: 'not-an-email',
    })

    expect(result.success).toBe(false)
  })

  it('rejects a phone number that is not a PH mobile', () => {
    for (const buyerPhone of ['12345', '+1 555 0100', '0281234567']) {
      expect(
        createOrderSchema.safeParse({ ...validInput, buyerPhone }).success,
      ).toBe(false)
    }
  })

  it('accepts both PH mobile formats', () => {
    for (const buyerPhone of ['09171234567', '+639171234567']) {
      expect(
        createOrderSchema.safeParse({ ...validInput, buyerPhone }).success,
      ).toBe(true)
    }
  })

  it('rejects a gift message longer than the printed card allows', () => {
    const result = createOrderSchema.safeParse({
      ...validInput,
      giftMessage: 'a'.repeat(501),
    })

    expect(result.success).toBe(false)
  })

  it('rejects an address too short to deliver to', () => {
    const result = createOrderSchema.safeParse({
      ...validInput,
      deliveryAddress: 'Makati',
    })

    expect(result.success).toBe(false)
  })

  it('rejects quantities outside the retail range', () => {
    expect(
      createOrderSchema.safeParse({ ...validInput, quantity: 0 }).success,
    ).toBe(false)
    expect(
      createOrderSchema.safeParse({ ...validInput, quantity: 11 }).success,
    ).toBe(false)
    expect(
      createOrderSchema.safeParse({ ...validInput, quantity: 2.5 }).success,
    ).toBe(false)
  })

  it('rejects a collection slug that could be a path traversal', () => {
    for (const collectionSlug of ['../secrets', 'Chefs Garden', '']) {
      expect(
        createOrderSchema.safeParse({ ...validInput, collectionSlug }).success,
      ).toBe(false)
    }
  })

  it('trims surrounding whitespace from names', () => {
    const result = createOrderSchema.parse({
      ...validInput,
      recipientName: '  Ana Reyes  ',
    })

    expect(result.recipientName).toBe('Ana Reyes')
  })
})
