import { render } from '@testing-library/react'
import { screen } from '@testing-library/dom'
import { App } from '../App'
import '@testing-library/jest-dom'

test('renders hello world text', () => {
  render(<App />)
  const linkElement = screen.getByText(/hello world/i)
  expect(linkElement).toBeInTheDocument()
})
