class AddNamesToUsers < ActiveRecord::Migration[5.0]
  def up
    add_column :users, :first_name, :string
    add_column :users, :last_name, :string

    add_index :users, [:last_name, :first_name]
  end

  def down
    remove_index :users, [:last_name, :first_name]

    remove_column :users, :first_name
    remove_column :users, :last_name
  end
end
