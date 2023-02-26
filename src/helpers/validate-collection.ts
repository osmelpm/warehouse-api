export const validateCollection = (
  collection: string,
  collections: string[],
) => {
  const validate = collections.includes(collection)

  if (!validate) {
    throw new Error(
      `Collection: ${collection} isn't allowed. Allowed: ${collections}`,
    )
  }
  return true
}
