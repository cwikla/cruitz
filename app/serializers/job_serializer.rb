class JobSerializer < ActiveModel::Serializer
  attributes  :id,
              :title, 
							:description, 
							:time_commit, 
              :candidate_counts,
              :user_id,
              :created_at,
              :category,
              :recruiter_limit,
              :salary,
              :salary_high,
              :salary_doe

  #has_many :candidates, serializer: CandidateSerializer, if: :should_cand?
  has_many :locations
  has_many :skills

  #belongs_to :company

  def id
    object.hashid
  end

  def category
    cat = object.categories.first
    #puts "CATEGORY"
    #puts "#{cat.inspect}"

    return nil if cat.nil?

    return CategorySerializer.new(cat)
  end

  def user_id
    object.user.hashid
  end

  def title
    Pyr::Base::Util::String::emojify(object.title)
  end

  def description
    Pyr::Base::Util::String::emojify(object.description)
  end

  def recruiter_limit
    settings = object.user.setting
    settings.use_recruiter_limit ? settings.recruiter_limit : null
  end

  def candidate_counts
    return {
      total: 0,
      accepted: 0,
      rejected: 0,
      waiting: 0
    }

   {
      total: object.candidates.count,
      accepted: object.candidates.accepted.count,
      rejected: object.candidates.rejected.count,
      waiting: object.candidates.isnew.count
    }
  end

  def should_cand?
    return instance_options[:cand]
  end

  def attributes(*args) # FIXME
    stuff = super
    stuff[:company] = CompanySerializer.new(object.user.company)

    if 0
    if instance_options[:candidates]
      stuff[:candidates] = ActiveModel::Serializer::CollectionSerializer.new(object.candidates) 
    end

    if instance_options[:submitted_candidates]
      stuff[:candidates] = current_user.submitted_candidates.where(job_id: object.id).live
    end
    end

    stuff 
  end

end
