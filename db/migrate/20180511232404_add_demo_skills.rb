class AddDemoSkills < ActiveRecord::Migration[5.1]
  def up
    skills = Skill.all

    Head.find_each do |h|
      puts h.full_name
      sk = []
      (0..rand(10)).each do 
        h.add_skill(skills[rand(skills.length)])
      end
    
      h.save
    end

  end

  def down
    # nothing to see here
  end
end
