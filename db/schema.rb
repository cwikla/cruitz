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

ActiveRecord::Schema.define(version: 20170510203461) do

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
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true, using: :btree
    t.index ["digits_user_id", "deleted_at"], name: "index_users_on_digits_user_id_and_deleted_at", unique: true, using: :btree
    t.index ["email"], name: "index_users_on_email", unique: true, using: :btree
    t.index ["facebook_id"], name: "index_users_on_facebook_id", unique: true, using: :btree
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree
    t.index ["twitter_id"], name: "index_users_on_twitter_id", using: :btree
    t.index ["unconfirmed_email"], name: "index_users_on_unconfirmed_email", using: :btree
    t.index ["username"], name: "index_users_on_username", unique: true, using: :btree
    t.index ["uuid"], name: "index_users_on_uuid", unique: true, using: :btree
  end

end
