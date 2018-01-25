class CreateJobSkills < ActiveRecord::Migration[5.1]
  def change
    create_table :job_skills do |t|
      t.timestamps
      t.timestamp :deleted_at

      t.integer :job_id, null: false
      t.integer :skill_id, null: false
    end

    add_index :job_skills, [:job_id, :skill_id], unique: true
  end
end
