class CreateCompanyLocations < ActiveRecord::Migration[5.1]
  def change
    create_table :company_locations do |t|
      t.timestamps
      t.timestamp :deleted_at

      t.integer :company_id, :null => false
      t.integer :location_id, :null => false
    end

    add_index :company_locations, [:company_id, :location_id]

  end
end
