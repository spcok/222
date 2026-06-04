import { pgTable, text, timestamp, boolean, uuid, numeric, date, integer } from 'drizzle-orm/pg-core';

// --- USERS ---
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email'),
  name: text('name'),
  initials: text('initials'),
  role: text('role'),
  is_deleted: boolean('is_deleted').default(false),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  phone: text('phone'),
  address: text('address'),
  signature_url: text('signature_url'),
  pin: text('pin'),
  updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  cv_url: text('cv_url'),
  emergency_contact_name: text('emergency_contact_name'),
  emergency_contact_phone: text('emergency_contact_phone'),
  start_date: date('start_date', { mode: 'string' }),
  hr_notes: text('hr_notes'),
  avatar_url: text('avatar_url'),
  dob: date('dob', { mode: 'string' }),
  end_date: date('end_date', { mode: 'string' }),
  is_active: boolean('is_active').default(false),
  requires_password_change: boolean('requires_password_change').default(false),
});

// --- ANIMALS ---
export const animals = pgTable('animals', {
  id: uuid('id').primaryKey().defaultRandom(),
  entity_type: text('entity_type').notNull(),
  parent_mob_id: uuid('parent_mob_id'),
  census_count: integer('census_count').notNull(),
  name: text('name'),
  species: text('species'),
  latin_name: text('latin_name'),
  category: text('category'),
  location: text('location'),
  image_url: text('image_url'),
  distribution_map_url: text('distribution_map_url'),
  hazard_rating: text('hazard_rating'),
  is_venomous: boolean('is_venomous').default(false),
  weight_unit: text('weight_unit').notNull(),
  flying_weight_g: numeric('flying_weight_g'),
  winter_weight_g: numeric('winter_weight_g'),
  average_target_weight: numeric('average_target_weight'),
  date_of_birth: date('date_of_birth', { mode: 'string' }),
  is_dob_unknown: boolean('is_dob_unknown').default(false),
  gender: text('gender'),
  microchip_id: text('microchip_id'),
  ring_number: text('ring_number'),
  has_no_id: boolean('has_no_id').default(false),
  red_list_status: text('red_list_status').notNull(),
  description: text('description'),
  special_requirements: text('special_requirements'),
  critical_husbandry_notes: text('critical_husbandry_notes'),
  ambient_temp_only: boolean('ambient_temp_only').default(false),
  target_day_temp_c: numeric('target_day_temp_c'),
  target_night_temp_c: numeric('target_night_temp_c'),
  water_tipping_temp: numeric('water_tipping_temp'),
  target_humidity_min_percent: numeric('target_humidity_min_percent'),
  target_humidity_max_percent: numeric('target_humidity_max_percent'),
  misting_frequency: text('misting_frequency'),
  acquisition_date: date('acquisition_date', { mode: 'string' }),
  acquisition_type: text('acquisition_type'),
  origin: text('origin'),
  origin_location: text('origin_location'),
  lineage_unknown: boolean('lineage_unknown').default(false),
  sire_id: uuid('sire_id'),
  dam_id: uuid('dam_id'),
  is_boarding: boolean('is_boarding').default(false),
  is_quarantine: boolean('is_quarantine').default(false),
  display_order: integer('display_order').notNull(),
  is_deleted: boolean('is_deleted').default(false),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  created_by: uuid('created_by').references(() => users.id),
  modified_by: uuid('modified_by').references(() => users.id),
});

// --- CLINICAL_ATTACHMENTS ---
export const clinical_attachments = pgTable('clinical_attachments', {
  id: uuid('id').primaryKey().defaultRandom(),
  record_id: uuid('record_id').notNull(),
  file_name: text('file_name').notNull(),
  file_type: text('file_type').notNull(),
  file_url: text('file_url').notNull(),
  is_deleted: boolean('is_deleted').default(false),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
});

// --- CLINICAL_RECORDS ---
export const clinical_records = pgTable('clinical_records', {
  id: uuid('id').primaryKey().defaultRandom(),
  animal_id: uuid('animal_id').notNull().references(() => animals.id),
  record_type: text('record_type').notNull(),
  record_date: timestamp('record_date', { withTimezone: true, mode: 'string' }).notNull(),
  soap_subjective: text('soap_subjective').notNull(),
  soap_objective: text('soap_objective').notNull(),
  soap_assessment: text('soap_assessment').notNull(),
  soap_plan: text('soap_plan').notNull(),
  weight_grams: numeric('weight_grams').notNull(),
  conductor_role: text('conductor_role').notNull(),
  conducted_by: uuid('conducted_by').notNull().references(() => users.id),
  external_vet_name: text('external_vet_name'),
  external_vet_clinic: text('external_vet_clinic'),
  is_deleted: boolean('is_deleted').default(false),
  created_by: uuid('created_by').notNull().references(() => users.id),
  modified_by: uuid('modified_by').notNull().references(() => users.id),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
});

// --- CLINICAL_SCHEDULE ---
export const clinical_schedule = pgTable('clinical_schedule', {
  id: uuid('id').primaryKey().defaultRandom(),
  animal_id: uuid('animal_id').notNull().references(() => animals.id),
  schedule_type: text('schedule_type').notNull(),
  medication_name: text('medication_name').notNull(),
  dosage: text('dosage').notNull(),
  frequency: text('frequency').notNull(),
  start_date: timestamp('start_date', { withTimezone: true, mode: 'string' }).notNull(),
  end_date: timestamp('end_date', { withTimezone: true, mode: 'string' }),
  status: text('status').notNull(),
  is_deleted: boolean('is_deleted').default(false),
  created_by: uuid('created_by').notNull().references(() => users.id),
  modified_by: uuid('modified_by').notNull().references(() => users.id),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  notes: text('notes'),
  instructions: text('instructions'),
});

// --- DAILY_LOGS ---
export const daily_logs = pgTable('daily_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  animal_id: uuid('animal_id').notNull().references(() => animals.id),
  log_type: text('log_type').notNull(),
  log_date: timestamp('log_date', { withTimezone: true, mode: 'string' }).notNull(),
  notes: text('notes'),
  weight_grams: numeric('weight_grams'),
  weight_unit: text('weight_unit'),
  basking_temp_c: numeric('basking_temp_c'),
  cool_temp_c: numeric('cool_temp_c'),
  temperature_c: numeric('temperature_c'),
  is_deleted: boolean('is_deleted').default(false),
  created_by: uuid('created_by').references(() => users.id),
  modified_by: uuid('modified_by').references(() => users.id),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  weight_not_required: boolean('weight_not_required'),
  feed_details: text('feed_details'),
});

// --- DAILY_ROUNDS ---
export const daily_rounds = pgTable('daily_rounds', {
  id: uuid('id').primaryKey().defaultRandom(),
  animal_id: uuid('animal_id').notNull().references(() => animals.id),
  date: date('date', { mode: 'string' }).notNull(),
  shift: text('shift').notNull(),
  section: text('section'),
  completed_by: uuid('completed_by'),
  completed_at: timestamp('completed_at', { withTimezone: true, mode: 'string' }),
  status: text('status').notNull(),
  notes: text('notes'),
  is_deleted: boolean('is_deleted').default(false),
  created_by: uuid('created_by').references(() => users.id),
  modified_by: uuid('modified_by').references(() => users.id),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  requires_followup: boolean('requires_followup').default(false),
  followup_notes: text('followup_notes'),
});

// --- EXTERNAL_TRANSFERS ---
export const external_transfers = pgTable('external_transfers', {
  id: uuid('id').primaryKey().defaultRandom(),
  animal_id: uuid('animal_id').references(() => animals.id),
  transfer_type: text('transfer_type').notNull(),
  transfer_date: timestamp('transfer_date', { withTimezone: true, mode: 'string' }).notNull(),
  entity_name: text('entity_name').notNull(),
  entity_contact: text('entity_contact'),
  reason: text('reason'),
  notes: text('notes'),
  is_deleted: boolean('is_deleted').default(false),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
});

// --- FEEDING_SCHEDULES ---
export const feeding_schedules = pgTable('feeding_schedules', {
  id: uuid('id').primaryKey().defaultRandom(),
  animal_id: uuid('animal_id').notNull().references(() => animals.id),
  scheduled_date: date('scheduled_date', { mode: 'string' }).notNull(),
  food_type: text('food_type').notNull(),
  quantity: numeric('quantity').notNull(),
  quantity_unit: text('quantity_unit').notNull(),
  status: text('status').notNull(),
  completed_at: timestamp('completed_at', { withTimezone: true, mode: 'string' }),
  completed_by: uuid('completed_by'),
  is_deleted: boolean('is_deleted').default(false),
  created_by: uuid('created_by').notNull().references(() => users.id),
  modified_by: uuid('modified_by').notNull().references(() => users.id),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  notes: text('notes'),
  supplements: text('supplements'),
  presentation_method: text('presentation_method'),
  uneaten_amount: numeric('uneaten_amount'),
});

// --- FIRST_AID_LOGS ---
export const first_aid_logs = pgTable('first_aid_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  incident_id: uuid('incident_id'),
  person_involved_name: text('person_involved_name').notNull(),
  incident_date: timestamp('incident_date', { withTimezone: true, mode: 'string' }).notNull(),
  person_type: text('person_type').notNull(),
  treatment_provided: text('treatment_provided').notNull(),
  administered_by: uuid('administered_by').notNull(),
  is_deleted: boolean('is_deleted').default(false),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  _modified: timestamp('_modified', { withTimezone: true, mode: 'string' }),
  injury_description: text('injury_description'),
  referral_needed: boolean('referral_needed').default(false),
  referral_details: text('referral_details'),
});

// --- INCIDENTS ---
export const incidents = pgTable('incidents', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  incident_date: timestamp('incident_date', { withTimezone: true, mode: 'string' }).notNull(),
  incident_type: text('incident_type').notNull(),
  severity: text('severity').notNull(),
  description: text('description').notNull(),
  immediate_action_taken: text('immediate_action_taken'),
  reported_by: uuid('reported_by'),
  is_deleted: boolean('is_deleted').default(false),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  _modified: timestamp('_modified', { withTimezone: true, mode: 'string' }),
  status: text('status'),
  resolution_notes: text('resolution_notes'),
});

// --- INTERNAL_MOVEMENTS ---
export const internal_movements = pgTable('internal_movements', {
  id: uuid('id').primaryKey().defaultRandom(),
  animal_id: uuid('animal_id').references(() => animals.id),
  movement_date: timestamp('movement_date', { withTimezone: true, mode: 'string' }).notNull(),
  from_location: text('from_location'),
  to_location: text('to_location').notNull(),
  reason: text('reason'),
  notes: text('notes'),
  is_deleted: boolean('is_deleted').default(false),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
});

// --- ISOLATION_LOGS ---
export const isolation_logs = pgTable('isolation_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  animal_id: uuid('animal_id').notNull().references(() => animals.id),
  isolation_type: text('isolation_type').notNull(),
  start_date: timestamp('start_date', { withTimezone: true, mode: 'string' }).notNull(),
  end_date: timestamp('end_date', { withTimezone: true, mode: 'string' }),
  reason: text('reason').notNull(),
  notes: text('notes'),
  is_deleted: boolean('is_deleted').default(false),
  created_by: uuid('created_by').notNull().references(() => users.id),
  modified_by: uuid('modified_by').notNull().references(() => users.id),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
});

// --- LEAVE_REQUESTS ---
export const leave_requests = pgTable('leave_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').references(() => users.id),
  start_date: date('start_date', { mode: 'string' }).notNull(),
  end_date: date('end_date', { mode: 'string' }).notNull(),
  status: text('status').notNull(),
  leave_type: text('leave_type').notNull(),
  reason: text('reason'),
  is_deleted: boolean('is_deleted').default(false),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  _modified: timestamp('_modified', { withTimezone: true, mode: 'string' }),
  approved_by: uuid('approved_by').references(() => users.id),
});

// --- MAINTENANCE_TICKETS ---
export const maintenance_tickets = pgTable('maintenance_tickets', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  category: text('category').notNull(),
  status: text('status').notNull(),
  priority: text('priority').notNull(),
  reported_by: uuid('reported_by'),
  assigned_to: uuid('assigned_to').references(() => users.id),
  is_deleted: boolean('is_deleted').default(false),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  _modified: timestamp('_modified', { withTimezone: true, mode: 'string' }),
  resolution_notes: text('resolution_notes'),
  due_date: timestamp('due_date', { withTimezone: true, mode: 'string' }),
  location: text('location'),
});

// --- MEDICATION_LOGS ---
export const medication_logs = pgTable('medication_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  schedule_id: uuid('schedule_id').notNull(),
  animal_id: uuid('animal_id').notNull().references(() => animals.id),
  administered_at: timestamp('administered_at', { withTimezone: true, mode: 'string' }).notNull(),
  status: text('status').notNull(),
  administered_by: uuid('administered_by').notNull(),
  notes: text('notes'),
  is_deleted: boolean('is_deleted').default(false),
  created_by: uuid('created_by').notNull().references(() => users.id),
  modified_by: uuid('modified_by').notNull().references(() => users.id),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
});

// --- OPERATIONAL_LISTS ---
export const operational_lists = pgTable('operational_lists', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  category: text('category'),
  is_deleted: boolean('is_deleted').default(false),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  _modified: timestamp('_modified', { withTimezone: true, mode: 'string' }),
  status: text('status'),
});

// --- ORGANISATIONS ---
export const organisations = pgTable('organisations', {
  id: uuid('id').primaryKey().defaultRandom(),
  org_name: text('org_name').notNull(),
  logo_url: text('logo_url'),
  contact_email: text('contact_email'),
  contact_phone: text('contact_phone'),
  address: text('address'),
  is_deleted: boolean('is_deleted').default(false),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  _modified: timestamp('_modified', { withTimezone: true, mode: 'string' }),
  website: text('website'),
  license_number: text('license_number'),
});

// --- ROLE_PERMISSIONS ---
export const role_permissions = pgTable('role_permissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  role: text('role').notNull(),
  permission: text('permission').notNull(),
});

// --- SAFETY_DRILLS ---
export const safety_drills = pgTable('safety_drills', {
  id: uuid('id').primaryKey().defaultRandom(),
  drill_date: timestamp('drill_date', { withTimezone: true, mode: 'string' }).notNull(),
  drill_type: text('drill_type').notNull(),
  scenario_description: text('scenario_description').notNull(),
  areas_involved: text('areas_involved').notNull(),
  duration_minutes: integer('duration_minutes'),
  conducted_by: uuid('conducted_by').references(() => users.id),
  is_deleted: boolean('is_deleted').default(false),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  _modified: timestamp('_modified', { withTimezone: true, mode: 'string' }),
  participants: text('participants'),
  feedback_notes: text('feedback_notes'),
  improvements_identified: text('improvements_identified'),
  status: text('status'),
});

// --- SHIFT_PATTERNS ---
export const shift_patterns = pgTable('shift_patterns', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').references(() => users.id),
  monday: boolean('monday').default(false),
  tuesday: boolean('tuesday').default(false),
  wednesday: boolean('wednesday').default(false),
  thursday: boolean('thursday').default(false),
  friday: boolean('friday').default(false),
  saturday: boolean('saturday').default(false),
  sunday: boolean('sunday').default(false),
  is_deleted: boolean('is_deleted').default(false),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  _modified: timestamp('_modified', { withTimezone: true, mode: 'string' }),
  pattern_name: text('pattern_name'),
  effective_from: date('effective_from', { mode: 'string' }),
});

// --- SHIFTS ---
export const shifts = pgTable('shifts', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').references(() => users.id),
  start_time: timestamp('start_time', { withTimezone: true, mode: 'string' }).notNull(),
  end_time: timestamp('end_time', { withTimezone: true, mode: 'string' }).notNull(),
  assigned_area: text('assigned_area'),
  status: text('status'),
  is_deleted: boolean('is_deleted').default(false),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  _modified: timestamp('_modified', { withTimezone: true, mode: 'string' }),
  notes: text('notes'),
});

// --- TASKS ---
export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  animal_id: uuid('animal_id').references(() => animals.id),
  title: text('title').notNull(),
  description: text('description'),
  assigned_to: uuid('assigned_to').references(() => users.id),
  due_date: timestamp('due_date', { withTimezone: true, mode: 'string' }),
  status: text('status').notNull(),
  priority: text('priority').notNull(),
  is_deleted: boolean('is_deleted').default(false),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  _modified: timestamp('_modified', { withTimezone: true, mode: 'string' }),
  completed_at: timestamp('completed_at', { withTimezone: true, mode: 'string' }),
  completed_by: uuid('completed_by').references(() => users.id),
  task_type: text('task_type'),
  recurrence_rule: text('recurrence_rule'),
});

// --- TIMESHEETS ---
export const timesheets = pgTable('timesheets', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').references(() => users.id),
  shift_date: date('shift_date', { mode: 'string' }).notNull(),
  clock_in_time: timestamp('clock_in_time', { withTimezone: true, mode: 'string' }).notNull(),
  clock_out_time: timestamp('clock_out_time', { withTimezone: true, mode: 'string' }),
  total_hours: numeric('total_hours'),
  status: text('status'),
  is_deleted: boolean('is_deleted').default(false),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  _modified: timestamp('_modified', { withTimezone: true, mode: 'string' }),
  approved_by: uuid('approved_by').references(() => users.id),
  notes: text('notes'),
});

// --- ZLA_DOCUMENTS ---
export const zla_documents = pgTable('zla_documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  file_url: text('file_url').notNull(),
  upload_date: timestamp('upload_date', { withTimezone: true, mode: 'string' }).notNull(),
  is_deleted: boolean('is_deleted').default(false),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  _modified: timestamp('_modified', { withTimezone: true, mode: 'string' }),
});