class MessageSerializer < ActiveModel::Serializer
  attributes :id,
    :title,
    :body,
    :parent_message_id,
    :root_message_id,
    :thread_count,
    :job_id,
    :candidate,
    :user,
    :from_user,
    :created_at,
    :updated_at,
    :read_at

  def id
    object.hashid
  end

  def parent_message_id
    object.parent_message_id ? object.parent_message.hashid : nil
  end

  def root_message_id
    object.root_message_id ? object.root_message.hashid : nil
  end

  def job_id
    object.job.hashid
  end

  def created_at
    object.created_at.in_time_zone.iso8601 if object.created_at
  end

  def updated_at
    object.updated_at.in_time_zone.iso8601 if object.created_at
  end

  def thread_count
    object.thread.count()
  end


  def body 
    return Pyr::Base::Util::String.emojify(object.body)
  end

  def user
    result = nil
    if object.user
      u = object.user
      result = { 
        id: u.hashid,
        first_name: u.first_name,
        last_name: u.last_name
      }
    end
    return result
  end

  def from_user
    result = nil
    if object.from_user
      u = object.from_user
      result = { 
        id: u.hashid,
        first_name: u.first_name,
        last_name: u.last_name
      }
    end
    return result
  end

  def candidate
    result = nil
    if object.candidate
      candy = object.candidate
      result = { 
        id: candy.head.hashid,
        first_name: candy.head.first_name,
        last_name: candy.head.last_name
      }
    end
    return result
  end
end
