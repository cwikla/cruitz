class Candidate < ApplicationRecord
  belongs_to :job
  belongs_to :head

  has_one :recruiter, through: :head, class_name: 'User', source: :user
  has_one :hirer, through: :job, source: :user, class_name: 'User'

  has_many :states, class_name: "CandidateState"
  has_many :messages

  SUBMITTED_STATE = 0
  ACCEPTED_STATE = 100
  REJECTED_STATE = -100
  PRECALL_STATE = 200
  ONSITE_STATE = 300
  CHECKS_STATE = 400
  HIRE_STATE = 1000
  SPAM_STATE = -666
  RECALL_STATE = -1000
  CANCEL_STATE = -5000

  cache_notify :user

  scope :isnew, -> { where(state: SUBMITTED_STATE) }
  scope :accepted, -> {  where(state: ACCEPTED_STATE) }
  scope :rejected, -> {  where(state: REJECTED_STATE) }
  scope :live, -> { where("state >= ? and state <= ?", SUBMITTED_STATE, HIRE_STATE) }

  validates :job_id, presence: true
  validates :head_id, presence: true
  validates :commission, presence: true

  def self.after_cached_candidate_state(state)
    c = Candidate.new(:id => state.candidate_id)
  end

  def after_destroy_cached
  end

  def self.after_cached_message(message)
    return if !message.candidate_id

    c = Candidate.new(:id => message.candidate_id)
  end

  def to_s
    "#{job.id} => #{job.title} => #{head}"
  end

  def self.submit(head, job, commission, body=nil)

    candidate = nil
    state = SUBMITTED_STATE

    puts "SUBMIT"

    Candidate.transaction do
      candidate = Candidate.find_or_create_unique(job: job, head: head, commission: commission, state: state)
      candidate.commission = commission if !candidate.commission || (commission.to_f < candidate.commission.to_f) # allow commission to be less
      candidate.state = state
      candidate.save!

      puts "GOT CANDIDATE"
      puts candidate.inspect

      recruiter = head.user
    
      msg = nil 
      msg = Message.create!(candidate: candidate, user: candidate.hirer, from_user: recruiter, job: job, body: body) if body
    
      #CandidateState.create!(candidate: candidate, 
        #state: candidate.state,
        #recruiter: recruiter,
        #message: msg)
    end

    return candidate
  end

  def accept(body)
    setState(self.hirer, ACCEPTED_STATE, body)
  end

  def reject(body)
    setState(self.hirer, REJECTED_STATE, body)
  end

  def spam(body)
    setState(self.hirer, SPAM_STATE, body)
  end

  def precall(body)
    setState(self.hirer, PRECALL_STATE, body)
  end

  def onsite(body)
    setState(self.hirer, ONSITE_STATE, body)
  end

  def checks(body)
    setState(self.hirer, CHECKS_STATE, body)
  end

  def hire(salary, body) # FIXME
    setState(self.hirer, HIRE_STATE, body)
  end

  def recall(body)
    setState(self.hirer, RECALL_STATE, body)
  end

  def cancel(body)
    setState(self.recruiter, CANCEL_STATE, body)
  end

  private

  def setState(actor, state, body)
    Candidate.transaction do
      recruiter = self.head.recruiter
      self.state = state
      self.save

      to_user = (actor.id == job.user_id) ? recruiter : job.user

      msg = nil
      if body
        msg = self.messages.order("-id").first
        msg = msg.reply_from(actor) if msg
        msg ||= Message.create(candidate: self, user: to_user, from_user: actor, body: body)
      end
      
      CandidateState.create(candidate: self,
        state: self.state,
        recruiter: recruiter,
        message: msg)
    end

    return self
  end

end
