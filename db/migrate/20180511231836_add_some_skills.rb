class AddSomeSkills < ActiveRecord::Migration[5.1]
  def up
    path = Rails.root.join('db', 'data', 'skills.txt')

    File.open(path).each do |l|
      l = l.strip

      puts l

      Skill.get_skill(l)
    end
  end

  def down
  end
end
