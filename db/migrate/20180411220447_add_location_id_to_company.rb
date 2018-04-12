class AddLocationIdToCompany < ActiveRecord::Migration[5.1]
  def change
    add_column :companies, :location_id, :integer
    add_index :companies, [:location_id]
  end

end
