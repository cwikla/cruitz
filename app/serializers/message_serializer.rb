class MessageSerializer < ActiveModel::Serializer
  attributes :id,
    :title,
    :body,
    :parent_message_id,
    :root_message_id,
    :thread_count,
    :job_id,
    :user_id,
    :from_user_id,
    :candidate

  def thread_count
    object.thread.count()
  end

  def candidate
    result = nil
    if object.candidate
      candy = object.candidate
      result = { 
        first_name: candy.head.first_name,
        last_name: candy.head.last_name
      }
    end
    return result
  end
end
