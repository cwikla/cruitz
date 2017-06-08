class CreateJobs < ActiveRecord::Migration[5.0]
  def change
    create_table :jobs do |t|
      t.timestamps
      t.timestamp :deleted_at 

      t.integer :employer_id, :null => false

      t.text :title, :null => false
      t.text :description, :null => false
    end

    add_index :jobs, [:employer_id]
  end
end
