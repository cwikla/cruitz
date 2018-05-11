class UniqueHeadSkills < ActiveRecord::Migration[5.1]
  def change
    add_index :head_skills, [:head_id, :skill_id], unique: true
  end

end
