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

ActiveRecord::Schema.define(version: 20170526200351) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "bookings", force: :cascade do |t|
    t.integer "user_id"
    t.integer "schedule_id"
    t.boolean "confirm"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "booking_size"
  end

  create_table "countries", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "reviews", force: :cascade do |t|
    t.integer "rating"
    t.text "comment"
    t.integer "author_id"
    t.bigint "tour_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["tour_id"], name: "index_reviews_on_tour_id"
  end

  create_table "schedules", force: :cascade do |t|
    t.datetime "tour_start_time"
    t.integer "tour_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "max_capacity"
    t.integer "current_capacity", default: 0
  end

  create_table "tourpoints", force: :cascade do |t|
    t.string "tour_point_name"
    t.jsonb "tour_point_laglng"
    t.string "tour_point_img"
    t.string "tour_point_description"
    t.bigint "tour_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "avatar_file_name"
    t.string "avatar_content_type"
    t.integer "avatar_file_size"
    t.datetime "avatar_updated_at"
    t.index ["tour_id"], name: "index_tourpoints_on_tour_id"
  end

  create_table "tours", force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.string "city"
    t.string "rendezvous_point"
    t.integer "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "category"
    t.integer "country_id"
    t.integer "capacity"
    t.integer "duration_in_ms"
    t.string "tourpic_file_name"
    t.string "tourpic_content_type"
    t.integer "tourpic_file_size"
    t.datetime "tourpic_updated_at"
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.string "phone"
    t.string "password"
    t.string "password_digest"
    t.string "picture"
    t.string "username"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "avatar_file_name"
    t.string "avatar_content_type"
    t.integer "avatar_file_size"
    t.datetime "avatar_updated_at"
  end

  add_foreign_key "reviews", "tours"
  add_foreign_key "tourpoints", "tours"
end
