class Message < ApplicationRecord
  cached_belongs_to :user
  cached_belongs_to :from_user, :class_name => 'User'
  cached_belongs_to :job
  cached_belongs_to :candidate

  cached_belongs_to :root_message, :class_name => 'Message'
  cached_belongs_to :parent_message, :class_name => 'Message'

  before_create :on_before_create

  validates :user_id, presence: true
  validates :from_user_id, presence: true
  validates :job_id, presence: true

  def after_cached_message(msg)
    msg.root_message_cached(true)
    msg.parent_message_cached(true)
    msg.thread_ids_cached(true)
    msg.thread_last_cached(true)
    threads_for_candidate_ids(self.candidate_id, true) if self.candidate_id
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

  def thread_last_id_cached(clear=false)
    return self if self.root_message_id.nil?

    key = "tlast_#{self.root_message_id}"
    cache_fetch(key, force: clear) {
      obj = messages.where("root_message_id = ? or id = ?", self.root_message_id, self.root_message_id).order("-id").first
      obj ? obj.id : id
    }
  end

  def thread_last
    @the_thread_last ||= thread_last_id_cached
  end

  def thread_ids_cached(clear=false)
    rid = self.root_message_id ? self.root_message_id : self.id

    key="thids_#{rid}"
    cache_fetch(key, force: clear) {
      Message.where(root_message_id: rid).or(Message.where(id: rid)).order(:id).pluck(:id)
    }
  end

  def thread(clear=false)
    @the_thread ||= Message.find_safe(thread_ids_cached(clear))
  end

  def thread_count
    thread_ids_cached.count
  end

  def self.threads_for_candidate_ids_cached(candidate, clear=false)
    cid = candidate.respond_to?(:id) ? candidate.id : candidate

    key="cand_thid"
    cache_fetch(key, force: clear) {
      Message.where(candidate_id: cid).order(:id).pluck(:id)
    }
  end

  def good(uid)
    return message.user_id == uid || message.from_user_id == uid
  end

  def self.threads_for_candidate(candidate)
    Message.find(threads_for_candidate_ids_cached(candidate))
  end

  def after_cache
    threads_for_candidate_ids(self.candidate_id, true) if self.candidate_id
    threads_ids(clear)
    thread_last(clear)
  end

    private

    def on_before_create
      if !self.title
        self.title = self.parent_message.title if self.parent_message_id
        self.title ||= "(No Subject)"
      end

    end
end
