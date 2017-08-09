class AddColumnsToCandidate < ActiveRecord::Migration[5.1]
  def change
    add_column :candidates, :accepted_at, :timestamp
    add_column :candidates, :rejected_at, :timestamp

    add_index :candidates, [:job_id, :accepted_at]
    add_index :candidates, [:job_id, :rejected_at]
  end
end
