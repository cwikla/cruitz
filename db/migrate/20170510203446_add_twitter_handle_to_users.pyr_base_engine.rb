# This migration comes from pyr_base_engine (originally 20140123213502)
class AddTwitterHandleToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :twitter_handle, :string, :unique => true
  end
end
