class User < ApplicationRecord
  include Pyr::Base::Model::User

  #make_authorized_by(:email)

  cached_has_many :jobs

  cached_has_many :heads

  cached_has_many :candidates, through: :jobs
  cached_has_many :candidate_heads, through: :candidates, source: :head, class_name: "Head"
  cached_has_many :recruiters, -> { group(:id) }, through: :candidate_heads, class_name: "User"

  cached_has_many :messages
  cached_has_many :roots, -> { where("root_message_id is null") }, class_name: "Message"
  cached_has_many :sent_messages, class_name: "Message", foreign_key: :from_user_id

  cached_has_many :invites
  cached_has_many :sent_invites, class_name: "Invite", foreign_key: :from_user_id

  cached_has_one :setting

  cached_belongs_to :company


  before_create :on_before_create
  after_create :on_after_create

  scope :is_recruiter, -> { where(is_recruiter: true) }

  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :email, uniqueness: true # FIXME, this isn't good

  def self.after_cached_job(job)
    u = User.new(:id => job.user_id)
    u.jobs_uncache
    u.candidates_uncache
    u.candidate_counts_cached(true)
  end

  def self.after_cached_head(head)
    u = User.new(:id => head.user_id)
    u.heads_uncache
    u.candidates_uncache
    u.candidate_heads_uncache
    u.recruiters_uncache
  end

  def self.after_cached_recruiter(recruiter)
    u = User.new(:id => recruiter.head)
  end

  def self.after_cached_candidate(candidate)
    candidate.recruiter.candidates_uncache
    candidate.recruiter.heads_uncache

    candidate.hirer.candidates_uncache
    candidate.hirer.candidate_heads_uncache
    candidate.hirer.candidate_counts_cached(true)
  end

  def self.after_cached_message(message)
    from = User.new(:id => message.from_user_id)
    user = User.new(:id => message.user_id)

    user.messages_uncache

    from.roots_uncache
    user.roots_uncache
    
    from.sent_messages_uncache

    user.thread_last_cached(message, true)
    from.thread_last_cached(message, true)
  end

  def self.after_cached_invite(invite)
    u = User.new(:id => invite.user_id)
    u.invites_uncache

    iu = User.new(:id => invite.from_user_id)
    iu.sent_invites_uncache
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

  def candidate_counts_cached(clear=false) # FIXME
    #candidates.group(:state).count
    named_cache_fetch(:can_counts, :delete=>clear) {
      results = jobs.pluck(:id, :title)
      results.map { |jid|
        j = Job.find(jid[0])
        [jid[0], jid[1], j.candidates.isnew.count, j.candidates.live.count]
      }
    }
  end

  def all_for_ids(clear=false)
    messages_ids_cached + sent_messages_ids_cached
  end

  def all_for(clear=false)
    Message.find(all_for_ids(clear))
  end

  def thread_last_cached(msg, clear=false)
    return msg if msg.root_parent_id.nil?

    key = "tlast_#{msg.root_parent_id}"
    cache_fetch(key, delete: clear) {
      messages.where("root_parent_id = ? or id = ?", msg.root_parent_id, msg.root_parent_id).order("-id").first
    }
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

  def after_cache
    #self.company.after_cached_user(self)
  end

  private

  def on_before_create
    self.jti = SecureRandom.uuid
  end

  def on_after_create
    create_setting
  end

  def check_jti
    self.jti ||= SecureRandom.uuid
  end
end
