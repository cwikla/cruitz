class CreateCandidates < ActiveRecord::Migration[5.0]
  def change
    create_table :candidates do |t|
      t.timestamps
      t.timestamp :deleted_at

      t.integer :head_id, :null => false
      t.integer :position_id, :null => false
    end

    add_index :candidates, [:head_id]
    add_index :candidates, [:position_id]
  end
end
