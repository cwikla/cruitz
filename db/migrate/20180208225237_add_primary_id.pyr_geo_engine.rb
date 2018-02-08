# This migration comes from pyr_geo_engine (originally 20180208224321)
class AddPrimaryId < ActiveRecord::Migration[5.1]
  def change
    add_column :pyr_geo_names, :primary_id, :integer

    add_index :pyr_geo_names, :primary_id
  end
end
