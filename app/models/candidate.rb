class Candidate < ApplicationRecord
  belongs_to :job
  belongs_to :head

  has_one :recruiter, through: :head, class_name: 'User', source: :recruiter
  has_one :hirer, through: :job, source: :user, class_name: 'User'

  has_many :states, class_name: "CandidateState"
  has_many :messages

  has_many :candidate_uploads
  has_many :uploads, through: :candidate_uploads

  belongs_to :description, class_name: 'Message'

  STATE_NEW = 0
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
  scope :unlocked, -> {  where(state: STATE_UNLOCKED) }
  scope :engaged, -> { where(state: STATE_ENGAGED) }
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
    if self.state > STATE_NEW
      self.unlocked_at ||= Time.zone.now
    end
  end

  def to_s
    "#{job.id} => #{job.title} => #{head}"
  end

  def unlocked?
    !unlocked_at.nil?
  end


  def self.submit(head, job, commission, body=nil)

    candidate = nil
    state = STATE_NEW

    puts "SUBMIT"

    Candidate.transaction do
      candidate = Candidate.find_or_create_unique(job: job, head: head, commission: commission, state: state)
      candidate.commission = commission if !candidate.commission || (commission.to_f < candidate.commission.to_f) # allow commission to be less
      candidate.state = state
      candidate.save!

      puts "GOT CANDIDATE"
      puts candidate.inspect

      recruiter = head.recruiter

      body ||= "New candidate #{head.full_name}"
    
      msg = nil 
      msg = Message.create!(candidate: candidate, user: candidate.hirer, from_user: recruiter, job: job, body: body) if body

      candidate.description = msg
      candidate.save!
    
      #CandidateState.create!(candidate: candidate, 
        #state: candidate.state,
        #recruiter: recruiter,
        #message: msg)
    end

    return candidate
  end

  def unlock(body=nil)
    setState(self.hirer, STATE_UNLOCKED, body)
  end

  def engage(body=nil)
    setState(self.hirer, STATE_ENGAGED, body)
  end

  def reject(body=nil)
    setState(self.hirer, STATE_REJECTED, body)
  end

  def spam(body=nil)
    setState(self.hirer, STATE_SPAM, body)
  end

  def offer(salary, body=nil)
    setState(self.hirer, STATE_OFFER, body)
  end

  def hire(salary, body=nil) # FIXME
    setState(self.hirer, STATE_HIRED, body)
  end

  def recall(body=nil)
    setState(self.hirer, STATE_RECALLED, body)
  end

  def cancel(body=nil)
    setState(self.recruiter, STATE_CANCELED, body)
  end

  private

  def setState(actor, state, body=nil)
    Candidate.transaction do
      self.state = state
      self.unlocked_at = Time.zone.now if state > STATE_NEW

      self.save!

      msg = nil
      if body
        recruiter = self.head.recruiter
        to_user = (actor.id == job.user_id) ? recruiter : job.user

        msg = self.messages.order("-id").first
        msg = msg.reply_from(actor) if msg
        msg ||= Message.create(candidate: self, user: to_user, from_user: actor, body: body)
      end
      
      #CandidateState.create(candidate: self,
        #state: self.state,
        #recruiter: recruiter,
        #message: msg)
    end

    return self
  end

end
