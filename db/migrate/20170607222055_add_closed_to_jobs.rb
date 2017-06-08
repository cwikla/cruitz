class AddClosedToJobs < ActiveRecord::Migration[5.0]
  def change
    add_column :jobs, :closed_at, :timestamp
    add_column :jobs, :closed_reason, :integer
    add_column :jobs, :filled_at, :timestamp
  end

end
