import { BaseService } from './BaseService.js'

/**
 * TrainingLogService - Handles all training_logs database operations.
 * Extends BaseService for shared CRUD functionality.
 */
export class TrainingLogService extends BaseService {
  constructor(supabase) {
    super(supabase, 'training_logs')
  }

  /**
   * Fetch all training logs for a specific swimmer, newest first.
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
