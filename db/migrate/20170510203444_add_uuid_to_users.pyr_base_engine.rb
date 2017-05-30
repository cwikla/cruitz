# This migration comes from pyr_base_engine (originally 20130910022333)
class AddUuidToUsers < ActiveRecord::Migration
  def change
    add_column :users, :uuid, :string, :limit => 36

    add_index :users, [:uuid], :unique => true
  end
end
