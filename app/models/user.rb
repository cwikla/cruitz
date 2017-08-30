class User < ApplicationRecord
  include Pyr::Base::Model::User

  #make_authorized_by(:email)

  before_create :check_jti
  after_create :on_after_create

  has_many :jobs
  has_many :heads
  has_many :messages
  has_many :sent_messages, class_name: "Message", foreign_key: :from_user_id
  has_many :candidates, through: :jobs

  has_many :candidate_heads, through: :candidates, source: :head
  has_many :recruiters, -> { group(:id) }, through: :candidate_heads

  scope :is_recruiter, -> { where(is_recruiter: true) }

  belongs_to :company

  def new_candidates
    candidates.isnew
  end

  def accepted_candidates
    candidates.accepted
  end

  def rejected_candidates
    candidates.rejected
  end

  def live_candidates
    candidates.live
  end

  def candidate_counts
    results = jobs.pluck(:id, :title)
    results.map { |jid|
      j = Job.find(jid[0])
      [jid[0], jid[1], j.candidates.isnew.count, j.candidates.live.count]
    }
  end

  def find_message(x)
    find_safe(x).where("user_id = ? or from_user_id = ?", self.id, self.id)
  end

  def self.is_recruiter
     where(is_recruiter: true)
  end

  def ui_identifier
    return first_name if first_name
    return username if username
    return email
  end

  def full_name
    return "#{first_name} #{last_name}"
  end

  def jwt_payload
    {:uuid => self.uuid}
  end

  private

  def on_after_create
    #self.build_employer
  end

  def check_jti
    self.jti ||= SecureRandom.uuid
  end
end
