# This migration comes from pyr_base_engine (originally 20130904194945)
class CreateApiKeys < ActiveRecord::Migration
  def change
    create_table :api_keys do |t|
      t.timestamps
      t.string :api_key, :null => false
      t.string :secret, :null => false
    end

    add_index :api_keys, [:api_key], :unique => true
  end
end
