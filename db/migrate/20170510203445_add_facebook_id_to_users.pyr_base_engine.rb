# This migration comes from pyr_base_engine (originally 20130910192459)
class AddFacebookIdToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :facebook_id, :string
    add_index :users,  [:facebook_id, :deleted_at], :unique => true
  end
end
