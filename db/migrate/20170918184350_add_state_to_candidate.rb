class AddStateToCandidate < ActiveRecord::Migration[5.1]
  def change
    add_column :candidates, :state, :integer, :default => Candidate::SUBMITTED_STATE, :null => false
  end

end
