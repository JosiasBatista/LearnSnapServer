export interface UserResponse {
  id: number,
  name: string,
  email: string,
  createdAt: string
}

export interface Educator extends UserResponse {
  contentsPosted: number,
  field: string
}

export interface Learner extends UserResponse {
  areasOfInterests: string[]
}