class User < ApplicationRecord
  include Pyr::Base::Model::User

  #make_authorized_by(:email)

  belongs_to :logo, class_name: "Upload", foreign_key: :upload_id

  has_many :jobs

  has_many :heads

  has_many :candidates, through: :jobs
  has_many :submitted_candidates, -> { where("candidates.state >= 0") }, through: :heads, source: :candidates, class_name: "Candidate"

  has_many :candidate_heads, through: :candidates, source: :head, class_name: "Head"
  has_many :candidate_jobs, through: :candidates, source: :job, class_name: "Job"
  has_many :recruiters, -> { group(:id) }, through: :candidate_heads, class_name: "User"

  has_many :spams
  has_many :spam_reports, foreign_key: :recruiter_id, class_name: "Spam"

  has_many :messages
  has_many :message_roots, -> { where("root_message_id is null") }, class_name: "Message"

  has_many :sent_messages, class_name: "Message", foreign_key: :from_user_id
  has_many :sent_message_roots, -> { where("root_message_id is null") }, foreign_key: :from_user_id, class_name: "Message"

  has_many :invites
  has_many :sent_invites, class_name: "Invite", foreign_key: :from_user_id

  has_one :setting

  has_one :company

  has_many :uploads

  has_many :reviews
  has_many :sent_reviews, class_name: "Review", foreign_key: :from_user_id

  before_create :on_before_create
  after_create :on_after_create

  scope :is_recruiter, -> { where(is_recruiter: true) }

  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :email, uniqueness: true # FIXME, this isn't good

  validates :password, format: { with: /\A(?=.*[a-zA-Z])(?=.*[0-9]).{8,}\z/, message: "must be at least 8 characters and include one number and one letter." }, unless: :password_is_nil?

  def after_cached
    self.score_cached(true)
    #self.thread_last_cached(true)
  end

  def self.after_cached_job(job)
    User.new(id: job.user_id).after_cached
  end

  def self.after_cached_head(head)
    User.new(id: head.user_id).after_cached
  end

  def self.after_cached_review(review)
    User.new(id: review.user_id).after_cached
  end

  def self.after_cached_recruiter(recruiter)
    User.new(id: recruiter.head).after_cached
  end

  def self.after_cached_candidate(candidate)
    candidate.recruiter.after_cached
    candidate.hirer.after_cached
  end

  def self.after_cached_message(message)
    User.new(id: message.from_user_id).after_cached
    User.new(id: message.user_id).after_cached
  end

  def self.after_cached_invite(invite)
    User.new(id: invite.user_id).after_cached
    User.new(id: invite.from_user_id).after_cached
  end

  ####

  def roots
    self.is_recruiter ? self.sent_message_roots : self.message_roots
  end

  def password_is_nil?
    password.nil?
  end

  def serializable_hash(options = nil) 
    super(options).merge(confirmed_at: confirmed_at, unconfirmed_email: unconfirmed_email)
  end

  def enough_info?
    return !self.first_name.blank? && !self.last_name.blank?
  end

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

  def all_for_ids(clear=false)
    messages_ids_cached + sent_messages_ids_cached
  end

  def all_for(clear=false)
    Message.find(all_for_ids(clear))
  end

  def thread_last(msg, clear=false)
    return msg if msg.root_message_id.nil?

    messages.where("root_message_id = ? or id = ?", msg.root_message_id, msg.root_message_id).order("-id").first
  end

  def self.is_recruiter
     where(is_recruiter: true)
  end

  def self.find_recruiter(id, clear=false)
    ux = User.find(id)
    ux = ux.is_recruiter ? ux : nil
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

  def score_cached(clear=false)
    key = 'scr'
    cache_fetch(key, force: clear) {
      reviews.average(:score) || 0
    }
  end

  def score
    score_cached
  end

  def after_cache
    #self.company.after_cached_user(self)
  end

  private

  def on_before_create
    self.jti = SecureRandom.uuid
  end

  def on_after_create
    create_setting
    create_company
  end

  def check_jti
    self.jti ||= SecureRandom.uuid
  end
end
