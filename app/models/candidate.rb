class Candidate < ApplicationRecord
  belongs_to :job
  belongs_to :head

  has_one :recruiter, through: :head, class_name: 'User'
  has_one :hirer, through: :job, source: :user, class_name: 'User'

  has_many :states, class_name: "CandidateState"
  has_many :messages

  cache_notify :user

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

  scope :isnew, -> { where(state: SUBMITTED_STATE) }
  scope :accepted, -> {  where(state: ACCEPTED_STATE) }
  scope :rejected, -> {  where(state: REJECTED_STATE) }
  scope :live, -> { where("state >= ? and state <= ?", SUBMITTED_STATE, HIRE_STATE) }

  def self.after_cached_candidate_state(state)
    c = Candidate.new(:id => state.candidate_id)
  end

  def self.after_cached_message(message)
    return if !message.candidate_id

    c = Candidate.new(:id => message.candidate_id)
  end

  def to_s
    "#{job.id} => #{job.title} => #{head}"
  end

  def self.submit(head, job, body=nil)
    candidate = nil
    state = SUBMITTED_STATE

    Candidate.transaction do
      recruiter = head.recruiter
      candidate = Candidate.create(job: job, head: head, state: state)
    
      msg = nil 
      msg = Message.create(candidate: candidate, user: candidate.hirer, from_user: recruiter, body: body) if body
    
      CandidateState.create(candidate: candidate, 
        state: candidate.state,
        recruiter: recruiter,
        message: msg)
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
