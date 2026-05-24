import { BaseService } from './BaseService.js'

/**
 * SwimmerService - Handles all swimmer-related database operations.
 * Extends BaseService for shared CRUD functionality.
 */
export class SwimmerService extends BaseService {
  constructor(supabase) {
    super(supabase, 'swimmers')
  }

  /**
   * Fetch a full swimmer profile by ID.
   * @param {string} id - Swimmer UUID
   */
  async getProfile(id) {
    return this.getById(id)
  }

  /**
   * Update editable profile fields.
   * @param {string} id - Swimmer UUID
   * @param {Object} payload - { full_name, age, gender, main_stroke, main_event, personal_best, height_cm, weight_kg }
   */
  async updateProfile(id, payload) {
    return this.update(id, payload)
  }
}
