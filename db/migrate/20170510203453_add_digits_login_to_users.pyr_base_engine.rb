# This migration comes from pyr_base_engine (originally 20150630063017)
class AddDigitsLoginToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :digits_user_id, :string
    add_column :users, :digits_phone, :string
    add_index :users,  [:digits_user_id, :deleted_at], :unique => true
  end
end
