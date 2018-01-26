class RemoveSkillDupIndex < ActiveRecord::Migration[5.1]
  def up
    remove_index :job_skills, [:job_id, :skill_id] 
    add_index :job_skills, [:job_id, :skill_id] # not unique
  end

  def down
    remove_index :job_skills, [:job_id, :skill_id]
    add_index :job_skills, [:job_id, :skill_id], unique: true
  end
end
