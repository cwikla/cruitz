class Message < ApplicationRecord
  acts_as_simple_cache
  acts_as_paranoid

  belongs_to :user
  belongs_to :from_user, :class_name => 'User'
  belongs_to :job
  belongs_to :candidate

  belongs_to :root_message, :class_name => 'Message'
  belongs_to :parent_message, :class_name => 'Message'

  before_create :on_before_create

  validates :user_id, presence: true
  validates :from_user_id, presence: true
  validates :job_id, presence: true

  def reply_from(from_user)
    to_user_id = (from_user.id == self.user_id ? self.from_user_id : self.user_id)
    Message.new(
      root_message_id: self.root_message_id || self.id,
      job_id: self.job_id,
      candidate_id: self.candidate_id,
      parent_message_id: self.id,
      user_id: to_user_id,
      from_user_id: from_user.id
    )
  end

  def self.thread_for_message(message)
    Message.where(id: message.root_message_id).or(Message.where(root_message_id: message.root_message_id)).order(:id)
  end

  def self.thread_for_candidate(candidate)
    Message.where(candidate_id: candidate.id).order(:id)
  end

    private

    def on_before_create
      if !self.title
        self.title = "RE: " + self.parent_message.title if self.parent_message_id
        self.title ||= "(No Subject)"
      end

    end
end
