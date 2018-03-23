class AddSalaryStuffToJobs < ActiveRecord::Migration[5.1]
  def change
    add_column :jobs, :salary, :integer
    add_column :jobs, :salary_high, :integer
    add_column :jobs, :salary_doe, :boolean, default: false
  end
end
