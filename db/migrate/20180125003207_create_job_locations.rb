class CreateJobLocations < ActiveRecord::Migration[5.1]
  def change
    create_table :job_locations do |t|
      t.timestamps
      t.timestamp :deleted_at

      t.integer :job_id, :null => false
      t.integer :location_id, :null => false
    end

    add_index :job_locations, [:job_id, :location_id]
  end
end
