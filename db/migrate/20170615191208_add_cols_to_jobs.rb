class AddColsToJobs < ActiveRecord::Migration[5.0]
  def change
    add_column :jobs, :location, :string, :null => false
    add_column :jobs, :time_commit, :integer, :default => 0, :null => false

    add_index :jobs, [:location]
  end
end
