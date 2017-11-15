class AddFieldsToCompany < ActiveRecord::Migration[5.1]
  def up
    change_column :companies, :name, :string, :null => true
    add_column :companies, :user_id, :integer, :null => false
    add_column :companies, :url, :string
    add_column :companies, :location, :string # for now

    add_index :companies, [:user_id]

  end

  def down
    remove_index :companies, [:user_id]
    change_column :companies, :name, :string

    remove_column :companies, :user_id, :integer, :null => false
    remove_column :companies, :url, :string
    remove_column :companies, :location, :string # for now

  end
end
