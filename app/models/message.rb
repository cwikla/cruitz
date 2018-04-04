class Message < ApplicationRecord
  belongs_to :user
  belongs_to :from_user, :class_name => 'User'
  belongs_to :job
  belongs_to :candidate

  belongs_to :root_message, :class_name => 'Message'
  belongs_to :parent_message, :class_name => 'Message'

  cache_notify :user

  before_create :on_before_create

  validates :user_id, presence: true
  validates :from_user_id, presence: true
  validates :job_id, presence: true
  validates :candidate, presence: true

  def after_cached
    puts "AFTER MESSAGE CACHED MESSAGE"
    self.thread_ids_cached(true)
    self.thread_last_cached(true)

    Message.new(id: self.parent_message_id).after_cached if self.parent_message_id
    Message.new(id: self.root_message_id).after_cached if self.root_message_id
  end

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

  def thread_last_cached(clear=false)
    return self if self.root_message_id.nil?

    key = "tlast_#{self.root_message_id}"
    cache_fetch(key, force: clear) {
      Message.where("root_message_id = ? or id = ?", self.root_message_id, self.root_message_id).order("-id").first
    }
  end

  def thread_last
    thread_last_cached
  end

  def self.find_for(user, mid)
    message = self.find(mid)
    return nil if message.user_id != user.id && message.from_user_id != user.id
    return message
  end

  def self.last_for(user, mid)
    message = self.find_for(user, mid)
    return nil if message.nil?

    return message.thread_last
  end

  def thread_ids_cached(clear=false)
    rid = self.root_message_id ? self.root_message_id : self.id

    key="thids_#{rid}"
    cache_fetch(key, force: clear) {
      Message.where(root_message_id: rid).or(Message.where(id: rid)).order(:id).pluck(:id)
    }
  end

  def thread(clear=false)
    Message.find_safe(thread_ids_cached(clear))
  end

  def thread_count
    thread_ids_cached.count
  end

  def good(uid)
    return message.user_id == uid || message.from_user_id == uid
  end

  def self.threads_for_candidate(candidate)
    Message.where(candidate_id: candidate.id).order(:id)
  end

    private

    def on_before_create
      if !self.title
        self.title = self.parent_message.title if self.parent_message_id
        self.title ||= "(No Subject)"
      end

    end
end
