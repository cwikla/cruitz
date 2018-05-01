class JobLocUni < ActiveRecord::Migration[5.1]
  def change
    remove_index :job_locations, [:job_id, :location_id]
    add_index :job_locations, [:job_id, :location_id], unique: true
  end
end
