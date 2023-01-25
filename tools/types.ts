type Phone = { value: string }[]
export type Place = {
  id: string
  name: string
  type: string
  phone: Phone
  address: string
}
export type Customer = {
  id: string
  name: string
  phone: Phone
  place?: Place
}
export type Reservation = {
  location: string
  count: number
  date: Date
  duration: number
  gender: string
  type: string
  pricePerPerson: number
  discount: number
  note: string
}
// count, duration, location, type
export type Order = {
  id: string
  customerId: string
  customer: string
  reservation: Reservation
  location: string
  count: number
  startTime: string
  date: string
  duration: number
  gender: string
  type: string
  pricePerPerson: number
  discount: number
  note: string
}
export type User = {
  id: string
  username: string
  password: string
  auth: "admin" | "standard"
}
