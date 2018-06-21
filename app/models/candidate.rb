class Candidate < ApplicationRecord
  include CandidateConcern

  belongs_to :job
  belongs_to :head

  has_one :recruiter, through: :head, class_name: 'User', source: :recruiter
  has_one :hirer, through: :job, source: :user, class_name: 'User'

  has_many :candidate_states, -> { order(:id) }
  has_many :messages

  has_many :candidate_uploads
  has_many :uploads, through: :candidate_uploads

  belongs_to :description, class_name: 'Message'

  STATE_NEW = 0
  STATE_REVIEWED = 50
  STATE_UNLOCKED = 100
  STATE_ENGAGED = 200
  STATE_OFFER = 300
  STATE_HIRED = 1000

  STATE_REJECTED = -100
  STATE_SPAM = -666
  STATE_RECALLED = -1000
  STATE_CANCELED = -5000

  #cache_notify :user # FIXME

  scope :isnew, -> { where(state: STATE_NEW) }
  scope :reviewed, -> { where(state: STATE_REVIEWED) }
  scope :unlocked, -> {  where(state: STATE_UNLOCKED) }
  scope :engaged, -> { where(state: STATE_ENGAGED) }
  scope :offer, -> { where(state: STATE_OFFER) }
  scope :hired, -> { where(state: STATE_HIRED) }

  scope :live, -> { where("state >= ? and state <= ?", STATE_NEW, STATE_HIRED) }

  scope :rejected, -> {  where(state: STATE_REJECTED) }
  scope :spam, -> { where(state: STATE_SPAM) }
  scope :recalled, -> { where(state: STATE_RECALLED) }
  scope :canceled, -> { where(state, STATE_CANCELED) }

  validates :job_id, presence: true
  validates :head_id, presence: true
  validates :commission, presence: true

  before_save :pre_save

  def pre_save
    if self.state >= STATE_UNLOCKED
      self.unlocked_at ||= Time.zone.now
    end
  end

  def to_s
    "#{job.id} => #{job.title} => #{head}"
  end

  def unlocked?
    !unlocked_at.nil?
  end


  def self.submit(head, job, commission, **kwargs)
    body = kwargs[:body]
    attachments = kwargs[:attachments] || []

    candidate = nil
    state = STATE_NEW

    puts "SUBMIT"

    Candidate.transaction do
      candidate = Candidate.find_or_create_unique(job_id: job.id, head_id: head.id)
      candidate.commission = commission if !candidate.commission || (commission.to_f < candidate.commission.to_f) # allow commission to be less
      candidate.state = state
      candidate.save!

      puts "GOT CANDIDATE"
      puts candidate.inspect

      recruiter = head.recruiter

      body = nil if body.blank?
      body ||= "New candidate for #{job.title}"
      puts "BODY IS #{body}"
    
      msg = nil 
      msg = Message.create!(candidate: candidate, user: candidate.hirer, from_user: recruiter, job_id: job.id, body: body)

      candidate.description = msg

      att_uploads = []
      attachments.each do |fid|
        upload = Upload.find(fid) # need to get the real id, not uuid
        att_uploads << CandidateUpload.find_or_create_unique(candidate_id: candidate.id, upload_id: upload.id) if upload
      end

      candidate.candidate_uploads = att_uploads

      candidate.save!
    
      #CandidateState.create!(candidate: candidate, 
        #state: candidate.state,
        #recruiter: recruiter,
        #message: msg)

       candidate.create_notify
    end

    return candidate
  end

  def setState(state, actor, body=nil)
    state = state.to_i

    Candidate.transaction do
      self.state = state
      self.unlocked_at = Time.zone.now if state >= STATE_UNLOCKED

      msg = nil
      if body
        recruiter = self.head.recruiter
        to_user = (actor.id == job.user_id) ? recruiter : job.user

        msg = self.messages.order("-id").first
        msg = msg.reply_from(actor) if msg
        msg ||= Message.create(candidate: self, user: to_user, from_user: actor, body: body)
      end
      
      CandidateState.create!(candidate: self,
        state: self.state,
        user: actor,
        message: msg)

      self.save!

      state_notify
    end

    return self
  end

  private

  def validate_next_state
    # do something here
  end


end
