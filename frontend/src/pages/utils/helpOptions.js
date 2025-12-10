export const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' }
export const optionsTime = {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12: true,
}

export const INRupee = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
})
