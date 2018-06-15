
class MeSerializer < UserSerializer
  attributes :pusher,
    :stats

  def stats
    {
      hires_count: object.candidates.hired.count,
      offers_count: object.candidates.offer.count,
      candidates_count: object.candidates.isnew.count,

      jobs_count: object.jobs.count,

      heads_count: object.heads.count,
      messages_count: object.messages.unread.count,
      recruiters_count: object.recruiters.length
    }
  end

  def pusher
    all = nil
    if ::USE_PUSHER
      all = {}
      all[:key] = ::PUSHER_KEY
      all[:cluster] = ::PUSHER_CLUSTER
      all[:encrypted] = ::PUSHER_ENCRYPTED
    end
    all
  end
end
