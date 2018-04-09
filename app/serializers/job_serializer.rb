class JobSerializer < JobSmallSerializer
  attributes  :candidate_counts

  #has_many :candidates, serializer: CandidateSerializer, if: :should_cand?
  has_many :locations
  has_many :skills

  #belongs_to :company

  def candidate_counts
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

  def attributes(*args)
    stuff = super

    if instance_options[:candidates]
      stuff[:candidates] = ActiveModel::Serializer::CollectionSerializer.new(object.candidates) 
    end

    if instance_options[:submitted_candidates]
      stuff[:candidates] = current_user.submitted_candidates.where(job_id: object.id).live
    end

    stuff 
  end

end
