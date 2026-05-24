export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  try {
    const response = await $fetch('http://localhost:8000/api/predict', {
      method: 'POST',
      body: {
        swimmer_id: body.swimmer_id,
        event: body.event
      }
    })
    return response
  } catch (err) {
    const msg = err?.data?.detail || err?.message || 'FastAPI prediction failed'
    throw createError({ statusCode: 500, statusMessage: msg })
  }
})