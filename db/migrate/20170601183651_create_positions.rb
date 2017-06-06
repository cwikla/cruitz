class CreatePositions < ActiveRecord::Migration[5.0]
  def change
    create_table :positions do |t|
      t.timestamps
      t.timestamp :deleted_at 

      t.integer :employer_id, :null => false

      t.text :title, :null => false
      t.text :description, :null => false
    end

    add_index :positions, [:employer_id]
  end
end
