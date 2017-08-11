class RecruiterSerializer < UserSerializer
  attribute :is_recruiter

  def json_key
    return 'recruiter'
  end
end
