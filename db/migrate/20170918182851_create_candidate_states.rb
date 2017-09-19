class CreateCandidateStates < ActiveRecord::Migration[5.1]
  def change
    create_table :candidate_states do |t|
      t.timestamps
      t.timestamp :deleted_at
      t.integer :candidate_id
      t.integer :user_id
      t.integer :recruiter_id
      t.integer :message_id
      t.integer :state
    end

    add_index :candidate_states, [:candidate_id, :state]
  end

end
