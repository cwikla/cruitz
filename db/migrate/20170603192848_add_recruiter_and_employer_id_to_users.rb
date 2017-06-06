class AddRecruiterAndEmployerIdToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :employer_id, :integer
    add_column :users, :recruiter_id, :integer

    add_index :users, [:employer_id]
    add_index :users, [:recruiter_id]
  end

end
