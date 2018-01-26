class NoJobLocation < ActiveRecord::Migration[5.1]
  def up
    remove_column :jobs, :location
  end

  def down
    add_column :jobs, :location, :string
  end
end
