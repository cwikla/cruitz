class MessageSerializer < BaseSerializer
  attributes :id,
    :body,
    #:parent_message_id,
    #:root_message_id,
    :job_id,
    #:candidate,
    #:user_id,
    #:from_user_id,
    :created_at,
    :read_at,
    #:job
    :mine

    #belongs_to :job

  def id
    object.hashid
  end

  def created_at
    object.created_at.in_time_zone.iso8601 if object.created_at
  end

  def updated_at
    object.updated_at.in_time_zone.iso8601 if object.updated_at
  end

  def read_at
    object.read_at.in_time_zone.iso8601 if object.read_at
  end


  def body 
    return Pyr::Base::Util::String.emojify(object.body)
  end

  def user_hash(uid)
    u = User.find(uid) # FIXME
    #puts("FOUND USER #{u.id}")
    result = { 
      id: u.hashid,
      first_name: u.first_name,
      last_name: u.last_name
    }
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
    candy = Candidate.find(object.candidate_id)
    head = candy.head
    result = { 
      id: candy.id,
      first_name: head.first_name,
      last_name: head.last_name,
       state: candy.state
     }
    return result
  end

  def job
    job = Job.find(object.job_id)
    {
      id: job.id,
      title: job.title,
    }
  end

  def mine
    #puts "INSTANCE OPTIONS"
    #puts "#{instance_options.inspect}"
    object.from_user_id == current_user.id # instance_options[:current_user].id
  end

  def other
    mine ? object.user : object.from_user # user_hash(object.user_id) : user_hash(object.from_user_id)
  end

  def attributes(*args)
    phash = super

    #puts "****GOT #{object.candidate}"

    if object.root_message_id.nil?
      
      phash[:other] = other.is_recruiter ? RecruiterSerializer.new(other) : UserSerializer.new(other)
      phash[:candidate] = object.candidate ? CandidateSmallSerializer.new(object.candidate, current_user: current_user) : {}
      #phash[:job] = JobSmallSerializer.new(object.job)
      phash[:is_root] = true

      tl = object.thread_last
      phash[:last_message] = (tl.id != object.id) ? MessageSerializer.new(tl, **instance_options) : nil
      phash[:count] = object.thread_count
    end

    phash
  end

end
