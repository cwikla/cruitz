# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170623230909) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "access_tokens", force: :cascade do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.datetime "deleted_at"
    t.integer  "user_id",                     null: false
    t.string   "token",            limit: 64, null: false
    t.datetime "last_accessed_at"
    t.integer  "api_key_id"
    t.index ["last_accessed_at"], name: "index_access_tokens_on_last_accessed_at", using: :btree
    t.index ["token"], name: "index_access_tokens_on_token", unique: true, using: :btree
  end

  create_table "api_keys", force: :cascade do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "api_key",    null: false
    t.string   "secret",     null: false
    t.index ["api_key"], name: "index_api_keys_on_api_key", unique: true, using: :btree
  end

  create_table "async_queues", force: :cascade do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.datetime "deleted_at"
    t.datetime "queued_at"
    t.datetime "started_at"
    t.datetime "completed_at"
    t.datetime "failed_at"
    t.string   "status"
    t.string   "clazz_name"
    t.integer  "obj_id"
    t.string   "method_name"
    t.text     "args"
    t.text     "message"
    t.index ["clazz_name", "obj_id", "status"], name: "index_async_queues_on_clazz_name_and_obj_id_and_status", using: :btree
    t.index ["completed_at", "status"], name: "index_async_queues_on_completed_at_and_status", using: :btree
    t.index ["failed_at", "status"], name: "index_async_queues_on_failed_at_and_status", using: :btree
    t.index ["queued_at", "status"], name: "index_async_queues_on_queued_at_and_status", using: :btree
    t.index ["started_at", "status"], name: "index_async_queues_on_started_at_and_status", using: :btree
  end

  create_table "candidates", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.integer  "head_id",    null: false
    t.integer  "job_id",     null: false
    t.index ["head_id"], name: "index_candidates_on_head_id", using: :btree
    t.index ["job_id"], name: "index_candidates_on_job_id", using: :btree
  end

  create_table "companies", force: :cascade do |t|
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.datetime "deleted_at"
    t.string   "name",        null: false
    t.text     "description"
    t.index ["name"], name: "index_companies_on_name", using: :btree
  end

  create_table "heads", force: :cascade do |t|
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
    t.datetime "deleted_at"
    t.integer  "recruiter_id", null: false
    t.string   "first_name"
    t.string   "last_name"
    t.string   "email"
    t.string   "phone_number"
    t.index ["recruiter_id"], name: "index_heads_on_recruiter_id", using: :btree
  end

  create_table "jobs", force: :cascade do |t|
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
    t.datetime "deleted_at"
    t.integer  "user_id",                   null: false
    t.text     "title",                     null: false
    t.text     "description",               null: false
    t.datetime "closed_at"
    t.integer  "closed_reason"
    t.datetime "filled_at"
    t.string   "location",                  null: false
    t.integer  "time_commit",   default: 0, null: false
    t.index ["location"], name: "index_jobs_on_location", using: :btree
    t.index ["user_id"], name: "index_jobs_on_user_id", using: :btree
  end

  create_table "pyr_base_magic_keys", force: :cascade do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.datetime "deleted_at"
    t.string   "magic_key",  null: false
    t.integer  "user_id",    null: false
    t.datetime "used_at"
    t.datetime "issued_at"
    t.index ["magic_key", "user_id"], name: "index_pyr_base_magic_keys_on_magic_key_and_user_id", using: :btree
    t.index ["user_id", "created_at"], name: "index_pyr_base_magic_keys_on_user_id_and_created_at", using: :btree
  end

  create_table "pyr_geo_caches", force: :cascade do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.decimal  "latitude",               precision: 9, scale: 6, null: false
    t.decimal  "longitude",              precision: 9, scale: 6, null: false
    t.string   "city",        limit: 64
    t.string   "state",       limit: 64
    t.string   "country",     limit: 2
    t.string   "postal_code", limit: 12
    t.string   "address"
    t.index ["city", "state", "country"], name: "index_pyr_geo_caches_on_city_and_state_and_country", using: :btree
    t.index ["latitude", "longitude"], name: "gcllidx", unique: true, using: :btree
    t.index ["postal_code", "country"], name: "index_pyr_geo_caches_on_postal_code_and_country", using: :btree
  end

  create_table "pyr_geo_cities", force: :cascade do |t|
    t.datetime "created_at",                                                    null: false
    t.datetime "updated_at",                                                    null: false
    t.string   "iso_country",     limit: 2,                                     null: false
    t.string   "city_normalized",                                               null: false
    t.string   "city",                                                          null: false
    t.integer  "region",                                                        null: false
    t.integer  "population",                                        default: 0
    t.decimal  "latitude",                  precision: 9, scale: 6,             null: false
    t.decimal  "longitude",                 precision: 9, scale: 6,             null: false
    t.index ["iso_country", "city", "population"], name: "index_pyr_geo_cities_on_iso_country_and_city_and_population", using: :btree
    t.index ["latitude", "longitude", "iso_country", "city"], name: "gc_llic_idx", using: :btree
  end

  create_table "pyr_geo_names", force: :cascade do |t|
    t.datetime "created_at",                                            null: false
    t.datetime "updated_at",                                            null: false
    t.string   "iso_country",       limit: 2,                           null: false
    t.string   "postal_code",       limit: 20
    t.string   "name",                                                  null: false
    t.string   "admin_name_1",      limit: 100
    t.string   "admin_code_1",      limit: 20
    t.string   "admin_name_2",      limit: 100
    t.string   "admin_code_2",      limit: 20
    t.string   "admin_name_3",      limit: 100
    t.string   "admin_code_3",      limit: 20
    t.decimal  "latitude",                      precision: 9, scale: 6, null: false
    t.decimal  "longitude",                     precision: 9, scale: 6, null: false
    t.decimal  "cluster_latitude",              precision: 9, scale: 6
    t.decimal  "cluster_longitude",             precision: 9, scale: 6
    t.integer  "accuracy"
    t.index ["cluster_latitude", "cluster_longitude", "iso_country", "name"], name: "pyr_geo_ccllin_idx", using: :btree
    t.index ["cluster_latitude", "cluster_longitude", "iso_country", "postal_code"], name: "pyr_geo_ccllip_idx", using: :btree
    t.index ["iso_country", "name", "postal_code"], name: "index_pyr_geo_names_on_iso_country_and_name_and_postal_code", using: :btree
    t.index ["iso_country", "postal_code"], name: "index_pyr_geo_names_on_iso_country_and_postal_code", using: :btree
    t.index ["latitude", "longitude", "iso_country", "name"], name: "pyr_geo_llin_idx", using: :btree
  end

  create_table "ratings", force: :cascade do |t|
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
    t.datetime "deleted_at"
    t.integer  "user_id",      null: false
    t.integer  "recruiter_id", null: false
    t.index ["user_id", "recruiter_id"], name: "index_ratings_on_user_id_and_recruiter_id", using: :btree
  end

  create_table "sessions", force: :cascade do |t|
    t.string   "session_id", null: false
    t.text     "data"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["session_id"], name: "index_sessions_on_session_id", using: :btree
    t.index ["updated_at"], name: "index_sessions_on_updated_at", using: :btree
  end

  create_table "users", force: :cascade do |t|
    t.string   "email"
    t.string   "encrypted_password",                               null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",                     default: 0,    null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.string   "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "unconfirmed_email"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "roles_mask"
    t.integer  "admin_roles_mask"
    t.datetime "deleted_at"
    t.string   "uuid",                   limit: 36
    t.string   "facebook_id"
    t.string   "twitter_handle"
    t.string   "username"
    t.string   "tz"
    t.string   "digits_user_id"
    t.string   "digits_phone"
    t.string   "twitter_id"
    t.boolean  "anon",                              default: true, null: false
    t.integer  "employer_id"
    t.integer  "recruiter_id"
    t.string   "first_name"
    t.string   "last_name"
    t.string   "jti",                                              null: false
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true, using: :btree
    t.index ["digits_user_id", "deleted_at"], name: "index_users_on_digits_user_id_and_deleted_at", unique: true, using: :btree
    t.index ["email"], name: "index_users_on_email", unique: true, using: :btree
    t.index ["employer_id"], name: "index_users_on_employer_id", using: :btree
    t.index ["facebook_id"], name: "index_users_on_facebook_id", unique: true, using: :btree
    t.index ["jti"], name: "index_users_on_jti", unique: true, using: :btree
    t.index ["last_name", "first_name"], name: "index_users_on_last_name_and_first_name", using: :btree
    t.index ["recruiter_id"], name: "index_users_on_recruiter_id", using: :btree
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree
    t.index ["twitter_id"], name: "index_users_on_twitter_id", using: :btree
    t.index ["unconfirmed_email"], name: "index_users_on_unconfirmed_email", using: :btree
    t.index ["username"], name: "index_users_on_username", unique: true, using: :btree
    t.index ["uuid"], name: "index_users_on_uuid", unique: true, using: :btree
  end

end
