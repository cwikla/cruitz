class Skill < ApplicationRecord
  has_many :job_skills
  has_many :jobs, through: :job_skills

  validates :name, presence: true

  def self.get_skill(*names)
    names.map { |x|
      Skill.find_or_create_unique(:name => x.downcase)
    }
  end

end
