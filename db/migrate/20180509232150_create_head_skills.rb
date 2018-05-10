class CreateHeadSkills < ActiveRecord::Migration[5.1]
  def change
    create_table :head_skills do |t|
      t.timestamps
      t.timestamp :deleted_at
      t.integer :head_id, null: false
      t.integer :skill_id, null: false
    end

    add_index :head_skills, :head_id
    add_index :head_skills, :skill_id
  end
end
