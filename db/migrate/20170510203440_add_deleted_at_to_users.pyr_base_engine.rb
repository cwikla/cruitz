# This migration comes from pyr_base_engine (originally 20130114043814)
class AddDeletedAtToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :deleted_at, :datetime
  end
end
