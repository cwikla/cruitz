
class MeSerializer < UserSerializer
  attributes :pusher

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
