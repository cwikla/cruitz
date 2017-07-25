class MessageSerializer < ActiveModel::Serializer
  attributes :id,
    :title,
    :body,
    :parent_message_id,
    :root_message_id,
    :thread_count

  def thread_count
    object.thread.count()
  end
end
