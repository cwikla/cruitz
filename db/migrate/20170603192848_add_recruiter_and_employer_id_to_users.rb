class AddRecruiterAndEmployerIdToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :employer_id, :integer
    add_column :users, :is_recruiter, :integer, :default => 0

    add_index :users, [:employer_id]
    add_index :users, [:is_recruiter]
  end

end
