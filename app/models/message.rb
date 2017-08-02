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

  def self.all_for(user)
    Message.where("user_id = ? or from_user_id = ?", user.id, user.id)
  end

  def self.for(user, mid)
    message = all_for(user).where(:id => mid).first
    return message
  end

  def self.thread_for_message(message)
    if message.root_message_id
      q = Message.where(root_message_id: message.root_message_id).or(Message.where(id: message.root_message_id))
    else
      q = Message.where(root_message_id: message.id).or(Message.where(id: message.id))
    end

    return q.order(:id)
  end

  def self.thread_for_candidate(candidate)
    Message.where(candidate_id: candidate.id).order(:id)
  end

  def self.compress(messages)
    all = []
    roots = {}

    messages.each do |x|
      key = x.root_message_id || x.id
      roots[key] ||= x
      roots[key] = x if roots[key].id < x.id
    end

    all = roots.values()
    all = all.sort_by(&:id)

    return all
  end

  def thread()
    self.class.thread_for_message(self)
  end

    private

    def on_before_create
      if !self.title
        self.title = self.parent_message.title if self.parent_message_id
        self.title ||= "(No Subject)"
      end

    end
end
