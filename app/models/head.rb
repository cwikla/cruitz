class Head < ApplicationRecord
  belongs_to :recruiter, :class_name => "User", foreign_key: :user_id
  has_many :candidates
  has_many :jobs, through: :candidates

  has_many :experiences

  has_many :educations, -> { where(exp_type: Experience::EXP_TYPE_SCHOOL) }, class_name: "Experience"
  has_many :works, -> { where(exp_type: Experience::EXP_TYPE_COMPANY) }, class_name: "Experience"

  has_many :head_uploads
  has_many :uploads, through: :head_uploads

  has_many :head_locations
  has_many :locations, through: :head_locations

  has_many :head_links
  has_many :links, through: :head_links

  has_many :head_skills
  has_many :skills, through: :head_skills

  cache_notify :user
 
  validates :first_name, presence: true 
  validates :last_name, presence: true
  validates :phone_number, presence: true,  format: { with: /(\d{3}-)?\d{3}-\d{4}/ }
  #validates :email #hmmm, presence: true

  validates :email, format: { with: /\A[^@\s]+@([^@\s]+\.)+[^@\s]+\z/ }

  before_save :pre_save

  def self.after_cached_candidate(candidate)
    h = Head.new(:id => candidate.head_id)
  end

  def pre_save
    self.email = self.email.downcase if self.email
  end

  def full_name
    return "#{first_name} #{last_name}"
  end

  def to_s
    "#{self.first_name} #{self.last_name}"
  end

  def summary
    t = experiences.select(:title, :place).first
    return "#{t.title} @ #{t.place}" if t
    return nil
  end

  def add_skill(skill)
    return HeadSkill.find_or_create_unique(head: self, skill: skill)
  end

end
