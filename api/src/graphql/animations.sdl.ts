export const schema = gql`
  type Animation {
    id: Int!
    name: String!
    description: String
    uuid: String!
    animationHistoryId: String!
    AnimationHistory: AnimationHistory!
    version: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    tracks: [AnimationTrack]!
    entities: [AnimationEntity]!
  }

  type Query {
    animations: [Animation!]! @requireAuth
    recentAnimations(input: RecentAnimationsInput): [Animation!]! @requireAuth
    animation(id: Int!): Animation @requireAuth
    animationByHistoryIdAndVersion(
      animationHistoryId: String!
      version: Int!
    ): Animation @requireAuth
  }

  enum OrderDirection {
    ASC
    DESC
  }

  input CreateAnimationInput {
    name: String!
    description: String
    uuid: String
    animationHistoryId: String!
    version: Int!
    tracks: [CreateAnimationTrackInput!]
    entities: [CreateAnimationEntityInput!]
  }

  input UpdateAnimationInput {
    name: String
    description: String
    uuid: String
    animationHistoryId: String!
    version: Int
  }

  input RecentAnimationsInput {
    first: Int
    skip: Int
    orderBy: String
    orderDirection: OrderDirection
  }

  type Mutation {
    createAnimation(input: CreateAnimationInput!): Animation! @requireAuth
    updateAnimation(id: Int!, input: UpdateAnimationInput!): Animation!
      @requireAuth
    deleteAnimation(id: Int!): Animation! @requireAuth
  }
`
