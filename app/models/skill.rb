class Skill < ApplicationRecord
  has_many :job_skills
  has_many :jobs, through: :job_skills

  validates :name, presence: true

  def self.get_skill(*names)
    puts "GET SKILL"
    puts names.inspect

    names.map { |x|
      puts "GET A SKILL #{x}"
      Skill.find_or_create_unique(:name => x)
    }
  end
end
