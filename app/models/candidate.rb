class Candidate < ApplicationRecord
  belongs_to :job
  belongs_to :head
  has_one :recruiter, through: :head, class_name: 'User'
  has_many :states
  has_many :messages

  scope :isnew, -> { where(accepted_at: nil).where(rejected_at: nil) }
  scope :accepted, -> {  where.not(accepted_at: nil).where(rejected_at: nil) }
  scope :rejected, -> {  where.not(rejected_at: nil) }
  scope :live, -> { where(rejected_at: nil) }

  SUBMITTED_STATE = "Submitted"
  ACCEPTED_STATE = "Accepted"
  REJECTED_STATE = "Rejected"
  PRECALL_STATE = "Precall"
  ONSITE_STATE = "OnSite"
  CHECKS_STATE = "Checking"
  HIRE_STATE = "Hired"
  RECALL_STATE = "Recalled"
  CANCEL_STATE = "Canceled"

  def to_s
    "#{job.id} => #{job.title} => #{head}"
  end

  def submit(job, msg)
  end

  def accept(msg)
  end

  def reject(msg)
  end

  def spam(msg)
  end

  def precall(msg)
  end

  def onsite(msg)
  end

  def checks(msg)
  end

  def hire(salary, msg)
  end

  def recall(msg)
  end

  def cancel(msg)
  end

  def state
  end
  

end
