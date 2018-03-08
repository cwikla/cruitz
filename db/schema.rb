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

ActiveRecord::Schema.define(version: 20180307014406) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "access_tokens", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.integer "user_id", null: false
    t.string "token", limit: 64, null: false
    t.datetime "last_accessed_at"
    t.integer "api_key_id"
    t.index ["last_accessed_at"], name: "index_access_tokens_on_last_accessed_at"
    t.index ["token"], name: "index_access_tokens_on_token", unique: true
  end

  create_table "api_keys", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "api_key", null: false
    t.string "secret", null: false
    t.index ["api_key"], name: "index_api_keys_on_api_key", unique: true
  end

  create_table "async_queues", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.datetime "queued_at"
    t.datetime "started_at"
    t.datetime "completed_at"
    t.datetime "failed_at"
    t.string "status"
    t.string "clazz_name"
    t.integer "obj_id"
    t.string "method_name"
    t.text "args"
    t.text "message"
    t.index ["clazz_name", "obj_id", "status"], name: "index_async_queues_on_clazz_name_and_obj_id_and_status"
    t.index ["completed_at", "status"], name: "index_async_queues_on_completed_at_and_status"
    t.index ["failed_at", "status"], name: "index_async_queues_on_failed_at_and_status"
    t.index ["queued_at", "status"], name: "index_async_queues_on_queued_at_and_status"
    t.index ["started_at", "status"], name: "index_async_queues_on_started_at_and_status"
  end

  create_table "candidate_states", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.integer "candidate_id"
    t.integer "user_id"
    t.integer "recruiter_id"
    t.integer "message_id"
    t.integer "state"
    t.index ["candidate_id", "state"], name: "index_candidate_states_on_candidate_id_and_state"
  end

  create_table "candidates", id: :serial, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.integer "head_id", null: false
    t.integer "job_id", null: false
    t.datetime "unlocked_at"
    t.datetime "accepted_at"
    t.datetime "rejected_at"
    t.integer "state", default: 0, null: false
    t.decimal "commission", precision: 5, scale: 2, null: false
    t.index ["head_id"], name: "index_candidates_on_head_id"
    t.index ["job_id", "accepted_at"], name: "index_candidates_on_job_id_and_accepted_at"
    t.index ["job_id", "rejected_at"], name: "index_candidates_on_job_id_and_rejected_at"
    t.index ["job_id"], name: "index_candidates_on_job_id"
  end

  create_table "categories", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.integer "parent_id"
    t.integer "syn_id"
    t.string "name", null: false
    t.index ["name"], name: "index_categories_on_name"
  end

  create_table "companies", id: :serial, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.string "name"
    t.text "description"
    t.integer "user_id", null: false
    t.string "url"
    t.string "location"
    t.integer "pyr_upload_id"
    t.index ["name"], name: "index_companies_on_name"
    t.index ["pyr_upload_id"], name: "index_companies_on_pyr_upload_id"
    t.index ["user_id"], name: "index_companies_on_user_id"
  end

  create_table "heads", id: :serial, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.integer "user_id", null: false
    t.string "first_name"
    t.string "last_name"
    t.string "email"
    t.string "phone_number"
    t.index ["email"], name: "index_heads_on_email"
    t.index ["last_name", "first_name"], name: "index_heads_on_last_name_and_first_name"
    t.index ["phone_number"], name: "index_heads_on_phone_number"
    t.index ["user_id"], name: "index_heads_on_user_id"
  end

  create_table "invites", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.datetime "sent_at"
    t.integer "user_id", null: false
    t.integer "from_user_id"
    t.string "first_name"
    t.string "last_name"
    t.string "email", null: false
    t.text "body"
    t.boolean "use_default", default: true, null: false
    t.index ["email"], name: "index_invites_on_email"
    t.index ["from_user_id"], name: "index_invites_on_from_user_id"
    t.index ["user_id"], name: "index_invites_on_user_id"
  end

  create_table "job_categories", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.integer "job_id"
    t.integer "category_id"
    t.index ["category_id", "job_id"], name: "index_job_categories_on_category_id_and_job_id"
    t.index ["job_id", "category_id"], name: "index_job_categories_on_job_id_and_category_id"
  end

  create_table "job_locations", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.integer "job_id", null: false
    t.integer "location_id", null: false
    t.index ["job_id", "location_id"], name: "index_job_locations_on_job_id_and_location_id"
  end

  create_table "job_skills", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.integer "job_id", null: false
    t.integer "skill_id", null: false
    t.index ["job_id", "skill_id"], name: "index_job_skills_on_job_id_and_skill_id"
  end

  create_table "jobs", id: :serial, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.integer "user_id", null: false
    t.text "title", null: false
    t.text "description", null: false
    t.datetime "closed_at"
    t.integer "closed_reason"
    t.datetime "filled_at"
    t.integer "time_commit", default: 0, null: false
    t.string "uuid", limit: 36
    t.index ["user_id"], name: "index_jobs_on_user_id"
    t.index ["uuid"], name: "index_jobs_on_uuid", unique: true
  end

  create_table "messages", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.datetime "read_at"
    t.integer "user_id", null: false
    t.integer "from_user_id", null: false
    t.integer "job_id", null: false
    t.integer "candidate_id"
    t.integer "root_message_id"
    t.integer "parent_message_id"
    t.text "title"
    t.text "body", null: false
    t.string "uuid", limit: 36
    t.index ["candidate_id"], name: "index_messages_on_candidate_id"
    t.index ["from_user_id", "job_id", "candidate_id"], name: "index_messages_on_from_user_id_and_job_id_and_candidate_id"
    t.index ["job_id"], name: "index_messages_on_job_id"
    t.index ["root_message_id"], name: "index_messages_on_root_message_id"
    t.index ["user_id", "job_id", "candidate_id"], name: "index_messages_on_user_id_and_job_id_and_candidate_id"
    t.index ["uuid"], name: "index_messages_on_uuid", unique: true
  end

  create_table "pyr_base_magic_keys", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.string "magic_key", null: false
    t.integer "user_id", null: false
    t.datetime "used_at"
    t.datetime "issued_at"
    t.index ["magic_key", "user_id"], name: "index_pyr_base_magic_keys_on_magic_key_and_user_id"
    t.index ["user_id", "created_at"], name: "index_pyr_base_magic_keys_on_user_id_and_created_at"
  end

  create_table "pyr_base_uploads", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "bucket_name", null: false
    t.string "file_name", null: false
    t.string "content_type", null: false
    t.string "sub_type"
    t.integer "user_id"
    t.string "uuid", limit: 36
    t.datetime "deleted_at"
    t.index ["user_id"], name: "index_pyr_base_uploads_on_user_id"
  end

  create_table "pyr_geo_caches", id: :serial, force: :cascade do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.decimal "latitude", precision: 9, scale: 6, null: false
    t.decimal "longitude", precision: 9, scale: 6, null: false
    t.string "city", limit: 64
    t.string "state", limit: 64
    t.string "country", limit: 2
    t.string "postal_code", limit: 12
    t.string "address"
    t.index ["city", "state", "country"], name: "index_pyr_geo_caches_on_city_and_state_and_country"
    t.index ["latitude", "longitude"], name: "gcllidx", unique: true
    t.index ["postal_code", "country"], name: "index_pyr_geo_caches_on_postal_code_and_country"
  end

  create_table "pyr_geo_cities", id: :serial, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.string "iso_country", limit: 2, null: false
    t.string "city_normalized", null: false
    t.string "city", null: false
    t.integer "region", null: false
    t.integer "population", default: 0
    t.decimal "latitude", precision: 9, scale: 6, null: false
    t.decimal "longitude", precision: 9, scale: 6, null: false
    t.index ["iso_country", "city", "population"], name: "index_pyr_geo_cities_on_iso_country_and_city_and_population"
    t.index ["latitude", "longitude", "iso_country", "city"], name: "gc_llic_idx"
  end

  create_table "pyr_geo_names", id: :serial, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.string "iso_country", limit: 2, null: false
    t.string "postal_code", limit: 20
    t.string "name", null: false
    t.string "admin_name_1", limit: 100
    t.string "admin_code_1", limit: 20
    t.string "admin_name_2", limit: 100
    t.string "admin_code_2", limit: 20
    t.string "admin_name_3", limit: 100
    t.string "admin_code_3", limit: 20
    t.decimal "latitude", precision: 9, scale: 6, null: false
    t.decimal "longitude", precision: 9, scale: 6, null: false
    t.decimal "cluster_latitude", precision: 9, scale: 6
    t.decimal "cluster_longitude", precision: 9, scale: 6
    t.integer "accuracy"
    t.boolean "is_primary", default: false, null: false
    t.integer "primary_id"
    t.index "lower((name)::text), lower((admin_code_1)::text), lower((iso_country)::text)", name: "pyr_geo_low_idx"
    t.index ["cluster_latitude", "cluster_longitude", "iso_country", "name"], name: "pyr_geo_ccllin_idx"
    t.index ["cluster_latitude", "cluster_longitude", "iso_country", "postal_code"], name: "pyr_geo_ccllip_idx"
    t.index ["iso_country", "name"], name: "index_pyr_geo_names_on_iso_country_and_name"
    t.index ["iso_country", "postal_code"], name: "index_pyr_geo_names_on_iso_country_and_postal_code"
    t.index ["latitude", "longitude", "iso_country", "name"], name: "pyr_geo_llin_idx"
    t.index ["primary_id"], name: "index_pyr_geo_names_on_primary_id"
  end

  create_table "ratings", id: :serial, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.integer "user_id", null: false
    t.integer "recruiter_id", null: false
    t.index ["user_id", "recruiter_id"], name: "index_ratings_on_user_id_and_recruiter_id"
  end

  create_table "reviews", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.integer "user_id", null: false
    t.integer "from_user_id", null: false
    t.integer "score", default: 0, null: false
    t.text "description"
    t.index ["from_user_id", "score"], name: "index_reviews_on_from_user_id_and_score"
    t.index ["user_id", "score"], name: "index_reviews_on_user_id_and_score"
  end

  create_table "sessions", force: :cascade do |t|
    t.string "session_id", null: false
    t.text "data"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["session_id"], name: "index_sessions_on_session_id"
    t.index ["updated_at"], name: "index_sessions_on_updated_at"
  end

  create_table "settings", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.string "uuid", limit: 36
    t.integer "user_id", null: false
    t.boolean "use_ignore_recruiters", default: true, null: false
    t.integer "minimum_recruiter_score", null: false
    t.boolean "use_ignore_agencies", default: true, null: false
    t.integer "minimum_agency_score", null: false
    t.boolean "use_reject_candidates", default: true, null: false
    t.integer "reject_candidate_days", null: false
    t.boolean "use_auto_spam", default: true, null: false
    t.boolean "use_ban_recruiter", default: true, null: false
    t.integer "ban_recruiter_days", null: false
    t.boolean "use_ban_agency", default: true, null: false
    t.integer "ban_agency_days", null: false
    t.boolean "use_recruiter_limit", default: true, null: false
    t.integer "recruiter_limit", null: false
    t.boolean "use_agency_limit", default: true, null: false
    t.integer "agency_limit", null: false
    t.index ["user_id"], name: "index_settings_on_user_id", unique: true
    t.index ["uuid"], name: "index_settings_on_uuid", unique: true
  end

  create_table "skills", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.string "name", null: false
    t.index ["name"], name: "index_skills_on_name", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.string "email"
    t.string "encrypted_password", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "roles_mask"
    t.integer "admin_roles_mask"
    t.datetime "deleted_at"
    t.string "uuid", limit: 36
    t.string "facebook_id"
    t.string "twitter_handle"
    t.string "username"
    t.string "tz"
    t.string "digits_user_id"
    t.string "digits_phone"
    t.string "twitter_id"
    t.boolean "anon", default: true, null: false
    t.integer "employer_id"
    t.integer "is_recruiter", default: 0
    t.string "first_name"
    t.string "last_name"
    t.string "jti", null: false
    t.boolean "first_time", default: true, null: false
    t.integer "pyr_upload_id"
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["digits_user_id", "deleted_at"], name: "index_users_on_digits_user_id_and_deleted_at", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["employer_id"], name: "index_users_on_employer_id"
    t.index ["facebook_id"], name: "index_users_on_facebook_id", unique: true
    t.index ["is_recruiter"], name: "index_users_on_is_recruiter"
    t.index ["jti"], name: "index_users_on_jti", unique: true
    t.index ["last_name", "first_name"], name: "index_users_on_last_name_and_first_name"
    t.index ["pyr_upload_id"], name: "index_users_on_pyr_upload_id"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["twitter_id"], name: "index_users_on_twitter_id"
    t.index ["unconfirmed_email"], name: "index_users_on_unconfirmed_email"
    t.index ["username"], name: "index_users_on_username", unique: true
    t.index ["uuid"], name: "index_users_on_uuid", unique: true
  end

end
