class JobSerializer < JobSmallSerializer
  attributes  :candidate_counts

  #has_many :candidates, serializer: CandidateSerializer, if: :should_cand?
  has_many :locations
  has_many :skills
  has_many :uploads

  #belongs_to :company

  def candidate_counts
   counts = object.candidates.group(:state).count
   {
      total: counts.values.reduce(:+) || 0,
      new: counts[Candidate::STATE_NEW] || 0,
      unlocked: object[Candidate::STATE_UNLOCKED] || 0,
      rejected: object[Candidate::STATE_REJECTED] || 0,
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
