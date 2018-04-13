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
    puts "AFTER MESSAGE CACHED MESSAGE => #{self.id}"
    #self.thread_ids_cached(true)
    #self.thread_last_cached(true)

    #Message.new(id: self.parent_message_id).after_cached if self.parent_message_id
    Message.new(id: self.root_message_id).after_cached if self.root_message_id
  end

  def reply_from(from_user)
    to_user_id = (from_user.id == self.user_id ? self.from_user_id : self.user_id)

    pid = self.thread_last_id

    Message.new(
      root_message_id: self.root_message_id || self.id,
      job_id: self.job_id,
      candidate_id: self.candidate_id,
      parent_message_id: pid,
      user_id: to_user_id,
      from_user_id: from_user.id
    )
  end

  def thread_last_id
    rid = self.root_message_id ? self.root_message_id : self.id 
    tl = self.class.where(root_message_id: rid).select("id").order("-id").first
    tl ? tl.id : rid
  end

  def thread_last
    tid = thread_last_id
    tid != self.root_message_id ? self.class.find(tid) : self 
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

# cache these
  def thread_ids
    rid = self.root_message_id ? self.root_message_id : self.id

    Message.where(root_message_id: rid).or(Message.where(id: rid)).select(:id).order(:id).pluck(:id)
  end

  def thread(clear=false)
    rid = self.root_message_id ? self.root_message_id : self.id
    Message.where(root_message_id: rid).or(Message.where(id: rid)).order(:id)
  end

  def thread_count
    thread_ids.count
  end

  def good(uid)
    return message.user_id == uid || message.from_user_id == uid
  end

  def self.threads_for_candidate(candidate)
    Message.where(candidate_id: candidate.id).order(:id)
  end

  def self.threads_for(user)
    Message.where(root_message_id: nil).where("user_id = ? or from_user_id = ?", user.id, user.id);
  end

    private

    def on_before_create
      if !self.title
        self.title = self.parent_message.title if self.parent_message_id
        self.title ||= "(No Subject)"
      end

    end
end
