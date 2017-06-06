class AddNamesToUsers < ActiveRecord::Migration[5.0]
  def up
    add_column :users, :first_name, :string
    add_column :users, :last_name, :string


    User.reset_column_information

    User.update_all(:first_name => "NoFirst", :last_name => "NoLast")

    change_column :users, :first_name, :string, :null => false
    change_column :users, :last_name, :string, :null => false

    add_index :users, [:last_name, :first_name]
  end

  def down
    remove_index :users, [:last_name, :first_name]

    remove_column :users, :first_name
    remove_column :users, :last_name
  end
end
