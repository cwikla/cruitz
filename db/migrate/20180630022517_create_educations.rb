class CreateEducations < ActiveRecord::Migration[5.1]
  def change
    create_table :educations do |t|
      t.timestamps
      t.timestamp :deleted_at
      t.integer :head_id, null: false

      t.string :place, null: false
      t.string :title
      t.integer :exp_type, null: false, default: 1
      t.integer :year_start, null: false
      t.integer :year_end
      t.text :description
    end

    add_index :educations, :head_id
  end

end
