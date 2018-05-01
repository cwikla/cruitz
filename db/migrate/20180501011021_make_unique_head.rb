class MakeUniqueHead < ActiveRecord::Migration[5.1]
  def change
    add_index :candidates, [:job_id, :head_id], unique: true
  end
end
