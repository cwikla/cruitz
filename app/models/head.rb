class Head < ApplicationRecord
  belongs_to :recruiter, :class_name => "User", foreign_key: :user_id
  has_many :candidates
  has_many :jobs, through: :candidates

  has_many :experiences, index_errors: true
  accepts_nested_attributes_for :experiences

  has_many :educations, index_errors: true
  accepts_nested_attributes_for :educations

  #has_many :educations, -> { where(exp_type: Experience::EXP_TYPE_SCHOOL) }, class_name: "Experience"
  #has_many :works, -> { where(exp_type: Experience::EXP_TYPE_COMPANY) }, class_name: "Experience"

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
  validates :phone_number, presence: true,  valid_phone_number: true

  validates :email, presence: true, valid_email: true

  before_save :on_before_save

  def self.after_cached_candidate(candidate)
    h = Head.new(:id => candidate.head_id)
  end

  def on_before_save
    phone_number_on_before_save
    self.email = self.email.downcase if self.email
  end

  def full_name
    return "#{first_name} #{last_name}"
  end

  def to_s
    "#{self.first_name} #{self.last_name}"
  end

  def current_exp(items)
    items.max_by { |e| e.year_end || Time.zone.now.year }
  end

  def best_summary_item
    all = []
    exp = current_exp(experiences) if experiences
    edu = current_exp(educations) if educations

    all << exp if exp
    all << edu if edu
    return current_exp(all) if all.length > 0
    return nil
  end

  def summary
    # FIXME find latest - or just tag one as headline? Or add a summary? Hmmm....
    obj = experiences ? experiences : educations
    #t = obj.select(:title, :place).first

    t = best_summary_item
    return "#{t.title} @ #{t.place}" if t 

    return nil
  end

  def add_skill(skill)
    return HeadSkill.find_or_create_unique(head: self, skill: skill)
  end

  def self.submit(user, params) 
    head = nil

    Head.transaction do
      head = Head.where(user_id: user.id).find_safe(params[:id]) if params[:id]

      puts "GOT HEAD #{head.inspect}"

      hid = params.delete(:id)
      experiences = params.delete(:experiences) || {}
      educations = params.delete(:educations) || {}
      skill_names = params.delete(:skills) || []
      file_ids = params.delete(:uploads) || []

      puts "HEAD PARMS"
      puts params.inspect

      head ||= Head.new(params)
      head.recruiter = user

      exp_keys = experiences.keys()

      new_exps = exp_keys.map do |k|
        exp = experiences[k]
        exp.delete(:id) # just in cases?
        Experience.new(exp)
      end

      puts new_exps.inspect

      edu_keys = educations.keys()

      new_edus = edu_keys.map do |k|
        edu = educations[k]
        edu.delete(:id) # just in cases?
        Education.new(edu)
      end

      puts new_edus.inspect

      head.experiences = new_exps
      head.educations = new_edus

      #puts "CURRENT HEAD ERRORS"
      #head.valid?
      #puts head.errors.inspect

      return head if !head.save

      skills = []
      skills = Skill.get_skill(*skill_names) if !skill_names.blank?

      hs = []
      skills.each do |skill|
        hs << HeadSkill.find_or_create_unique(head_id: head.id, skill: skill)
      end

      head.head_skills = hs

      # FIXME PERMISSIONS
      head_uploads = []
      file_ids.each do |fid|
        upload = Upload.find(fid) # need to get the real id, not uuid
        head_uploads << HeadUpload.find_or_create_unique(head_id: head.id, upload_id: upload.id) if upload
      end

      head.head_uploads = head_uploads
      head.save

    end

    return head
  end

end
