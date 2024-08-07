export interface User {
  id: number,
  name: string,
  email: string
}

export interface Educator extends User {
  contentsPosted: number,
  field: string
}

export interface Learner extends User {
  areasOfInterests: string[]
}