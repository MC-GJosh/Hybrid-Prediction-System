/**
 * BaseService - Generic OOP base class for Supabase CRUD operations.
 * All entity-specific services extend this class.
 */
export class BaseService {
  constructor(supabase, table) {
    this.supabase = supabase
    this.table = table
  }

  /**
   * Fetch multiple records with optional filters, ordering, and limit.
   * @param {Object} options - { select, filters, order, limit }
   */
  async getAll(options = {}) {
    let query = this.supabase.from(this.table).select(options.select || '*')

    if (options.filters) {
      for (const [col, val] of Object.entries(options.filters)) {
        query = query.eq(col, val)
      }
    }
    if (options.order) {
      query = query.order(options.order.column, { ascending: options.order.ascending ?? false })
    }
    if (options.limit) {
      query = query.limit(options.limit)
    }

    const { data, error } = await query
    return { data: data || [], error }
  }

  /**
   * Fetch a single record by primary key.
   * @param {string} id - UUID
   */
  async getById(id) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .eq('id', id)
      .single()
    return { data, error }
  }

  /**
   * Insert a new record.
   * @param {Object} payload - Fields to insert
   */
  async create(payload) {
    const { data, error } = await this.supabase
      .from(this.table)
      .insert(payload)
      .select()
      .single()
    return { data, error }
  }

  /**
   * Update an existing record by ID.
   * @param {string} id - UUID
   * @param {Object} payload - Fields to update
   */
  async update(id, payload) {
    const { data, error } = await this.supabase
      .from(this.table)
      .update(payload)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  }

  /**
   * Delete a record by ID.
   * @param {string} id - UUID
   */
  async delete(id) {
    const { error } = await this.supabase
      .from(this.table)
      .delete()
      .eq('id', id)
    return { error }
  }
}
