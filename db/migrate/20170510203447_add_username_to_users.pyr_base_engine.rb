# This migration comes from pyr_base_engine (originally 20140207224009)
class AddUsernameToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :username, :string
    add_index :users, :username, :unique => true
  end
end
