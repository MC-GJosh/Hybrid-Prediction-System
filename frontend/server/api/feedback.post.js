export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  try {
    const response = await $fetch('http://localhost:8000/api/feedback', {
      method: 'POST',
      body: body
    })
    return response
  } catch (err) {
    const msg = err?.data?.detail || err?.message || 'FastAPI feedback failed'
    throw createError({ statusCode: 500, statusMessage: msg })
  }
})