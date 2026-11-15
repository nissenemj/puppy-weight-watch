import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import GrowthDevelopmentSection from './GrowthDevelopmentSection'
import type { WeightEntry } from '@/services/weightService'

const entry = (date: string, weight: number): WeightEntry => ({ id: date, date, weight })
const show = (birthDate: string | undefined, weightData: WeightEntry[]) => render(
  <MemoryRouter>
    <GrowthDevelopmentSection birthDate={birthDate} weightData={weightData} />
  </MemoryRouter>
)

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date('2026-11-07T12:00:00Z'))
})
afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

describe('growth overview', () => {
  it('does not multiply an adult dog’s measured 16 kg into a 24 kg growth target', () => {
    show('2023-09-15', [entry('2026-10-01', 15.8), entry('2026-11-01', 16)])
    expect(screen.getByText('Aikuisen koiran paino')).toBeInTheDocument()
    expect(screen.getByText('16 kg')).toBeInTheDocument()
    expect(screen.queryByText('24.0 kg')).not.toBeInTheDocument()
    expect(screen.queryByText('Ennustettu aikuispaino')).not.toBeInTheDocument()
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    expect(screen.getByRole('link', {name:'Avaa aikuisen koiran painonseuranta'})).toHaveAttribute('href','/weight-tracker?vaihe=aikuinen')
  })

  it('labels a historical puppy measurement as measured data when the dog is now adult', () => {
    show('2023-09-15', [entry('2024-02-01', 12), entry('2024-03-01', 16)])
    expect(screen.getByText(/Viimeisin mitattu paino/)).toHaveTextContent('1.3.2024')
    expect(screen.getByText('16 kg')).toBeInTheDocument()
    expect(screen.queryByText('Ennustettu aikuispaino')).not.toBeInTheDocument()
  })

  it('requires separate measurement days rather than displaying a zero estimate', () => {
    show('2026-08-01', [entry('2026-10-20', 6), entry('2026-10-20', 6.1)])
    expect(screen.getByText(/Aikuispainoarvio on tauolla/)).toBeInTheDocument()
    expect(screen.queryByText('0.0 kg')).not.toBeInTheDocument()
  })

  it('uses the newest valid measurement even when the array ends with an older or invalid entry', () => {
    show('2026-08-01', [
      entry('2026-10-26', 6), entry('2026-09-28', 3),
      entry('2026-12-01', 90), entry('not-a-date', 80), entry('2026-11-01', NaN),
    ])
    expect(screen.getByText('6 kg')).toBeInTheDocument()
    expect(screen.queryByText('90 kg')).not.toBeInTheDocument()
  })

  it('shows age from the calendar without an unvalidated adult weight or a development score', () => {
    show('2026-10-31', [entry('2026-11-01', 0.8)])
    expect(screen.getByText('Ikä: 1 viikko (7 päivää)')).toBeInTheDocument()
    expect(screen.getByText(/Aikuispainoarvio on tauolla/)).toBeInTheDocument()
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Walthamin kasvukäyrät' })).toHaveAttribute(
      'href', 'https://www.waltham.com/resources/puppy-growth-charts'
    )
  })

  it('does not estimate adult weight from neonatal measurements', () => {
    show('2026-10-20', [entry('2026-10-27', 0.6), entry('2026-11-01', 0.8)])
    expect(screen.getByText('0,8 kg')).toBeInTheDocument()
    expect(screen.getByText(/Aikuispainoarvio on tauolla/)).toBeInTheDocument()
  })

  it.each(['not-a-date', '2027-01-01'])('rejects an invalid or future birth date: %s', (birth) => {
    show(birth, [entry('2026-11-01', 6)])
    expect(screen.getByText(/Tarkista syntymäpäivä/)).toBeInTheDocument()
    expect(screen.queryByText('Ennustettu aikuispaino')).not.toBeInTheDocument()
  })

  it('excludes measurements from before birth', () => {
    show('2026-10-30', [entry('2026-10-29', 16)])
    expect(screen.getByText(/Lisää painomittaus/)).toBeInTheDocument()
  })
})
