class AddDescriptionIdToCandidate < ActiveRecord::Migration[5.1]
  def change
    add_column :candidates, :description_id, :integer

    add_index :candidates, :description_id
  end
end
