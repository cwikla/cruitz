class ResetStates < ActiveRecord::Migration[5.1]
  def up
    Candidate.update_all(state: 0, unlocked_at: nil)

    table_name = "candidate_states"
    ActiveRecord::Base.connection.execute("TRUNCATE #{table_name} RESTART IDENTITY")
  end

  def down
    # nothing to see here
  end
end
