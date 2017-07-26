class MessageSerializer < ActiveModel::Serializer
  attributes :id,
    :title,
    :body,
    :parent_message_id,
    :root_message_id,
    :thread_count,
    :job_id

  def thread_count
    object.thread.count()
  end
end
