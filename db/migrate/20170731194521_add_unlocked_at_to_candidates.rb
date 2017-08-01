class AddUnlockedAtToCandidates < ActiveRecord::Migration[5.1]
  def change
    add_column :candidates, :unlocked_at, :timestamp
  end
end
