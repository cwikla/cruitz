class Skill < ApplicationRecord
  has_many :job_skills
  has_many :jobs, through: :job_skills

  validates :name, presence: true

  before_save :pre_save

  def pre_save
    self.name = self.name.downcase
  end

  def self.get_skill(*names)
    names.map { |x|
      x = x.strip.downcase
      Skill.find_or_create_unique(:name => x)
    }
  end

end
