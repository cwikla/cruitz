class CreateHeadLocations < ActiveRecord::Migration[5.1]
  def change
    create_table :head_locations do |t|
      t.timestamps
      t.timestamp :deleted_at

      t.integer :head_id, :null => false
      t.integer :location_id, :null => false
    end

    add_index :head_locations, [:head_id, :location_id]

  end
end
