class AddCommissionToCandidates < ActiveRecord::Migration[5.1]
  def change
    add_column :candidates, :commission, :decimal, :precision => 5, :scale => 2, :default => 20

    Candidate.reset_column_information

    change_column :candidates, :commission, :decimal, precision: 5, scale: 2, default: nil, null: false

  end
end
