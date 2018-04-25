class NoCompanyJob < ActiveRecord::Migration[5.1]
  def up
    remove_column :companies, :location 
  end 
      
  def down
    add_column :companies, :location, :string
  end 
end
