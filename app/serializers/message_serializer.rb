class MessageSerializer < ActiveModel::Serializer
  attributes :id,
    :body,
    :parent_message_id,
    :root_message_id,
    :job_id,
    :candidate,
    :user,
    :from_user,
    :created_at,
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

  def created_at
    object.created_at.in_time_zone.iso8601 if object.created_at
  end

  def updated_at
    object.updated_at.in_time_zone.iso8601 if object.created_at
  end


  def body 
    return Pyr::Base::Util::String.emojify(object.body)
  end

  def user
    result = nil
    u = User.find(object.user_id)
    result = { 
      id: u.hashid,
      first_name: u.first_name,
      last_name: u.last_name
    }
    return result
  end

  def from_user
    result = nil
    u = User.find(object.from_user_id)
    result = { 
      id: u.hashid,
      first_name: u.first_name,
      last_name: u.last_name
    }
    return result
  end

  def candidate
    result = nil
    if object.candidate_id
      candy = Candidate.find(object.candidate_id)
      head = candy.head
      result = { 
        id: candy.id,
        first_name: head.first_name,
        last_name: head.last_name
      }
    end
    return result
  end

  def attributes(*args)
    hash = super
    if instance_options[:thread]
      hash[:thread] = ActiveModel::Serializer::CollectionSerializer.new(object.thread)
    end
    hash
  end

end
