class RedoCandidateState < ActiveRecord::Migration[5.1]
  def change
    remove_column :candidate_states, :recruiter_id
  end
end
