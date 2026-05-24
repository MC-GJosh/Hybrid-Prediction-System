import { BaseService } from './BaseService.js'

/**
 * TimeLogService - Handles all time_logs database operations.
 * Extends BaseService for shared CRUD functionality.
 */
export class TimeLogService extends BaseService {
  constructor(supabase) {
    super(supabase, 'time_logs')
  }

  /**
   * Fetch all time logs for a specific swimmer, newest first.
   * @param {string} swimmerId - Swimmer UUID
   * @param {number} limit - Max rows to return (default 30)
   */
  async getBySwimmer(swimmerId, limit = 30) {
    return this.getAll({
      filters: { swimmer_id: swimmerId },
      order: { column: 'log_date', ascending: false },
      limit,
    })
  }
}
