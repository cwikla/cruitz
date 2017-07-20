# This migration comes from pyr_base_engine (originally 20150222225423)
class AddTzToUser < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :tz, :string
  end
end
