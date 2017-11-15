class AddFirstTimeToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :first_time, :boolean, :default => true, :null => false
  end
end
