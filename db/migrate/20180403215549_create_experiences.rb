class CreateExperiences < ActiveRecord::Migration[5.1]
  def change
    create_table :experiences do |t|
      t.timestamps
      t.timestamp :deleted_at
      t.integer :head_id, null: false

      t.string :place, null: false
      t.string :title
      t.integer :exp_type, null: false, default: 0
      t.integer :year_start, null: false
      t.integer :year_end
      t.text :description
    end

    add_index :experiences, :head_id

  end
end
