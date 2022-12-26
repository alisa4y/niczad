export type Place = {
  name: string
  type: string
  phones: string[]
  address: string
}
export type Customer = {
  name: string
  phone: string[]
  place?: Place
}
export type Reservation = {
  count: number
  duration: number
  date: Date
  location: string
  gender: string
  type: string
  pricePerPerson: number
  discount: number
  note: string
}
// count, duration, location, type
export type Order = {
  customer: Customer
  reservation: Reservation
  date: Date
}
export type User = {
  id: string
  username: string
  password: string
  auth: "admin" | "standard"
}
